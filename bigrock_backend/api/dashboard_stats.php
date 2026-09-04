<?php
require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = $pdo;

$response = [
    'totalRevenue' => 0,
    'totalOrderCount' => 0,
    'totalUserCount' => 0,
    'activeOrders' => 0,
    'salesData' => [],
    'productData' => [],
    'recentOrders' => []
];

try {
    // 1. Total Order Count and Total Revenue
    $stmt = $conn->prepare("SELECT COUNT(*) as count, SUM(total) as revenue FROM orders");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $response['totalOrderCount'] = (int)$row['count'];
    $response['totalRevenue'] = (int)$row['revenue'];

    // 2. Active Orders (Not delivered, cancelled, or rejected)
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM orders WHERE status NOT IN ('delivered', 'cancelled', 'rejected')");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $response['activeOrders'] = (int)$row['count'];

    // 3. Total Users Count (from users table or distinct users in orders)
    $stmt = $conn->prepare("SELECT COUNT(DISTINCT user_id) as count FROM orders");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $response['totalUserCount'] = (int)$row['count'];

    // 4. Monthly Revenue (Last 7 months)
    $monthlyRevenue = [];
    $monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize last 7 months with 0
    for ($i = 6; $i >= 0; $i--) {
        $timestamp = strtotime("-$i months");
        $label = $monthNames[(int)date('n', $timestamp) - 1] . " " . date('y', $timestamp);
        $monthlyRevenue[$label] = 0;
    }

    $stmt = $conn->prepare("SELECT created_at, total FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 MONTH)");
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($orders as $order) {
        $timestamp = strtotime($order['created_at']);
        $label = $monthNames[(int)date('n', $timestamp) - 1] . " " . date('y', $timestamp);
        if (isset($monthlyRevenue[$label])) {
            $monthlyRevenue[$label] += (float)$order['total'];
        }
    }

    foreach ($monthlyRevenue as $name => $total) {
        $response['salesData'][] = ['name' => $name, 'total' => round($total)];
    }

    // 5. Product Sales Data
    $stmt = $conn->prepare("SELECT product_name as name, quantity as qty FROM order_items");
    $stmt->execute();
    $allItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $productSales = [];
    foreach ($allItems as $item) {
        $name = $item['name'] ?? 'Unknown Product';
        $qty = (int)$item['qty'];
        if (!isset($productSales[$name])) {
            $productSales[$name] = 0;
        }
        $productSales[$name] += $qty;
    }

    arsort($productSales);
    $count = 0;
    foreach ($productSales as $name => $sales) {
        if ($count >= 5) break;
        $response['productData'][] = ['name' => $name, 'sales' => $sales];
        $count++;
    }

    // 6. Recent Orders (Top 5)
    $stmt = $conn->prepare("SELECT order_id as id, user_id, total, status, created_at as time FROM orders ORDER BY created_at DESC LIMIT 5");
    $stmt->execute();
    $recentOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($recentOrders as $order) {
        $customer = $order['user_id'];
        
        $response['recentOrders'][] = [
            'id' => $order['id'],
            'customer' => $customer,
            'total' => (float)$order['total'],
            'status' => $order['status'],
            'time' => date('n/j/Y, g:i:s A', strtotime($order['time']))
        ];
    }

    echo json_encode(['success' => true, 'data' => $response]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
