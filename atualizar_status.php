<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

$host = "localhost";
$db   = "saude_digital";
$user = "saude_admin";
$pass = "digital";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['agenda_id']) || !isset($input['status'])) {
        echo json_encode(["success" => false, "error" => "Dados incompletos."]);
        exit;
    }

    $sql = "UPDATE agenda SET status = :status WHERE id = :agenda_id";
    $stmt = $conn->prepare($sql);
    $resultado = $stmt->execute([
        ':status' => $input['status'],
        ':agenda_id' => $input['agenda_id']
    ]);

    echo json_encode(["success" => $resultado]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>