<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $pdo->query("SELECT * FROM coupons ORDER BY code ASC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $sql = "INSERT INTO coupons (code, discount_type, discount_value, min_order_value, expiry_date, is_active) 
            VALUES (?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE discount_type=?, discount_value=?, min_order_value=?, expiry_date=?, is_active=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['code'], $data['discount_type'], $data['discount_value'], $data['min_order_value'] ?? 0, $data['expiry_date'] ?? null, $data['is_active'] ?? 1,
        $data['discount_type'], $data['discount_value'], $data['min_order_value'] ?? 0, $data['expiry_date'] ?? null, $data['is_active'] ?? 1
    ]);
    echo json_encode(["success" => true, "code" => $data['code']]);
    exit();
}
?>
