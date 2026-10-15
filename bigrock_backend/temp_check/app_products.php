<?php
require_once 'db.php';

// Handle GET request: Fetch all products for the app
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $pdo->query("SELECT * FROM app_products ORDER BY created_at DESC");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($products);
    exit();
}

// Handle POST request: Add a new product OR update an existing one
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Read the JSON data sent from Flutter or Next.js
    $data = json_decode(file_get_contents("php://input"), true);
    
    // If no ID is provided, create a new unique one
    $id = $data['id'] ?? uniqid('prod_');
    $name = $data['name'];
    $description = $data['description'] ?? '';
    $price = $data['price'] ?? 0;
    $stock = $data['stock'] ?? 0;
    $image_url = $data['image_url'] ?? '';
    $category = $data['category'] ?? '';
    $is_active = isset($data['is_active']) ? (int)$data['is_active'] : 1;

    // Insert into MySQL (or update if the product ID already exists)
    $sql = "INSERT INTO app_products (id, name, description, price, stock, image_url, category, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            name=?, description=?, price=?, stock=?, image_url=?, category=?, is_active=?";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id, $name, $description, $price, $stock, $image_url, $category, $is_active,
        $name, $description, $price, $stock, $image_url, $category, $is_active
    ]);

    echo json_encode(["success" => true, "message" => "Product saved successfully", "id" => $id]);
    exit();
}
?>
