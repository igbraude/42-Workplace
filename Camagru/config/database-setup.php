<?php
$DB_DSN = 'mysql:dbname=Camagru;host=mysql';
$DB_USER = 'root';
$DB_PASSWORD = 'rootpass';
$URL = 'localhost:8080';

try {
    $conn = new PDO($DB_DSN, $DB_USER, $DB_PASSWORD);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Échec lors de la connexion : ' . $e->getMessage();
    return;
}
?>