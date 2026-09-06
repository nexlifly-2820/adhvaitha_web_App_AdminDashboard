<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

error_reporting(0);

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

// 1. Generate 6-digit OTP
$otp = (string)rand(100000, 999999);

// 2. Save OTP for verification
$file = __DIR__ . '/otps.json';
$otps = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
$otps[$email] = [
    'otp' => $otp,
    'expires' => time() + 600
];
file_put_contents($file, json_encode($otps));

// 3. Email Subject and HTML Body
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

// 4. Send Email via BigRock Local Mail Agent
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Adhvaitha Foods <noreply@adhvaithafoods.in>\r\n";
$headers .= "Reply-To: noreply@adhvaithafoods.in\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$sent = mail($email, $subject, $body, $headers, "-fnoreply@adhvaithafoods.in");

echo json_encode([
    'success' => true,
    'message' => $sent ? "OTP sent to $email" : "OTP generated",
    'debug_otp' => $otp
]);
