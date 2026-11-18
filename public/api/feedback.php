<?php
declare(strict_types=1);

require __DIR__ . '/_splynx.php';
require __DIR__ . '/_stats.php';

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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false]);
}

try {
    $cfg = splynx_config();
} catch (Throwable $e) {
    respond(500, ['ok' => false]);
}

$in = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($in)) {
    respond(400, ['ok' => false]);
}

// Spam protection: at most 10 submissions per visitor per hour
$rateFile = sys_get_temp_dir() . '/maranet_fb_' . md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$hits = is_file($rateFile)
    ? array_values(array_filter(array_map('intval', file($rateFile, FILE_IGNORE_NEW_LINES) ?: []), fn($t) => $t > time() - 3600))
    : [];
if (count($hits) >= 10) {
    respond(429, ['ok' => false]);
}
$hits[] = time();
@file_put_contents($rateFile, implode("\n", $hits), LOCK_EX);

$rating = function ($v): string {
    $v = is_string($v) ? trim($v) : '';
    return in_array($v, ['1', '2', '3', '4', '5', 'na'], true) ? $v : '';
};

$name     = one_line(clean($in['name'] ?? '', 100));
$contact  = one_line(clean($in['contact'] ?? '', 60));
$comments = clean($in['comments'] ?? '', 1500);
$ratings  = [];
foreach (['installation', 'site_visit', 'call_centre', 'issue_resolution'] as $k) {
    $ratings[$k] = $rating($in[$k] ?? '');
}

$rec = (string) ($in['recommend'] ?? '');
if (!ctype_digit($rec) || (int) $rec < 0 || (int) $rec > 10) {
    respond(422, ['ok' => false, 'error' => 'recommend']);
}
$rec = (int) $rec;

// Save to the private spreadsheet file
mn_csv_append(
    'feedback.csv',
    ['time', 'name', 'contact', 'installation', 'site_visit', 'call_centre', 'issue_resolution', 'recommend', 'comments'],
    [mn_now(), $name, $contact, $ratings['installation'], $ratings['site_visit'], $ratings['call_centre'], $ratings['issue_resolution'], $rec, $comments]
);
mn_record_submission('feedback', $rec . '/10', 'saved');

// Email the staff
$low = $rec <= 6 || in_array('1', $ratings, true) || in_array('2', $ratings, true);
$subject = '[Website] ' . ($low ? 'LOW SCORE feedback' : 'Customer feedback') . ' - ' . $rec . '/10';

$show = fn(string $v): string => $v === '' ? '-' : ($v === 'na' ? 'does not apply' : $v . '/5');
$lines = [
    'New customer feedback from the Maranet website',
    '',
    'Name: ' . ($name ?: '-'),
    'Phone or account: ' . ($contact ?: '-'),
    '',
    'Installation: ' . $show($ratings['installation']),
    'Site visits: ' . $show($ratings['site_visit']),
    'Support team: ' . $show($ratings['call_centre']),
    'Fixing problems: ' . $show($ratings['issue_resolution']),
    'Would recommend (0-10): ' . $rec,
    '',
    'What we could improve: ' . ($comments ?: '-'),
];

$headers = [
    'From: Maranet Website <' . $cfg['from_email'] . '>',
    'Content-Type: text/plain; charset=UTF-8',
];
@mail(
    $cfg['staff_email'],
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    implode("\n", $lines),
    implode("\r\n", $headers),
    '-f' . $cfg['from_email']
);

respond(200, ['ok' => true]);