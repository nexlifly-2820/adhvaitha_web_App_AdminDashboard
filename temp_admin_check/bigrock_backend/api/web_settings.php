<?php
require_once 'db.php';

// Handle GET request
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $doc_id = $_GET['doc_id'] ?? null;
    if (!$doc_id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing doc_id parameter"]);
        exit();
    }
    $stmt = $pdo->prepare("SELECT json_data FROM web_settings WHERE doc_id = ?");
    $stmt->execute([$doc_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo $result ? $result['json_data'] : json_encode(new stdClass());
    exit();
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $doc_id = $_GET['doc_id'] ?? null;
    if (!$doc_id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing doc_id parameter"]);
        exit();
    }
    $json_data = file_get_contents("php://input");
    if (json_decode($json_data) === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON"]);
        exit();
    }
    $sql = "INSERT INTO web_settings (doc_id, json_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE json_data = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$doc_id, $json_data, $json_data]);
    echo json_encode(["success" => true, "message" => "Updated: " . $doc_id]);
    exit();
}
?>
