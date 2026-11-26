<?php
// Server-to-server key shared with the admin (Vercel env BIGROCK_API_KEY).
// Put the same key in a file named aj_secret.php next to this file:   <?php return 'YOUR-LONG-RANDOM-KEY';
// Until that file exists everything works like before (open), so nothing breaks while you set it up.
function aj_key_configured() {
    return file_exists(__DIR__ . '/aj_secret.php');
}
function aj_key_ok() {
    if (!aj_key_configured()) return true;
    $key = (string) (include __DIR__ . '/aj_secret.php');
    $sent = $_SERVER['HTTP_X_AJ_KEY'] ?? '';
    return strlen($key) >= 16 && is_string($sent) && hash_equals($key, $sent);
}
function aj_is_private_doc($doc) {
    $private = ['app_orders', 'login_otps', 'contact_inbox', 'review_inbox', 'account_deletions', 'push_tokens'];
    return in_array($doc, $private, true) || strpos($doc, 'u_') === 0;
}
