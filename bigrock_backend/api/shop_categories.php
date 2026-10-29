<?php
// shop_categories.php — 3D "Lazy Susan" Turntable Category API Endpoint for Flutter App
// Serves GET /api/shop/categories and GET /api/shop_categories.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// Default authentic Lazy Susan configuration
$defaultConfig = [
    'settings' => [
        'enabled' => true,
        'eyebrow' => 'SHOP BY CATEGORY',
        'titleStart' => "Spin Amma's",
        'titleAccent' => 'lazy susan',
        'hint' => '👆 Tap a bowl, a name or swipe to choose',
        'products' => true
    ],
    'categories' => [
        [
            'id' => '1',
            'slug' => 'pickle',
            'name' => 'Pickles',
            'label' => 'BESTSELLERS',
            'subtitle' => 'Sun-cured in jaadis',
            'image' => 'assets/images/avakaya_pickle.png',
            'color1' => '#E8432B',
            'color2' => '#9E1424',
            'color3' => '#4A0A0E',
            'count' => 12,
            'products' => []
        ],
        [
            'id' => '2',
            'slug' => 'snack',
            'name' => 'Snacks',
            'label' => 'CRISPY',
            'subtitle' => 'Crunchy, tea-time ready',
            'image' => 'assets/images/murukku_rings.png',
            'color1' => '#F59E2B',
            'color2' => '#C2410C',
            'color3' => '#5A1E04',
            'count' => 9,
            'products' => []
        ],
        [
            'id' => '3',
            'slug' => 'podi',
            'name' => 'Podis',
            'label' => 'MADE DAILY',
            'subtitle' => 'Stone-ground fresh every week',
            'image' => 'assets/images/karivepaku_podi.png',
            'color1' => '#3FA34D',
            'color2' => '#1D6B33',
            'color3' => '#0A2E16',
            'count' => 8,
            'products' => []
        ],
        [
            'id' => '4',
            'slug' => 'sweet',
            'name' => 'Sweets',
            'label' => 'FESTIVE',
            'subtitle' => 'Pure ghee & jaggery',
            'image' => 'assets/images/sweets.png',
            'color1' => '#E0579A',
            'color2' => '#9D174D',
            'color3' => '#4A0A26',
            'count' => 10,
            'products' => []
        ],
        [
            'id' => '5',
            'slug' => 'vadiyalu',
            'name' => 'Vadiyalu',
            'label' => 'FRY & ENJOY',
            'subtitle' => 'Sun-dried on the terrace',
            'image' => 'assets/images/snacks.png',
            'color1' => '#8B5CF6',
            'color2' => '#5B21B6',
            'color3' => '#26104F',
            'count' => 6,
            'products' => []
        ],
        [
            'id' => '6',
            'slug' => 'masala',
            'name' => 'Masalas',
            'label' => 'AROMATIC',
            'subtitle' => 'Whole spices, slow-roasted',
            'image' => 'assets/images/pickles.png',
            'color1' => '#B7791F',
            'color2' => '#7A4512',
            'color3' => '#3A1E06',
            'count' => 7,
            'products' => []
        ]
    ]
];

// Handle GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 1. Check if saved in app_settings table
    try {
        $stmt = $pdo->prepare("SELECT json_data FROM app_settings WHERE doc_id = 'shop_categories'");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row && !empty($row['json_data'])) {
            $decoded = json_decode($row['json_data'], true);
            if ($decoded && isset($decoded['categories'])) {
                echo $row['json_data'];
                exit();
            }
        }
    } catch (Exception $e) {
        // Fallback continues below
    }

    // 2. Return authentic default config
    echo json_encode($defaultConfig, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit();
}

// Handle POST/PUT: Save configuration
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        exit();
    }

    $cleanPayload = isset($data['content']) ? $data['content'] : $data;
    $jsonToStore = json_encode($cleanPayload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    try {
        $sql = "INSERT INTO app_settings (doc_id, json_data) VALUES ('shop_categories', ?) 
                ON DUPLICATE KEY UPDATE json_data = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$jsonToStore, $jsonToStore]);

        echo json_encode([
            'success' => true,
            'status' => 'success',
            'message' => 'Turntable categories updated successfully'
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database update failed: ' . $e->getMessage()]);
    }
    exit();
}
?>
