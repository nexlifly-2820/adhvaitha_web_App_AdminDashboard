<?php
// category_tabs.php — Home Category Glass Tabs Backend API (PHP / MySQL)
// Serves:
//   PUBLIC:
//     GET  /api/category-tabs
//   ADMIN:
//     GET    /api/admin/category-tabs
//     POST   /api/admin/category-tabs
//     PUT    /api/admin/category-tabs/:id
//     DELETE /api/admin/category-tabs/:id
//     PUT    /api/admin/category-tabs/order
//     POST   /api/admin/category-tabs/upload

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
    $pdo->exec("CREATE TABLE IF NOT EXISTS category_tabs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        label VARCHAR(100) NOT NULL,
        image TEXT DEFAULT NULL,
        badge VARCHAR(50) DEFAULT '',
        enabled TINYINT(1) DEFAULT 1,
        sort INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Seed authentic category tabs if empty
    $count = (int)$pdo->query("SELECT COUNT(*) FROM category_tabs")->fetchColumn();
    if ($count == 0) {
        $defaultTabs = [
            ['slug' => 'all',     'label' => 'All',     'image' => '',                                       'badge' => '',    'sort' => 1],
            ['slug' => 'pickles', 'label' => 'Pickles', 'image' => 'assets/images/bowl_bellam_avakaya.png',  'badge' => '',    'sort' => 2],
            ['slug' => 'snacks',  'label' => 'Snacks',  'image' => 'assets/images/bowl_karam_janthukalu.png','badge' => 'NEW', 'sort' => 3],
            ['slug' => 'sweets',  'label' => 'Sweets',  'image' => 'assets/images/bowl_sunnunda_laddu.png',  'badge' => '',    'sort' => 4],
            ['slug' => 'podis',   'label' => 'Podis',   'image' => 'assets/images/bowl_karam_podi.png',     'badge' => '',    'sort' => 5],
            ['slug' => 'combos',  'label' => 'Combos',  'image' => 'assets/images/combos.png',               'badge' => '',    'sort' => 6]
        ];

        $ins = $pdo->prepare("INSERT IGNORE INTO category_tabs (slug, label, image, badge, sort, enabled)
                              VALUES (:slug, :label, :image, :badge, :sort, 1)");
        foreach ($defaultTabs as $t) {
            $ins->execute($t);
        }
    }
} catch (Exception $e) {
    error_log("Category Tabs DDL Warning: " . $e->getMessage());
}

// ----------------------------------------------------
// 2. ROUTING & DISPATCH
// ----------------------------------------------------
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if (empty($action)) {
    $uri = $_SERVER['REQUEST_URI'];
    $path = parse_url($uri, PHP_URL_PATH);
    if (strpos($path, '/admin/category-tabs/order') !== false) {
        $action = 'admin_order';
    } else if (strpos($path, '/admin/category-tabs/upload') !== false) {
        $action = 'admin_upload';
    } else if (preg_match('#/admin/category-tabs/([0-9]+)#', $path, $m)) {
        $action = 'admin_item';
        $_GET['id'] = $m[1];
    } else if (strpos($path, '/admin/category-tabs') !== false) {
        $action = 'admin_tabs';
    } else if (strpos($path, '/category-tabs') !== false) {
        $action = 'public_tabs';
    }
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($action) {
    // ------------------------------------------------
    // PUBLIC APP ENDPOINT: GET /api/category-tabs
    // ------------------------------------------------
    case 'public_tabs':
        $rows = $pdo->query("SELECT * FROM category_tabs WHERE enabled = 1 ORDER BY sort ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC);

        // Compute preview thumbnails for "all" tab
        $others = [];
        foreach ($rows as $r) {
            if ($r['slug'] !== 'all' && !empty($r['image'])) {
                $others[] = absUrl($r['image']);
                if (count($others) >= 4) break;
            }
        }

        $tabs = array_map(function($r) use ($others) {
            return [
                'id' => (string)$r['id'],
                'slug' => (string)$r['slug'],
                'label' => (string)$r['label'],
                'image' => absUrl($r['image'] ?? ''),
                'badge' => (string)($r['badge'] ?? ''),
                'allImages' => ($r['slug'] === 'all') ? $others : []
            ];
        }, $rows);

        echo json_encode(['tabs' => $tabs], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        break;

    // ------------------------------------------------
    // ADMIN TABS LIST & CREATE: GET / POST /api/admin/category-tabs
    // ------------------------------------------------
    case 'admin_tabs':
        if ($method === 'GET') {
            $rows = $pdo->query("SELECT * FROM category_tabs ORDER BY sort ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC);
            $out = array_map(function($r) {
                return [
                    'id' => (string)$r['id'],
                    'slug' => (string)$r['slug'],
                    'label' => (string)$r['label'],
                    'image' => (string)($r['image'] ?? ''),
                    'url' => absUrl($r['image'] ?? ''),
                    'badge' => (string)($r['badge'] ?? ''),
                    'enabled' => (bool)$r['enabled'],
                    'sort' => (int)$r['sort']
                ];
            }, $rows);
            echo json_encode($out, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        } else if ($method === 'POST') {
            $label = substr(trim((string)($input['label'] ?? '')), 0, 14);
            $slug = strtolower(preg_replace('/[^a-z0-9-]+/', '-', trim((string)($input['slug'] ?? ''))));
            if (empty($label) || empty($slug)) {
                http_response_code(400);
                echo json_encode(['error' => 'Name and slug are required']);
                exit();
            }

            $badge = substr(trim((string)($input['badge'] ?? '')), 0, 6);
            $image = trim((string)($input['image'] ?? ''));
            $enabled = isset($input['enabled']) ? ($input['enabled'] ? 1 : 0) : 1;
            $maxSort = (int)$pdo->query("SELECT COALESCE(MAX(sort),0) FROM category_tabs")->fetchColumn();

            $stmt = $pdo->prepare("INSERT INTO category_tabs (slug, label, image, badge, enabled, sort)
                                  VALUES (:slug, :label, :image, :badge, :enabled, :sort)");
            try {
                $stmt->execute([
                    ':slug' => $slug,
                    ':label' => $label,
                    ':image' => $image,
                    ':badge' => $badge,
                    ':enabled' => $enabled,
                    ':sort' => $maxSort + 1
                ]);
                $id = $pdo->lastInsertId();
                $newRow = $pdo->query("SELECT * FROM category_tabs WHERE id = $id")->fetch(PDO::FETCH_ASSOC);
                $newRow['url'] = absUrl($newRow['image'] ?? '');
                $newRow['enabled'] = (bool)$newRow['enabled'];
                echo json_encode($newRow);
            } catch (PDOException $e) {
                http_response_code(400);
                echo json_encode(['error' => 'This slug already exists']);
            }
        }
        break;

    // ------------------------------------------------
    // ADMIN TAB ITEM: PUT / DELETE /api/admin/category-tabs/:id
    // ------------------------------------------------
    case 'admin_item':
        $id = intval($_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid tab ID']);
            exit();
        }

        if ($method === 'PUT') {
            $updates = [];
            $params = [':id' => $id];

            if (isset($input['label'])) {
                $updates[] = "label = :label";
                $params[':label'] = substr(trim((string)$input['label']), 0, 14);
            }
            if (isset($input['slug'])) {
                $updates[] = "slug = :slug";
                $params[':slug'] = strtolower(preg_replace('/[^a-z0-9-]+/', '-', trim((string)$input['slug'])));
            }
            if (isset($input['image'])) {
                $updates[] = "image = :image";
                $params[':image'] = trim((string)$input['image']);
            }
            if (isset($input['badge'])) {
                $updates[] = "badge = :badge";
                $params[':badge'] = substr(trim((string)$input['badge']), 0, 6);
            }
            if (isset($input['enabled'])) {
                $updates[] = "enabled = :enabled";
                $params[':enabled'] = $input['enabled'] ? 1 : 0;
            }

            if (!empty($updates)) {
                $sql = "UPDATE category_tabs SET " . implode(", ", $updates) . " WHERE id = :id";
                $stmt = $pdo->prepare($sql);
                try {
                    $stmt->execute($params);
                } catch (PDOException $e) {
                    http_response_code(400);
                    echo json_encode(['error' => 'This slug already exists']);
                    exit();
                }
            }

            echo json_encode(['ok' => true]);
        } else if ($method === 'DELETE') {
            $stmt = $pdo->prepare("DELETE FROM category_tabs WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(['ok' => true]);
        }
        break;

    // ------------------------------------------------
    // ADMIN REORDER: PUT /api/admin/category-tabs/order
    // ------------------------------------------------
    case 'admin_order':
        $ids = $input['ids'] ?? [];
        if (is_array($ids)) {
            $stmt = $pdo->prepare("UPDATE category_tabs SET sort = :sort WHERE id = :id");
            foreach ($ids as $index => $cid) {
                $stmt->execute([':sort' => $index + 1, ':id' => intval($cid)]);
            }
        }
        echo json_encode(['ok' => true]);
        break;

    // ------------------------------------------------
    // ADMIN UPLOAD: POST /api/admin/category-tabs/upload
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

        $filename = 'cat_' . bin2hex(random_bytes(8)) . '.' . $ext;
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

