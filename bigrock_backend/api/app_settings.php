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
    } else if ($doc_id === 'festival_config') {
        echo json_encode([
            'enabled' => true,
            'id' => 'sankranti-2027',
            'kicker' => 'CELEBRATE',
            'title' => 'Sankranti',
            'subtitle' => 'Pindi vantalu, sweets & gift boxes, made fresh',
            'chipsTitle' => 'FESTIVE SPECIALS',
            'theme' => [
                'bgTop' => '#F9DFB3',
                'bgBottom' => '#F6D6A2',
                'tile' => '#B81D3B',
                'line' => '#EFCF8C',
                'title' => '#7A1240',
                'kicker' => '#5A1030',
                'strip' => '#D98F2E',
                'chipBg' => '#FDF3DD',
                'accent' => '#E9952C'
            ],
            'tiles' => [
                ['title' => "Pindi\nVantalu", 'image' => 'assets/images/snacks.png', 'image2' => 'assets/images/sweets.png', 'link' => ['category' => 'Snacks']],
                ['title' => "Festive\nSweets", 'image' => 'assets/images/sweets.png', 'image2' => 'assets/images/snacks.png', 'link' => ['category' => 'Sweets']],
                ['title' => "Gifting\nCorner", 'image' => 'assets/images/combos.png', 'image2' => 'assets/images/pickles.png', 'link' => ['category' => 'Combos']],
                ['title' => "Pickles\n& Podis", 'image' => 'assets/images/pickles.png', 'image2' => 'assets/images/spices.png', 'link' => ['category' => 'Pickles']]
            ],
            'strip' => ['HOMEMADE', 'STONE-GROUND', 'FRESH BATCHES', 'PAN-INDIA'],
            'chips' => [
                ['title' => "Sankranti\nEssentials", 'image' => 'assets/images/sweets.png', 'link' => ['tag' => 'sankranti']],
                ['title' => "Snacks\n& More", 'image' => 'assets/images/snacks.png', 'link' => ['category' => 'Snacks']],
                ['title' => "Under\n₹299", 'image' => 'assets/images/spices.png', 'link' => ['maxPrice' => 299]]
            ],
            'products' => ['tag' => 'sankranti-2027', 'limit' => 10]
        ]);
    } else if ($doc_id === 'featured_video_section') {
        echo json_encode([
            'enabled' => true,
            'tag' => 'HERITAGE IN MOTION',
            'title' => 'Behind the Craft: Our Sun-Dried Tradition',
            'subtitle' => 'Watch how our 40-year-old authentic recipes come to life.',
            'video_url' => 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4'
        ]);
    } else if ($doc_id === 'tab_transition_video') {
        echo json_encode([
            'enabled' => true,
            'duration_ms' => 1200,
            'video_url' => 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1793005669/adhvaitha_foods_videos/ofnsjz4frs9ur2pzpufe.mp4',
            'caption' => 'Swapping Heritage Kitchens...',
            'show_spinner' => true,
            'display_mode' => 'fullscreen',
            'is_fullscreen' => true
        ]);
    } else {
        echo json_encode(new stdClass());
    }
    exit();
}

// Handle POST request: Save or update a setting document
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $doc_id = $_GET['doc_id'] ?? $_GET['key'] ?? null;
    $json_data = file_get_contents("php://input");
    
    // Safety Check: Ensure it is actually valid JSON before saving it to the database
    $decoded = json_decode($json_data, true);
    if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON data received"]);
        exit();
    }
    
    // Fallback: extract doc_id from body if not in query parameters
    if (!$doc_id && isset($decoded['doc_id'])) {
        $doc_id = $decoded['doc_id'];
    }
    if (!$doc_id && isset($decoded['key'])) {
        $doc_id = $decoded['key'];
    }
    
    if (!$doc_id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing doc_id or key parameter (e.g., ?key=home_video or ?doc_id=home_video)"]);
        exit();
    }
    
    // If body wraps content in `content` field, save the inner content
    $data_to_save = (isset($decoded['content']) && is_array($decoded['content']))
        ? json_encode($decoded['content'])
        : $json_data;

    // Try inserting/updating using standard doc_id / json_data schema
    try {
        $sql = "INSERT INTO app_settings (doc_id, json_data) VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE json_data = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$doc_id, $data_to_save, $data_to_save]);
    } catch (PDOException $e) {
        // Fallback for setting_key / setting_value schema
        $sql = "INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE setting_value = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$doc_id, $data_to_save, $data_to_save]);
    }

    echo json_encode([
        "success" => true,
        "status" => "success",
        "saved" => true,
        "message" => "Settings updated perfectly for: " . $doc_id
    ]);
    exit();
}
?>
