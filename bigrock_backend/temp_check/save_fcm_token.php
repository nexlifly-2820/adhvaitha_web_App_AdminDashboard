<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $uid = $data['uid'] ?? '';
    $token = $data['token'] ?? '';
    
    $sql = "UPDATE users SET fcm_token = ? WHERE uid = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$token, $uid]);
    
    echo json_encode(["success" => true, "message" => "FCM Token updated"]);
    exit();
}
?>
