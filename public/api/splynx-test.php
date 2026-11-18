<?php
require __DIR__ . '/_splynx.php';
header('Content-Type: text/plain');

try {
    $cfg = splynx_config();
    if (!hash_equals($cfg['test_token'], (string) ($_GET['t'] ?? ''))) {
        http_response_code(403);
        exit('Forbidden');
    }

    $r = splynx_request($cfg, 'GET', 'admin/support/tickets?limit=1');
    echo "Tickets: HTTP status {$r['status']}\n";
    if ($r['error']) echo "Connection error: {$r['error']}\n";
    if ($r['status'] !== 200) echo "Splynx replied: " . substr($r['raw'], 0, 300) . "\n";

    $l = splynx_request($cfg, 'GET', 'admin/crm/leads?limit=1');
    echo "Leads: HTTP status {$l['status']}\n";
    if ($l['status'] !== 200) echo "Splynx replied: " . substr($l['raw'], 0, 300) . "\n";

    $c = splynx_request($cfg, 'GET', 'admin/customers/customer?limit=1');
    echo "Customers: HTTP status {$c['status']}\n";
    if ($c['status'] !== 200) echo "Splynx replied: " . substr($c['raw'], 0, 300) . "\n";

    echo ($r['status'] === 200 && $l['status'] === 200 && $c['status'] === 200)
        ? "\nAll three checks passed.\n"
        : "\nAt least one check failed, see above.\n";
} catch (Throwable $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
}