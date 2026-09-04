<?php
require_once 'db.php';

// Handle GET request: Fetch addresses for a specific user
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    
    if (!$user_id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing user_id parameter"]);
        exit();
    }
    
    $stmt = $pdo->prepare("SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit();
}

// Handle POST request: Save a new address
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Unset other default addresses for this user if this one is set as default
    if (isset($data['is_default']) && $data['is_default'] == true) {
        $updateStmt = $pdo->prepare("UPDATE addresses SET is_default = FALSE WHERE user_id = ?");
        $updateStmt->execute([$data['user_id']]);
    }
    
    $sql = "INSERT INTO addresses (user_id, title, full_address, is_default) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $data['user_id'], 
        $data['title'], 
        $data['full_address'], 
        $data['is_default'] ?? false
    ]);
    
    echo json_encode(["success" => true, "message" => "Address saved successfully"]);
    exit();
}
?>
