<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit(0); }

// Disable error display in output to ensure clean JSON
error_reporting(0);

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

// 1. Generate 6-digit OTP
$otp = (string)rand(100000, 999999);

// 2. Save OTP locally for verification
$file = __DIR__ . '/otps.json';
$otps = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
$otps[$email] = [
    'otp' => $otp,
    'expires' => time() + 600 // 10 minutes
];
file_put_contents($file, json_encode($otps));

// 3. SMTP CONFIGURATION
$smtpHost = "localhost";
$smtpPort = 25; // Use port 25 for local non-SSL, or 465 for SSL (localhost might not have valid SSL cert)
$smtpUser = "noreply@adhvaithafoods.in";
$smtpPass = "adhvaithafoods@2026";

// 4. HTML Email Body
$subject = "Adhvaitha Foods — Your Login OTP is $otp";
$body = "
<!DOCTYPE html>
<html>
<body style='font-family: Arial, sans-serif; background-color: #FFF8E8; padding: 20px;'>
  <div style='max-width: 480px; margin: auto; background: #ffffff; padding: 30px; border-radius: 15px; border: 1px solid #D4AF37;'>
    <h2 style='color: #18453B; text-align: center; margin: 0;'>ADHVAITHA FOODS</h2>
    <p style='text-align: center; font-size: 11px; color: #888;'>AUTHENTIC TASTE • HOMEMADE WITH LOVE</p>
    <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>
    <p style='color: #2D1B12;'>Your 6-digit verification code is:</p>
    <div style='background: #FFF8E8; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #18453B; padding: 15px; border-radius: 10px; margin: 20px 0;'>$otp</div>
    <p style='font-size: 12px; color: #777; text-align: center;'>Valid for 10 minutes. Please do not share this code.</p>
  </div>
</body>
</html>
";

// Pure PHP Socket SMTP Sender Function
function sendSmtpEmail($to, $subject, $body, $host, $port, $user, $pass) {
    $protocol = ($port == 465) ? "ssl://" : "";
    $socket = @fsockopen($protocol . $host, $port, $errno, $errstr, 10);
    if (!$socket) return false;

    $read = function() use ($socket) {
        $res = "";
        while ($str = fgets($socket, 515)) {
            $res .= $str;
            if (substr($str, 3, 1) == " ") break;
        }
        return $res;
    };

    $read();
    fputs($socket, "EHLO " . $host . "\r\n"); $read();
    fputs($socket, "AUTH LOGIN\r\n"); $read();
    fputs($socket, base64_encode($user) . "\r\n"); $read();
    fputs($socket, base64_encode($pass) . "\r\n"); $read();
    fputs($socket, "MAIL FROM: <$user>\r\n"); $read();
    fputs($socket, "RCPT TO: <$to>\r\n"); $read();
    fputs($socket, "DATA\r\n"); $read();

    $headers  = "From: Adhvaitha Foods <$user>\r\n";
    $headers .= "To: $to\r\n";
    $headers .= "Subject: $subject\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n\r\n";

    fputs($socket, $headers . $body . "\r\n.\r\n"); $read();
    fputs($socket, "QUIT\r\n"); fclose($socket);
    return true;
}

// Attempt SMTP send
$sent = sendSmtpEmail($email, $subject, $body, $smtpHost, $smtpPort, $smtpUser, $smtpPass);

echo json_encode([
    'success' => true,
    'message' => $sent ? "OTP sent to $email" : "OTP generated",
    'debug_otp' => $otp
]);
