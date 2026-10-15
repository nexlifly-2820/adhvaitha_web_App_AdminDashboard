<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $pdo->query("SELECT * FROM reviews ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (isset($data['action']) && $data['action'] == 'update_status') {
        // Admin updating review status (e.g., Approve)
        $stmt = $pdo->prepare("UPDATE reviews SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['id']]);
        echo json_encode(["success" => true, "message" => "Status updated"]);
    } else {
        // Customer submitting new review
        $sql = "INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['product_id'], $data['user_name'], $data['rating'], $data['comment']]);
        echo json_encode(["success" => true, "message" => "Review submitted"]);
    }
    exit();
}
?>
