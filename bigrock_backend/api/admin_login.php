<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify password against the hash in the database
    if ($user && password_verify($password, $user['password_hash'])) {
        // Successful login
        $token = bin2hex(random_bytes(16)); // Generate a simple session token
        echo json_encode(["success" => true, "token" => $token, "role" => $user['role']]);
    } else {
        // Failed login
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "Invalid username or password"]);
    }
    exit();
}
?>
