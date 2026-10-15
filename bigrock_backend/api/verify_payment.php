<?php
require_once 'db.php';
if (file_exists('config.php')) {
    require_once 'config.php';
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents("php://input"), true);
$order_id = $data['order_id'] ?? '';
$payment_id = $data['payment_id'] ?? '';
$signature = $data['signature'] ?? '';

// Razorpay Secret Key (loaded from config.php or fallback)
$secret = defined('RAZORPAY_KEY_SECRET') ? RAZORPAY_KEY_SECRET : 'r8Sg84fsXuOMpBHg5h0SiCsN';

$generated_signature = hash_hmac('sha256', $order_id . "|" . $payment_id, $secret);

if (!empty($signature) && hash_equals($generated_signature, $signature)) {
    // Payment is authentic! Update the order status in MySQL
    $stmt = $pdo->prepare("UPDATE orders SET payment_id = ?, status = 'Paid' WHERE order_id = ?");
    $stmt->execute([$payment_id, $order_id]);
    
    echo json_encode(["verified" => true, "message" => "Payment successful"]);
} else {
    http_response_code(400);
    echo json_encode(["verified" => false, "error" => "Invalid signature. Potential fraud."]);
}
?>
