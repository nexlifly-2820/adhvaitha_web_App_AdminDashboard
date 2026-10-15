<?php
require_once 'db.php';

// Handle GET request: Fetch a specific setting document
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $doc_id = $_GET['doc_id'] ?? null;
    
    if (!$doc_id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing doc_id parameter (e.g., ?doc_id=banners)"]);
        exit();
    }
    
    $stmt = $pdo->prepare("SELECT json_data FROM app_settings WHERE doc_id = ?");
    $stmt->execute([$doc_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        // Echo the JSON data exactly as it was saved
        echo $result['json_data'];
    } else {
        // Return an empty object if the document doesn't exist yet
        echo json_encode(new stdClass());
    }
    exit();
}

// Handle POST request: Save or update a setting document
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $doc_id = $_GET['doc_id'] ?? null;
    
    if (!$doc_id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing doc_id parameter (e.g., ?doc_id=banners)"]);
        exit();
    }
    
    // Get the raw JSON string sent from the Next.js Admin Dashboard
    $json_data = file_get_contents("php://input");
    
    // Safety Check: Ensure it is actually valid JSON before saving it to the database
    if (json_decode($json_data) === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON data received"]);
        exit();
    }

    // Insert or Update the JSON data for this doc_id
    $sql = "INSERT INTO app_settings (doc_id, json_data) VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE json_data = ?";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$doc_id, $json_data, $json_data]);

    echo json_encode(["success" => true, "message" => "Settings updated perfectly for: " . $doc_id]);
    exit();
}
?>
