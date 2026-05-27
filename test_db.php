<?php
$options = [PDO::ATTR_TIMEOUT => 5, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];
try {
    echo "Connecting...\n";
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=db_asrama', 'root', '', $options);
    echo "Connected!\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
