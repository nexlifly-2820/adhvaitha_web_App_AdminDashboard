<?php
require_once 'db.php';

// Handle GET request: Fetch a specific setting document
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $doc_id = $_GET['doc_id'] ?? $_GET['key'] ?? null;
    
    if (!$doc_id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing doc_id or key parameter (e.g., ?key=home_video or ?doc_id=home_video)"]);
        exit();
    }
    
    $result = null;
    try {
        $stmt = $pdo->prepare("SELECT json_data FROM app_settings WHERE doc_id = ?");
        $stmt->execute([$doc_id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result && isset($result['json_data'])) {
            echo $result['json_data'];
            exit();
        }
    } catch (PDOException $e) {
        // Fallback check if schema uses setting_key / setting_value
        try {
            $stmt = $pdo->prepare("SELECT setting_value FROM app_settings WHERE setting_key = ?");
            $stmt->execute([$doc_id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($result && isset($result['setting_value'])) {
                echo $result['setting_value'];
                exit();
            }
        } catch (PDOException $e2) {
            // Table error handled by fallback below
        }
    }
    
    // Check if result was found using the setting_key fallback
    if ($result && isset($result['setting_value'])) {
        echo $result['setting_value'];
        exit();
    }

    // Return default fallback if the document doesn't exist yet
    if ($doc_id === 'home_video') {
        echo json_encode([
            'header_video_enabled' => true,
            'header_video_url' => 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4',
            'enabled' => true,
            'video_url' => 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1792920192/adhvaitha_foods_videos/okhemjaycs9mffdyoca9.mp4',
            'featured_video_url' => 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1792920192/adhvaitha_foods_videos/okhemjaycs9mffdyoca9.mp4',
            'title' => 'AmbhuJakshi Royal Collection'
        ]);
    } else {
        echo json_encode(new stdClass());
    }
    exit();
}

// Handle POST request: Save or update a setting document
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $doc_id = $_GET['doc_id'] ?? $_GET['key'] ?? null;
    
    if (!$doc_id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing doc_id or key parameter (e.g., ?key=home_video or ?doc_id=home_video)"]);
        exit();
    }
    
    // Get the raw JSON string sent from the Next.js Admin Dashboard or client
    $json_data = file_get_contents("php://input");
    
    // Safety Check: Ensure it is actually valid JSON before saving it to the database
    if (json_decode($json_data) === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON data received"]);
        exit();
    }

    // Try inserting/updating using standard doc_id / json_data schema
    try {
        $sql = "INSERT INTO app_settings (doc_id, json_data) VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE json_data = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$doc_id, $json_data, $json_data]);
    } catch (PDOException $e) {
        // Fallback for setting_key / setting_value schema
        $sql = "INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE setting_value = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$doc_id, $json_data, $json_data]);
    }

    echo json_encode(["success" => true, "message" => "Settings updated perfectly for: " . $doc_id]);
    exit();
}
?>
