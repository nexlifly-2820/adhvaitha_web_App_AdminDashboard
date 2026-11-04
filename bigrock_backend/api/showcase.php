<?php
// showcase.php — Home Pickles Showcase Section Backend API
// Serves:
//   PUBLIC:
//     GET  /api/showcase/:key
//   ADMIN:
//     GET  /api/admin/showcase/:key/settings
//     PUT  /api/admin/showcase/:key/settings
//     GET  /api/admin/showcase/:key/items
//     POST /api/admin/showcase/:key/items
//     PUT  /api/admin/showcase-items/:id
//     DELETE /api/admin/showcase-items/:id
//     PUT  /api/admin/showcase/:key/order
//     POST /api/admin/showcase-upload

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$PUBLIC_URL = 'https://admin.adhvaithafoods.in/api';

// ----------------------------------------------------
// 1. DDL AUTO-MIGRATION: Ensure tables exist
// ----------------------------------------------------
try {
    // 1. Showcase Sections Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS showcase_sections (
        `key` VARCHAR(50) PRIMARY KEY,
        enabled TINYINT(1) DEFAULT 1,
        eyebrow VARCHAR(255) DEFAULT 'PICKLES · HAND-MIXED',
        view_all_text VARCHAR(255) DEFAULT 'View all →',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 2. Showcase Items Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS showcase_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_key VARCHAR(50) NOT NULL,
        product_id VARCHAR(100) DEFAULT '',
        name VARCHAR(100) NOT NULL,
        badge VARCHAR(100) DEFAULT '',
        description TEXT DEFAULT '',
        cure_text VARCHAR(100) DEFAULT '',
        thumb TEXT DEFAULT '',
        shots TEXT DEFAULT '[]',
        variants TEXT DEFAULT '[]',
        enabled TINYINT(1) DEFAULT 1,
        sort INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_section (section_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Seed default section row
    $secCount = $pdo->query("SELECT COUNT(*) FROM showcase_sections WHERE `key` = 'pickles'")->fetchColumn();
    if ($secCount == 0) {
        $pdo->exec("INSERT INTO showcase_sections (`key`, enabled, eyebrow, view_all_text) 
                    VALUES ('pickles', 1, 'PICKLES · HAND-MIXED', 'View all →')");
    }

    // Seed authentic items if empty
    $itemCount = $pdo->query("SELECT COUNT(*) FROM showcase_items WHERE section_key = 'pickles'")->fetchColumn();
    if ($itemCount == 0) {
        $items = [
            [
                'section_key' => 'pickles',
                'product_id' => 'mango_avakaya',
                'name' => 'Avakaya',
                'badge' => 'BESTSELLER',
                'description' => 'Raw mango, Guntur chilli, mustard & gingelly oil',
                'cure_text' => '☀️ 21 days sun-cured',
                'thumb' => 'assets/images/mango_close.jpg',
                'shots' => json_encode([
                    ['image' => 'assets/images/banner_1.jpg', 'caption' => 'Sun-cured in ceramic jaadis', 'ms' => 2500],
                    ['image' => 'assets/images/mango_close.jpg', 'caption' => 'Rich in wood-pressed sesame oil', 'ms' => 2100]
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'variants' => json_encode([
                    ['id' => '250g', 'label' => '250 g', 'price' => 249, 'mrp' => 299],
                    ['id' => '500g', 'label' => '500 g', 'price' => 459, 'mrp' => 549],
                    ['id' => '1kg', 'label' => '1 kg', 'price' => 879, 'mrp' => 1049]
                ]),
                'sort' => 1
            ],
            [
                'section_key' => 'pickles',
                'product_id' => 'lemon_pickle',
                'name' => 'Nimmakaya',
                'badge' => 'TANGY CLASSIC',
                'description' => 'Juicy lemons, chilli & fenugreek, aged till soft',
                'cure_text' => '☀️ 30 days aged',
                'thumb' => 'assets/images/lemon_close.jpg',
                'shots' => json_encode([
                    ['image' => 'assets/images/lemon_bowl.jpg', 'caption' => 'Freshly squeezed hand-cut lemons', 'ms' => 2500],
                    ['image' => 'assets/images/lemon_jar.jpg', 'caption' => 'Aged to tangy perfection', 'ms' => 2100]
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'variants' => json_encode([
                    ['id' => '250g', 'label' => '250 g', 'price' => 199, 'mrp' => 239],
                    ['id' => '500g', 'label' => '500 g', 'price' => 369, 'mrp' => 439],
                    ['id' => '1kg', 'label' => '1 kg', 'price' => 699, 'mrp' => 839]
                ]),
                'sort' => 2
            ],
            [
                'section_key' => 'pickles',
                'product_id' => 'gongura_pickle',
                'name' => 'Gongura',
                'badge' => 'ANDHRA SPECIAL',
                'description' => 'Hand-picked sorrel leaves cooked with red chillies & garlic',
                'cure_text' => 'Wood-fired',
                'thumb' => 'assets/images/gongura_close.jpg',
                'shots' => json_encode([
                    ['image' => 'assets/images/gongura_bowl.jpg', 'caption' => 'Farm fresh Gongura leaves', 'ms' => 2500],
                    ['image' => 'assets/images/gongura_close.jpg', 'caption' => 'The authentic taste of Andhra', 'ms' => 2100]
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'variants' => json_encode([
                    ['id' => '250g', 'label' => '250 g', 'price' => 179, 'mrp' => 210],
                    ['id' => '500g', 'label' => '500 g', 'price' => 340, 'mrp' => 390]
                ]),
                'sort' => 3
            ],
            [
                'section_key' => 'pickles',
                'product_id' => 'garlic_pickle',
                'name' => 'Garlic Pickle',
                'badge' => 'IMMUNITY BOOSTER',
                'description' => 'Peeled garlic cloves roasted in mustard oil with traditional spices',
                'cure_text' => 'Slow-roasted',
                'thumb' => 'assets/images/garlic_close.jpg',
                'shots' => json_encode([
                    ['image' => 'assets/images/garlic_bowl.jpg', 'caption' => 'Plump garlic cloves roasted slow', 'ms' => 2500],
                    ['image' => 'assets/images/garlic_close.jpg', 'caption' => 'Deep, savory & aromatic heat', 'ms' => 2100]
                ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                'variants' => json_encode([
                    ['id' => '250g', 'label' => '250 g', 'price' => 199, 'mrp' => 240],
                    ['id' => '500g', 'label' => '500 g', 'price' => 379, 'mrp' => 440]
                ]),
                'sort' => 4
            ]
        ];

        $stmt = $pdo->prepare("INSERT INTO showcase_items (section_key, product_id, name, badge, description, cure_text, thumb, shots, variants, sort) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach ($items as $it) {
            $stmt->execute([
                $it['section_key'], $it['product_id'], $it['name'], $it['badge'],
                $it['description'], $it['cure_text'], $it['thumb'], $it['shots'],
                $it['variants'], $it['sort']
            ]);
        }
    }
} catch (Exception $e) {
    // Continue
}

// ----------------------------------------------------
// 2. HELPER FUNCTIONS
// ----------------------------------------------------
function absUrl($u, $base) {
    if (empty($u)) return '';
    if (preg_match('#^https?://#i', $u) || strpos($u, 'assets/') === 0) {
        return $u;
    }
    return rtrim($base, '/') . '/' . ltrim($u, '/');
}

$MAP = [
    'productId' => 'product_id',
    'name' => 'name',
    'badge' => 'badge',
    'description' => 'description',
    'cureText' => 'cure_text',
    'thumb' => 'thumb',
    'shots' => 'shots',
    'variants' => 'variants',
    'enabled' => 'enabled',
    'sort' => 'sort'
];

function sanitizePayload(&$b) {
    if (isset($b['name'])) {
        $name = trim((string)$b['name']);
        if (empty($name) || mb_strlen($name) > 16) {
            http_response_code(400);
            echo json_encode(['error' => 'Name is required, max 16 letters']);
            exit();
        }
        $b['name'] = $name;
    }
    if (isset($b['badge']) && mb_strlen((string)$b['badge']) > 22) {
        http_response_code(400);
        echo json_encode(['error' => 'Badge max 22 letters']);
        exit();
    }
    if (isset($b['description']) && mb_strlen((string)$b['description']) > 70) {
        http_response_code(400);
        echo json_encode(['error' => 'Description max 70 letters (2 lines)']);
        exit();
    }
    if (isset($b['cureText']) && mb_strlen((string)$b['cureText']) > 30) {
        http_response_code(400);
        echo json_encode(['error' => 'Cure tag max 30 letters']);
        exit();
    }
    if (isset($b['shots'])) {
        if (!is_array($b['shots']) || count($b['shots']) > 6) {
            http_response_code(400);
            echo json_encode(['error' => 'Up to 6 photos per pickle']);
            exit();
        }
        $cleanedShots = [];
        foreach ($b['shots'] as $x) {
            $img = isset($x['image']) ? (string)$x['image'] : (isset($x['url']) ? (string)$x['url'] : '');
            $caption = isset($x['caption']) ? mb_substr((string)$x['caption'], 0, 32) : '';
            $ms = isset($x['ms']) ? max(1200, min(5000, (int)$x['ms'])) : 2100;
            if (!empty($img)) {
                $cleanedShots[] = [
                    'image' => $img,
                    'caption' => $caption,
                    'ms' => $ms
                ];
            }
        }
        $b['shots'] = json_encode($cleanedShots, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
    if (isset($b['variants'])) {
        if (!is_array($b['variants']) || empty($b['variants']) || count($b['variants']) > 4) {
            http_response_code(400);
            echo json_encode(['error' => 'Add 1 to 4 weights']);
            exit();
        }
        $cleanedVariants = [];
        foreach ($b['variants'] as $v) {
            $label = trim(mb_substr((string)($v['label'] ?? ''), 0, 8));
            $price = (float)($v['price'] ?? 0);
            $mrp = (float)($v['mrp'] ?? 0);
            $id = (string)($v['id'] ?? '');
            if (empty($label) || $price <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Every weight needs a label (e.g. 250 g) and a price']);
                exit();
            }
            $cleanedVariants[] = [
                'id' => $id,
                'label' => $label,
                'price' => $price,
                'mrp' => $mrp
            ];
        }
        $b['variants'] = json_encode($cleanedVariants, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}

// ----------------------------------------------------
// 3. ROUTER MATCHING
// ----------------------------------------------------
$action = $_GET['action'] ?? null;
$key = $_GET['key'] ?? null;
$id = $_GET['id'] ?? null;
$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

if (!$action) {
    if (preg_match('#admin/showcase/([^/]+)/settings#', $uri, $m)) {
        $action = 'admin_settings';
        $key = $m[1];
    } elseif (preg_match('#admin/showcase/([^/]+)/items#', $uri, $m)) {
        $action = 'admin_items';
        $key = $m[1];
    } elseif (preg_match('#admin/showcase/([^/]+)/order#', $uri, $m)) {
        $action = 'admin_order';
        $key = $m[1];
    } elseif (preg_match('#admin/showcase-items/([0-9]+)#', $uri, $m)) {
        $action = 'admin_item_single';
        $id = $m[1];
    } elseif (strpos($uri, 'admin/showcase-upload') !== false) {
        $action = 'admin_upload';
    } elseif (preg_match('#showcase/([^/]+)#', $uri, $m)) {
        $action = 'public_showcase';
        $key = $m[1];
    }
}

if (!$key && isset($_GET['section_key'])) {
    $key = $_GET['section_key'];
}
if (!$key) {
    $key = 'pickles';
}

// ====================================================
// 1. PUBLIC APP: GET /api/showcase/:key
// ====================================================
if ($action === 'public_showcase' && $method === 'GET') {
    try {
        $stmtSec = $pdo->prepare("SELECT * FROM showcase_sections WHERE `key` = ?");
        $stmtSec->execute([$key]);
        $s = $stmtSec->fetch(PDO::FETCH_ASSOC);

        if (!$s) {
            http_response_code(404);
            echo json_encode(['error' => 'Unknown section', 'key' => $key]);
            exit();
        }

        $stmtItems = $pdo->prepare("SELECT * FROM showcase_items WHERE section_key = ? AND enabled = 1 ORDER BY sort ASC, id ASC");
        $stmtItems->execute([$key]);
        $rows = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

        $items = [];
        foreach ($rows as $r) {
            $rawShots = json_decode($r['shots'] ?? '[]', true) ?: [];
            $rawVariants = json_decode($r['variants'] ?? '[]', true) ?: [];

            $shots = [];
            foreach ($rawShots as $x) {
                $img = $x['image'] ?? ($x['url'] ?? '');
                if (!empty($img)) {
                    $shots[] = [
                        'image' => absUrl($img, $PUBLIC_URL),
                        'caption' => $x['caption'] ?? '',
                        'ms' => (int)($x['ms'] ?? 2100)
                    ];
                }
            }

            $variants = [];
            foreach ($rawVariants as $v) {
                if (!empty($v['label'])) {
                    $variants[] = [
                        'id' => (string)($v['id'] ?? ''),
                        'label' => (string)$v['label'],
                        'price' => (float)($v['price'] ?? 0),
                        'mrp' => (float)($v['mrp'] ?? 0)
                    ];
                }
            }

            // Must have both shots and variants to render nicely on mobile carousel
            if (!empty($shots) && !empty($variants)) {
                $items[] = [
                    'id' => (string)$r['id'],
                    'productId' => (string)($r['product_id'] ?? ''),
                    'name' => (string)$r['name'],
                    'badge' => (string)($r['badge'] ?? ''),
                    'description' => (string)($r['description'] ?? ''),
                    'cureText' => (string)($r['cure_text'] ?? ''),
                    'thumb' => absUrl($r['thumb'], $PUBLIC_URL),
                    'shots' => $shots,
                    'variants' => $variants
                ];
            }
        }

        $data = [
            'settings' => [
                'enabled' => (bool)($s['enabled'] ?? true),
                'eyebrow' => (string)($s['eyebrow'] ?? 'PICKLES · HAND-MIXED'),
                'viewAllText' => (string)($s['view_all_text'] ?? 'View all →')
            ],
            'items' => $items
        ];

        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit();
    }
}

// ====================================================
// 2. ADMIN: GET & PUT /api/admin/showcase/:key/settings
// ====================================================
if ($action === 'admin_settings') {
    if ($method === 'GET') {
        try {
            $stmt = $pdo->prepare("SELECT * FROM showcase_sections WHERE `key` = ?");
            $stmt->execute([$key]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                $pdo->prepare("INSERT INTO showcase_sections (`key`) VALUES (?)")->execute([$key]);
                $stmt->execute([$key]);
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
            }

            echo json_encode([
                'key' => $row['key'],
                'enabled' => (bool)$row['enabled'],
                'eyebrow' => $row['eyebrow'],
                'view_all_text' => $row['view_all_text'],
                'viewAllText' => $row['view_all_text']
            ]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }

    if ($method === 'PUT') {
        $raw = file_get_contents('php://input');
        $b = json_decode($raw, true) ?: [];

        $enabled = isset($b['enabled']) ? ($b['enabled'] ? 1 : 0) : 1;
        $eyebrow = isset($b['eyebrow']) ? trim((string)$b['eyebrow']) : 'PICKLES · HAND-MIXED';
        $viewAllText = isset($b['viewAllText']) ? trim((string)$b['viewAllText']) : (isset($b['view_all_text']) ? trim((string)$b['view_all_text']) : 'View all →');

        try {
            $sql = "INSERT INTO showcase_sections (`key`, enabled, eyebrow, view_all_text) 
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        enabled = VALUES(enabled),
                        eyebrow = VALUES(eyebrow),
                        view_all_text = VALUES(view_all_text)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$key, $enabled, $eyebrow, $viewAllText]);

            echo json_encode(['ok' => true, 'success' => true]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }
}

// ====================================================
// 3. ADMIN: GET & POST /api/admin/showcase/:key/items
// ====================================================
if ($action === 'admin_items') {
    if ($method === 'GET') {
        try {
            $stmt = $pdo->prepare("SELECT * FROM showcase_items WHERE section_key = ? ORDER BY sort ASC, id ASC");
            $stmt->execute([$key]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($rows as &$r) {
                $r['id'] = (int)$r['id'];
                $r['enabled'] = (bool)$r['enabled'];
                $r['sort'] = (int)$r['sort'];
                $r['shots'] = json_decode($r['shots'] ?? '[]', true) ?: [];
                $r['variants'] = json_decode($r['variants'] ?? '[]', true) ?: [];
                $r['thumb'] = absUrl($r['thumb'], $PUBLIC_URL);
            }

            echo json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }

    if ($method === 'POST') {
        $raw = file_get_contents('php://input');
        $b = json_decode($raw, true) ?: [];

        if (empty($b['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name is required']);
            exit();
        }
        if (!isset($b['variants'])) {
            $b['variants'] = [['label' => '250 g', 'price' => 199, 'mrp' => 0]];
        }

        sanitizePayload($b);

        try {
            $cols = ['section_key'];
            $placeholders = ['?'];
            $params = [$key];

            foreach ($MAP as $k => $col) {
                if (isset($b[$k])) {
                    $cols[] = $col;
                    $placeholders[] = '?';
                    $params[] = $b[$k];
                }
            }

            // Default sort if not provided
            if (!isset($b['sort'])) {
                $maxSort = (int)$pdo->prepare("SELECT COALESCE(MAX(sort)+1, 1) FROM showcase_items WHERE section_key = ?");
                $maxSort->execute([$key]);
                $cols[] = 'sort';
                $placeholders[] = '?';
                $params[] = (int)$maxSort->fetchColumn();
            }

            $sql = "INSERT INTO showcase_items (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $placeholders) . ")";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $newId = $pdo->lastInsertId();

            $fetch = $pdo->prepare("SELECT * FROM showcase_items WHERE id = ?");
            $fetch->execute([$newId]);
            $row = $fetch->fetch(PDO::FETCH_ASSOC);
            $row['shots'] = json_decode($row['shots'] ?? '[]', true) ?: [];
            $row['variants'] = json_decode($row['variants'] ?? '[]', true) ?: [];

            echo json_encode($row, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }
}

// ====================================================
// 4. ADMIN: PUT & DELETE /api/admin/showcase-items/:id
// ====================================================
if ($action === 'admin_item_single' && $id) {
    if ($method === 'PUT') {
        $raw = file_get_contents('php://input');
        $b = json_decode($raw, true) ?: [];

        sanitizePayload($b);

        $sets = [];
        $params = [];
        foreach ($MAP as $k => $col) {
            if (isset($b[$k])) {
                $sets[] = "$col = ?";
                $params[] = $b[$k];
            }
        }

        if (empty($sets)) {
            http_response_code(400);
            echo json_encode(['error' => 'nothing to update']);
            exit();
        }

        $params[] = $id;

        try {
            $sql = "UPDATE showcase_items SET " . implode(', ', $sets) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            echo json_encode(['ok' => true, 'success' => true]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }

    if ($method === 'DELETE') {
        try {
            $stmt = $pdo->prepare("DELETE FROM showcase_items WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(['ok' => true, 'success' => true]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }
}

// ====================================================
// 5. ADMIN: PUT /api/admin/showcase/:key/order
// ====================================================
if ($action === 'admin_order' && $method === 'PUT') {
    $raw = file_get_contents('php://input');
    $b = json_decode($raw, true) ?: [];
    $ids = isset($b['ids']) && is_array($b['ids']) ? $b['ids'] : [];

    try {
        $stmt = $pdo->prepare("UPDATE showcase_items SET sort = ? WHERE id = ? AND section_key = ?");
        foreach ($ids as $i => $itemId) {
            $stmt->execute([$i + 1, $itemId, $key]);
        }

        echo json_encode(['ok' => true, 'success' => true]);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit();
    }
}

// ====================================================
// 6. ADMIN: POST /api/admin/showcase-upload
// ====================================================
if ($action === 'admin_upload' && $method === 'POST') {
    if (empty($_FILES['image']['tmp_name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Send a JPG/PNG/WebP photo in the "image" field']);
        exit();
    }

    $uploadsDir = __DIR__ . '/uploads';
    if (!is_dir($uploadsDir)) {
        mkdir($uploadsDir, 0755, true);
    }

    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION) ?: 'jpg';
    $name = 'sc_' . bin2hex(random_bytes(6)) . '.' . strtolower($ext);
    $dest = $uploadsDir . '/' . $name;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $dest)) {
        $path = '/uploads/' . $name;
        $fullUrl = absUrl($path, $PUBLIC_URL);
        echo json_encode([
            'ok' => true,
            'path' => $path,
            'url' => $fullUrl
        ]);
        exit();
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save uploaded image']);
        exit();
    }
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found', 'action' => $action, 'key' => $key]);
exit();
?>
