<?php
header('Content-Type: application/json');
require_once 'db.php';

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
        
        // Cast boolean flags
        $p['isBestSeller'] = (bool)$p['is_bestseller'];
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
        unset($p['weight_price_json'], $p['trust_badges_json'], $p['ingredients_json'], $p['recipes_json'], $p['secret_ingredient_json'], $p['pairings_json'], $p['sommelier_pairings_json'], $p['is_bestseller'], $p['is_out_of_stock'], $p['is_veg'], $p['stock'], $p['image_url']);
        
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

    // Build the query
    $sql = "INSERT INTO app_products (
                id, name, description, price, stock, image_url, category, is_active,
                subCategory, rating, is_bestseller, is_out_of_stock, is_veg, color, canRequestTempering,
                origin, preparationMethod, shelfLife, storageInstructions, servingSuggestion,
                artisanName, artisanDescription, viewCount, purchaseCount,
                weight_price_json, trust_badges_json, ingredients_json, recipes_json,
                secret_ingredient_json, pairings_json, sommelier_pairings_json
            ) 
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?
            ) 
            ON DUPLICATE KEY UPDATE 
                name=VALUES(name), description=VALUES(description), price=VALUES(price), stock=VALUES(stock), 
                image_url=VALUES(image_url), category=VALUES(category), is_active=VALUES(is_active),
                subCategory=VALUES(subCategory), rating=VALUES(rating), is_bestseller=VALUES(is_bestseller), 
                is_out_of_stock=VALUES(is_out_of_stock), is_veg=VALUES(is_veg), color=VALUES(color), 
                canRequestTempering=VALUES(canRequestTempering), origin=VALUES(origin), 
                preparationMethod=VALUES(preparationMethod), shelfLife=VALUES(shelfLife), 
                storageInstructions=VALUES(storageInstructions), servingSuggestion=VALUES(servingSuggestion),
                artisanName=VALUES(artisanName), artisanDescription=VALUES(artisanDescription), 
                viewCount=VALUES(viewCount), purchaseCount=VALUES(purchaseCount),
                weight_price_json=VALUES(weight_price_json), trust_badges_json=VALUES(trust_badges_json), 
                ingredients_json=VALUES(ingredients_json), recipes_json=VALUES(recipes_json),
                secret_ingredient_json=VALUES(secret_ingredient_json), pairings_json=VALUES(pairings_json), 
                sommelier_pairings_json=VALUES(sommelier_pairings_json)";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id, $name, $description, $price, $stock, $image_url, $category, $is_active,
        $subCategory, $rating, $is_bestseller, $is_out_of_stock, $is_veg, $color, $canRequestTempering,
        $origin, $preparationMethod, $shelfLife, $storageInstructions, $servingSuggestion,
        $artisanName, $artisanDescription, $viewCount, $purchaseCount,
        $weight_price_json, $trust_badges_json, $ingredients_json, $recipes_json,
        $secret_ingredient_json, $pairings_json, $sommelier_pairings_json
    ]);

    echo json_encode(["success" => true, "message" => "Product saved successfully", "id" => $id]);
    exit();
}
?>
