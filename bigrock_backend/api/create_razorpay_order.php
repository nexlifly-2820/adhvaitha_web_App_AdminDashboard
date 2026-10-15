<?php
require_once 'db.php';
if (file_exists('config.php')) {
    require_once 'config.php';
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$key_id = defined('RAZORPAY_KEY_ID') ? RAZORPAY_KEY_ID : 'rzp_test_TnGowXx3bsrNOR';
$key_secret = defined('RAZORPAY_KEY_SECRET') ? RAZORPAY_KEY_SECRET : 'r8Sg84fsXuOMpBHg5h0SiCsN';

$data = json_decode(file_get_contents("php://input"), true);
$amount = $data['amount'] ?? 0; // Amount in INR
$currency = $data['currency'] ?? 'INR';
$receipt = $data['receipt'] ?? ('rcpt_' . time());

// If amount is passed in INR (e.g. 450), convert to paise (45000)
$amount_in_paise = (int) round($amount * 100);
if (isset($data['amount_in_paise'])) {
    $amount_in_paise = (int) $data['amount_in_paise'];
}

$orderData = [
    'amount' => $amount_in_paise,
    'currency' => $currency,
    'receipt' => $receipt,
    'payment_capture' => 1
];

$ch = curl_init('https://api.razorpay.com/v1/orders');
curl_setopt($ch, CURLOPT_USERPWD, $key_id . ':' . $key_secret);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_err = curl_error($ch);
curl_close($ch);

if ($curl_err) {
    http_response_code(500);
    echo json_encode(['error' => $curl_err]);
} else {
    http_response_code($http_status);
    echo $response;
}
?>
