<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new PDO("mysql:host=localhost;dbname=saude_digital;charset=utf8", "saude_admin", "digital");

// Faz um JOIN para trazer o nome do paciente junto com a consulta
$sql = "SELECT a.*, u.nome as paciente_nome 
        FROM agenda a 
        JOIN usuarios u ON a.paciente_id = u.id 
        ORDER BY a.data_hora ASC";

$stmt = $conn->prepare($sql);
$stmt->execute();
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));