<?php
require_once 'db.php';

// This is a dedicated endpoint just for the Flutter app to get its own addresses
$user_id = $_GET['user_id'] ?? null;

if ($user_id) {
    $stmt = $pdo->prepare("SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} else {
    echo json_encode([]);
}
?>
