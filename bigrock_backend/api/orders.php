<?php
require_once 'db.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Handle GET request: Fetch orders for Admin Dashboard (all) or Customer App (by user_id)
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user_id = $_GET['user_id'] ?? $_GET['userId'] ?? null;
    
    if ($user_id) {
        // Fetch orders for a specific user (Customer App)
        $stmt = $pdo->prepare("SELECT o.*, u.name AS customer_name, u.phone AS customer_phone, u.email AS customer_email 
                               FROM orders o 
                               LEFT JOIN users u ON (o.user_id = u.uid OR o.user_id = u.user_id) 
                               WHERE o.user_id = ? 
                               ORDER BY o.id DESC");
        $stmt->execute([$user_id]);
    } else {
        // Fetch ALL orders (Admin Dashboard)
        $stmt = $pdo->query("SELECT o.*, u.name AS customer_name, u.phone AS customer_phone, u.email AS customer_email 
                             FROM orders o 
                             LEFT JOIN users u ON (o.user_id = u.uid OR o.user_id = u.user_id) 
                             ORDER BY o.id DESC");
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

// Handle POST request: Place a new order OR update an existing order
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON payload"]);
        exit();
    }
    
    $order_id = $data['order_id'] ?? $data['orderId'] ?? $data['documentId'] ?? null;
    $status = $data['status'] ?? $data['orderStatus'] ?? null;
    $items = $data['items'] ?? $data['products'] ?? null;

    // Check if this is an UPDATE from the Admin Dashboard (order already exists or updating status)
    if ($order_id && (!isset($items) || !is_array($items))) {
        // Check if order exists in DB
        $chk = $pdo->prepare("SELECT id FROM orders WHERE order_id = ?");
        $chk->execute([$order_id]);
        if ($chk->fetch()) {
            $updates = [];
            $params = [];
            
            if ($status !== null) {
                $updates[] = "status = ?";
                $params[] = $status;
            }
            if (isset($data['payment_id']) || isset($data['paymentId'])) {
                $updates[] = "payment_id = ?";
                $params[] = $data['payment_id'] ?? $data['paymentId'];
            }
            if (isset($data['payment_method']) || isset($data['paymentMethod'])) {
                $updates[] = "payment_method = ?";
                $params[] = $data['payment_method'] ?? $data['paymentMethod'];
            }
            
            if (!empty($updates)) {
                $params[] = $order_id;
                $updateSql = "UPDATE orders SET " . implode(", ", $updates) . " WHERE order_id = ?";
                $updateStmt = $pdo->prepare($updateSql);
                $updateStmt->execute($params);
                echo json_encode(["success" => true, "message" => "Order updated successfully", "order_id" => $order_id]);
                exit();
            }
        }
    }
    
    // Otherwise, place a NEW order
    $order_id = $order_id ?? ('AMBJ' . date('Y') . rand(100, 999));
    $user_id = $data['user_id'] ?? $data['userId'] ?? $data['customer_id'] ?? 'guest';
    $subtotal = $data['subtotal'] ?? $data['subTotal'] ?? 0;
    $delivery_fee = $data['delivery_fee'] ?? $data['deliveryFee'] ?? 0;
    $packing_fee = $data['packing_fee'] ?? $data['packingFee'] ?? 0;
    $gst_amount = $data['gst_amount'] ?? $data['gstAmount'] ?? 0;
    $discount_amount = $data['discount_amount'] ?? $data['discountAmount'] ?? 0;
    $total = $data['total'] ?? $data['total_amount'] ?? $data['totalAmount'] ?? 0;
    
    // Support address strings or structured objects
    $shipping_address = $data['shipping_address'] ?? $data['shippingAddress'] ?? '';
    if (is_array($shipping_address)) {
        $shipping_address = implode(', ', array_filter($shipping_address));
    }
    
    $city = $data['city'] ?? $data['shippingInfo']['city'] ?? '';
    $state = $data['state'] ?? $data['shippingInfo']['state'] ?? '';
    $pincode = $data['pincode'] ?? $data['pinCode'] ?? $data['postalCode'] ?? $data['zip'] ?? '';
    $payment_method = $data['payment_method'] ?? $data['paymentMethod'] ?? 'COD';
    $payment_id = $data['payment_id'] ?? $data['paymentId'] ?? null;
    $status = $status ?? 'Placed';
    
    try {
        $pdo->beginTransaction();
        
        // 1. Insert into orders table
        $sql = "INSERT INTO orders (order_id, user_id, subtotal, delivery_fee, packing_fee, gst_amount, discount_amount, total, shipping_address, city, state, pincode, payment_method, payment_id, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE 
                    status = VALUES(status), 
                    payment_id = VALUES(payment_id), 
                    payment_method = VALUES(payment_method),
                    total = VALUES(total)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $order_id,
            $user_id,
            $subtotal,
            $delivery_fee,
            $packing_fee,
            $gst_amount,
            $discount_amount,
            $total,
            $shipping_address,
            $city,
            $state,
            $pincode,
            $payment_method,
            $payment_id,
            $status
        ]);
        
        // 2. Insert into order_items table
        if (isset($items) && is_array($items) && count($items) > 0) {
            $itemSql = "INSERT INTO order_items (order_id, product_name, quantity, weight, price, tempering, chef_note) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $itemStmt = $pdo->prepare($itemSql);
            
            foreach ($items as $item) {
                $itemStmt->execute([
                    $order_id,
                    $item['product_name'] ?? $item['name'] ?? $item['title'] ?? 'Product',
                    $item['quantity'] ?? $item['qty'] ?? 1,
                    $item['weight'] ?? $item['size'] ?? '',
                    $item['price'] ?? $item['unitPrice'] ?? 0,
                    $item['tempering'] ?? null,
                    $item['chef_note'] ?? null
                ]);
            }
        }
        
        $pdo->commit();
        echo json_encode(["success" => true, "message" => "Order placed successfully", "order_id" => $order_id]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => "Failed to place order: " . $e->getMessage()]);
    }
    exit();
}
?>
