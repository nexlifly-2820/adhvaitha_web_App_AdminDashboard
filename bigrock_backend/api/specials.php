<?php
// specials.php — Ambhujakshi Specials (Lotus Eye) Backend API (PHP / MySQL)
// Serves:
//   PUBLIC:
//     GET  /api/specials
//   ADMIN:
//     GET    /api/admin/specials/settings
//     PUT    /api/admin/specials/settings
//     GET    /api/admin/specials
//     POST   /api/admin/specials
//     PUT    /api/admin/specials/:id
//     DELETE /api/admin/specials/:id
//     PUT    /api/admin/specials-order
//     POST   /api/admin/specials-upload

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$PUBLIC_URL = 'https://api.adhvaithafoods.in';

function absUrl($u) {
    global $PUBLIC_URL;
    if (empty($u)) return '';
    if (preg_match('/^https?:\/\//i', $u)) return $u;
    return rtrim($PUBLIC_URL, '/') . '/' . ltrim($u, '/');
}

$VALID_ICONS = ['recipe', 'leaf', 'jar', 'sun', 'fire', 'hand', 'ghee', 'heart', 'star', 'truck'];

// ----------------------------------------------------
// 1. DDL AUTO-MIGRATIONS (MySQL Compatible)
// ----------------------------------------------------
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS specials_settings (
        id INT PRIMARY KEY DEFAULT 1,
        enabled TINYINT(1) DEFAULT 1,
        title VARCHAR(100) DEFAULT 'AMBHUJAKSHI',
        subtitle VARCHAR(100) DEFAULT 'SPECIALS',
        tagline VARCHAR(255) DEFAULT 'Seen through the Lotus Eye',
        tag_text VARCHAR(100) DEFAULT 'AMMA\'S SPECIAL',
        more_text VARCHAR(100) DEFAULT 'MORE SPECIALS',
        show_intro TINYINT(1) DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS specials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(100) DEFAULT '',
        name VARCHAR(100) NOT NULL,
        story VARCHAR(255) DEFAULT '',
        image TEXT DEFAULT '',
        features TEXT DEFAULT '[]',
        variants TEXT DEFAULT '[]',
        default_variant INT DEFAULT 0,
        enabled TINYINT(1) DEFAULT 1,
        sort INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Seed default settings row if empty
    $stCount = $pdo->query("SELECT COUNT(*) FROM specials_settings WHERE id = 1")->fetchColumn();
    if ($stCount == 0) {
        $pdo->exec("INSERT INTO specials_settings (id, enabled, title, subtitle, tagline, tag_text, more_text, show_intro)
                    VALUES (1, 1, 'AMBHUJAKSHI', 'SPECIALS', 'Seen through the Lotus Eye', 'AMMA\'S SPECIAL', 'MORE SPECIALS', 1)");
    }

    // Seed authentic specials items if empty
    $spCount = $pdo->query("SELECT COUNT(*) FROM specials")->fetchColumn();
    if ($spCount == 0) {
        $defaultSpecials = [
            [
                'product_id' => 'p1',
                'name' => 'Bellam Avakaya',
                'story' => 'Amma\'s sun-cured sweet and spicy jaggery mango pickle.',
                'image' => 'assets/images/bowl_bellam_avakaya.png',
                'features' => json_encode([
                    ['icon' => 'sun', 'text' => '21 Days Sun-Cured'],
                    ['icon' => 'recipe', 'text' => 'Organic Palm Jaggery'],
                    ['icon' => 'leaf', 'text' => 'No Preservatives']
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'variants' => json_encode([
                    ['id' => '250g', 'label' => '250 g', 'price' => 120, 'mrp' => 136],
                    ['id' => '500g', 'label' => '500 g', 'price' => 230, 'mrp' => 260]
                ]),
                'default_variant' => 0,
                'enabled' => 1,
                'sort' => 1
            ],
            [
                'product_id' => 'p2',
                'name' => 'Idli Karam Podi',
                'story' => 'Stone-pounded authentic gun powder spice mix for hot idlis and dosas.',
                'image' => 'assets/images/bowl_karam_podi.png',
                'features' => json_encode([
                    ['icon' => 'fire', 'text' => 'Stone-Pounded Spices'],
                    ['icon' => 'ghee', 'text' => 'Best with Desi Ghee'],
                    ['icon' => 'recipe', 'text' => 'Traditional Recipe']
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'variants' => json_encode([
                    ['id' => '250g', 'label' => '250 g', 'price' => 139, 'mrp' => 150],
                    ['id' => '500g', 'label' => '500 g', 'price' => 265, 'mrp' => 290]
                ]),
                'default_variant' => 0,
                'enabled' => 1,
                'sort' => 2
            ],
            [
                'product_id' => 'p3',
                'name' => 'Sunnunda Laddu',
                'story' => 'Royal roasted urad dal & desi ghee laddu from Andhra heritage.',
                'image' => 'assets/images/bowl_sunnunda_laddu.png',
                'features' => json_encode([
                    ['icon' => 'ghee', 'text' => '100% Pure Desi Ghee'],
                    ['icon' => 'heart', 'text' => 'High Protein & Energy'],
                    ['icon' => 'recipe', 'text' => 'No Refined Sugar']
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'variants' => json_encode([
                    ['id' => '250g', 'label' => '250 g', 'price' => 199, 'mrp' => 220],
                    ['id' => '500g', 'label' => '500 g', 'price' => 380, 'mrp' => 420]
                ]),
                'default_variant' => 0,
                'enabled' => 1,
                'sort' => 3
            ],
            [
                'product_id' => 'p6',
                'name' => 'Gongura Pickle',
                'story' => 'Heritage hand-mixed Andhra Sorrel leaves cooked in cold-pressed oil.',
                'image' => 'assets/images/bowl_gongura_pickle.png',
                'features' => json_encode([
                    ['icon' => 'leaf', 'text' => 'Handpicked Sorrel Leaves'],
                    ['icon' => 'ghee', 'text' => 'Wood-Pressed Sesame Oil'],
                    ['icon' => 'jar', 'text' => 'Aged in Ceramic Jaadis']
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'variants' => json_encode([
                    ['id' => '250g', 'label' => '250 g', 'price' => 130, 'mrp' => 145],
                    ['id' => '500g', 'label' => '500 g', 'price' => 250, 'mrp' => 280]
                ]),
                'default_variant' => 0,
                'enabled' => 1,
                'sort' => 4
            ]
        ];

        $ins = $pdo->prepare("
            INSERT INTO specials (product_id, name, story, image, features, variants, default_variant, enabled, sort)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        foreach ($defaultSpecials as $ds) {
            $ins->execute([
                $ds['product_id'], $ds['name'], $ds['story'], $ds['image'],
                $ds['features'], $ds['variants'], $ds['default_variant'], $ds['enabled'], $ds['sort']
            ]);
        }
    }
} catch (Exception $e) {
    // Schema creation caught safely
}

// ----------------------------------------------------
// 2. ROUTING LOGIC
// ----------------------------------------------------
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (!$action) {
    if (strpos($path, '/admin/specials/settings') !== false) {
        $action = 'admin_settings';
    } else if (strpos($path, '/admin/specials-order') !== false) {
        $action = 'admin_order';
    } else if (strpos($path, '/admin/specials-upload') !== false) {
        $action = 'admin_upload';
    } else if (preg_match('#/admin/specials/([0-9]+)#', $path, $m)) {
        $action = 'admin_item';
        $_GET['id'] = $m[1];
    } else if (strpos($path, '/admin/specials') !== false) {
        $action = 'admin_specials';
    } else if (strpos($path, '/specials') !== false) {
        $action = 'public_specials';
    }
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($action) {
    // ------------------------------------------------
    // PUBLIC APP ENDPOINT: GET /api/specials
    // ------------------------------------------------
    case 'public_specials':
        $st = $pdo->query("SELECT * FROM specials_settings WHERE id = 1 LIMIT 1")->fetch(PDO::FETCH_ASSOC);
        $rows = $pdo->query("SELECT * FROM specials WHERE enabled = 1 ORDER BY sort ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC);

        $items = [];
        foreach ($rows as $r) {
            $rawFeatures = json_decode($r['features'] ?? '[]', true) ?: [];
            $features = [];
            foreach (array_slice($rawFeatures, 0, 3) as $f) {
                if (!empty($f['text'])) {
                    $icon = in_array($f['icon'] ?? '', $VALID_ICONS) ? $f['icon'] : 'star';
                    $features[] = ['icon' => $icon, 'text' => (string)$f['text']];
                }
            }

            $rawVariants = json_decode($r['variants'] ?? '[]', true) ?: [];
            $variants = [];
            foreach ($rawVariants as $v) {
                if (!empty($v['label']) && (float)($v['price'] ?? 0) > 0) {
                    $variants[] = [
                        'id' => (string)($v['id'] ?? ''),
                        'label' => (string)$v['label'],
                        'price' => (float)$v['price'],
                        'mrp' => (float)($v['mrp'] ?? 0)
                    ];
                }
            }

            // Must have image and at least one variant
            if (!empty($r['image']) && count($variants) > 0) {
                $items[] = [
                    'id' => (string)$r['id'],
                    'productId' => (string)($r['product_id'] ?? ''),
                    'name' => (string)$r['name'],
                    'story' => (string)($r['story'] ?? ''),
                    'image' => absUrl($r['image']),
                    'features' => $features,
                    'variants' => $variants,
                    'defaultVariant' => (int)($r['default_variant'] ?? 0)
                ];
            }
        }

        $response = [
            'settings' => [
                'enabled' => $st ? (bool)$st['enabled'] : true,
                'title' => $st['title'] ?? 'AMBHUJAKSHI',
                'subtitle' => $st['subtitle'] ?? 'SPECIALS',
                'tagline' => $st['tagline'] ?? 'Seen through the Lotus Eye',
                'tagText' => $st['tag_text'] ?? "AMMA'S SPECIAL",
                'moreText' => $st['more_text'] ?? 'MORE SPECIALS',
                'showIntro' => $st ? (bool)$st['show_intro'] : true
            ],
            'items' => $items
        ];

        header('Cache-Control: public, max-age=60');
        echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        break;

    // ------------------------------------------------
    // ADMIN SETTINGS: GET/PUT /api/admin/specials/settings
    // ------------------------------------------------
    case 'admin_settings':
        if ($method === 'GET') {
            $st = $pdo->query("SELECT * FROM specials_settings WHERE id = 1 LIMIT 1")->fetch(PDO::FETCH_ASSOC);
            echo json_encode($st ?: [], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        } else if ($method === 'PUT' || $method === 'POST') {
            $b = $input;
            $enabled = isset($b['enabled']) ? ($b['enabled'] ? 1 : 0) : 1;
            $title = $b['title'] ?? 'AMBHUJAKSHI';
            $subtitle = $b['subtitle'] ?? 'SPECIALS';
            $tagline = $b['tagline'] ?? 'Seen through the Lotus Eye';
            $tagText = $b['tagText'] ?? $b['tag_text'] ?? "AMMA'S SPECIAL";
            $moreText = $b['moreText'] ?? $b['more_text'] ?? 'MORE SPECIALS';
            $showIntro = isset($b['showIntro']) ? ($b['showIntro'] ? 1 : 0) : (isset($b['show_intro']) ? ($b['show_intro'] ? 1 : 0) : 1);

            $stmt = $pdo->prepare("
                UPDATE specials_settings SET
                    enabled = ?, title = ?, subtitle = ?, tagline = ?,
                    tag_text = ?, more_text = ?, show_intro = ?
                WHERE id = 1
            ");
            $stmt->execute([$enabled, $title, $subtitle, $tagline, $tagText, $moreText, $showIntro]);
            echo json_encode(['ok' => true]);
        }
        break;

    // ------------------------------------------------
    // ADMIN SPECIALS: GET/POST /api/admin/specials
    // ------------------------------------------------
    case 'admin_specials':
        if ($method === 'GET') {
            $rows = $pdo->query("SELECT * FROM specials ORDER BY sort ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC);
            // Decode features and variants as arrays for the admin panel
            foreach ($rows as &$r) {
                $r['features'] = json_decode($r['features'] ?? '[]', true) ?: [];
                $r['variants'] = json_decode($r['variants'] ?? '[]', true) ?: [];
                $r['enabled'] = (bool)$r['enabled'];
                $r['default_variant'] = (int)($r['default_variant'] ?? 0);
            }
            echo json_encode($rows, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        } else if ($method === 'POST') {
            $b = $input;
            $name = trim($b['name'] ?? '');
            if (!$name) {
                http_response_code(400);
                echo json_encode(['error' => 'Name is required']);
                exit();
            }
            if (mb_strlen($name) > 18) {
                http_response_code(400);
                echo json_encode(['error' => 'Name is max 18 letters']);
                exit();
            }

            $productId = $b['productId'] ?? $b['product_id'] ?? '';
            $story = $b['story'] ?? '';
            $image = $b['image'] ?? 'assets/images/bowl_bellam_avakaya.png';
            $features = is_array($b['features'] ?? null) ? json_encode($b['features'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : '[]';
            $variants = is_array($b['variants'] ?? null) ? json_encode($b['variants'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : '[]';
            $defaultVariant = (int)($b['defaultVariant'] ?? $b['default_variant'] ?? 0);
            $enabled = isset($b['enabled']) ? ($b['enabled'] ? 1 : 0) : 1;

            $maxSort = (int)$pdo->query("SELECT COALESCE(MAX(sort), 0) FROM specials")->fetchColumn();
            $sort = $maxSort + 1;

            $stmt = $pdo->prepare("
                INSERT INTO specials (product_id, name, story, image, features, variants, default_variant, enabled, sort)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$productId, $name, $story, $image, $features, $variants, $defaultVariant, $enabled, $sort]);
            $newId = $pdo->lastInsertId();

            $created = $pdo->prepare("SELECT * FROM specials WHERE id = ?");
            $created->execute([$newId]);
            $row = $created->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                $row['features'] = json_decode($row['features'] ?? '[]', true) ?: [];
                $row['variants'] = json_decode($row['variants'] ?? '[]', true) ?: [];
                $row['enabled'] = (bool)$row['enabled'];
            }
            echo json_encode($row ?: ['ok' => true, 'id' => $newId], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }
        break;

    // ------------------------------------------------
    // ADMIN SINGLE ITEM: PUT/DELETE /api/admin/specials/:id
    // ------------------------------------------------
    case 'admin_item':
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Valid ID required']);
            exit();
        }

        if ($method === 'PUT' || $method === 'POST') {
            $b = $input;
            $fields = [];
            $params = [];

            if (isset($b['name'])) {
                $name = trim($b['name']);
                if (!$name || mb_strlen($name) > 18) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Name required, max 18 letters']);
                    exit();
                }
                $fields[] = "name = ?";
                $params[] = $name;
            }
            if (isset($b['productId']) || isset($b['product_id'])) {
                $fields[] = "product_id = ?";
                $params[] = $b['productId'] ?? $b['product_id'];
            }
            if (isset($b['story'])) {
                $story = trim($b['story']);
                if (mb_strlen($story) > 80) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Story max 80 letters']);
                    exit();
                }
                $fields[] = "story = ?";
                $params[] = $story;
            }
            if (isset($b['image'])) {
                $fields[] = "image = ?";
                $params[] = $b['image'];
            }
            if (isset($b['features'])) {
                $features = is_array($b['features']) ? json_encode($b['features'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : (string)$b['features'];
                $fields[] = "features = ?";
                $params[] = $features;
            }
            if (isset($b['variants'])) {
                $variants = is_array($b['variants']) ? json_encode($b['variants'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : (string)$b['variants'];
                $fields[] = "variants = ?";
                $params[] = $variants;
            }
            if (isset($b['defaultVariant']) || isset($b['default_variant'])) {
                $fields[] = "default_variant = ?";
                $params[] = (int)($b['defaultVariant'] ?? $b['default_variant']);
            }
            if (isset($b['enabled'])) {
                $fields[] = "enabled = ?";
                $params[] = $b['enabled'] ? 1 : 0;
            }

            if (!empty($fields)) {
                $params[] = $id;
                $sql = "UPDATE specials SET " . implode(', ', $fields) . " WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }
            echo json_encode(['ok' => true]);
        } else if ($method === 'DELETE') {
            $stmt = $pdo->prepare("DELETE FROM specials WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['ok' => true]);
        }
        break;

    // ------------------------------------------------
    // ADMIN REORDER: PUT /api/admin/specials-order
    // ------------------------------------------------
    case 'admin_order':
        $ids = $input['ids'] ?? [];
        if (is_array($ids)) {
            $stmt = $pdo->prepare("UPDATE specials SET sort = ? WHERE id = ?");
            foreach ($ids as $idx => $sid) {
                $stmt->execute([$idx + 1, (int)$sid]);
            }
        }
        echo json_encode(['ok' => true]);
        break;

    // ------------------------------------------------
    // ADMIN UPLOAD: POST /api/admin/specials-upload
    // ------------------------------------------------
    case 'admin_upload':
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'Send a PNG/JPG/WebP photo in the image field']);
            exit();
        }

        $file = $_FILES['image'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['png', 'jpg', 'jpeg', 'webp'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Only PNG, JPG, or WebP allowed']);
            exit();
        }

        $uploadDir = __DIR__ . '/uploads';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $name = 'special_' . bin2hex(random_bytes(8)) . '.' . $ext;
        $dest = $uploadDir . '/' . $name;

        if (move_uploaded_file($file['tmp_name'], $dest)) {
            $relPath = 'uploads/' . $name;
            echo json_encode([
                'ok' => true,
                'path' => $relPath,
                'url' => absUrl($relPath)
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save uploaded file']);
        }
        break;

    default:
        // Default fallback to public specials
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}
