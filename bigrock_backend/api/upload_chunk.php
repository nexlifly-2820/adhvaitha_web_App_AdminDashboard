<?php
// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$fileName = $_POST['fileName'] ?? '';
$chunkIndex = $_POST['chunkIndex'] ?? 0;
$totalChunks = $_POST['totalChunks'] ?? 1;

if (empty($fileName) || !isset($_FILES['chunkData'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fileName or chunkData file']);
    exit();
}

// Security: basic filename sanitization
$fileName = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $fileName);
$fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

$allowedExtensions = ['mp4', 'webm', 'ogg', 'jpg', 'jpeg', 'png', 'gif', 'webp'];
if (!in_array($fileExtension, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file extension']);
    exit();
}

$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Temporary file for appending chunks
$tempFilePath = $uploadDir . $fileName . '.part';

// Append chunk file directly to the temp file
$chunkTmpFile = $_FILES['chunkData']['tmp_name'];
$chunkData = file_get_contents($chunkTmpFile);
file_put_contents($tempFilePath, $chunkData, FILE_APPEND);

// If this is the last chunk, finalize the file
if ($chunkIndex == $totalChunks - 1) {
    // Generate unique name for final file
    $finalFileName = uniqid() . '_' . time() . '.' . $fileExtension;
    $finalPath = $uploadDir . $finalFileName;
    
    rename($tempFilePath, $finalPath);
    
    // Return URL
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];
    $baseUrl = $protocol . "://" . $host . dirname($_SERVER['PHP_SELF']) . '/uploads/';
    
    echo json_encode([
        'success' => true,
        'url' => $baseUrl . $finalFileName,
        'message' => 'Upload complete'
    ]);
} else {
    echo json_encode([
        'success' => true,
        'message' => 'Chunk ' . $chunkIndex . ' received'
    ]);
}
?>
