<?php
// combo_box.php — "Amma's Combo Box" Backend API (PHP / MySQL)
// Serves:
//   PUBLIC:
//     GET  /api/combo-box
//   ADMIN:
//     GET    /api/admin/combo-box/settings
//     PUT    /api/admin/combo-box/settings
//     GET    /api/admin/combo-box/products
//     POST   /api/admin/combo-box/products
//     POST   /api/admin/combo-box/products/bulk
//     PUT    /api/admin/combo-box/products/:id
//     DELETE /api/admin/combo-box/products/:id
//     PUT    /api/admin/combo-box/products/order
//     POST   /api/admin/combo-box/upload

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

function normLabel($s) {
    return strtolower(preg_replace('/\s+/', '', (string)$s));
}

// ----------------------------------------------------
// 1. DDL AUTO-MIGRATIONS (MySQL Compatible)
// ----------------------------------------------------
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS combo_settings (
        id INT PRIMARY KEY DEFAULT 1,
        enabled TINYINT(1) DEFAULT 1,
        eyebrow VARCHAR(100) DEFAULT 'BUILD YOUR BOX',
        title_start VARCHAR(100) DEFAULT 'Amma\'s',
        title_accent VARCHAR(100) DEFAULT 'Combo Box',
        jars INT DEFAULT 4,
        box_label VARCHAR(100) DEFAULT 'Amma\'s Combo',
        lid_text TEXT DEFAULT 'Made with love,\npacked by Amma',
        tag_text VARCHAR(100) DEFAULT 'For you, with love 💛',
        sizes TEXT DEFAULT '[\"250 g\", \"500 g\", \"1 kg\"]',
        tiers TEXT DEFAULT '[{\"jars\":4,\"percent\":10},{\"jars\":6,\"percent\":15},{\"jars\":8,\"percent\":20}]',
        categories TEXT DEFAULT '[\"Pickles\", \"Podis\", \"Snacks\", \"Sweets\"]',
        home_line VARCHAR(255) DEFAULT 'pick any 4 jars, Amma packs them',
        home_title VARCHAR(100) DEFAULT 'Fill the box,',
        home_accent VARCHAR(100) DEFAULT 'save more',
        home_button VARCHAR(100) DEFAULT 'Start building your box',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS combo_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(50) NOT NULL,
        category VARCHAR(50) DEFAULT 'Pickles',
        image TEXT DEFAULT NULL,
        color1 VARCHAR(20) DEFAULT '#8A1A10',
        color2 VARCHAR(20) DEFAULT '#2A0806',
        enabled TINYINT(1) DEFAULT 1,
        sort INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_prod (product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Seed default settings row if empty
    $stCount = $pdo->query("SELECT COUNT(*) FROM combo_settings WHERE id = 1")->fetchColumn();
    if ($stCount == 0) {
        $pdo->exec("INSERT INTO combo_settings (id, enabled, eyebrow, title_start, title_accent, jars, box_label, lid_text, tag_text, sizes, tiers, categories, home_line, home_title, home_accent, home_button)
                    VALUES (1, 1, 'BUILD YOUR BOX', 'Amma\'s', 'Combo Box', 4, 'Amma\'s Combo', 'Made with love,\npacked by Amma', 'For you, with love 💛',
                            '[\"250 g\", \"500 g\", \"1 kg\"]',
                            '[{\"jars\":4,\"percent\":10},{\"jars\":6,\"percent\":15},{\"jars\":8,\"percent\":20}]',
                            '[\"Pickles\", \"Podis\", \"Snacks\", \"Sweets\"]',
                            'pick any 4 jars, Amma packs them', 'Fill the box,', 'save more', 'Start building your box')");
    }

    // Seed initial 20 combo products if empty
    $cpCount = $pdo->query("SELECT COUNT(*) FROM combo_products")->fetchColumn();
    if ($cpCount == 0) {
        $defaults = [
            ['product_id' => 'p1', 'category' => 'Pickles', 'color1' => '#8A1A10', 'color2' => '#2A0806'],
            ['product_id' => 'p2', 'category' => 'Podis',   'color1' => '#7A2000', 'color2' => '#3D1000'],
            ['product_id' => 'p3', 'category' => 'Sweets',  'color1' => '#8C5810', 'color2' => '#3D2504'],
            ['product_id' => 'p4', 'category' => 'Snacks',  'color1' => '#9C6200', 'color2' => '#3E2700'],
            ['product_id' => 'p5', 'category' => 'Snacks',  'color1' => '#A07010', 'color2' => '#402D04'],
            ['product_id' => 'p6', 'category' => 'Pickles', 'color1' => '#2B4A10', 'color2' => '#0F1E04'],
            ['product_id' => 'p7', 'category' => 'Pickles', 'color1' => '#821015', 'color2' => '#2E0306'],
            ['product_id' => 'p8', 'category' => 'Pickles', 'color1' => '#8A3010', 'color2' => '#3A1204'],
            ['product_id' => 'p9', 'category' => 'Podis',   'color1' => '#7C3400', 'color2' => '#3B1800'],
            ['product_id' => 'p10','category' => 'Podis',   'color1' => '#6A1A05', 'color2' => '#2A0802'],
            ['product_id' => 'p11','category' => 'Sweets',  'color1' => '#884D12', 'color2' => '#382006'],
            ['product_id' => 'p12','category' => 'Sweets',  'color1' => '#9B6114', 'color2' => '#3E2606'],
            ['product_id' => 'p13','category' => 'Snacks',  'color1' => '#805008', 'color2' => '#322002'],
            ['product_id' => 'p14','category' => 'Snacks',  'color1' => '#7C4505', 'color2' => '#331B01'],
            ['product_id' => 'p15','category' => 'Pickles', 'color1' => '#851212', 'color2' => '#320404'],
            ['product_id' => 'p16','category' => 'Pickles', 'color1' => '#8B2A10', 'color2' => '#340E02'],
            ['product_id' => 'p17','category' => 'Podis',   'color1' => '#702202', 'color2' => '#2E0D00'],
            ['product_id' => 'p18','category' => 'Podis',   'color1' => '#622E06', 'color2' => '#281301'],
            ['product_id' => 'p19','category' => 'Sweets',  'color1' => '#8D5215', 'color2' => '#3A2107'],
            ['product_id' => 'p20','category' => 'Snacks',  'color1' => '#7F4800', 'color2' => '#341D00']
        ];

        $ins = $pdo->prepare("INSERT IGNORE INTO combo_products (product_id, category, color1, color2, sort) VALUES (:product_id, :category, :color1, :color2, :sort)");
        foreach ($defaults as $i => $d) {
            $ins->execute([
                ':product_id' => $d['product_id'],
                ':category' => $d['category'],
                ':color1' => $d['color1'],
                ':color2' => $d['color2'],
                ':sort' => $i + 1
            ]);
        }
    }
} catch (Exception $e) {
    error_log("Combo Box DDL Warning: " . $e->getMessage());
}

// ----------------------------------------------------
// 2. ROUTING & DISPATCH
// ----------------------------------------------------
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if (empty($action)) {
    $uri = $_SERVER['REQUEST_URI'];
    $path = parse_url($uri, PHP_URL_PATH);
    if (strpos($path, '/admin/combo-box/settings') !== false) {
        $action = 'admin_settings';
    } else if (strpos($path, '/admin/combo-box/products/bulk') !== false) {
        $action = 'admin_bulk';
    } else if (strpos($path, '/admin/combo-box/products/order') !== false) {
        $action = 'admin_order';
    } else if (strpos($path, '/admin/combo-box/upload') !== false) {
        $action = 'admin_upload';
    } else if (preg_match('#/admin/combo-box/products/([0-9]+)#', $path, $m)) {
        $action = 'admin_item';
        $_GET['id'] = $m[1];
    } else if (strpos($path, '/admin/combo-box/products') !== false) {
        $action = 'admin_products';
    } else if (strpos($path, '/combo-box') !== false) {
        $action = 'public_combo';
    }
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

// Helper to retrieve combo settings
function fetchSettings($pdo) {
    $s = $pdo->query("SELECT * FROM combo_settings WHERE id = 1 LIMIT 1")->fetch(PDO::FETCH_ASSOC);
    if (!$s) {
        return [
            'enabled' => true,
            'eyebrow' => 'BUILD YOUR BOX',
            'titleStart' => "Amma's",
            'titleAccent' => 'Combo Box',
            'jars' => 4,
            'boxLabel' => "Amma's Combo",
            'lidText' => "Made with love,\npacked by Amma",
            'tagText' => "For you, with love 💛",
            'sizes' => ['250 g', '500 g', '1 kg'],
            'tiers' => [
                ['jars' => 4, 'percent' => 10],
                ['jars' => 6, 'percent' => 15],
                ['jars' => 8, 'percent' => 20]
            ],
            'categories' => ['Pickles', 'Podis', 'Snacks', 'Sweets'],
            'homeLine' => 'pick any 4 jars, Amma packs them',
            'homeTitle' => 'Fill the box,',
            'homeAccent' => 'save more',
            'homeButton' => 'Start building your box'
        ];
    }
    return [
        'enabled' => (bool)$s['enabled'],
        'eyebrow' => $s['eyebrow'] ?: 'BUILD YOUR BOX',
        'titleStart' => $s['title_start'] ?: "Amma's",
        'titleAccent' => $s['title_accent'] ?: 'Combo Box',
        'jars' => (int)($s['jars'] ?: 4),
        'boxLabel' => $s['box_label'] ?: "Amma's Combo",
        'lidText' => $s['lid_text'] ?: "Made with love,\npacked by Amma",
        'tagText' => $s['tag_text'] ?: "For you, with love 💛",
        'sizes' => json_decode($s['sizes'] ?? '[]', true) ?: ['250 g', '500 g', '1 kg'],
        'tiers' => json_decode($s['tiers'] ?? '[]', true) ?: [
            ['jars' => 4, 'percent' => 10],
            ['jars' => 6, 'percent' => 15],
            ['jars' => 8, 'percent' => 20]
        ],
        'categories' => json_decode($s['categories'] ?? '[]', true) ?: ['Pickles', 'Podis', 'Snacks', 'Sweets'],
        'homeLine' => $s['home_line'] ?: 'pick any 4 jars, Amma packs them',
        'homeTitle' => $s['home_title'] ?: 'Fill the box,',
        'homeAccent' => $s['home_accent'] ?: 'save more',
        'homeButton' => $s['home_button'] ?: 'Start building your box'
    ];
}

// Helper to query products with prices per size
function fetchComboProducts($pdo, $sizes, $onlyEnabled = false) {
    $where = $onlyEnabled ? "WHERE c.enabled = 1" : "";
    $sql = "SELECT c.*, p.name, p.image, p.price, p.weight_price_json
            FROM combo_products c
            LEFT JOIN app_products p ON p.id = c.product_id
            $where
            ORDER BY c.sort ASC, c.id ASC";
    
    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $out = [];
    foreach ($rows as $r) {
        $pName = $r['name'] ?: 'Product ' . $r['product_id'];
        $pImg = $r['c_image'] ?? $r['image'] ?? 'assets/images/bowl_bellam_avakaya.png';

        // Parse weights & prices
        $weightJson = json_decode($r['weight_price_json'] ?? '[]', true) ?: [];
        $basePrice = (float)($r['price'] ?? 149);

        $prices = [];
        foreach ($sizes as $sz) {
            $found = null;
            $normSz = normLabel($sz);
            foreach ($weightJson as $w) {
                if (normLabel($w['weight'] ?? $w['label'] ?? '') === $normSz) {
                    $found = $w;
                    break;
                }
            }

            if ($found) {
                $pr = (float)($found['price'] ?? $basePrice);
                $mrp = (float)($found['mrp'] ?? ($pr * 1.15));
                $prices[$sz] = [
                    'variantId' => (string)($found['id'] ?? $sz),
                    'price' => $pr,
                    'mrp' => $mrp,
                    'inStock' => true
                ];
            } else {
                // Synthetic price fallback based on 250g / 500g / 1kg multiplier
                $mult = 1.0;
                if (strpos($normSz, '500') !== false) $mult = 1.85;
                else if (strpos($normSz, '1kg') !== false || strpos($normSz, '1000') !== false) $mult = 3.5;
                $pr = round($basePrice * $mult);
                $prices[$sz] = [
                    'variantId' => $r['product_id'] . '_' . $normSz,
                    'price' => $pr,
                    'mrp' => round($pr * 1.15),
                    'inStock' => true
                ];
            }
        }

        $out[] = [
            'id' => (string)$r['id'],
            'productId' => (string)$r['product_id'],
            'name' => $pName,
            'image' => absUrl($pImg),
            'category' => (string)($r['category'] ?: 'Pickles'),
            'color1' => $r['color1'] ?: '#8A1A10',
            'color2' => $r['color2'] ?: '#2A0806',
            'enabled' => (bool)$r['enabled'],
            'prices' => $prices
        ];
    }
    return $out;
}

switch ($action) {
    // ------------------------------------------------
    // PUBLIC APP ENDPOINT: GET /api/combo-box
    // ------------------------------------------------
    case 'public_combo':
        $st = fetchSettings($pdo);
        $allProds = fetchComboProducts($pdo, $st['sizes'], true);
        $products = array_filter($allProds, function($p) {
            return count($p['prices']) > 0;
        });

        // Filter valid sizes having at least `jars` products
        $validSizes = [];
        foreach ($st['sizes'] as $sz) {
            $c = 0;
            foreach ($products as $p) {
                if (isset($p['prices'][$sz])) $c++;
            }
            if ($c >= $st['jars']) {
                $validSizes[] = $sz;
            }
        }

        $st['sizes'] = $validSizes ?: $st['sizes'];

        echo json_encode([
            'settings' => $st,
            'products' => array_values($products)
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        break;

    // ------------------------------------------------
    // ADMIN SETTINGS: GET / PUT /api/admin/combo-box/settings
    // ------------------------------------------------
    case 'admin_settings':
        if ($method === 'GET') {
            echo json_encode(fetchSettings($pdo));
        } else if ($method === 'PUT') {
            $stmt = $pdo->prepare("UPDATE combo_settings SET
                enabled = COALESCE(:enabled, enabled),
                eyebrow = COALESCE(:eyebrow, eyebrow),
                title_start = COALESCE(:title_start, title_start),
                title_accent = COALESCE(:title_accent, title_accent),
                jars = COALESCE(:jars, jars),
                box_label = COALESCE(:box_label, box_label),
                lid_text = COALESCE(:lid_text, lid_text),
                tag_text = COALESCE(:tag_text, tag_text),
                sizes = COALESCE(:sizes, sizes),
                tiers = COALESCE(:tiers, tiers),
                categories = COALESCE(:categories, categories),
                home_line = COALESCE(:home_line, home_line),
                home_title = COALESCE(:home_title, home_title),
                home_accent = COALESCE(:home_accent, home_accent),
                home_button = COALESCE(:home_button, home_button)
                WHERE id = 1");

            $stmt->execute([
                ':enabled' => isset($input['enabled']) ? ($input['enabled'] ? 1 : 0) : null,
                ':eyebrow' => $input['eyebrow'] ?? null,
                ':title_start' => $input['titleStart'] ?? $input['title_start'] ?? null,
                ':title_accent' => $input['titleAccent'] ?? $input['title_accent'] ?? null,
                ':jars' => isset($input['jars']) ? intval($input['jars']) : null,
                ':box_label' => $input['boxLabel'] ?? $input['box_label'] ?? null,
                ':lid_text' => $input['lidText'] ?? $input['lid_text'] ?? null,
                ':tag_text' => $input['tagText'] ?? $input['tag_text'] ?? null,
                ':sizes' => isset($input['sizes']) ? json_encode($input['sizes']) : null,
                ':tiers' => isset($input['tiers']) ? json_encode($input['tiers']) : null,
                ':categories' => isset($input['categories']) ? json_encode($input['categories']) : null,
                ':home_line' => $input['homeLine'] ?? $input['home_line'] ?? null,
                ':home_title' => $input['homeTitle'] ?? $input['home_title'] ?? null,
                ':home_accent' => $input['homeAccent'] ?? $input['home_accent'] ?? null,
                ':home_button' => $input['homeButton'] ?? $input['home_button'] ?? null
            ]);

            echo json_encode(['ok' => true]);
        }
        break;

    // ------------------------------------------------
    // ADMIN PRODUCTS: GET / POST /api/admin/combo-box/products
    // ------------------------------------------------
    case 'admin_products':
        if ($method === 'GET') {
            $st = fetchSettings($pdo);
            $list = fetchComboProducts($pdo, $st['sizes'], false);
            echo json_encode($list);
        } else if ($method === 'POST') {
            $pid = trim((string)($input['productId'] ?? ''));
            if (empty($pid)) {
                http_response_code(400);
                echo json_encode(['error' => 'Product ID is required']);
                exit();
            }

            $cat = substr(trim((string)($input['category'] ?? 'Pickles')), 0, 30);
            $maxSort = (int)$pdo->query("SELECT COALESCE(MAX(sort),0) FROM combo_products")->fetchColumn();

            $stmt = $pdo->prepare("INSERT INTO combo_products (product_id, category, sort)
                                  VALUES (:pid, :cat, :sort)
                                  ON DUPLICATE KEY UPDATE category = VALUES(category)");
            $stmt->execute([
                ':pid' => $pid,
                ':cat' => $cat,
                ':sort' => $maxSort + 1
            ]);

            echo json_encode(['ok' => true]);
        }
        break;

    // ------------------------------------------------
    // ADMIN BULK IMPORT 20+ PRODUCTS: POST /api/admin/combo-box/products/bulk
    // ------------------------------------------------
    case 'admin_bulk':
        $rawIds = $input['productIds'] ?? '';
        if (is_array($rawIds)) {
            $ids = array_map('strval', $rawIds);
        } else {
            $ids = preg_split('/[\s,]+/', (string)$rawIds, -1, PREG_SPLIT_NO_EMPTY);
        }

        if (empty($ids)) {
            http_response_code(400);
            echo json_encode(['error' => 'Please provide product IDs']);
            exit();
        }

        $category = substr(trim((string)($input['category'] ?? 'Pickles')), 0, 30);
        $maxSort = (int)$pdo->query("SELECT COALESCE(MAX(sort),0) FROM combo_products")->fetchColumn();

        $stmt = $pdo->prepare("INSERT INTO combo_products (product_id, category, sort)
                              VALUES (:pid, :category, :sort)
                              ON DUPLICATE KEY UPDATE category = VALUES(category)");

        $added = 0;
        foreach ($ids as $pid) {
            $cleanPid = trim($pid);
            if (!empty($cleanPid)) {
                $maxSort++;
                $stmt->execute([
                    ':pid' => $cleanPid,
                    ':category' => $category,
                    ':sort' => $maxSort
                ]);
                $added++;
            }
        }

        echo json_encode([
            'ok' => true,
            'added' => $added,
            'notFound' => []
        ]);
        break;

    // ------------------------------------------------
    // ADMIN ITEM: PUT / DELETE /api/admin/combo-box/products/:id
    // ------------------------------------------------
    case 'admin_item':
        $id = intval($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid product entry ID']);
            exit();
        }

        if ($method === 'PUT') {
            $updates = [];
            $params = [':id' => $id];

            if (isset($input['category'])) {
                $updates[] = "category = :category";
                $params[':category'] = substr(trim((string)$input['category']), 0, 30);
            }
            if (isset($input['image'])) {
                $updates[] = "image = :image";
                $params[':image'] = trim((string)$input['image']);
            }
            if (isset($input['color1'])) {
                $updates[] = "color1 = :color1";
                $params[':color1'] = substr(trim((string)$input['color1']), 0, 20);
            }
            if (isset($input['color2'])) {
                $updates[] = "color2 = :color2";
                $params[':color2'] = substr(trim((string)$input['color2']), 0, 20);
            }
            if (isset($input['enabled'])) {
                $updates[] = "enabled = :enabled";
                $params[':enabled'] = $input['enabled'] ? 1 : 0;
            }

            if (!empty($updates)) {
                $sql = "UPDATE combo_products SET " . implode(", ", $updates) . " WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }

            echo json_encode(['ok' => true]);
        } else if ($method === 'DELETE') {
            $stmt = $pdo->prepare("DELETE FROM combo_products WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(['ok' => true]);
        }
        break;

    // ------------------------------------------------
    // ADMIN REORDER: PUT /api/admin/combo-box/products/order
    // ------------------------------------------------
    case 'admin_order':
        $ids = $input['ids'] ?? [];
        if (is_array($ids)) {
            $stmt = $pdo->prepare("UPDATE combo_products SET sort = :sort WHERE id = :id");
            foreach ($ids as $index => $cid) {
                $stmt->execute([':sort' => $index + 1, ':id' => intval($cid)]);
            }
        }
        echo json_encode(['ok' => true]);
        break;

    // ------------------------------------------------
    // ADMIN UPLOAD: POST /api/admin/combo-box/upload
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

        $filename = 'combo_' . bin2hex(random_bytes(8)) . '.' . $ext;
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

