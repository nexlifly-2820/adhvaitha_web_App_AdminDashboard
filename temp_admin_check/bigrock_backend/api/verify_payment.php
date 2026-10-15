<?php
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$order_id = $data['order_id'] ?? '';
$payment_id = $data['payment_id'] ?? '';
$signature = $data['signature'] ?? '';

// 🚨 IMPORTANT: Replace this with your actual Razorpay Secret Key in production
$secret = 'YOUR_RAZORPAY_SECRET_HERE';

$generated_signature = hash_hmac('sha256', $order_id . "|" . $payment_id, $secret);

if ($generated_signature == $signature) {
    // Payment is authentic! Update the order status in MySQL
    $stmt = $pdo->prepare("UPDATE orders SET payment_id = ?, status = 'Paid' WHERE order_id = ?");
    $stmt->execute([$payment_id, $order_id]);
    
    echo json_encode(["verified" => true, "message" => "Payment successful"]);
} else {
    echo json_encode(["verified" => false, "error" => "Invalid signature. Potential fraud."]);
}
?>
