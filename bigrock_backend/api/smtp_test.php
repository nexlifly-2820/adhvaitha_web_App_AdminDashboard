<?php
header('Content-Type: text/plain');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$port = 25;
$user = 'noreply@adhvaithafoods.in';
$pass = 'adhvaithafoods@2026';
$to = 'test@gmail.com';

echo "Testing SMTP connection to $host:$port...\n";

$socket = @fsockopen($host, $port, $errno, $errstr, 10);
if (!$socket) {
    die("Failed to connect: $errstr ($errno)\n");
}

function send_cmd($socket, $cmd, $expect = '') {
    echo "> " . trim($cmd) . "\n";
    fputs($socket, $cmd . "\r\n");
    $res = '';
    while ($str = fgets($socket, 515)) {
        $res .= $str;
        if (substr($str, 3, 1) == " ") break;
    }
    echo "< " . trim($res) . "\n";
    return $res;
}

$res = '';
while ($str = fgets($socket, 515)) {
    $res .= $str;
    if (substr($str, 3, 1) == " ") break;
}
echo "< " . trim($res) . "\n";

send_cmd($socket, "EHLO localhost");
send_cmd($socket, "AUTH LOGIN");
send_cmd($socket, base64_encode($user));
send_cmd($socket, base64_encode($pass));
send_cmd($socket, "MAIL FROM: <$user>");
send_cmd($socket, "RCPT TO: <$to>");
send_cmd($socket, "DATA");
send_cmd($socket, "Subject: Test\r\n\r\nTest body\r\n.");
send_cmd($socket, "QUIT");

fclose($socket);
echo "\nFinished.\n";
?>
