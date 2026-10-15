<?php
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
require_once 'db.php';

// Auto-migrate database if ?setup=xxx is passed (any value)
if (isset($_GET['setup'])) {
    $columns = [
        'subCategory VARCHAR(255) DEFAULT NULL',
        'rating DECIMAL(3,1) DEFAULT 0',
        'is_bestseller TINYINT(1) DEFAULT 0',
        'is_most_loved TINYINT(1) DEFAULT 0',
        'is_fresh_pick TINYINT(1) DEFAULT 0',
        'is_out_of_stock TINYINT(1) DEFAULT 0',
        'is_veg TINYINT(1) DEFAULT 1',
        'color VARCHAR(20) DEFAULT NULL',
        'canRequestTempering TINYINT(1) DEFAULT 0',
        'origin VARCHAR(255) DEFAULT NULL',
        'preparationMethod TEXT DEFAULT NULL',
        'shelfLife VARCHAR(255) DEFAULT NULL',
        'storageInstructions TEXT DEFAULT NULL',
        'servingSuggestion TEXT DEFAULT NULL',
        'artisanName VARCHAR(255) DEFAULT NULL',
        'artisanDescription TEXT DEFAULT NULL',
        'viewCount INT DEFAULT 0',
        'purchaseCount INT DEFAULT 0',
        'weight_price_json TEXT DEFAULT NULL',
        'trust_badges_json TEXT DEFAULT NULL',
        'ingredients_json TEXT DEFAULT NULL',
        'recipes_json TEXT DEFAULT NULL',
        'secret_ingredient_json TEXT DEFAULT NULL',
        'pairings_json TEXT DEFAULT NULL',
        'sommelier_pairings_json TEXT DEFAULT NULL',
        'gallery_json TEXT DEFAULT NULL',
        'behind_the_jar_json TEXT DEFAULT NULL',
        'artisanImage VARCHAR(255) DEFAULT NULL',
        'story_image VARCHAR(512) DEFAULT NULL'
    ];
    
    try {
        foreach ($columns as $col) {
            try { 
                $pdo->exec("ALTER TABLE app_products ADD COLUMN $col"); 
            } catch(Exception $e) {
                // Column likely exists already, ignore
            }
        }
        
        echo json_encode(["success" => true, "message" => "Database schema columns successfully verified and updated!"]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
    exit();
}

// Handle GET request: Fetch all products for the app
if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    $stmt = $pdo->prepare("SELECT * FROM app_products ORDER BY id DESC");
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted = [];
    foreach ($products as $p) {
        // Decode JSON fields for Flutter App
        $p['weightPriceMap'] = json_decode($p['weight_price_json'], true) ?? [];
        $p['trustBadges'] = json_decode($p['trust_badges_json'], true) ?? [];
        $p['ingredients'] = json_decode($p['ingredients_json'], true) ?? [];
        $p['recipes'] = json_decode($p['recipes_json'], true) ?? [];
        $p['secretIngredient'] = json_decode($p['secret_ingredient_json'], true);
        $p['pairings'] = json_decode($p['pairings_json'], true) ?? [];
        $p['sommelierPairings'] = json_decode($p['sommelier_pairings_json'], true) ?? [];
        $p['gallery'] = json_decode($p['gallery_json'], true) ?? [];
        $p['behindTheJar'] = json_decode($p['behind_the_jar_json'] ?? 'null', true) ?? [];
        $p['storyImage'] = $p['story_image'] ?? '';
        
        // Cast boolean flags
        $p['isBestSeller'] = (bool)$p['is_bestseller'];
        $p['isMostLoved'] = (bool)$p['is_most_loved'];
        $p['isFreshPick'] = (bool)$p['is_fresh_pick'];
        $p['isOutOfStock'] = (bool)$p['is_out_of_stock'];
        $p['isVeg'] = (bool)$p['is_veg'];
        $p['canRequestTempering'] = (bool)($p['canRequestTempering'] ?? false);
        
        // Ensure numbers
        $p['rating'] = (float)($p['rating'] ?? 0);
        $p['stockCount'] = (int)($p['stock'] ?? 0);
        $p['viewCount'] = (int)($p['viewCount'] ?? 0);
        $p['purchaseCount'] = (int)($p['purchaseCount'] ?? 0);
        
        // Map legacy image_url to image
        $p['image'] = $p['image_url'] ?? '';

        // Remove raw database columns from response to match schema perfectly
        unset($p['weight_price_json'], $p['trust_badges_json'], $p['ingredients_json'], $p['recipes_json'], $p['secret_ingredient_json'], $p['pairings_json'], $p['sommelier_pairings_json'], $p['gallery_json'], $p['behind_the_jar_json'], $p['story_image'], $p['is_bestseller'], $p['is_most_loved'], $p['is_fresh_pick'], $p['is_out_of_stock'], $p['is_veg'], $p['stock'], $p['image_url']);
        
        $formatted[] = $p;
    }

    echo json_encode(['products' => $formatted]);
    exit();
}

// Handle POST request: Add a new product OR update an existing one (from Admin Dashboard)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Read the JSON data sent from Vercel Next.js Dashboard
    $data = json_decode(file_get_contents("php://input"), true);
    
    // If no ID is provided, create a new unique one
    $id = $data['id'] ?? uniqid('prod_');
    $name = $data['name'] ?? '';
    $description = $data['description'] ?? '';
    
    // Pricing & Inventory
    $price = $data['price'] ?? 0;
    $stock = $data['stockCount'] ?? 0;
    
    $image_url = $data['image'] ?? '';
    $category = $data['category'] ?? '';
    $subCategory = $data['subCategory'] ?? '';
    
    // Flags & Basic Stats
    $is_active = isset($data['is_active']) ? (int)$data['is_active'] : 1;
    $is_bestseller = isset($data['isBestSeller']) ? (int)$data['isBestSeller'] : 0;
    $is_most_loved = isset($data['isMostLoved']) ? (int)$data['isMostLoved'] : 0;
    $is_fresh_pick = isset($data['isFreshPick']) ? (int)$data['isFreshPick'] : 0;
    $is_out_of_stock = isset($data['isOutOfStock']) ? (int)$data['isOutOfStock'] : 0;
    $is_veg = isset($data['isVeg']) ? (int)$data['isVeg'] : 1;
    $canRequestTempering = isset($data['canRequestTempering']) ? (int)$data['canRequestTempering'] : 0;
    
    $color = $data['color'] ?? '0xFF18453B';
    $rating = $data['rating'] ?? 0.0;
    
    // Details
    $origin = $data['origin'] ?? '';
    $preparationMethod = $data['preparationMethod'] ?? '';
    $shelfLife = $data['shelfLife'] ?? '';
    $storageInstructions = $data['storageInstructions'] ?? '';
    $servingSuggestion = $data['servingSuggestion'] ?? '';
    $artisanName = $data['artisanName'] ?? '';
    $artisanDescription = $data['artisanDescription'] ?? '';
    $artisanImage = $data['artisanImage'] ?? '';
    $storyImage = $data['storyImage'] ?? '';
    
    $viewCount = $data['viewCount'] ?? 0;
    $purchaseCount = $data['purchaseCount'] ?? 0;

    // JSON Encoding for complex objects
    $weight_price_json = isset($data['weightPriceMap']) ? json_encode($data['weightPriceMap']) : null;
    $trust_badges_json = isset($data['trustBadges']) ? json_encode($data['trustBadges']) : null;
    $ingredients_json = isset($data['ingredients']) ? json_encode($data['ingredients']) : null;
    $recipes_json = isset($data['recipes']) ? json_encode($data['recipes']) : null;
    $secret_ingredient_json = isset($data['secretIngredient']) ? json_encode($data['secretIngredient']) : null;
    $pairings_json = isset($data['pairings']) ? json_encode($data['pairings']) : null;
    $sommelier_pairings_json = isset($data['sommelierPairings']) ? json_encode($data['sommelierPairings']) : null;
    $gallery_json = isset($data['gallery']) ? json_encode($data['gallery']) : null;
    $behind_the_jar_json = isset($data['behindTheJar']) ? json_encode($data['behindTheJar']) : null;

    // Build the query
    $sql = "INSERT INTO app_products (
                id, name, description, price, stock, image_url, category, is_active,
                subCategory, rating, is_bestseller, is_most_loved, is_fresh_pick, is_out_of_stock, is_veg, color, canRequestTempering,
                origin, preparationMethod, shelfLife, storageInstructions, servingSuggestion,
                artisanName, artisanDescription, viewCount, purchaseCount,
                weight_price_json, trust_badges_json, ingredients_json, recipes_json,
                secret_ingredient_json, pairings_json, sommelier_pairings_json, gallery_json, behind_the_jar_json, artisanImage, story_image
            ) 
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?
            ) 
            ON DUPLICATE KEY UPDATE 
                name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), 
                image_url=VALUES(image_url), category=VALUES(category), is_active=VALUES(is_active),
                subCategory=VALUES(subCategory), rating=VALUES(rating), is_bestseller=VALUES(is_bestseller), 
                is_most_loved=VALUES(is_most_loved), is_fresh_pick=VALUES(is_fresh_pick),
                is_out_of_stock=VALUES(is_out_of_stock), is_veg=VALUES(is_veg), color=VALUES(color), 
                canRequestTempering=VALUES(canRequestTempering), origin=VALUES(origin), 
                preparationMethod=VALUES(preparationMethod), shelfLife=VALUES(shelfLife), 
                storageInstructions=VALUES(storageInstructions), servingSuggestion=VALUES(servingSuggestion),
                artisanName=VALUES(artisanName), artisanDescription=VALUES(artisanDescription), 
                viewCount=VALUES(viewCount), purchaseCount=VALUES(purchaseCount),
                weight_price_json=VALUES(weight_price_json), trust_badges_json=VALUES(trust_badges_json), 
                ingredients_json=VALUES(ingredients_json), recipes_json=VALUES(recipes_json),
                secret_ingredient_json=VALUES(secret_ingredient_json), pairings_json=VALUES(pairings_json), 
                sommelier_pairings_json=VALUES(sommelier_pairings_json), gallery_json=VALUES(gallery_json), 
                behind_the_jar_json=VALUES(behind_the_jar_json), artisanImage=VALUES(artisanImage), story_image=VALUES(story_image)";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id, $name, $description, $price, $stock, $image_url, $category, $is_active,
        $subCategory, $rating, $is_bestseller, $is_most_loved, $is_fresh_pick, $is_out_of_stock, $is_veg, $color, $canRequestTempering,
        $origin, $preparationMethod, $shelfLife, $storageInstructions, $servingSuggestion,
        $artisanName, $artisanDescription, $viewCount, $purchaseCount,
        $weight_price_json, $trust_badges_json, $ingredients_json, $recipes_json,
        $secret_ingredient_json, $pairings_json, $sommelier_pairings_json, $gallery_json, $behind_the_jar_json, $artisanImage, $storyImage
    ]);

    echo json_encode(["success" => true, "message" => "Product saved successfully", "id" => $id]);
    exit();
}
?>
