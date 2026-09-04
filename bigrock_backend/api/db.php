<?php
// CORS Headers (This allows your Vercel Dashboard and Flutter app to talk to BigRock safely)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Database Credentials
$host = "localhost";
$dbname = "a177262b_adhvaitha_data";
$username = "a177262b_admin"; 
$password = "adhvaithafoods@2026"; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    // Set PDO to throw errors so we can catch them easily
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(["error" => "Database connection failed!"]));
}
?>
