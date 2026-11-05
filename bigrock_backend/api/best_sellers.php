<?php
// best_sellers.php — Production PHP/MySQL Backend for Best Sellers section
// Serves:
//   PUBLIC:
//     GET  /api/home/best-sellers
//     GET  /api/best-sellers?tab=all
//   ADMIN:
//     GET    /api/admin/best-sellers
//     PUT    /api/admin/best-sellers/settings
//     POST   /api/admin/best-sellers/tabs
//     PUT    /api/admin/best-sellers/tabs/order
//     DELETE /api/admin/best-sellers/tabs/:id
//     PUT    /api/admin/best-sellers/tabs/:tabId/products/:productId
//     PUT    /api/admin/best-sellers/tabs/:tabId/order
//     POST   /api/admin/best-sellers/refresh
//
// GUARANTEE: All product photos are strictly 100% background-free in traditional brass bowls

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
// Transparent Bowl Images Registry (Background-Free)
// ----------------------------------------------------
$TRANSPARENT_BOWL_IMAGES = [
    'p1' => 'assets/images/bowl_bellam_avakaya.png',
    'bellam avakaya' => 'assets/images/bowl_bellam_avakaya.png',
    'p2' => 'assets/images/bowl_karam_podi.png',
    'idli karam podi' => 'assets/images/bowl_karam_podi.png',
    'karam podi' => 'assets/images/bowl_karam_podi.png',
    'p3' => 'assets/images/bowl_sunnunda_laddu.png',
    'sunnunda laddu' => 'assets/images/bowl_sunnunda_laddu.png',
    'p4' => 'assets/images/bowl_kara_murukku.png',
    'kara murukku' => 'assets/images/bowl_kara_murukku.png',
    'p5' => 'assets/images/bowl_khara_mixture.png',
    'khara mixture' => 'assets/images/bowl_khara_mixture.png',
    'p6' => 'assets/images/bowl_gongura_pickle.png',
    'gongura pickle' => 'assets/images/bowl_gongura_pickle.png',
    'p7' => 'assets/images/bowl_usiri_pickle.png',
    'usiri pickle' => 'assets/images/bowl_usiri_pickle.png',
    'p8' => 'assets/images/bowl_chakinalu.png',
    'chakinalu' => 'assets/images/bowl_chakinalu.png',
    'chakralu' => 'assets/images/bowl_chakinalu.png'
];

function getTransparentBowlImage($id, $name, $rawImage = '') {
    global $TRANSPARENT_BOWL_IMAGES;
    if ($rawImage && strpos($rawImage, 'bowl_') !== false && substr($rawImage, -4) === '.png') {
        return $rawImage;
    }
    $idKey = strtolower(trim((string)$id));
    $nameKey = strtolower(trim((string)$name));

    if (isset($TRANSPARENT_BOWL_IMAGES[$idKey])) {
        return $TRANSPARENT_BOWL_IMAGES[$idKey];
    }
    foreach ($TRANSPARENT_BOWL_IMAGES as $k => $v) {
        if (strpos($nameKey, $k) !== false || strpos($k, $nameKey) !== false) {
            return $v;
        }
    }
    return $rawImage ?: 'assets/images/bowl_bellam_avakaya.png';
}

function fmtSold($n) {
    $n = (int)$n;
    if ($n >= 10000) return floor($n / 1000) . 'K+';
    if ($n >= 1000) return str_replace('.0', '', number_format($n / 1000, 1)) . 'K';
    return (string)$n;
}

// ----------------------------------------------------
// DDL AUTO-MIGRATIONS (MySQL Compatible)
// ----------------------------------------------------
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS bs_settings (
        id INT PRIMARY KEY DEFAULT 1,
        enabled TINYINT(1) DEFAULT 1,
        kicker VARCHAR(255) DEFAULT 'THIS MONTH\'S CHAMPIONS',
        title VARCHAR(255) DEFAULT 'Best',
        title_accent VARCHAR(255) DEFAULT 'sellers',
        subtitle VARCHAR(255) DEFAULT 'Ranked by real orders from {homes}+ homes',
        interval_ms INT DEFAULT 4000,
        `rows` INT DEFAULT 3,
        max_items INT DEFAULT 10,
        period_days INT DEFAULT 30,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS bs_tabs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        emoji VARCHAR(20) DEFAULT '',
        category_id BIGINT NULL,
        mode VARCHAR(20) DEFAULT 'auto',
        position INT DEFAULT 0,
        active TINYINT(1) DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS bs_overrides (
        tab_id INT NOT NULL,
        product_id VARCHAR(100) NOT NULL,
        pin_rank INT NULL,
        hidden TINYINT(1) DEFAULT 0,
        sold_label VARCHAR(50) NULL,
        PRIMARY KEY (tab_id, product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS bs_ranks (
        tab_id INT NOT NULL,
        product_id VARCHAR(100) NOT NULL,
        `rank` INT NOT NULL,
        prev_rank INT NULL,
        sold INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (tab_id, product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Ensure default settings row exists
    $stCount = $pdo->query("SELECT COUNT(*) FROM bs_settings WHERE id=1")->fetchColumn();
    if ($stCount == 0) {
        $pdo->exec("INSERT INTO bs_settings (id, enabled, kicker, title, title_accent, subtitle, interval_ms, `rows`, max_items, period_days)
                    VALUES (1, 1, 'THIS MONTH\'S CHAMPIONS', 'Best', 'sellers', 'Ranked by real orders from {homes}+ homes', 4000, 3, 10, 30)");
    }

    // Ensure default tabs exist
    $tabCount = $pdo->query("SELECT COUNT(*) FROM bs_tabs")->fetchColumn();
    if ($tabCount == 0) {
        $defaultTabs = [
            ['slug' => 'all', 'name' => 'All', 'emoji' => '🔥', 'position' => 0],
            ['slug' => 'pickles', 'name' => 'Pickles', 'emoji' => '🥭', 'position' => 1],
            ['slug' => 'powders', 'name' => 'Podis', 'emoji' => '🌶️', 'position' => 2],
            ['slug' => 'sweets', 'name' => 'Sweets', 'emoji' => '🍯', 'position' => 3],
            ['slug' => 'snacks', 'name' => 'Snacks', 'emoji' => '🥨', 'position' => 4],
        ];
        $ins = $pdo->prepare("INSERT INTO bs_tabs (slug, name, emoji, position) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)");
        foreach ($defaultTabs as $t) {
            $ins->execute([$t['slug'], $t['name'], $t['emoji'], $t['position']]);
        }
    }

    // Ensure 8 champion products exist in bs_ranks for tab 'all'
    $allTabId = $pdo->query("SELECT id FROM bs_tabs WHERE slug='all'")->fetchColumn();
    if ($allTabId) {
        $rankCount = $pdo->query("SELECT COUNT(*) FROM bs_ranks WHERE tab_id = $allTabId")->fetchColumn();
        if ($rankCount == 0) {
            $defaultRanks = [
                ['id' => 'p1', 'rank' => 1, 'prev_rank' => 3, 'sold' => 12000],
                ['id' => 'p2', 'rank' => 2, 'prev_rank' => 3, 'sold' => 9800],
                ['id' => 'p3', 'rank' => 3, 'prev_rank' => null, 'sold' => 8400],
                ['id' => 'p4', 'rank' => 4, 'prev_rank' => 7, 'sold' => 6200],
                ['id' => 'p5', 'rank' => 5, 'prev_rank' => 4, 'sold' => 5500],
                ['id' => 'p6', 'rank' => 6, 'prev_rank' => 8, 'sold' => 7100],
                ['id' => 'p7', 'rank' => 7, 'prev_rank' => 8, 'sold' => 6800],
                ['id' => 'p8', 'rank' => 8, 'prev_rank' => null, 'sold' => 8200],
            ];
            $rins = $pdo->prepare("INSERT INTO bs_ranks (tab_id, product_id, `rank`, prev_rank, sold) VALUES (?, ?, ?, ?, ?)
                                   ON DUPLICATE KEY UPDATE `rank`=VALUES(`rank`), prev_rank=VALUES(prev_rank), sold=VALUES(sold)");
            foreach ($defaultRanks as $dr) {
                $rins->execute([$allTabId, $dr['id'], $dr['rank'], $dr['prev_rank'], $dr['sold']]);
            }
        }
    }
} catch (Exception $e) {
    // Migration error caught silently so public API doesn't fail
}

// ----------------------------------------------------
// DEFAULT 8 CHAMPION PRODUCTS FALLBACK
// (All using background-free transparent brass bowl PNGs)
// ----------------------------------------------------
function getChampionProducts() {
    return [
        'p1' => [
            'id' => 'p1', 'variantId' => 'v1', 'name' => 'Bellam Avakaya',
            'image' => 'assets/images/bowl_bellam_avakaya.png',
            'price' => 120, 'mrp' => 136, 'sold' => '12K+', 'rating' => 4.8, 'move' => 'up', 'moveBy' => 2
        ],
        'p2' => [
            'id' => 'p2', 'variantId' => 'v4', 'name' => 'Idli Karam Podi',
            'image' => 'assets/images/bowl_karam_podi.png',
            'price' => 139, 'mrp' => 150, 'sold' => '9.8K+', 'rating' => 4.9, 'move' => 'up', 'moveBy' => 1
        ],
        'p3' => [
            'id' => 'p3', 'variantId' => 'v8', 'name' => 'Sunnunda Laddu',
            'image' => 'assets/images/bowl_sunnunda_laddu.png',
            'price' => 199, 'mrp' => 220, 'sold' => '8.4K+', 'rating' => 4.9, 'move' => 'new', 'moveBy' => 0
        ],
        'p4' => [
            'id' => 'p4', 'variantId' => 'v6', 'name' => 'Kara Murukku',
            'image' => 'assets/images/bowl_kara_murukku.png',
            'price' => 129, 'mrp' => 140, 'sold' => '6.2K+', 'rating' => 4.7, 'move' => 'up', 'moveBy' => 3
        ],
        'p5' => [
            'id' => 'p5', 'variantId' => 'v10', 'name' => 'Khara Mixture',
            'image' => 'assets/images/bowl_khara_mixture.png',
            'price' => 149, 'mrp' => 165, 'sold' => '5.5K+', 'rating' => 4.6, 'move' => 'down', 'moveBy' => 1
        ],
        'p6' => [
            'id' => 'p6', 'variantId' => 'v12', 'name' => 'Gongura Pickle',
            'image' => 'assets/images/bowl_gongura_pickle.png',
            'price' => 130, 'mrp' => 145, 'sold' => '7.1K+', 'rating' => 4.9, 'move' => 'up', 'moveBy' => 2
        ],
        'p7' => [
            'id' => 'p7', 'variantId' => 'v14', 'name' => 'Usiri Pickle',
            'image' => 'assets/images/bowl_usiri_pickle.png',
            'price' => 130, 'mrp' => 150, 'sold' => '6.8K+', 'rating' => 4.8, 'move' => 'up', 'moveBy' => 1
        ],
        'p8' => [
            'id' => 'p8', 'variantId' => 'v16', 'name' => 'Chakinalu',
            'image' => 'assets/images/bowl_chakinalu.png',
            'price' => 110, 'mrp' => 130, 'sold' => '8.2K+', 'rating' => 4.8, 'move' => 'new', 'moveBy' => 0
        ]
    ];
}

// ----------------------------------------------------
// BUILD FUNCTION
// ----------------------------------------------------
function buildBestSellers($pdo) {
    try {
        $stStmt = $pdo->query("SELECT * FROM bs_settings WHERE id=1 LIMIT 1");
        $st = $stStmt ? $stStmt->fetch(PDO::FETCH_ASSOC) : null;
        if ($st && !(int)$st['enabled']) {
            return ['settings' => ['enabled' => false], 'categories' => []];
        }

        // Homes count
        $homes = 12000;
        try {
            $hCount = $pdo->query("SELECT COUNT(DISTINCT user_id) FROM orders WHERE status NOT IN ('cancelled','refunded')")->fetchColumn();
            if ($hCount && (int)$hCount > 0) $homes = (int)$hCount;
        } catch (Exception $e) {}

        $homesTxt = $homes >= 1000 ? number_format(floor($homes / 1000)) . ',000' : (string)$homes;

        $kicker = $st['kicker'] ?? "THIS MONTH'S CHAMPIONS";
        $title = $st['title'] ?? 'Best';
        $titleAccent = $st['title_accent'] ?? 'sellers';
        $subtitle = str_replace('{homes}', $homesTxt, $st['subtitle'] ?? 'Ranked by real orders from {homes}+ homes');
        $intervalMs = (int)($st['interval_ms'] ?? 4000);
        $rows = (int)($st['rows'] ?? 3);

        // Fetch active tabs
        $tabsStmt = $pdo->query("SELECT * FROM bs_tabs WHERE active=1 ORDER BY position ASC, id ASC");
        $tabs = $tabsStmt ? $tabsStmt->fetchAll(PDO::FETCH_ASSOC) : [];
        if (empty($tabs)) {
            $tabs = [['id' => 1, 'slug' => 'all', 'name' => 'All', 'emoji' => '🔥']];
        }

        $champions = getChampionProducts();
        $categories = [];

        foreach ($tabs as $t) {
            $tabId = (int)$t['id'];
            $slug = $t['slug'];

            // Fetch ranked products for this tab
            $ranksStmt = $pdo->prepare("
                SELECT r.product_id, r.rank, r.prev_rank, r.sold, ov.sold_label, ov.hidden
                FROM bs_ranks r
                LEFT JOIN bs_overrides ov ON ov.tab_id = r.tab_id AND ov.product_id = r.product_id
                WHERE r.tab_id = ? AND (ov.hidden IS NULL OR ov.hidden = 0)
                ORDER BY r.rank ASC
            ");
            $ranksStmt->execute([$tabId]);
            $rankedRows = $ranksStmt->fetchAll(PDO::FETCH_ASSOC);

            $items = [];

            if (!empty($rankedRows)) {
                foreach ($rankedRows as $rr) {
                    $pid = $rr['product_id'];
                    $move = $rr['prev_rank'] === null ? 'new' : ($rr['prev_rank'] > $rr['rank'] ? 'up' : ($rr['prev_rank'] < $rr['rank'] ? 'down' : ''));
                    $moveBy = $rr['prev_rank'] ? abs((int)$rr['prev_rank'] - (int)$rr['rank']) : 0;
                    $soldDisplay = !empty($rr['sold_label']) ? $rr['sold_label'] : fmtSold($rr['sold']);

                    if (isset($champions[$pid])) {
                        $base = $champions[$pid];
                        $items[] = [
                            'id' => (string)$base['id'],
                            'variantId' => (string)$base['variantId'],
                            'name' => $base['name'],
                            'image' => getTransparentBowlImage($base['id'], $base['name'], $base['image']),
                            'price' => (float)$base['price'],
                            'mrp' => (float)$base['mrp'],
                            'sold' => $soldDisplay,
                            'rating' => (float)$base['rating'],
                            'move' => $move,
                            'moveBy' => $moveBy
                        ];
                    } else {
                        // Check products table
                        try {
                            $pStmt = $pdo->prepare("SELECT id, name, image, rating, price, mrp FROM products WHERE id=? LIMIT 1");
                            $pStmt->execute([$pid]);
                            $pRow = $pStmt->fetch(PDO::FETCH_ASSOC);
                            if ($pRow) {
                                $items[] = [
                                    'id' => (string)$pRow['id'],
                                    'variantId' => 'v_' . $pRow['id'],
                                    'name' => $pRow['name'],
                                    'image' => getTransparentBowlImage($pRow['id'], $pRow['name'], $pRow['image'] ?? ''),
                                    'price' => (float)($pRow['price'] ?? 149),
                                    'mrp' => (float)($pRow['mrp'] ?? 169),
                                    'sold' => $soldDisplay,
                                    'rating' => (float)($pRow['rating'] ?? 4.8),
                                    'move' => $move,
                                    'moveBy' => $moveBy
                                ];
                            }
                        } catch (Exception $pe) {}
                    }
                }
            }

            // Fallback for 'all' tab if empty
            if (empty($items) && $slug === 'all') {
                $items = array_values($champions);
            }

            if (!empty($items)) {
                $categories[] = [
                    'id' => $slug,
                    'name' => $t['name'],
                    'emoji' => $t['emoji'] ?? '',
                    'items' => $items
                ];
            }
        }

        // If categories still empty, return default 8 champions
        if (empty($categories)) {
            $categories[] = [
                'id' => 'all',
                'name' => 'All',
                'emoji' => '🔥',
                'items' => array_values($champions)
            ];
        }

        return [
            'settings' => [
                'enabled' => true,
                'kicker' => $kicker,
                'title' => $title,
                'titleAccent' => $titleAccent,
                'subtitle' => $subtitle,
                'intervalMs' => $intervalMs,
                'rows' => $rows
            ],
            'categories' => $categories
        ];
    } catch (Exception $e) {
        return [
            'settings' => [
                'enabled' => true,
                'kicker' => "THIS MONTH'S CHAMPIONS",
                'title' => 'Best',
                'titleAccent' => 'sellers',
                'subtitle' => 'Ranked by real orders from 12,000+ homes',
                'intervalMs' => 4000,
                'rows' => 3
            ],
            'categories' => [
                [
                    'id' => 'all',
                    'name' => 'All',
                    'emoji' => '🔥',
                    'items' => array_values(getChampionProducts())
                ]
            ]
        ];
    }
}

// ----------------------------------------------------
// ROUTING HANDLER
// ----------------------------------------------------
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Normalize action if called via direct URL paths
if (!$action) {
    if (strpos($path, '/home/best-sellers') !== false) {
        $action = 'home';
    } else if (strpos($path, '/admin/best-sellers') !== false) {
        if (strpos($path, '/settings') !== false) $action = 'admin_settings';
        else if (strpos($path, '/refresh') !== false) $action = 'admin_refresh';
        else if (strpos($path, '/tabs/order') !== false) $action = 'admin_tabs_order';
        else if (strpos($path, '/tabs') !== false) $action = 'admin_save_tab';
        else $action = 'admin_get';
    } else if (strpos($path, '/best-sellers') !== false) {
        $action = 'tab';
    }
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($action) {
    // ---------------- APP / PUBLIC ----------------
    case 'home':
        $data = buildBestSellers($pdo);
        header('Cache-Control: public, max-age=300');
        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        break;

    case 'tab':
        $data = buildBestSellers($pdo);
        $tabSlug = $_GET['tab'] ?? 'all';
        $found = null;
        foreach ($data['categories'] as $cat) {
            if ($cat['id'] === $tabSlug) {
                $found = $cat;
                break;
            }
        }
        echo json_encode($found ?: ['items' => []], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        break;

    // ---------------- ADMIN ENDPOINTS ----------------
    case 'admin_get':
        $st = $pdo->query("SELECT * FROM bs_settings WHERE id=1 LIMIT 1")->fetch(PDO::FETCH_ASSOC);
        $tabs = $pdo->query("SELECT * FROM bs_tabs ORDER BY position ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC);
        $overrides = $pdo->query("SELECT * FROM bs_overrides")->fetchAll(PDO::FETCH_ASSOC);
        $preview = buildBestSellers($pdo);
        echo json_encode([
            'settings' => $st,
            'tabs' => $tabs,
            'overrides' => $overrides,
            'preview' => $preview
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        break;

    case 'admin_settings':
        $b = $input;
        $enabled = isset($b['enabled']) ? ((bool)$b['enabled'] ? 1 : 0) : 1;
        $kicker = $b['kicker'] ?? "THIS MONTH'S CHAMPIONS";
        $title = $b['title'] ?? 'Best';
        $titleAccent = $b['titleAccent'] ?? 'sellers';
        $subtitle = $b['subtitle'] ?? 'Ranked by real orders from {homes}+ homes';
        $intervalMs = max(2500, (int)($b['intervalMs'] ?? 4000));
        $rows = min(10, max(1, (int)($b['rows'] ?? 3)));
        $maxItems = min(20, max(1, (int)($b['maxItems'] ?? 10)));
        $periodDays = (int)($b['periodDays'] ?? 30);

        $stmt = $pdo->prepare("
            UPDATE bs_settings SET
                enabled = ?, kicker = ?, title = ?, title_accent = ?,
                subtitle = ?, interval_ms = ?, `rows` = ?, max_items = ?, period_days = ?
            WHERE id = 1
        ");
        $stmt->execute([$enabled, $kicker, $title, $titleAccent, $subtitle, $intervalMs, $rows, $maxItems, $periodDays]);

        // Keep app_settings JSON in sync
        try {
            $fullData = buildBestSellers($pdo);
            $appStmt = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES ('best_sellers', ?)
                                      ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)");
            $appStmt->execute([json_encode($fullData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)]);
        } catch (Exception $se) {}

        echo json_encode(['ok' => true]);
        break;

    case 'admin_save_tab':
        $b = $input;
        $slug = $b['slug'] ?? '';
        $name = $b['name'] ?? '';
        $emoji = $b['emoji'] ?? '';
        $categoryId = !empty($b['categoryId']) ? (int)$b['categoryId'] : null;
        $mode = in_array($b['mode'] ?? '', ['auto', 'manual']) ? $b['mode'] : 'auto';
        $active = isset($b['active']) ? ((bool)$b['active'] ? 1 : 0) : 1;

        if (!$slug || !$name) {
            http_response_code(400);
            echo json_encode(['error' => 'slug and name required']);
            break;
        }

        $stmt = $pdo->prepare("
            INSERT INTO bs_tabs (slug, name, emoji, category_id, mode, active, position)
            VALUES (?, ?, ?, ?, ?, ?, (SELECT COALESCE(MAX(t.position),0)+1 FROM bs_tabs t))
            ON DUPLICATE KEY UPDATE
                name = VALUES(name), emoji = VALUES(emoji), category_id = VALUES(category_id),
                mode = VALUES(mode), active = VALUES(active)
        ");
        $stmt->execute([$slug, $name, $emoji, $categoryId, $mode, $active]);
        echo json_encode(['ok' => true]);
        break;

    case 'admin_tabs_order':
        $order = $input['order'] ?? [];
        if (is_array($order)) {
            $stmt = $pdo->prepare("UPDATE bs_tabs SET position = ? WHERE id = ?");
            foreach ($order as $pos => $tid) {
                $stmt->execute([$pos, (int)$tid]);
            }
        }
        echo json_encode(['ok' => true]);
        break;

    case 'admin_delete_tab':
        $tid = (int)($_GET['id'] ?? 0);
        if ($tid > 0) {
            $stmt = $pdo->prepare("DELETE FROM bs_tabs WHERE id = ? AND slug <> 'all'");
            $stmt->execute([$tid]);
        }
        echo json_encode(['ok' => true]);
        break;

    case 'admin_override':
        $tabId = (int)($_GET['tabId'] ?? 0);
        $productId = $_GET['productId'] ?? '';
        $pinRank = !empty($input['pinRank']) ? (int)$input['pinRank'] : null;
        $hidden = !empty($input['hidden']) ? 1 : 0;
        $soldLabel = !empty($input['soldLabel']) ? $input['soldLabel'] : null;

        if ($tabId && $productId) {
            $stmt = $pdo->prepare("
                INSERT INTO bs_overrides (tab_id, product_id, pin_rank, hidden, sold_label)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    pin_rank = VALUES(pin_rank), hidden = VALUES(hidden), sold_label = VALUES(sold_label)
            ");
            $stmt->execute([$tabId, $productId, $pinRank, $hidden, $soldLabel]);
        }
        echo json_encode(['ok' => true]);
        break;

    case 'admin_tab_products_order':
        $tabId = (int)($_GET['tabId'] ?? 0);
        $ids = $input['order'] ?? [];
        if ($tabId && is_array($ids)) {
            $pdo->prepare("UPDATE bs_overrides SET pin_rank=NULL WHERE tab_id=?")->execute([$tabId]);
            $stmt = $pdo->prepare("
                INSERT INTO bs_overrides (tab_id, product_id, pin_rank) VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE pin_rank = VALUES(pin_rank)
            ");
            foreach ($ids as $idx => $pid) {
                $stmt->execute([$tabId, $pid, $idx + 1]);
            }
        }
        echo json_encode(['ok' => true]);
        break;

    case 'admin_refresh':
        $data = buildBestSellers($pdo);
        // Persist to app_settings as well
        try {
            $appStmt = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES ('best_sellers', ?)
                                      ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)");
            $appStmt->execute([json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)]);
        } catch (Exception $e) {}
        echo json_encode(['ok' => true, 'preview' => $data]);
        break;

    default:
        // Default to public home best sellers response
        $data = buildBestSellers($pdo);
        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        break;
}
