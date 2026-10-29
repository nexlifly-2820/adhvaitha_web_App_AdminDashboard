<?php
require_once 'db.php';

// Ensure tables exist
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS wishlist_items (
        user_id INT NOT NULL,
        product_id VARCHAR(100) NOT NULL,
        variant_id VARCHAR(100) DEFAULT '',
        added_price DECIMAL(10,2) DEFAULT 0,
        added_in_stock TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS wishlist_shares (
        token VARCHAR(64) PRIMARY KEY,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS wishlist_settings (
        id INT PRIMARY KEY DEFAULT 1,
        eyebrow VARCHAR(100) DEFAULT 'MY WISHLIST',
        title_start VARCHAR(100) DEFAULT 'Amma\'s',
        title_accent VARCHAR(100) DEFAULT 'pantry',
        title_end VARCHAR(100) DEFAULT 'for you',
        share_label VARCHAR(100) DEFAULT '↗ Share my shelf',
        fill_label VARCHAR(100) DEFAULT 'Fill my basket',
        fairy_lights TINYINT(1) DEFAULT 1,
        share_base VARCHAR(255) DEFAULT 'https://ambhujakshi.com/wishlist/'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Insert default settings row if missing
    $pdo->exec("INSERT IGNORE INTO wishlist_settings (id) VALUES (1);");
} catch (PDOException $e) {
    // Continue if already exists or permission issues
}

// Helper: Extract user_id from Bearer token, query param, or header
function getUserId() {
    if (isset($_GET['user_id']) && is_numeric($_GET['user_id'])) {
        return (int)$_GET['user_id'];
    }
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (preg_match('/Bearer\s+(\S+)/', $auth, $m)) {
        $token = $m[1];
        // If JWT or user ID token
        if (is_numeric($token)) return (int)$token;
        // Check if users table has token
        global $pdo;
        try {
            $stmt = $pdo->prepare("SELECT id FROM users WHERE token = ? OR phone = ? LIMIT 1");
            $stmt->execute([$token, $token]);
            $u = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($u && isset($u['id'])) return (int)$u['id'];
        } catch (Exception $ex) {}
    }
    return 1; // Default demo user
}

// Parse request path & action
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$pathInfo = $_SERVER['PATH_INFO'] ?? '';

if (strpos($pathInfo, '/ids') !== false || $action === 'ids') {
    $action = 'ids';
} else if (strpos($pathInfo, '/share') !== false || $action === 'share') {
    $action = 'share';
} else if (strpos($pathInfo, '/stats') !== false || $action === 'stats') {
    $action = 'stats';
}

$userId = getUserId();

// 1. GET /api/wishlist/ids -> Simple JSON array of product IDs
if ($method === 'GET' && $action === 'ids') {
    try {
        $stmt = $pdo->prepare("SELECT product_id FROM wishlist_items WHERE user_id = ?");
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo json_encode($rows ?: []);
    } catch (PDOException $e) {
        echo json_encode([]);
    }
    exit();
}

// 2. GET /api/wishlist/stats -> For Admin Dashboard Analytics
if ($method === 'GET' && $action === 'stats') {
    try {
        $sql = "SELECT w.product_id, COUNT(w.user_id) AS wished,
                       SUM(CASE WHEN w.added_in_stock = 0 THEN 1 ELSE 0 END) AS waiting_for_stock
                FROM wishlist_items w
                GROUP BY w.product_id
                ORDER BY wished DESC LIMIT 50";
        $stmt = $pdo->query($sql);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "stats" => $rows]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
    exit();
}

// 3. POST /api/wishlist/share -> Generate shareable link
if ($method === 'POST' && $action === 'share') {
    try {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $token = '';
        for ($i = 0; $i < 6; $i++) {
            $token .= $chars[rand(0, strlen($chars) - 1)];
        }

        $stmt = $pdo->prepare("INSERT INTO wishlist_shares (token, user_id) VALUES (?, ?)");
        $stmt->execute([$token, $userId]);

        // Get share base
        $settingsStmt = $pdo->query("SELECT share_base FROM wishlist_settings WHERE id = 1 LIMIT 1");
        $setRow = $settingsStmt ? $settingsStmt->fetch(PDO::FETCH_ASSOC) : null;
        $shareBase = $setRow['share_base'] ?? 'https://ambhujakshi.com/wishlist/';

        echo json_encode([
            "success" => true,
            "token" => $token,
            "link" => rtrim($shareBase, '/') . '/' . $token
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
    exit();
}

// 4. DELETE /api/wishlist/:productId or DELETE /api/wishlist?product_id=123
if ($method === 'DELETE' || ($method === 'POST' && $action === 'delete')) {
    $productId = $_GET['productId'] ?? $_GET['product_id'] ?? '';
    if (!$productId && preg_match('#/([a-zA-Z0-9_\-]+)$#', $pathInfo, $pm)) {
        $productId = $pm[1];
    }
    if (!$productId) {
        $input = json_decode(file_get_contents('php://input'), true);
        $productId = $input['productId'] ?? $input['product_id'] ?? '';
    }

    if ($productId) {
        try {
            $stmt = $pdo->prepare("DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$userId, $productId]);
            echo json_encode(["success" => true, "message" => "Item removed from wishlist"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Missing productId"]);
    }
    exit();
}

// 5. POST /api/wishlist -> Add or update wishlist item (or update settings)
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    // If updating settings from Admin Dashboard
    if (isset($input['settings'])) {
        $s = $input['settings'];
        try {
            $stmt = $pdo->prepare("UPDATE wishlist_settings SET 
                eyebrow = ?, title_start = ?, title_accent = ?, title_end = ?, 
                share_label = ?, fill_label = ?, fairy_lights = ?, share_base = ? 
                WHERE id = 1");
            $stmt->execute([
                $s['eyebrow'] ?? 'MY WISHLIST',
                $s['titleStart'] ?? $s['title_start'] ?? "Amma's",
                $s['titleAccent'] ?? $s['title_accent'] ?? 'pantry',
                $s['titleEnd'] ?? $s['title_end'] ?? 'for you',
                $s['shareLabel'] ?? $s['share_label'] ?? '↗ Share my shelf',
                $s['fillLabel'] ?? $s['fill_label'] ?? 'Fill my basket',
                isset($s['fairyLights']) ? ($s['fairyLights'] ? 1 : 0) : (isset($s['fairy_lights']) ? ($s['fairy_lights'] ? 1 : 0) : 1),
                $s['shareBase'] ?? $s['share_base'] ?? 'https://ambhujakshi.com/wishlist/'
            ]);

            // Also mirror to app_settings doc_id = 'wishlist'
            $pdo->prepare("INSERT INTO app_settings (doc_id, json_data) VALUES ('wishlist', ?) 
                           ON DUPLICATE KEY UPDATE json_data = ?")->execute([$rawInput, $rawInput]);

            echo json_encode(["success" => true, "message" => "Wishlist settings updated"]);
            exit();
        } catch (PDOException $e) {}
    }

    // Add or Update Wishlist Item
    $productId = $input['productId'] ?? $input['product_id'] ?? '';
    $variantId = $input['variantId'] ?? $input['variant_id'] ?? '';
    $addedPrice = $input['addedPrice'] ?? $input['price'] ?? 0;
    $inStock = isset($input['inStock']) ? ($input['inStock'] ? 1 : 0) : 1;

    if ($productId) {
        try {
            $stmt = $pdo->prepare("INSERT INTO wishlist_items 
                (user_id, product_id, variant_id, added_price, added_in_stock) 
                VALUES (?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                variant_id = VALUES(variant_id), 
                added_price = VALUES(added_price), 
                added_in_stock = VALUES(added_in_stock)");
            $stmt->execute([$userId, $productId, $variantId, $addedPrice, $inStock]);
            echo json_encode(["success" => true, "message" => "Saved to wishlist"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Missing productId in body"]);
    }
    exit();
}

// 6. GET /api/wishlist -> Fetch current user wishlist & UI settings
if ($method === 'GET') {
    // Settings
    $settings = [
        "eyebrow" => "MY WISHLIST",
        "titleStart" => "Amma's",
        "titleAccent" => "pantry",
        "titleEnd" => "for you",
        "shareLabel" => "↗ Share my shelf",
        "fillLabel" => "Fill my basket",
        "fairyLights" => true,
        "shareBase" => "https://ambhujakshi.com/wishlist/"
    ];

    try {
        $stmt = $pdo->query("SELECT * FROM wishlist_settings WHERE id = 1 LIMIT 1");
        $row = $stmt ? $stmt->fetch(PDO::FETCH_ASSOC) : null;
        if ($row) {
            $settings = [
                "eyebrow" => $row['eyebrow'] ?: "MY WISHLIST",
                "titleStart" => $row['title_start'] ?: "Amma's",
                "titleAccent" => $row['title_accent'] ?: "pantry",
                "titleEnd" => $row['title_end'] ?: "for you",
                "shareLabel" => $row['share_label'] ?: "↗ Share my shelf",
                "fillLabel" => $row['fill_label'] ?: "Fill my basket",
                "fairyLights" => (bool)$row['fairy_lights'],
                "shareBase" => $row['share_base'] ?: "https://ambhujakshi.com/wishlist/"
            ];
        } else {
            // Check app_settings fallback
            $st = $pdo->prepare("SELECT json_data FROM app_settings WHERE doc_id = 'wishlist'");
            $st->execute();
            $d = $st->fetch(PDO::FETCH_ASSOC);
            if ($d && isset($d['json_data'])) {
                $dec = json_decode($d['json_data'], true);
                if (isset($dec['settings'])) $settings = array_merge($settings, $dec['settings']);
            }
        }
    } catch (Exception $e) {}

    // Items
    $items = [];
    try {
        // Query items joined with products if table exists, otherwise select wishlist_items
        $stmt = $pdo->prepare("SELECT w.product_id, w.variant_id, w.added_price, w.added_in_stock 
                               FROM wishlist_items w 
                               WHERE w.user_id = ? 
                               ORDER BY w.created_at DESC");
        $stmt->execute([$userId]);
        $wished = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch products catalog for images & current pricing
        $prodMap = [];
        try {
            $pStmt = $pdo->query("SELECT id, name, image, price, mrp, in_stock FROM products");
            if ($pStmt) {
                while ($p = $pStmt->fetch(PDO::FETCH_ASSOC)) {
                    $prodMap[$p['id']] = $p;
                }
            }
        } catch (Exception $pe) {}

        foreach ($wished as $w) {
            $pId = $w['product_id'];
            $p = $prodMap[$pId] ?? null;

            $currentPrice = $p ? (float)$p['price'] : (float)$w['added_price'];
            $mrp = $p ? (float)$p['mrp'] : ($currentPrice * 1.15);
            $addedPrice = (float)$w['added_price'];
            $inStock = $p ? (bool)$p['in_stock'] : (bool)$w['added_in_stock'];

            $note = '';
            if ($addedPrice > $currentPrice && $currentPrice > 0) {
                $drop = round($addedPrice - $currentPrice);
                $note = "₹{$drop} OFF";
            } else if ((int)$w['added_in_stock'] === 0 && $inStock) {
                $note = "BACK!";
            }

            $items[] = [
                "productId" => (string)$pId,
                "variantId" => (string)($w['variant_id'] ?: '500g'),
                "name" => $p ? $p['name'] : "Product #$pId",
                "image" => $p && $p['image'] ? $p['image'] : "assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg",
                "price" => $currentPrice,
                "mrp" => $mrp,
                "addedPrice" => $addedPrice,
                "inStock" => $inStock,
                "note" => $note
            ];
        }
    } catch (PDOException $e) {}

    // Fallback demo items if user has none saved yet
    if (empty($items)) {
        $items = [
          [
            "productId" => "mango_avakaya",
            "variantId" => "500g",
            "name" => "Mango Avakaya",
            "image" => "assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg",
            "price" => 349,
            "mrp" => 399,
            "addedPrice" => 399,
            "inStock" => true,
            "note" => "₹50 OFF"
          ],
          [
            "productId" => "idli_karam",
            "variantId" => "250g",
            "name" => "Special Idli Karam Podi",
            "image" => "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg",
            "price" => 190,
            "mrp" => 210,
            "addedPrice" => 190,
            "inStock" => true,
            "note" => "BACK!"
          ],
          [
            "productId" => "sunnunda_laddu",
            "variantId" => "500g",
            "name" => "Sunnunda Laddu",
            "image" => "assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg",
            "price" => 320,
            "mrp" => 350,
            "addedPrice" => 320,
            "inStock" => true,
            "note" => ""
          ]
        ];
    }

    echo json_encode([
        "settings" => $settings,
        "items" => $items
    ]);
    exit();
}
?>
