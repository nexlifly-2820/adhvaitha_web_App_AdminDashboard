<?php
require_once 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$otp = $data['otp'] ?? '';

if (empty($email) || empty($otp) || strlen($otp) != 6) {
    echo json_encode(['success' => false, 'verified' => false, 'message' => 'Invalid email or OTP code']);
    exit;
}

// Check OTP from MySQL — must match email, otp, and be within last 10 minutes
$stmt = $pdo->prepare("SELECT id FROM email_otps WHERE email = ? AND otp = ? AND created_at > NOW() - INTERVAL 10 MINUTE LIMIT 1");
$stmt->execute([$email, $otp]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if ($row) {
    // OTP is valid — delete it so it can't be reused
    $stmt = $pdo->prepare("DELETE FROM email_otps WHERE email = ?");
    $stmt->execute([$email]);

    echo json_encode(['success' => true, 'verified' => true, 'message' => 'OTP verified successfully']);
} else {
    echo json_encode(['success' => false, 'verified' => false, 'message' => 'Invalid or expired OTP code']);
}
?>
