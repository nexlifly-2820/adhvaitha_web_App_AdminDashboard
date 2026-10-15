<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $uid = $data['uid'] ?? '';
    $phone = $data['phone'] ?? '';
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    
    // Insert new user, or update their name/email if they already exist
    $sql = "INSERT INTO users (uid, phone, name, email) VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE name=?, email=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$uid, $phone, $name, $email, $name, $email]);
    
    echo json_encode(["success" => true, "message" => "User profile saved"]);
    exit();
}
?>
