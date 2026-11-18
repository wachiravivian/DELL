<?php
// Shared helper for talking to Splynx. Produces no output on its own.

function splynx_config(): array {
    // The config file lives ABOVE public_html, so visitors can never download it.
    $path = dirname($_SERVER['DOCUMENT_ROOT']) . '/maranet_config.php';
    if (!is_file($path)) {
        throw new RuntimeException('Config file not found');
    }
    return require $path;
}

function splynx_request(array $cfg, string $method, string $endpoint, ?array $body = null): array {
    // Splynx signed authentication
    $nonce = (int) round(microtime(true) * 100);
    $signature = strtoupper(hash_hmac('sha256', $nonce . $cfg['splynx_key'], $cfg['splynx_secret']));
    $auth = 'Splynx-EA (key=' . $cfg['splynx_key'] . '&nonce=' . $nonce . '&signature=' . $signature . ')';

    $ch = curl_init(rtrim($cfg['splynx_url'], '/') . '/api/2.0/' . ltrim($endpoint, '/'));
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_HTTPHEADER     => ['Authorization: ' . $auth, 'Content-Type: application/json', 'Accept: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    $raw    = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error  = curl_error($ch);
    curl_close($ch);

    return ['status' => $status, 'body' => json_decode((string) $raw, true), 'raw' => (string) $raw, 'error' => $error];
}