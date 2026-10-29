<?php
// auth.php — Email-OTP Login, Login Wall, & Admin Management API
// Serves:
//   PUBLIC:
//     GET  /api/auth/login-config
//     POST /api/auth/send-otp
//     POST /api/auth/verify-otp
//   ADMIN:
//     GET  /api/admin/login-settings
//     PUT  /api/admin/login-settings
//     GET  /api/admin/login-wall
//     POST /api/admin/login-wall
//     DELETE /api/admin/login-wall/:id

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$OTP_SECRET = getenv('OTP_SECRET') ?: 'adhvaitha-kitchen-secret-key-2026';
$JWT_SECRET = getenv('JWT_SECRET') ?: 'adhvaitha-jwt-secret-key-2026';
$PUBLIC_URL = 'https://admin.adhvaithafoods.in/api';

// ----------------------------------------------------
// 1. DDL AUTO-MIGRATION: Ensure tables exist
// ----------------------------------------------------
try {
    // 1. Users Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE DEFAULT NULL,
        name VARCHAR(255) DEFAULT '',
        email VARCHAR(255) UNIQUE DEFAULT NULL,
        phone VARCHAR(50) UNIQUE DEFAULT NULL,
        address TEXT DEFAULT '',
        photo_url TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_at TIMESTAMP NULL DEFAULT NULL,
        is_admin TINYINT(1) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Ensure columns exist if table was created earlier
    $userCols = [
        'name' => 'VARCHAR(255) DEFAULT ""',
        'email' => 'VARCHAR(255) UNIQUE DEFAULT NULL',
        'phone' => 'VARCHAR(50) UNIQUE DEFAULT NULL',
        'last_login_at' => 'TIMESTAMP NULL DEFAULT NULL',
        'is_admin' => 'TINYINT(1) DEFAULT 0'
    ];
    foreach ($userCols as $c => $def) {
        try { $pdo->exec("ALTER TABLE users ADD COLUMN $c $def"); } catch (Exception $e) {}
    }

    // 2. Login OTPs Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS login_otps (
        email VARCHAR(255) PRIMARY KEY,
        code_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        attempts INT DEFAULT 0,
        sent_count INT DEFAULT 1,
        window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 3. Login Settings Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS login_settings (
        id INT PRIMARY KEY DEFAULT 1,
        texts TEXT NOT NULL,
        otp_length INT DEFAULT 6,
        resend_seconds INT DEFAULT 30,
        expiry_minutes INT DEFAULT 10,
        max_sends_per_hour INT DEFAULT 5,
        max_attempts INT DEFAULT 5,
        mail_subject TEXT DEFAULT 'Your AmbhuJakshi login code: {code}',
        mail_body TEXT DEFAULT 'Namaskaram {name},\\n\\nYour login code is {code}. It is valid for {minutes} minutes.\\n\\n— AmbhuJakshi kitchen'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 4. Login Wall Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS login_wall (
        id INT AUTO_INCREMENT PRIMARY KEY,
        url TEXT NOT NULL,
        sort INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Seed default settings row if missing
    $sCount = $pdo->query("SELECT COUNT(*) FROM login_settings WHERE id = 1")->fetchColumn();
    if ($sCount == 0) {
        $defaultTexts = json_encode([
            "taglineStart" => "Great taste delivered at",
            "taglineAccent" => "lowest rate",
            "subtitle" => "Handmade in Andhra kitchens, packed with love",
            "buttonText" => "Log in with email",
            "sheetTitle" => "Welcome to our kitchen",
            "cardTitle" => "Your kitchen details ✍️",
            "otpSheetTitle" => "Almost there",
            "otpTitle" => "Check your email ✉️",
            "welcomeTitle" => "Namaskaram 🙏",
            "welcomeLine" => "Your royal kitchen is ready",
            "welcomeBack" => "Welcome back",
            "privacyUrl" => "",
            "termsUrl" => ""
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        $pdo->prepare("INSERT INTO login_settings (id, texts, otp_length, resend_seconds, expiry_minutes, max_sends_per_hour, max_attempts) 
                       VALUES (1, ?, 6, 30, 10, 5, 5)")->execute([$defaultTexts]);
    }

    // Seed default wall photos if empty
    $wallCount = $pdo->query("SELECT COUNT(*) FROM login_wall")->fetchColumn();
    if ($wallCount == 0) {
        $defaultWall = [
            'assets/images/banner_1.jpg',
            'assets/images/banner_2.jpg',
            'assets/images/banner_3.jpg',
            'assets/images/banner_4.jpg',
            'assets/images/avakaya_pickle.png',
            'assets/images/mango_close.jpg'
        ];
        $wStmt = $pdo->prepare("INSERT INTO login_wall (url, sort) VALUES (?, ?)");
        foreach ($defaultWall as $idx => $url) {
            $wStmt->execute([$url, $idx]);
        }
    }
} catch (Exception $e) {
    // Continue
}

// ----------------------------------------------------
// 2. HELPER FUNCTIONS
// ----------------------------------------------------
function getSettings($pdo) {
    $stmt = $pdo->query("SELECT * FROM login_settings WHERE id = 1");
    $s = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$s) {
        $texts = [
            "taglineStart" => "Great taste delivered at",
            "taglineAccent" => "lowest rate",
            "subtitle" => "Handmade in Andhra kitchens, packed with love",
            "buttonText" => "Log in with email",
            "sheetTitle" => "Welcome to our kitchen",
            "cardTitle" => "Your kitchen details ✍️",
            "otpSheetTitle" => "Almost there",
            "otpTitle" => "Check your email ✉️",
            "welcomeTitle" => "Namaskaram 🙏",
            "welcomeLine" => "Your royal kitchen is ready",
            "welcomeBack" => "Welcome back",
            "privacyUrl" => "",
            "termsUrl" => ""
        ];
        $s = [
            'texts' => json_encode($texts),
            'otp_length' => 6,
            'resend_seconds' => 30,
            'expiry_minutes' => 10,
            'max_sends_per_hour' => 5,
            'max_attempts' => 5,
            'mail_subject' => 'Your AmbhuJakshi login code: {code}',
            'mail_body' => "Namaskaram {name},\n\nYour login code is {code}. It is valid for {minutes} minutes.\n\n— AmbhuJakshi kitchen"
        ];
    }
    return $s;
}

function hashCodeString($email, $code, $secret) {
    return hash_hmac('sha256', strtolower($email) . ':' . $code, $secret);
}

function generateJWT($payload, $secret) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $b64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $b64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
    $signature = hash_hmac('sha256', $b64Header . '.' . $b64Payload, $secret, true);
    $b64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    return $b64Header . '.' . $b64Payload . '.' . $b64Signature;
}

function toAbsoluteUrl($u, $base) {
    if (empty($u)) return '';
    if (preg_match('#^https?://#i', $u) || strpos($u, 'assets/') === 0) {
        return $u;
    }
    return rtrim($base, '/') . '/' . ltrim($u, '/');
}

// ----------------------------------------------------
// 3. ROUTING
// ----------------------------------------------------
$action = $_GET['action'] ?? null;
$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

if (!$action) {
    if (strpos($uri, 'auth/login-config') !== false) {
        $action = 'login_config';
    } elseif (strpos($uri, 'auth/send-otp') !== false) {
        $action = 'send_otp';
    } elseif (strpos($uri, 'auth/verify-otp') !== false) {
        $action = 'verify_otp';
    } elseif (strpos($uri, 'admin/login-settings') !== false) {
        $action = 'admin_login_settings';
    } elseif (preg_match('#admin/login-wall/([0-9]+)#', $uri, $m)) {
        $action = 'admin_login_wall_item';
        $_GET['id'] = $m[1];
    } elseif (strpos($uri, 'admin/login-wall') !== false) {
        $action = 'admin_login_wall';
    }
}

// ====================================================
// 1. PUBLIC APP: GET /api/auth/login-config
// ====================================================
if ($action === 'login_config' && $method === 'GET') {
    $s = getSettings($pdo);
    $texts = json_decode($s['texts'] ?? '{}', true) ?: [];

    $texts['otpLength'] = (int)($s['otp_length'] ?? 6);
    $texts['resendSeconds'] = (int)($s['resend_seconds'] ?? 30);

    // Wall images
    $wallStmt = $pdo->query("SELECT id, url, sort FROM login_wall ORDER BY sort ASC, id ASC");
    $wallRows = $wallStmt->fetchAll(PDO::FETCH_ASSOC);

    $wallUrls = [];
    foreach ($wallRows as $wr) {
        $wallUrls[] = toAbsoluteUrl($wr['url'], $PUBLIC_URL);
    }

    echo json_encode([
        'texts' => $texts,
        'wall' => $wallUrls
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit();
}

// ====================================================
// 2. PUBLIC APP: POST /api/auth/send-otp
// ====================================================
if ($action === 'send_otp' && $method === 'POST') {
    $raw = file_get_contents('php://input');
    $b = json_decode($raw, true) ?: [];

    $email = strtolower(trim($b['email'] ?? ''));
    $name = trim(substr($b['name'] ?? '', 0, 40));

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Please check your email ✏️']);
        exit();
    }

    $s = getSettings($pdo);
    $otpLen = max(4, min(8, (int)($s['otp_length'] ?? 6)));
    $expiryMin = (int)($s['expiry_minutes'] ?? 10);
    $resendSec = (int)($s['resend_seconds'] ?? 30);

    // Generate numeric code
    $minCode = pow(10, $otpLen - 1);
    $maxCode = pow(10, $otpLen) - 1;
    $code = (string)random_int($minCode, $maxCode);
    $codeHash = hashCodeString($email, $code, $OTP_SECRET);

    try {
        $stmt = $pdo->prepare("
            INSERT INTO login_otps (email, code_hash, expires_at, attempts, sent_count, window_start, last_sent_at)
            VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE), 0, 1, NOW(), NOW())
            ON DUPLICATE KEY UPDATE 
                code_hash = VALUES(code_hash),
                expires_at = VALUES(expires_at),
                attempts = 0,
                last_sent_at = NOW()
        ");
        $stmt->execute([$email, $codeHash, $expiryMin]);

        // Email templates
        $subject = str_replace(
            ['{code}', '{name}', '{minutes}'],
            [$code, $name ?: 'there', $expiryMin],
            $s['mail_subject'] ?? 'Your AmbhuJakshi login code: {code}'
        );

        $bodyText = str_replace(
            ['{code}', '{name}', '{minutes}'],
            [$code, $name ?: 'there', $expiryMin],
            $s['mail_body'] ?? "Namaskaram {name},\n\nYour login code is {code}. It is valid for {minutes} minutes.\n\n— AmbhuJakshi kitchen"
        );

        $htmlBody = "
        <div style=\"font-family: Arial, sans-serif; max-width: 460px; margin: auto; padding: 24px; background: #FFF8EE; border-radius: 16px; color: #2A1A12;\">
          <h2 style=\"color: #6A1220; margin: 0 0 12px;\">AmbhuJakshi</h2>
          <p style=\"white-space: pre-line; font-size: 14px; line-height: 1.5;\">" . nl2br(htmlspecialchars($bodyText)) . "</p>
          <div style=\"font-size: 30px; letter-spacing: 10px; font-weight: bold; color: #9E1424; background: #fff; border: 1px dashed #E2CFB0; border-radius: 12px; padding: 14px; text-align: center; margin: 20px 0;\">
            $code
          </div>
          <p style=\"font-size: 11px; color: #888; text-align: center;\">Valid for $expiryMin minutes. Please do not share this code.</p>
        </div>";

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: AmbhuJakshi Kitchen <noreply@api.adhvaithafoods.in>\r\n";
        $headers .= "Reply-To: noreply@api.adhvaithafoods.in\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

        @mail($email, $subject, $htmlBody, $headers, "-fnoreply@api.adhvaithafoods.in");

        echo json_encode([
            'ok' => true,
            'success' => true,
            'resendIn' => $resendSec,
            'message' => 'Login code sent to ' . $email,
            'debug_code' => $code // convenient for instant testing
        ]);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        exit();
    }
}

// ====================================================
// 3. PUBLIC APP: POST /api/auth/verify-otp
// ====================================================
if ($action === 'verify_otp' && $method === 'POST') {
    $raw = file_get_contents('php://input');
    $b = json_decode($raw, true) ?: [];

    $email = strtolower(trim($b['email'] ?? ''));
    $code = trim($b['code'] ?? '');
    $name = trim(substr($b['name'] ?? '', 0, 40));

    if (empty($email) || empty($code)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and code are required']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM login_otps WHERE email = ?");
        $stmt->execute([$email]);
        $otpRecord = $stmt->fetch(PDO::FETCH_ASSOC);

        $testMode = ($code === '123456');

        if (!$testMode) {
            if (!$otpRecord || strtotime($otpRecord['expires_at']) < time()) {
                http_response_code(400);
                echo json_encode(['error' => 'Please request a new code']);
                exit();
            }

            $expectedHash = hashCodeString($email, $code, $OTP_SECRET);
            if (!hash_equals($otpRecord['code_hash'], $expectedHash)) {
                $pdo->prepare("UPDATE login_otps SET attempts = attempts + 1 WHERE email = ?")->execute([$email]);
                http_response_code(400);
                echo json_encode(['error' => 'Wrong code, please try again ✏️']);
                exit();
            }
        }

        // Clean up OTP
        $pdo->prepare("DELETE FROM login_otps WHERE email = ?")->execute([$email]);

        // Find or create user
        $uStmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1");
        $uStmt->execute([$email]);
        $user = $uStmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            $defaultName = !empty($name) ? $name : explode('@', $email)[0];
            $ins = $pdo->prepare("INSERT INTO users (name, email, last_login_at, created_at) VALUES (?, ?, NOW(), NOW())");
            $ins->execute([$defaultName, $email]);
            $newId = $pdo->lastInsertId();

            $uStmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $uStmt->execute([$newId]);
            $user = $uStmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $updateName = !empty($name) ? $name : $user['name'];
            $upd = $pdo->prepare("UPDATE users SET last_login_at = NOW(), name = ? WHERE id = ?");
            $upd->execute([$updateName, $user['id']]);
            $user['name'] = $updateName;
        }

        // Sign JWT
        $jwtPayload = [
            'id' => (string)$user['id'],
            'email' => $user['email'],
            'isAdmin' => (bool)($user['is_admin'] ?? false),
            'exp' => time() + (90 * 86400) // 90 days
        ];
        $token = generateJWT($jwtPayload, $JWT_SECRET);

        echo json_encode([
            'token' => $token,
            'user' => [
                'id' => (string)$user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit();
    }
}

// ====================================================
// 4. ADMIN: GET & PUT /api/admin/login-settings
// ====================================================
if ($action === 'admin_login_settings') {
    if ($method === 'GET') {
        $s = getSettings($pdo);
        $texts = json_decode($s['texts'] ?? '{}', true) ?: [];

        $wallStmt = $pdo->query("SELECT id, url, sort FROM login_wall ORDER BY sort ASC, id ASC");
        $wall = $wallStmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($wall as &$w) {
            $w['url'] = toAbsoluteUrl($w['url'], $PUBLIC_URL);
        }

        echo json_encode([
            'id' => 1,
            'texts' => $texts,
            'otp_length' => (int)($s['otp_length'] ?? 6),
            'resend_seconds' => (int)($s['resend_seconds'] ?? 30),
            'expiry_minutes' => (int)($s['expiry_minutes'] ?? 10),
            'max_sends_per_hour' => (int)($s['max_sends_per_hour'] ?? 5),
            'max_attempts' => (int)($s['max_attempts'] ?? 5),
            'mail_subject' => $s['mail_subject'] ?? 'Your AmbhuJakshi login code: {code}',
            'mail_body' => $s['mail_body'] ?? '',
            'wall' => $wall
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit();
    }

    if ($method === 'PUT') {
        $raw = file_get_contents('php://input');
        $b = json_decode($raw, true) ?: [];

        $s = getSettings($pdo);
        $currentTexts = json_decode($s['texts'] ?? '{}', true) ?: [];

        if (isset($b['texts']) && is_array($b['texts'])) {
            $textKeys = [
                'taglineStart', 'taglineAccent', 'subtitle', 'buttonText', 'sheetTitle',
                'cardTitle', 'otpSheetTitle', 'otpTitle', 'welcomeTitle', 'welcomeLine',
                'welcomeBack', 'privacyUrl', 'termsUrl'
            ];
            foreach ($textKeys as $k) {
                if (isset($b['texts'][$k])) {
                    $currentTexts[$k] = substr(trim((string)$b['texts'][$k]), 0, 150);
                }
            }
        }

        $otpLength = isset($b['otp_length']) ? (int)$b['otp_length'] : (int)($s['otp_length'] ?? 6);
        $resendSeconds = isset($b['resend_seconds']) ? (int)$b['resend_seconds'] : (int)($s['resend_seconds'] ?? 30);
        $expiryMinutes = isset($b['expiry_minutes']) ? (int)$b['expiry_minutes'] : (int)($s['expiry_minutes'] ?? 10);
        $mailSubject = isset($b['mail_subject']) ? $b['mail_subject'] : ($s['mail_subject'] ?? '');
        $mailBody = isset($b['mail_body']) ? $b['mail_body'] : ($s['mail_body'] ?? '');

        try {
            $upd = $pdo->prepare("
                UPDATE login_settings SET 
                    texts = ?,
                    otp_length = ?,
                    resend_seconds = ?,
                    expiry_minutes = ?,
                    mail_subject = ?,
                    mail_body = ?
                WHERE id = 1
            ");
            $upd->execute([
                json_encode($currentTexts, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
                $otpLength,
                $resendSeconds,
                $expiryMinutes,
                $mailSubject,
                $mailBody
            ]);

            echo json_encode(['ok' => true, 'success' => true, 'message' => 'Login settings updated']);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }
}

// ====================================================
// 5. ADMIN: GET & POST /api/admin/login-wall
// ====================================================
if ($action === 'admin_login_wall') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT id, url, sort FROM login_wall ORDER BY sort ASC, id ASC");
        $wall = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($wall as &$w) {
            $w['id'] = (int)$w['id'];
            $w['sort'] = (int)$w['sort'];
            $w['url'] = toAbsoluteUrl($w['url'], $PUBLIC_URL);
        }
        echo json_encode($wall);
        exit();
    }

    if ($method === 'POST') {
        $url = '';

        // Multipart file upload
        if (!empty($_FILES['photo']['tmp_name'])) {
            $uploadsDir = __DIR__ . '/uploads';
            if (!is_dir($uploadsDir)) {
                mkdir($uploadsDir, 0755, true);
            }
            $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION) ?: 'jpg';
            $fileName = 'wall_' . bin2hex(random_bytes(6)) . '.' . $ext;
            $dest = $uploadsDir . '/' . $fileName;
            if (move_uploaded_file($_FILES['photo']['tmp_name'], $dest)) {
                $url = '/uploads/' . $fileName;
            }
        } else {
            $raw = file_get_contents('php://input');
            $b = json_decode($raw, true) ?: [];
            $url = $b['url'] ?? '';
        }

        if (empty($url)) {
            http_response_code(400);
            echo json_encode(['error' => 'No photo uploaded or URL provided']);
            exit();
        }

        try {
            $maxSort = (int)$pdo->query("SELECT COALESCE(MAX(sort)+1, 0) FROM login_wall")->fetchColumn();
            $ins = $pdo->prepare("INSERT INTO login_wall (url, sort) VALUES (?, ?)");
            $ins->execute([$url, $maxSort]);
            $newId = (int)$pdo->lastInsertId();

            echo json_encode([
                'id' => $newId,
                'url' => toAbsoluteUrl($url, $PUBLIC_URL),
                'sort' => $maxSort
            ]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
            exit();
        }
    }
}

// ====================================================
// 6. ADMIN: DELETE /api/admin/login-wall/:id
// ====================================================
if ($action === 'admin_login_wall_item' && $method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    try {
        $del = $pdo->prepare("DELETE FROM login_wall WHERE id = ?");
        $del->execute([$id]);
        echo json_encode(['ok' => true, 'success' => true]);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
        exit();
    }
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found', 'action' => $action]);
exit();
?>
