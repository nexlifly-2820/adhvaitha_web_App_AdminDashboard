<?php
require_once 'db_connect.php';

$stmt = $pdo->prepare("SELECT data_json FROM app_settings WHERE doc_id = 'homepage_web'");
$stmt->execute();
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if ($row) {
    $data = json_decode($row['data_json'], true);
    
    // Fix heroImages
    if (isset($data['heroImages']) && is_array($data['heroImages'])) {
        $data['heroImages'] = [
            '/images/hero-1-pickle.jpg',
            '/images/hero-2-powder.jpg',
            '/images/hero-3-laddu.jpg'
        ];
    }

    $new_json = json_encode($data);
    
    $updateStmt = $pdo->prepare("UPDATE app_settings SET data_json = ? WHERE doc_id = 'homepage_web'");
    if ($updateStmt->execute([$new_json])) {
        echo "Successfully updated homepage_web hero images in the database.\n";
    } else {
        echo "Failed to update database.\n";
    }
} else {
    echo "homepage_web document not found.\n";
}
?>
