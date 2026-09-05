<?php
require_once 'db.php';

try {
    $pdo->exec("ALTER TABLE recipes ADD COLUMN json_data TEXT");
} catch (Exception $e) {
    // Ignore if column already exists
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $pdo->query("SELECT * FROM recipes ORDER BY created_at DESC");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Parse json_data and merge it back into the root for the frontend
    $mergedResults = [];
    foreach ($results as $row) {
        $json = !empty($row['json_data']) ? json_decode($row['json_data'], true) : [];
        $mergedResults[] = array_merge($row, $json ?? []);
    }
    echo json_encode($mergedResults);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? uniqid('rec_');
    
    // Flattened data for legacy columns
    $title = $data['recipeName'] ?? $data['title'] ?? '';
    $content = $data['recipeDescription'] ?? $data['content'] ?? '';
    
    $image_url = '';
    if (!empty($data['images']) && is_array($data['images'])) {
        $image_url = $data['images'][0];
    } elseif (!empty($data['image_url'])) {
        $image_url = $data['image_url'];
    }
    
    $json_data = json_encode($data);

    $sql = "INSERT INTO recipes (id, title, content, image_url, json_data) VALUES (?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE title=?, content=?, image_url=?, json_data=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id, $title, $content, $image_url, $json_data, 
        $title, $content, $image_url, $json_data
    ]);
    
    echo json_encode(["success" => true, "id" => $id]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "ID is required"]);
        exit();
    }
    $stmt = $pdo->prepare("DELETE FROM recipes WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
    exit();
}
?>
