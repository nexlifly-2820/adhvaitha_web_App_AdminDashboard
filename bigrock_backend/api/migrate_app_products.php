<?php
require_once 'db.php';

echo "Starting migration for app_products table...<br>";

// List of columns to add
// Format: 'column_name' => 'COLUMN_TYPE'
$columns_to_add = [
    'subCategory' => 'VARCHAR(255) DEFAULT NULL',
    'rating' => 'DECIMAL(3,1) DEFAULT 0',
    'is_bestseller' => 'TINYINT(1) DEFAULT 0',
    'is_out_of_stock' => 'TINYINT(1) DEFAULT 0',
    'is_veg' => 'TINYINT(1) DEFAULT 1',
    'color' => 'VARCHAR(20) DEFAULT NULL',
    'canRequestTempering' => 'TINYINT(1) DEFAULT 0',
    'origin' => 'VARCHAR(255) DEFAULT NULL',
    'preparationMethod' => 'TEXT DEFAULT NULL',
    'shelfLife' => 'VARCHAR(255) DEFAULT NULL',
    'storageInstructions' => 'TEXT DEFAULT NULL',
    'servingSuggestion' => 'TEXT DEFAULT NULL',
    'artisanName' => 'VARCHAR(255) DEFAULT NULL',
    'artisanDescription' => 'TEXT DEFAULT NULL',
    'viewCount' => 'INT DEFAULT 0',
    'purchaseCount' => 'INT DEFAULT 0',
    
    // JSON Columns
    'weight_price_json' => 'TEXT DEFAULT NULL',
    'trust_badges_json' => 'TEXT DEFAULT NULL',
    'ingredients_json' => 'TEXT DEFAULT NULL',
    'recipes_json' => 'TEXT DEFAULT NULL',
    'secret_ingredient_json' => 'TEXT DEFAULT NULL',
    'pairings_json' => 'TEXT DEFAULT NULL',
    'sommelier_pairings_json' => 'TEXT DEFAULT NULL',
];

foreach ($columns_to_add as $column => $type) {
    try {
        $sql = "ALTER TABLE app_products ADD COLUMN $column $type";
        $pdo->exec($sql);
        echo "Successfully added column: $column <br>";
    } catch (PDOException $e) {
        // 1060 is "Duplicate column name", meaning it already exists
        if ($e->getCode() == '42S21' || strpos($e->getMessage(), '1060') !== false) {
            echo "Column already exists (skipping): $column <br>";
        } else {
            echo "Error adding column $column: " . $e->getMessage() . "<br>";
        }
    }
}

echo "Migration completed!<br>";
?>
