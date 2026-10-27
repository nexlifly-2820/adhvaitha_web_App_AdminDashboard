<?php
require_once 'db.php';

// Rewards API Endpoint for Ladder & Offers
$action = $_GET['action'] ?? 'ladder';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'ladder') {
        try {
            $stmt = $pdo->prepare("SELECT json_data FROM app_settings WHERE doc_id = 'reward_ladder'");
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row && isset($row['json_data'])) {
                echo $row['json_data'];
                exit();
            }
        } catch (PDOException $e) {}

        // Fallback default ladder
        echo json_encode([
            "list" => [
                ["step" => 1, "unlock_after" => 0, "is_big" => false, "active" => true, "title" => "Free on Signup"],
                ["step" => 2, "unlock_after" => 1, "is_big" => false, "active" => true, "title" => "1st Delivered Order"],
                ["step" => 3, "unlock_after" => 2, "is_big" => false, "active" => true, "title" => "2nd Delivered Order"],
                ["step" => 4, "unlock_after" => 3, "is_big" => true, "active" => true, "title" => "Big Prize Milestone 🎁"]
            ]
        ]);
        exit();
    } else if ($action === 'offers') {
        try {
            $stmt = $pdo->prepare("SELECT json_data FROM app_settings WHERE doc_id = 'reward_offers'");
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row && isset($row['json_data'])) {
                echo $row['json_data'];
                exit();
            }
        } catch (PDOException $e) {}

        echo json_encode(["list" => []]);
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $decoded = json_decode($input, true);
    
    $doc_id = $action === 'ladder' ? 'reward_ladder' : 'reward_offers';
    
    try {
        $sql = "INSERT INTO app_settings (doc_id, json_data) VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE json_data = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$doc_id, $input, $input]);
        echo json_encode(["success" => true, "message" => "Updated $doc_id"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
    exit();
}
?>
