<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'db.php';

// Ensure table exists
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
} catch (PDOException $e) {
    // Ignore if exists
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Support both old 'uid' and new 'user_id' fields
    $user_id = $data['user_id'] ?? $data['uid'] ?? '';
    $phone = $data['phone'] ?? '';
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    
    if (empty($user_id)) {
        echo json_encode(["success" => false, "message" => "user_id is required"]);
        exit();
    }
    
    // Insert new user, or update their name/email/phone if they already exist
    $sql = "INSERT INTO users (user_id, phone, name, email) VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE name=?, email=?, phone=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user_id, $phone, $name, $email, $name, $email, $phone]);
    
    echo json_encode(["success" => true, "message" => "User profile saved"]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $pdo->query("SELECT * FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $users]);
    exit();
}
?>
