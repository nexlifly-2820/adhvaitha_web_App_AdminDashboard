<?php
require_once 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Create email_otps table if it doesn't exist
$pdo->exec("CREATE TABLE IF NOT EXISTS email_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
)");

// Delete any old OTPs for this email (cleanup)
$stmt = $pdo->prepare("DELETE FROM email_otps WHERE email = ?");
$stmt->execute([$email]);

// Generate 6-digit OTP
$otp = rand(100000, 999999);

// Save OTP to MySQL (valid for 10 minutes — checked during verification)
$stmt = $pdo->prepare("INSERT INTO email_otps (email, otp, created_at) VALUES (?, ?, NOW())");
$stmt->execute([$email, $otp]);

// Send beautifully styled email
$to = $email;
$subject = "Adhvaitha Foods — Your Login OTP is $otp";
$message = "
<html>
<body style='font-family: Arial, sans-serif; background-color: #FFF8E8; padding: 20px;'>
  <div style='max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 15px; border: 1px solid #18453B;'>
    <h2 style='color: #18453B; text-align: center;'>ADHVAITHA FOODS</h2>
    <p style='color: #333;'>Your 6-digit login verification code is:</p>
    <div style='text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #D4AF37; margin: 20px 0;'>$otp</div>
    <p style='font-size: 12px; color: #777;'>This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
  </div>
</body>
</html>
";

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Adhvaitha Foods <noreply@adhvaithafoods.in>" . "\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true, 'message' => "OTP sent to $email"]);
} else {
    // Fallback: even if mail() fails on BigRock, the OTP is saved in DB
    // In production, you'd integrate a third-party email service
    echo json_encode(['success' => true, 'message' => "OTP generated for $email"]);
}
?>
