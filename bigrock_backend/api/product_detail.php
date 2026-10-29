<?php
// product_detail.php — Product Detail Living-Photo & Admin Management API
// Serves:
//   APP:   GET  /api/products/:id/detail
//   ADMIN: PUT  /api/admin/products/:id/detail
//          GET  /api/admin/products/:id/photos
//          POST /api/admin/products/:id/photos
//          PUT  /api/admin/products/:id/photos/:photoId
//          DELETE /api/admin/products/:id/photos/:photoId
//          GET  /api/admin/products/analytics/views

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// ----------------------------------------------------
// DDL AUTO-MIGRATION: Ensure tables and columns exist
// ----------------------------------------------------
try {
    // 1. Photos Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS product_photos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL,
        url TEXT NOT NULL,
        caption VARCHAR(255) DEFAULT '',
        glints TEXT DEFAULT '[]',
        sort INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_prod (product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 2. Views Counter Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS product_views (
        product_id VARCHAR(100) NOT NULL,
        day DATE NOT NULL,
        n INT DEFAULT 0,
        PRIMARY KEY (product_id, day)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // 3. Ensure detail columns in app_products
    $newCols = [
        'category_label VARCHAR(255) DEFAULT NULL',
        'highlight VARCHAR(255) DEFAULT NULL',
        'brand_line VARCHAR(255) DEFAULT NULL',
        'features TEXT DEFAULT NULL',
        'journey TEXT DEFAULT NULL',
        'artisan TEXT DEFAULT NULL',
        'video_url TEXT DEFAULT NULL'
    ];
    foreach ($newCols as $colSql) {
        try {
            $pdo->exec("ALTER TABLE app_products ADD COLUMN $colSql");
        } catch (Exception $e) {
            // Already exists
        }
    }
} catch (Exception $e) {
    // Continue
}

// Determine Action and IDs
$action = $_GET['action'] ?? null;
$id = $_GET['id'] ?? null;
$photoId = $_GET['photoId'] ?? null;

// Route matching if action is not set via query param
if (!$action) {
    $uri = $_SERVER['REQUEST_URI'];
    if (preg_match('#products/([^/]+)/detail#', $uri, $m)) {
        $id = $m[1];
        $action = (strpos($uri, 'admin') !== false) ? 'admin_detail' : 'app_detail';
    } else if (preg_match('#admin/products/([^/]+)/photos/([^/]+)#', $uri, $m)) {
        $id = $m[1];
        $photoId = $m[2];
        $action = 'admin_photo_item';
    } else if (preg_match('#admin/products/([^/]+)/photos#', $uri, $m)) {
        $id = $m[1];
        $action = 'admin_photos';
    } else if (preg_match('#admin/products/analytics/views#', $uri)) {
        $action = 'analytics_views';
    }
}

$method = $_SERVER['REQUEST_METHOD'];

// ====================================================
// 1. APP: GET /api/products/:id/detail
// ====================================================
if ($action === 'app_detail' || ($method === 'GET' && $id && !$photoId && $action !== 'admin_photos' && $action !== 'analytics_views')) {
    try {
        // Increment daily view count
        $stmtView = $pdo->prepare("INSERT INTO product_views (product_id, day, n) VALUES (?, CURRENT_DATE, 1)
                                   ON DUPLICATE KEY UPDATE n = n + 1");
        $stmtView->execute([$id]);

        // Get today's views
        $stmtCount = $pdo->prepare("SELECT n FROM product_views WHERE product_id = ? AND day = CURRENT_DATE");
        $stmtCount->execute([$id]);
        $viewRow = $stmtCount->fetch(PDO::FETCH_ASSOC);
        $viewsToday = $viewRow ? (int)$viewRow['n'] : 1;

        // Fetch product
        $stmtP = $pdo->prepare("SELECT * FROM app_products WHERE id = ?");
        $stmtP->execute([$id]);
        $p = $stmtP->fetch(PDO::FETCH_ASSOC);

        if (!$p) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found', 'id' => $id]);
            exit();
        }

        // Fetch living photos with glints
        $stmtPhotos = $pdo->prepare("SELECT id, url, caption, glints, sort FROM product_photos WHERE product_id = ? ORDER BY sort ASC, id ASC");
        $stmtPhotos->execute([$id]);
        $photoRows = $stmtPhotos->fetchAll(PDO::FETCH_ASSOC);

        $photos = [];
        foreach ($photoRows as $pr) {
            $photos[] = [
                'id' => (string)$pr['id'],
                'url' => $pr['url'],
                'caption' => $pr['caption'] ?? '',
                'glints' => json_decode($pr['glints'] ?? '[]', true) ?? [],
                'sort' => (int)($pr['sort'] ?? 0)
            ];
        }

        if (empty($photos)) {
            $photos = [
                [
                    'id' => 'p1',
                    'url' => $p['image_url'] ?? '',
                    'caption' => 'Handcrafted authentic recipe',
                    'glints' => [[0.52, 0.45], [0.38, 0.60]]
                ]
            ];
            if (!empty($p['story_image'])) {
                $photos[] = [
                    'id' => 'p2',
                    'url' => $p['story_image'],
                    'caption' => 'Slow-cured in ceramic jaadis',
                    'glints' => [[0.48, 0.52]]
                ];
            }
        }

        // Parse variants from weight_price_json
        $weights = json_decode($p['weight_price_json'] ?? '[]', true) ?? [];
        $variants = [];
        $vIdx = 1;
        foreach ($weights as $wLabel => $wPrice) {
            $priceNum = (float)$wPrice;
            $variants[] = [
                'id' => 'v' . $vIdx,
                'label' => (string)$wLabel,
                'price' => $priceNum,
                'mrp' => round($priceNum * 1.15),
                'is_default' => ($vIdx === 1)
            ];
            $vIdx++;
        }
        if (empty($variants)) {
            $basePrice = (float)($p['price'] ?? 149);
            $variants[] = [
                'id' => 'v1',
                'label' => '250g',
                'price' => $basePrice,
                'mrp' => round($basePrice * 1.15),
                'is_default' => true
            ];
        }

        // Ingredients
        $ingredients = json_decode($p['ingredients_json'] ?? '[]', true) ?? [];
        if (empty($ingredients) && !empty($p['ingredients'])) {
            $ingredients = json_decode($p['ingredients'], true) ?? [];
        }

        // Journey / Behind the Jar
        $journey = json_decode($p['journey'] ?? '[]', true) ?? [];
        if (empty($journey)) {
            $journey = json_decode($p['behind_the_jar_json'] ?? '[]', true) ?? [
                ["icon" => "📍", "label" => "Origin", "title" => "Guntur", "text" => "Finest farms"],
                ["icon" => "☀️", "label" => "Process", "title" => "Sun-dried", "text" => "For 21 days"],
                ["icon" => "🏺", "label" => "Storage", "title" => "Jaadi jars", "text" => "Airtight & aged"]
            ];
        }

        // Artisan
        $artisan = json_decode($p['artisan'] ?? 'null', true);
        if (!$artisan) {
            $artisan = [
                'name' => !empty($p['artisanName']) ? $p['artisanName'] : 'Lakshmi Amma',
                'since' => '1982',
                'quote' => !empty($p['artisanDescription']) ? $p['artisanDescription'] : 'Every jar carries the scent of home and Amma\'s blessings.',
                'photo' => !empty($p['artisanImage']) ? $p['artisanImage'] : 'assets/images/AMBHUJAKSHI  logo.png'
            ];
        }

        // Features
        $features = json_decode($p['features'] ?? '[]', true) ?? [];
        if (empty($features)) {
            $features = json_decode($p['trust_badges_json'] ?? '[]', true) ?? [
                '100% Natural', 'Sun-cured in Jaadis', 'Wood-pressed Oil', 'Zero Preservatives'
            ];
        }

        // Recipes
        $recipes = json_decode($p['recipes_json'] ?? '[]', true) ?? [];

        $spiceLevels = ['', 'Mild', 'Medium', 'Hot', 'Very Hot', 'Fiery'];
        $spiceInt = (int)($p['spice'] ?? 3);

        $response = [
            'id' => (string)$p['id'],
            'name' => $p['name'],
            'categoryLabel' => !empty($p['category_label']) ? $p['category_label'] : ($p['category'] . ' Special'),
            'rating' => (float)($p['rating'] ?? 4.8),
            'reviewCount' => (int)($p['purchaseCount'] ?? 128),
            'soldText' => ((int)($p['purchaseCount'] ?? 0) > 0) ? ($p['purchaseCount'] . '+ sold') : 'Bestseller',
            'spice' => $spiceInt,
            'spiceLabel' => $spiceLevels[$spiceInt] ?? 'Medium',
            'viewersToday' => $viewsToday,
            'photos' => $photos,
            'videoUrl' => $p['video_url'] ?? '',
            'variants' => $variants,
            'defaultVariantId' => $variants[0]['id'],
            'description' => $p['description'] ?? '',
            'highlight' => $p['highlight'] ?? 'wood-pressed sesame oil',
            'features' => $features,
            'ingredients' => $ingredients,
            'journey' => $journey,
            'artisan' => $artisan,
            'recipes' => $recipes,
            'brandLine' => !empty($p['brand_line']) ? $p['brand_line'] : "Bringing Andhra's authentic flavours to your home.",
            'logo' => 'assets/images/AMBHUJAKSHI  logo.png'
        ];

        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit();
    }
}

// ====================================================
// 2. ADMIN: PUT /api/admin/products/:id/detail
// ====================================================
if ($action === 'admin_detail' || ($method === 'PUT' && $id && !$photoId)) {
    $raw = file_get_contents('php://input');
    $b = json_decode($raw, true);

    if (!$b) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit();
    }

    try {
        $categoryLabel = $b['categoryLabel'] ?? null;
        $description = $b['description'] ?? null;
        $highlight = $b['highlight'] ?? null;
        $spice = isset($b['spice']) ? (int)$b['spice'] : null;
        $videoUrl = $b['videoUrl'] ?? null;
        $brandLine = $b['brandLine'] ?? null;
        
        $features = isset($b['features']) ? (is_array($b['features']) ? json_encode($b['features']) : $b['features']) : null;
        $ingredients = isset($b['ingredients']) ? (is_array($b['ingredients']) ? json_encode($b['ingredients']) : $b['ingredients']) : null;
        $journey = isset($b['journey']) ? (is_array($b['journey']) ? json_encode($b['journey']) : $b['journey']) : null;
        $artisan = isset($b['artisan']) ? (is_array($b['artisan']) ? json_encode($b['artisan']) : $b['artisan']) : null;
        $recipes = isset($b['recipes']) ? (is_array($b['recipes']) ? json_encode($b['recipes']) : $b['recipes']) : null;

        $sql = "UPDATE app_products SET 
                    category_label = COALESCE(?, category_label),
                    description = COALESCE(?, description),
                    highlight = COALESCE(?, highlight),
                    spice = COALESCE(?, spice),
                    video_url = COALESCE(?, video_url),
                    brand_line = COALESCE(?, brand_line),
                    features = COALESCE(?, features),
                    ingredients_json = COALESCE(?, ingredients_json),
                    journey = COALESCE(?, journey),
                    artisan = COALESCE(?, artisan),
                    recipes_json = COALESCE(?, recipes_json)
                WHERE id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $categoryLabel, $description, $highlight, $spice, $videoUrl, $brandLine,
            $features, $ingredients, $journey, $artisan, $recipes, $id
        ]);

        echo json_encode(['ok' => true, 'success' => true, 'message' => 'Product detail updated successfully']);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit();
    }
}

// ====================================================
// 3. ADMIN: GET & POST /api/admin/products/:id/photos
// ====================================================
if ($action === 'admin_photos') {
    // GET: List photos for product
    if ($method === 'GET') {
        try {
            $stmt = $pdo->prepare("SELECT id, product_id, url, caption, glints, sort, created_at FROM product_photos WHERE product_id = ? ORDER BY sort ASC, id ASC");
            $stmt->execute([$id]);
            $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($photos as &$photo) {
                $photo['id'] = (string)$photo['id'];
                $photo['glints'] = json_decode($photo['glints'] ?? '[]', true) ?? [];
                $photo['sort'] = (int)($photo['sort'] ?? 0);
            }

            echo json_encode(['success' => true, 'photos' => $photos]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }

    // POST: Add new living photo with glints
    if ($method === 'POST') {
        $raw = file_get_contents('php://input');
        $b = json_decode($raw, true);

        $url = $b['url'] ?? '';
        $caption = $b['caption'] ?? '';
        $glints = $b['glints'] ?? [];
        $sort = isset($b['sort']) ? (int)$b['sort'] : 0;

        // If multipart upload was sent
        if (!empty($_FILES['photo']['tmp_name'])) {
            $uploadsDir = __DIR__ . '/uploads';
            if (!is_dir($uploadsDir)) {
                mkdir($uploadsDir, 0755, true);
            }
            $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION) ?: 'jpg';
            $fileName = 'glint_' . uniqid() . '.' . $ext;
            $dest = $uploadsDir . '/' . $fileName;
            if (move_uploaded_file($_FILES['photo']['tmp_name'], $dest)) {
                $url = 'https://admin.adhvaithafoods.in/api/uploads/' . $fileName;
            }
            $caption = $_POST['caption'] ?? $caption;
            if (isset($_POST['glints'])) {
                $glints = json_decode($_POST['glints'], true) ?? $glints;
            }
        }

        if (empty($url)) {
            http_response_code(400);
            echo json_encode(['error' => 'Photo URL or uploaded file is required']);
            exit();
        }

        $glintsJson = is_array($glints) ? json_encode($glints) : $glints;

        try {
            $stmt = $pdo->prepare("INSERT INTO product_photos (product_id, url, caption, glints, sort) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$id, $url, $caption, $glintsJson, $sort]);
            $newPhotoId = $pdo->lastInsertId();

            echo json_encode([
                'success' => true,
                'ok' => true,
                'photo' => [
                    'id' => (string)$newPhotoId,
                    'productId' => $id,
                    'url' => $url,
                    'caption' => $caption,
                    'glints' => is_array($glints) ? $glints : json_decode($glintsJson, true),
                    'sort' => $sort
                ]
            ]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }
}

// ====================================================
// 4. ADMIN: PUT & DELETE /api/admin/products/:id/photos/:photoId
// ====================================================
if ($action === 'admin_photo_item' || ($photoId && $id)) {
    // PUT: Update caption, glints, or sort order
    if ($method === 'PUT') {
        $raw = file_get_contents('php://input');
        $b = json_decode($raw, true);

        try {
            $sets = [];
            $params = [];
            if (isset($b['caption'])) {
                $sets[] = "caption = ?";
                $params[] = $b['caption'];
            }
            if (isset($b['sort'])) {
                $sets[] = "sort = ?";
                $params[] = (int)$b['sort'];
            }
            if (isset($b['glints'])) {
                $sets[] = "glints = ?";
                $params[] = is_array($b['glints']) ? json_encode($b['glints']) : $b['glints'];
            }
            if (isset($b['url'])) {
                $sets[] = "url = ?";
                $params[] = $b['url'];
            }

            if (empty($sets)) {
                http_response_code(400);
                echo json_encode(['error' => 'No fields to update']);
                exit();
            }

            $params[] = $photoId;
            $params[] = $id;

            $sql = "UPDATE product_photos SET " . implode(', ', $sets) . " WHERE id = ? AND product_id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            echo json_encode(['ok' => true, 'success' => true, 'message' => 'Photo updated']);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }

    // DELETE: Delete photo
    if ($method === 'DELETE') {
        try {
            $stmt = $pdo->prepare("DELETE FROM product_photos WHERE id = ? AND product_id = ?");
            $stmt->execute([$photoId, $id]);

            echo json_encode(['ok' => true, 'success' => true, 'message' => 'Photo deleted']);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }
}

// ====================================================
// 5. BONUS: GET /api/admin/products/analytics/views
// ====================================================
if ($action === 'analytics_views' || ($method === 'GET' && isset($_GET['analytics']))) {
    try {
        $stmt = $pdo->prepare("
            SELECT pv.product_id, pv.n AS views_today, p.name, p.image_url, p.category
            FROM product_views pv
            LEFT JOIN app_products p ON p.id = pv.product_id
            WHERE pv.day = CURRENT_DATE
            ORDER BY pv.n DESC
            LIMIT 20
        ");
        $stmt->execute();
        $analytics = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'day' => date('Y-m-d'),
            'totalViewsToday' => array_sum(array_column($analytics, 'views_today')),
            'products' => $analytics
        ]);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit();
    }
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not matched', 'action' => $action, 'method' => $method]);
exit();
?>
