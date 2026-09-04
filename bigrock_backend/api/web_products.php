<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $pdo->query("SELECT * FROM web_products ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? uniqid('webprod_');
    $name = $data['name'];
    $description = $data['description'] ?? '';
    $price = $data['price'] ?? 0;
    $stock = $data['stock'] ?? 0;
    $image_url = $data['image_url'] ?? '';
    $category = $data['category'] ?? '';
    $is_active = isset($data['is_active']) ? (int)$data['is_active'] : 1;

    $sql = "INSERT INTO web_products (id, name, description, price, stock, image_url, category, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE name=?, description=?, price=?, stock=?, image_url=?, category=?, is_active=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id, $name, $description, $price, $stock, $image_url, $category, $is_active, $name, $description, $price, $stock, $image_url, $category, $is_active]);
    echo json_encode(["success" => true, "id" => $id]);
    exit();
}
?>
