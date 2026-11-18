<?php
// Helpers for the private data files (kept outside the public website folder).

function mn_data_dir(): string
{
    $dir = dirname($_SERVER['DOCUMENT_ROOT']) . '/maranet_data';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    return $dir;
}

// Stops spreadsheet programs from running formulas that a visitor typed in
function mn_safe_cell(string $value): string
{
    return preg_match('/^[=+\-@\t\r]/', $value) ? "'" . $value : $value;
}

function mn_csv_append(string $file, array $header, array $row): void
{
    $path = mn_data_dir() . '/' . $file;
    $isNew = !is_file($path);
    $h = @fopen($path, 'ab');
    if (!$h) {
        return;
    }
    flock($h, LOCK_EX);
    if ($isNew) {
        fputcsv($h, $header, ',', '"', '\\');
    }
    fputcsv($h, array_map(fn($v) => mn_safe_cell((string) $v), $row), ',', '"', '\\');
    flock($h, LOCK_UN);
    fclose($h);
}

function mn_now(): string
{
    return (new DateTime('now', new DateTimeZone('Africa/Nairobi')))->format('Y-m-d H:i:s');
}

function mn_record_submission(string $type, string $detail, string $outcome): void
{
    mn_csv_append('submissions.csv', ['time', 'type', 'detail', 'outcome'], [mn_now(), $type, $detail, $outcome]);
}