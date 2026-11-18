<?php
declare(strict_types=1);

require __DIR__ . '/_splynx.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $code, array $data): void
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function clean($value, int $max = 200): string
{
    $value = is_string($value) ? trim($value) : '';
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $value) ?? '';
    return mb_substr($value, 0, $max);
}

function one_line(string $value): string
{
    return trim(preg_replace('/\s+/', ' ', $value) ?? '');
}

function log_line(string $message): void
{
    $dir = dirname($_SERVER['DOCUMENT_ROOT']) . '/maranet_logs';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    @file_put_contents($dir . '/website.log', '[' . date('Y-m-d H:i:s') . '] ' . $message . "\n", FILE_APPEND | LOCK_EX);
}

function splynx_ok(array $r): bool
{
    return in_array($r['status'], [200, 201], true);
}

function first_id($body): int
{
    if (is_array($body) && isset($body['id'])) {
        return (int) $body['id'];
    }
    if (is_array($body) && isset($body[0]['id'])) {
        return (int) $body[0]['id'];
    }
    return 0;
}

// Looks up a customer or a lead; returns its ID only when exactly one matches
function find_match(array $cfg, string $endpoint, string $account, string $phone, string $email): int
{
    $tries = [];
    if ($account !== '' && $endpoint === 'admin/customers/customer') {
        $tries[] = ['login' => $account];
    }
    $local = '0' . substr(preg_replace('/\D/', '', $phone) ?? '', -9);
    foreach ([$local, '254' . substr($local, 1), '+254' . substr($local, 1)] as $p) {
        $tries[] = ['phone' => $p];
    }
    if ($email !== '') {
        $tries[] = ['email' => $email];
    }

    foreach ($tries as $attrs) {
        $r = splynx_request($cfg, 'GET', $endpoint . '?' . http_build_query(['main_attributes' => $attrs]));
        if ($r['status'] === 200 && is_array($r['body']) && count($r['body']) === 1) {
            $id = first_id($r['body']);
            if ($id > 0) {
                return $id;
            }
        }
    }
    return 0;
}

// Creates a lead: name, phone, email, street (location details), city (area) and coordinates
function create_lead(array $cfg, string $name, string $phonePlus, string $email, string $street, string $city, string $gps): int
{
    $payload = ['name' => $name, 'phone' => $phonePlus];
    if ($email !== '') {
        $payload['email'] = $email;
    }
    if ($street !== '') {
        $payload['street_1'] = $street;
    }
    if ($city !== '') {
        $payload['city'] = $city;
    }
    if ($gps !== '') {
        $payload['gps'] = $gps;
    }
    $extra = is_array($cfg['lead_extra'] ?? null) ? $cfg['lead_extra'] : [];

    $r = splynx_request($cfg, 'POST', 'admin/crm/leads', array_merge($payload, $extra));
    if (splynx_ok($r)) {
        return first_id($r['body']);
    }
    log_line('Lead creation failed. HTTP ' . $r['status'] . ' ' . $r['error'] . ' ' . substr($r['raw'], 0, 300));
    return 0;
}

function esc(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function render_html(string $intro, array $rows, string $footer): string
{
    $html = '<p>' . esc($intro) . '</p><table cellpadding="4">';
    foreach ($rows as $label => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $cell = is_array($value) ? $value['html'] : nl2br(esc((string) $value));
        $html .= '<tr><td><b>' . esc((string) $label) . '</b></td><td>' . $cell . '</td></tr>';
    }
    return $html . '</table><p><small>' . esc($footer) . '</small></p>';
}

function render_text(string $intro, array $rows, string $footer): string
{
    $lines = [$intro, ''];
    foreach ($rows as $label => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $lines[] = $label . ': ' . (is_array($value) ? $value['text'] : $value);
    }
    $lines[] = '';
    $lines[] = $footer;
    return implode("\n", $lines);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

try {
    $cfg = splynx_config();
} catch (Throwable $e) {
    log_line('Config problem: ' . $e->getMessage());
    respond(500, ['ok' => false]);
}

$input = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($input)) {
    respond(400, ['ok' => false, 'error' => 'Invalid request']);
}

// Spam protection: at most 6 requests per visitor per hour
$rateFile = sys_get_temp_dir() . '/maranet_rl_' . md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$hits = is_file($rateFile)
    ? array_values(array_filter(array_map('intval', file($rateFile, FILE_IGNORE_NEW_LINES) ?: []), fn($t) => $t > time() - 3600))
    : [];
if (count($hits) >= 6) {
    respond(429, ['ok' => false, 'error' => 'Too many requests']);
}
$hits[] = time();
@file_put_contents($rateFile, implode("\n", $hits), LOCK_EX);

// Basic fields
$type  = clean($input['type'] ?? '', 20);
$name  = one_line(clean($input['name'] ?? '', 100));
$phone = one_line(clean($input['phone'] ?? '', 30));
$email = one_line(clean($input['email'] ?? '', 120));

if (!in_array($type, ['installation', 'support', 'enquiry'], true)) {
    respond(400, ['ok' => false, 'error' => 'Unknown type']);
}
if (mb_strlen($name) < 2) {
    respond(422, ['ok' => false, 'error' => 'Name']);
}
if (!preg_match('/^(?:\+?254|0)[17]\d{8}$/', str_replace([' ', '-'], '', $phone))) {
    respond(422, ['ok' => false, 'error' => 'Phone']);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'Email']);
}

$phonePlus = '+254' . substr(preg_replace('/\D/', '', $phone) ?? '', -9);
$account = '';
$street  = '';
$city    = '';
$gpsRaw  = '';

// Fields that depend on the type of request
switch ($type) {
    case 'installation':
        $kind     = strtolower(clean($input['customer_type'] ?? '', 20)) === 'business' ? 'business' : 'home';
        $area     = one_line(clean($input['area'] ?? '', 80));
        $location = one_line(clean($input['location'] ?? '', 150));
        $gpsInput = clean($input['gps'] ?? '', 40);

        $street = $location;
        $city   = $area;
        $gpsRaw = preg_match('/^-?\d{1,3}\.\d+,-?\d{1,3}\.\d+$/', $gpsInput) ? $gpsInput : '';

        $subject = '[Website] New ' . $kind . ' connection' . ($area !== '' ? ' – ' . $area : '');
        $intro   = 'I would like a new ' . $kind . ' fibre connection.';
        $request = 'New ' . $kind . ' connection';

        $gpsCell = '';
        if ($gpsRaw !== '') {
            $url = 'https://www.google.com/maps?q=' . $gpsRaw;
            $gpsCell = [
                'html' => '<a href="' . esc($url) . '">' . esc(str_replace(',', ', ', $gpsRaw)) . ' (open map)</a>',
                'text' => str_replace(',', ', ', $gpsRaw) . ' ' . $url,
            ];
        }

        $extraRows = [
            'Customer type'  => $kind,
            'Package'        => one_line(clean($input['plan'] ?? '', 120)),
            'Location'       => $location,
            'GPS'            => $gpsCell,
            'Nearest zone'   => $area,
            'Coverage check' => one_line(clean($input['coverage'] ?? '', 100)),
            'Best time'      => one_line(clean($input['best_time'] ?? '', 40)),
            'Contact via'    => one_line(clean($input['contact_via'] ?? '', 30)),
            'Notes'          => clean($input['notes'] ?? '', 1000),
        ];
        break;

    case 'support':
        $account = one_line(clean($input['account'] ?? '', 40));
        $issue   = one_line(clean($input['issue'] ?? '', 80));
        $subject = '[Website] Support – ' . $issue;
        $intro   = 'I need support: ' . $issue . '.';
        $request = 'Support request';
        $extraRows = [
            'Account number' => $account,
            'Issue'          => $issue,
            'Details'        => clean($input['details'] ?? '', 1500),
        ];
        break;

    default:
        $topic   = one_line(clean($input['topic'] ?? '', 80));
        $subject = '[Website] Enquiry – ' . $topic;
        $intro   = 'I have an enquiry about: ' . $topic . '.';
        $request = 'General enquiry';
        $extraRows = [
            'Topic'   => $topic,
            'Message' => clean($input['message'] ?? '', 1500),
        ];
}
$subject = mb_substr($subject, 0, 150);
$page   = clean($input['page'] ?? '', 200);
$footer = 'Submitted from ' . (preg_match('#^https?://#', $page) ? $page : ($cfg['site_url'] ?? 'the Maranet website'));

// 1. Splynx: find the customer or lead, or create a new lead; then create the ticket
$customerId = 0;
$leadId     = 0;
$ticketId   = 0;
$matchText  = 'Not checked (Splynx unavailable)';
$ticketNote = 'Splynx ticket: not created (see the website log)';

try {
    $customerId = find_match($cfg, 'admin/customers/customer', $account, $phone, $email);
    if ($customerId > 0) {
        $matchText = 'Yes – existing customer';
    } else {
        $leadId = find_match($cfg, 'admin/crm/leads', '', $phone, $email);
        if ($leadId > 0) {
            $matchText = 'Yes – existing lead';
        } else {
            $leadId = create_lead($cfg, $name, $phonePlus, $email, $street, $city, $gpsRaw);
            $matchText = $leadId > 0 ? 'No – new lead created' : 'No – lead could not be created';
        }
    }
} catch (Throwable $e) {
    log_line('Splynx lookup error: ' . $e->getMessage());
}

$rows = [
    'Request type'      => $request,
    'Name'              => $name,
    'Phone'             => $phonePlus,
    'Email'             => $email,
    'Matched in Splynx' => $matchText,
] + $extraRows;

try {
    if ($customerId > 0 || $leadId > 0) {
        $payload = [
            'subject'  => $subject,
            'priority' => 'medium',
            'message'  => render_html($intro, $rows, $footer),
        ];
        $payload += $customerId > 0 ? ['customer_id' => $customerId] : ['lead_id' => $leadId];
                foreach (['status_id', 'group_id'] as $key) {
            if (!empty($cfg['ticket_' . $key])) {
                $payload[$key] = (int) $cfg['ticket_' . $key];
            }
        }
        $typeId = (int) (($cfg['ticket_type_ids'][$type] ?? 0));
        if ($typeId > 0) {
            $payload['type_id'] = $typeId;
        }
        if (!empty($cfg['ticket_assign_to'])) {
            $payload['assign_to'] = (int) $cfg['ticket_assign_to'];
        }
        if (is_array($cfg['ticket_extra'] ?? null)) {
            $payload = array_merge($payload, $cfg['ticket_extra']);
        }

        $r = splynx_request($cfg, 'POST', 'admin/support/tickets', $payload);
        if (splynx_ok($r) && first_id($r['body']) > 0) {
            $ticketId   = first_id($r['body']);
            $ticketNote = 'Splynx ticket: #' . $ticketId;
        } else {
            log_line('Ticket creation failed. HTTP ' . $r['status'] . ' ' . $r['error'] . ' ' . substr($r['raw'], 0, 300));
        }
    }
} catch (Throwable $e) {
    log_line('Splynx ticket error: ' . $e->getMessage());
}

// 2. Email the staff (always sent)
$headers = [
    'From: Maranet Website <' . $cfg['from_email'] . '>',
    'Content-Type: text/plain; charset=UTF-8',
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}
$sent = @mail(
    $cfg['staff_email'],
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    render_text($intro, $rows, $footer) . "\n\n" . $ticketNote,
    implode("\r\n", $headers),
    '-f' . $cfg['from_email']
);
if (!$sent) {
    log_line('Email could not be sent for: ' . $subject);
}

if ($ticketId === 0 && !$sent) {
    respond(502, ['ok' => false]);
}

$reference = $ticketId > 0 ? '#' . $ticketId : 'WEB-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
respond(200, ['ok' => true, 'reference' => $reference]);