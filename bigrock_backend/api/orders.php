<?php
require_once 'db.php';

// Handle GET request: Fetch orders for Admin Dashboard (all) or Customer App (by user_id)
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    
    if ($user_id) {
        // Fetch orders for a specific user (Customer App)
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);
    } else {
        // Fetch ALL orders (Admin Dashboard)
        $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
    }
    
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Fetch and attach the items for each order
    foreach ($orders as &$order) {
        $itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $itemStmt->execute([$order['order_id']]);
        $order['items'] = $itemStmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    echo json_encode($orders);
    exit();
}

// Handle POST request: Place a new order
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $order_id = $data['order_id'] ?? uniqid('ORD_');
    
    try {
        // Start database transaction (Ensures both order and items are saved together)
        $pdo->beginTransaction();
        
        // 1. Insert into orders table
        $sql = "INSERT INTO orders (order_id, user_id, subtotal, delivery_fee, packing_fee, gst_amount, discount_amount, total, shipping_address, city, state, pincode, payment_method, payment_id, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $order_id,
            $data['user_id'],
            $data['subtotal'] ?? 0,
            $data['delivery_fee'] ?? 0,
            $data['packing_fee'] ?? 0,
            $data['gst_amount'] ?? 0,
            $data['discount_amount'] ?? 0,
            $data['total'] ?? 0,
            $data['shipping_address'] ?? '',
            $data['city'] ?? '',
            $data['state'] ?? '',
            $data['pincode'] ?? '',
            $data['payment_method'] ?? 'COD',
            $data['payment_id'] ?? null,
            $data['status'] ?? 'Placed'
        ]);
        
        // 2. Insert into order_items table
        if (isset($data['items']) && is_array($data['items'])) {
            $itemSql = "INSERT INTO order_items (order_id, product_name, quantity, weight, price, tempering, chef_note) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $itemStmt = $pdo->prepare($itemSql);
            
            foreach ($data['items'] as $item) {
                $itemStmt->execute([
                    $order_id,
                    $item['product_name'],
                    $item['quantity'] ?? 1,
                    $item['weight'] ?? '',
                    $item['price'] ?? 0,
                    $item['tempering'] ?? null,
                    $item['chef_note'] ?? null
                ]);
            }
        }
        
        // Commit the transaction
        $pdo->commit();
        echo json_encode(["success" => true, "message" => "Order placed successfully", "order_id" => $order_id]);
        
    } catch (Exception $e) {
        $pdo->rollBack(); // If something fails, undo the whole order
        http_response_code(500);
        echo json_encode(["error" => "Failed to place order: " . $e->getMessage()]);
    }
    exit();
}
?>
