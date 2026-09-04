<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $pdo->query("SELECT * FROM recipes ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? uniqid('rec_');
    $sql = "INSERT INTO recipes (id, title, content, image_url) VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE title=?, content=?, image_url=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id, $data['title'], $data['content'], $data['image_url'] ?? '', $data['title'], $data['content'], $data['image_url'] ?? '']);
    echo json_encode(["success" => true, "id" => $id]);
    exit();
}
?>
