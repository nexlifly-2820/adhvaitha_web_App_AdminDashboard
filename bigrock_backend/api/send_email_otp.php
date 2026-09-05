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

// Generate 6-digit OTP
$otp = rand(100000, 999999);

// Save OTP to JSON file for verification
$file = __DIR__ . '/otps.json';
$otps = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
$otps[$email] = [
    'otp' => (string)$otp,
    'expires' => time() + 600 // 10 minutes
];
file_put_contents($file, json_encode($otps));

// Mail details
$to = $email;
$subject = "Adhvaitha Foods — Your Login OTP is $otp";
$message = "
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

$headers = array(
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Adhvaitha Foods <noreply@adhvaithafoods.in>',
    'Reply-To: noreply@adhvaithafoods.in',
    'X-Mailer: PHP/' . phpversion()
);

$sent = mail($to, $subject, $message, implode("\r\n", $headers));

// Response
echo json_encode([
    'success' => true,
    'message' => "OTP sent to $email",
    'debug_otp' => $otp
]);
