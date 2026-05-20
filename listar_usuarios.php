<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$db   = "saude_digital";
$user = "saude_admin";
$pass = "digital";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Buscando ID, Nome, Perfil e Especialidade
    $stmt = $conn->prepare("SELECT id, nome, perfil, specialty as especialidade FROM usuarios");
    
    // NOTA: Se na sua tabela a coluna se chamar 'especialidade', mude para:
    $stmt = $conn->prepare("SELECT id, nome, perfil, COLUMN_JSON(especialidade) as especialidade FROM usuarios");
    // Ou simplesmente:
    $stmt = $conn->prepare("SELECT id, nome, perfil, name as nome, especialidade FROM usuarios");
    
    // Vamos usar a query padrão garantida:
    $stmt = $conn->prepare("SELECT id, nome, perfil, especialidade FROM usuarios");
    
    $stmt->execute();
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($usuarios);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>