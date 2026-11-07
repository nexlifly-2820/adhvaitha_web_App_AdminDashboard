<?php
// pairing.php — "The Art of Pairing" (Couples & Combos) Backend API (PHP / MySQL)
// Serves:
//   PUBLIC:
//     GET  /api/pairing
//   ADMIN:
//     GET    /api/admin/pairing/settings
//     PUT    /api/admin/pairing/settings
//     GET    /api/admin/pairing/couples
//     POST   /api/admin/pairing/couples
//     PUT    /api/admin/pairing/couples/:id
//     DELETE /api/admin/pairing/couples/:id
//     PUT    /api/admin/pairing/order
//     POST   /api/admin/pairing/upload

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

// ----------------------------------------------------
// 1. DDL AUTO-MIGRATIONS (MySQL Compatible)
// ----------------------------------------------------
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS pairing_settings (
        id INT PRIMARY KEY DEFAULT 1,
        enabled TINYINT(1) DEFAULT 1,
        eyebrow VARCHAR(100) DEFAULT 'CURATED COMBOS',
        title VARCHAR(100) DEFAULT 'The Art of',
        title_accent VARCHAR(100) DEFAULT 'Pairing',
        subtitle VARCHAR(255) DEFAULT '',
        explain_text TEXT DEFAULT '',
        match_text VARCHAR(100) DEFAULT 'Made for each other',
        button_text VARCHAR(100) DEFAULT 'Meet Amma\'s perfect couples',
        more_text VARCHAR(100) DEFAULT 'MORE PERFECT COUPLES',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS pairing_couples (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        tag VARCHAR(50) DEFAULT '',
        meal_icon VARCHAR(20) DEFAULT '',
        meal_name VARCHAR(50) DEFAULT '',
        loved_text VARCHAR(100) DEFAULT '',
        tip VARCHAR(255) DEFAULT '',
        a TEXT DEFAULT '{}',
        b TEXT DEFAULT '{}',
        weights TEXT DEFAULT '[]',
        enabled TINYINT(1) DEFAULT 1,
        sort INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Seed default settings row if empty
    $stCount = $pdo->query("SELECT COUNT(*) FROM pairing_settings WHERE id = 1")->fetchColumn();
    if ($stCount == 0) {
        $pdo->exec("INSERT INTO pairing_settings (id, enabled, eyebrow, title, title_accent, subtitle, explain_text, match_text, button_text, more_text)
                    VALUES (1, 1, 'CURATED COMBOS', 'The Art of', 'Pairing', 'Flavors meant to be experienced together', 'Traditional South Indian dining has always paired complementary flavors — tangy with sweet, crunchy with soft, hot podi with soothing ghee.', 'Made for each other', 'Meet Amma\'s perfect couples', 'MORE PERFECT COUPLES')");
    }

    // Seed authentic pairing couples if empty
    $cpCount = $pdo->query("SELECT COUNT(*) FROM pairing_couples")->fetchColumn();
    if ($cpCount == 0) {
        $defaultCouples = [
            [
                'name' => 'Karam Podi + Avakaya',
                'tag' => 'BESTSELLER',
                'meal_icon' => '🌅',
                'meal_name' => 'BREAKFAST',
                'loved_text' => 'Amma\'s favorite morning duo',
                'tip' => 'Serve hot with piping hot idlis and pure cow ghee',
                'a' => json_encode([
                    'productId' => 'p2',
                    'name' => 'Karam Podi',
                    'bio' => 'Stone-ground spices & roasted lentils',
                    'image' => 'assets/images/bowl_karam_podi.png',
                    'tags' => ['SPICY', 'CRISP']
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'b' => json_encode([
                    'productId' => 'p1',
                    'name' => 'Bellam Avakaya',
                    'bio' => 'Sun-cured sweet and spicy mango pickle',
                    'image' => 'assets/images/bowl_bellam_avakaya.png',
                    'tags' => ['SWEET', 'TANGY']
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'weights' => json_encode([
                    ['label' => '250 g each', 'price' => 379, 'mrp' => 419, 'aVariantId' => 'p2_250', 'bVariantId' => 'p1_250'],
                    ['label' => '500 g each', 'price' => 699, 'mrp' => 779, 'aVariantId' => 'p2_500', 'bVariantId' => 'p1_500']
                ]),
                'enabled' => 1,
                'sort' => 1
            ],
            [
                'name' => 'Murukku + Banana Chips',
                'tag' => 'CRUNCHY',
                'meal_icon' => '☕',
                'meal_name' => 'EVENING TEA',
                'loved_text' => 'The ultimate 4 PM companion',
                'tip' => 'Pair with hot ginger filter chai',
                'a' => json_encode([
                    'productId' => 'p4',
                    'name' => 'Karam Janthukalu',
                    'bio' => 'Crispy savory golden spiral snack',
                    'image' => 'assets/images/bowl_karam_janthukalu.png',
                    'tags' => ['CRUNCHY']
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'b' => json_encode([
                    'productId' => 'p5',
                    'name' => 'Banana Chips',
                    'bio' => 'Thinly sliced raw banana fried in oil',
                    'image' => 'assets/images/bowl_allu_chips.png',
                    'tags' => ['SAVORY']
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'weights' => json_encode([
                    ['label' => '250 g each', 'price' => 299, 'mrp' => 349, 'aVariantId' => 'p4_250', 'bVariantId' => 'p5_250']
                ]),
                'enabled' => 1,
                'sort' => 2
            ],
            [
                'name' => 'Sunnunda Laddu + Murukku',
                'tag' => 'ROYAL',
                'meal_icon' => '🌙',
                'meal_name' => 'AFTER MEALS',
                'loved_text' => 'Sweet endings & crunchy treats',
                'tip' => 'Perfect after-meal dessert and festival treat',
                'a' => json_encode([
                    'productId' => 'p3',
                    'name' => 'Sunnunda Laddu',
                    'bio' => 'Desi ghee roasted urad dal laddu',
                    'image' => 'assets/images/bowl_sunnunda_laddu.png',
                    'tags' => ['SWEET', 'GHEE']
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'b' => json_encode([
                    'productId' => 'p4',
                    'name' => 'Karam Murukku',
                    'bio' => 'Traditional crisp spiced rings',
                    'image' => 'assets/images/bowl_karam_janthukalu.png',
                    'tags' => ['CRISP']
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'weights' => json_encode([
                    ['label' => '250 g each', 'price' => 399, 'mrp' => 449, 'aVariantId' => 'p3_250', 'bVariantId' => 'p4_250']
                ]),
                'enabled' => 1,
                'sort' => 3
            ]
        ];

        $ins = $pdo->prepare("INSERT INTO pairing_couples (name, tag, meal_icon, meal_name, loved_text, tip, a, b, weights, enabled, sort)
                              VALUES (:name, :tag, :meal_icon, :meal_name, :loved_text, :tip, :a, :b, :weights, :enabled, :sort)");
        foreach ($defaultCouples as $c) {
            $ins->execute($c);
        }
    }
} catch (Exception $e) {
    error_log("Pairing DB Migration Warning: " . $e->getMessage());
}

// ----------------------------------------------------
// 2. ROUTING & DISPATCH
// ----------------------------------------------------
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// Parse URL path fallback if mod_rewrite wasn't applied
if (empty($action)) {
    $uri = $_SERVER['REQUEST_URI'];
    $path = parse_url($uri, PHP_URL_PATH);
    if (strpos($path, '/admin/pairing/settings') !== false) {
        $action = 'admin_settings';
    } else if (strpos($path, '/admin/pairing/order') !== false) {
        $action = 'admin_order';
    } else if (strpos($path, '/admin/pairing/upload') !== false) {
        $action = 'admin_upload';
    } else if (preg_match('#/admin/pairing/couples/([0-9]+)#', $path, $m)) {
        $action = 'admin_item';
        $_GET['id'] = $m[1];
    } else if (strpos($path, '/admin/pairing/couples') !== false) {
        $action = 'admin_couples';
    } else if (strpos($path, '/pairing') !== false) {
        $action = 'public_pairing';
    }
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

function formatSide($side) {
    $data = is_string($side) ? json_decode($side, true) : (is_array($side) ? $side : []);
    $tags = isset($data['tags']) && is_array($data['tags']) ? array_slice($data['tags'], 0, 2) : [];
    return [
        'productId' => (string)($data['productId'] ?? ''),
        'name' => (string)($data['name'] ?? ''),
        'bio' => (string)($data['bio'] ?? ''),
        'image' => absUrl($data['image'] ?? ''),
        'tags' => array_map('strval', $tags)
    ];
}

switch ($action) {
    // ------------------------------------------------
    // PUBLIC APP ENDPOINT: GET /api/pairing
    // ------------------------------------------------
    case 'public_pairing':
        $st = $pdo->query("SELECT * FROM pairing_settings WHERE id = 1 LIMIT 1")->fetch(PDO::FETCH_ASSOC);
        $rows = $pdo->query("SELECT * FROM pairing_couples WHERE enabled = 1 ORDER BY sort ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC);

        $couples = [];
        foreach ($rows as $r) {
            $rawWeights = json_decode($r['weights'] ?? '[]', true) ?: [];
            $weights = [];
            foreach ($rawWeights as $w) {
                if (!empty($w['label']) && (float)($w['price'] ?? 0) > 0) {
                    $weights[] = [
                        'label' => (string)$w['label'],
                        'price' => (float)$w['price'],
                        'mrp' => (float)($w['mrp'] ?? 0),
                        'aVariantId' => (string)($w['aVariantId'] ?? ''),
                        'bVariantId' => (string)($w['bVariantId'] ?? '')
                    ];
                }
            }

            $sideA = formatSide($r['a']);
            $sideB = formatSide($r['b']);

            if (!empty($sideA['image']) && !empty($sideB['image']) && count($weights) > 0) {
                $couples[] = [
                    'id' => (string)$r['id'],
                    'name' => (string)$r['name'],
                    'tag' => (string)($r['tag'] ?? ''),
                    'mealIcon' => (string)($r['meal_icon'] ?? ''),
                    'mealName' => (string)($r['meal_name'] ?? ''),
                    'lovedText' => (string)($r['loved_text'] ?? ''),
                    'tip' => (string)($r['tip'] ?? ''),
                    'a' => $sideA,
                    'b' => $sideB,
                    'weights' => $weights
                ];
            }
        }

        $response = [
            'settings' => [
                'enabled' => $st ? (bool)$st['enabled'] : true,
                'eyebrow' => $st['eyebrow'] ?? 'CURATED COMBOS',
                'title' => $st['title'] ?? 'The Art of',
                'titleAccent' => $st['title_accent'] ?? 'Pairing',
                'subtitle' => $st['subtitle'] ?? '',
                'explainText' => $st['explain_text'] ?? '',
                'matchText' => $st['match_text'] ?? 'Made for each other',
                'buttonText' => $st['button_text'] ?? "Meet Amma's perfect couples",
                'moreText' => $st['more_text'] ?? 'MORE PERFECT COUPLES'
            ],
            'couples' => $couples
        ];

        echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        break;

    // ------------------------------------------------
    // ADMIN SETTINGS: GET / PUT /api/admin/pairing/settings
    // ------------------------------------------------
    case 'admin_settings':
        if ($method === 'GET') {
            $row = $pdo->query("SELECT * FROM pairing_settings WHERE id = 1 LIMIT 1")->fetch(PDO::FETCH_ASSOC);
            if (!$row) {
                $row = [
                    'id' => 1,
                    'enabled' => 1,
                    'eyebrow' => 'CURATED COMBOS',
                    'title' => 'The Art of',
                    'title_accent' => 'Pairing',
                    'subtitle' => '',
                    'explain_text' => '',
                    'match_text' => 'Made for each other',
                    'button_text' => "Meet Amma's perfect couples",
                    'more_text' => 'MORE PERFECT COUPLES'
                ];
            }
            echo json_encode($row);
        } else if ($method === 'PUT') {
            $stmt = $pdo->prepare("UPDATE pairing_settings SET
                enabled = COALESCE(:enabled, enabled),
                eyebrow = COALESCE(:eyebrow, eyebrow),
                title = COALESCE(:title, title),
                title_accent = COALESCE(:title_accent, title_accent),
                subtitle = COALESCE(:subtitle, subtitle),
                match_text = COALESCE(:match_text, match_text),
                button_text = COALESCE(:button_text, button_text),
                more_text = COALESCE(:more_text, more_text),
                explain_text = COALESCE(:explain_text, explain_text)
                WHERE id = 1");

            $stmt->execute([
                ':enabled' => isset($input['enabled']) ? ($input['enabled'] ? 1 : 0) : null,
                ':eyebrow' => $input['eyebrow'] ?? null,
                ':title' => $input['title'] ?? null,
                ':title_accent' => $input['titleAccent'] ?? $input['title_accent'] ?? null,
                ':subtitle' => $input['subtitle'] ?? null,
                ':match_text' => $input['matchText'] ?? $input['match_text'] ?? null,
                ':button_text' => $input['buttonText'] ?? $input['button_text'] ?? null,
                ':more_text' => $input['moreText'] ?? $input['more_text'] ?? null,
                ':explain_text' => $input['explainText'] ?? $input['explain_text'] ?? null
            ]);

            echo json_encode(['ok' => true]);
        }
        break;

    // ------------------------------------------------
    // ADMIN COUPLES: GET / POST /api/admin/pairing/couples
    // ------------------------------------------------
    case 'admin_couples':
        if ($method === 'GET') {
            $rows = $pdo->query("SELECT * FROM pairing_couples ORDER BY sort ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC);
            $out = array_map(function($r) {
                $r['enabled'] = (bool)$r['enabled'];
                $r['a'] = json_decode($r['a'] ?? '{}', true) ?: [];
                $r['b'] = json_decode($r['b'] ?? '{}', true) ?: [];
                $r['weights'] = json_decode($r['weights'] ?? '[]', true) ?: [];
                return $r;
            }, $rows);
            echo json_encode($out);
        } else if ($method === 'POST') {
            $name = trim($input['name'] ?? '');
            if (empty($name)) {
                http_response_code(400);
                echo json_encode(['error' => 'Couple name is required']);
                exit();
            }

            $tag = strtoupper(substr(trim($input['tag'] ?? ''), 0, 14));
            $mealIcon = substr(trim($input['mealIcon'] ?? $input['meal_icon'] ?? ''), 0, 4);
            $mealName = strtoupper(substr(trim($input['mealName'] ?? $input['meal_name'] ?? ''), 0, 12));
            $lovedText = substr(trim($input['lovedText'] ?? $input['loved_text'] ?? ''), 0, 32);
            $tip = substr(trim($input['tip'] ?? ''), 0, 52);

            $a = json_encode($input['a'] ?? ['name' => 'Product 1']);
            $b = json_encode($input['b'] ?? ['name' => 'Product 2']);
            $weights = json_encode($input['weights'] ?? [['label' => '250 g each', 'price' => 299, 'mrp' => 0]]);
            $enabled = isset($input['enabled']) ? ($input['enabled'] ? 1 : 0) : 1;

            $maxSort = (int)$pdo->query("SELECT COALESCE(MAX(sort),0) FROM pairing_couples")->fetchColumn();
            $sort = $maxSort + 1;

            $stmt = $pdo->prepare("INSERT INTO pairing_couples (name, tag, meal_icon, meal_name, loved_text, tip, a, b, weights, enabled, sort)
                                  VALUES (:name, :tag, :meal_icon, :meal_name, :loved_text, :tip, :a, :b, :weights, :enabled, :sort)");
            $stmt->execute([
                ':name' => $name,
                ':tag' => $tag,
                ':meal_icon' => $mealIcon,
                ':meal_name' => $mealName,
                ':loved_text' => $lovedText,
                ':tip' => $tip,
                ':a' => $a,
                ':b' => $b,
                ':weights' => $weights,
                ':enabled' => $enabled,
                ':sort' => $sort
            ]);

            $id = $pdo->lastInsertId();
            $newRow = $pdo->query("SELECT * FROM pairing_couples WHERE id = $id")->fetch(PDO::FETCH_ASSOC);
            $newRow['a'] = json_decode($newRow['a'] ?? '{}', true);
            $newRow['b'] = json_decode($newRow['b'] ?? '{}', true);
            $newRow['weights'] = json_decode($newRow['weights'] ?? '[]', true);
            echo json_encode($newRow);
        }
        break;

    // ------------------------------------------------
    // ADMIN COUPLE ITEM: PUT / DELETE /api/admin/pairing/couples/:id
    // ------------------------------------------------
    case 'admin_item':
        $id = intval($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid couple ID']);
            exit();
        }

        if ($method === 'PUT') {
            $updates = [];
            $params = [':id' => $id];

            if (isset($input['name'])) {
                $updates[] = "name = :name";
                $params[':name'] = substr(trim($input['name']), 0, 26);
            }
            if (isset($input['tag'])) {
                $updates[] = "tag = :tag";
                $params[':tag'] = strtoupper(substr(trim($input['tag']), 0, 14));
            }
            if (isset($input['mealIcon']) || isset($input['meal_icon'])) {
                $updates[] = "meal_icon = :meal_icon";
                $params[':meal_icon'] = substr(trim($input['mealIcon'] ?? $input['meal_icon']), 0, 4);
            }
            if (isset($input['mealName']) || isset($input['meal_name'])) {
                $updates[] = "meal_name = :meal_name";
                $params[':meal_name'] = strtoupper(substr(trim($input['mealName'] ?? $input['meal_name']), 0, 12));
            }
            if (isset($input['lovedText']) || isset($input['loved_text'])) {
                $updates[] = "loved_text = :loved_text";
                $params[':loved_text'] = substr(trim($input['lovedText'] ?? $input['loved_text']), 0, 32);
            }
            if (isset($input['tip'])) {
                $updates[] = "tip = :tip";
                $params[':tip'] = substr(trim($input['tip']), 0, 52);
            }
            if (isset($input['a'])) {
                $updates[] = "a = :a";
                $params[':a'] = is_string($input['a']) ? $input['a'] : json_encode($input['a']);
            }
            if (isset($input['b'])) {
                $updates[] = "b = :b";
                $params[':b'] = is_string($input['b']) ? $input['b'] : json_encode($input['b']);
            }
            if (isset($input['weights'])) {
                $updates[] = "weights = :weights";
                $params[':weights'] = is_string($input['weights']) ? $input['weights'] : json_encode($input['weights']);
            }
            if (isset($input['enabled'])) {
                $updates[] = "enabled = :enabled";
                $params[':enabled'] = $input['enabled'] ? 1 : 0;
            }

            if (empty($updates)) {
                echo json_encode(['ok' => true]);
                exit();
            }

            $sql = "UPDATE pairing_couples SET " . implode(", ", $updates) . " WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            echo json_encode(['ok' => true]);
        } else if ($method === 'DELETE') {
            $stmt = $pdo->prepare("DELETE FROM pairing_couples WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(['ok' => true]);
        }
        break;

    // ------------------------------------------------
    // ADMIN REORDER: PUT /api/admin/pairing/order
    // ------------------------------------------------
    case 'admin_order':
        $ids = $input['ids'] ?? [];
        if (is_array($ids)) {
            $stmt = $pdo->prepare("UPDATE pairing_couples SET sort = :sort WHERE id = :id");
            foreach ($ids as $index => $cid) {
                $stmt->execute([':sort' => $index + 1, ':id' => intval($cid)]);
            }
        }
        echo json_encode(['ok' => true]);
        break;

    // ------------------------------------------------
    // ADMIN UPLOAD: POST /api/admin/pairing/upload
    // ------------------------------------------------
    case 'admin_upload':
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'Valid photo file is required in image field']);
            exit();
        }

        $f = $_FILES['image'];
        $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['png', 'jpg', 'jpeg', 'webp'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Only PNG, JPG, or WebP images supported']);
            exit();
        }

        $uploadDir = __DIR__ . '/uploads';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = 'pair_' . bin2hex(random_bytes(8)) . '.' . $ext;
        $destination = $uploadDir . '/' . $filename;

        if (move_uploaded_file($f['tmp_name'], $destination)) {
            $relPath = 'uploads/' . $filename;
            echo json_encode([
                'ok' => true,
                'path' => $relPath,
                'url' => absUrl($relPath)
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save uploaded image']);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}

