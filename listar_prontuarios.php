<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new PDO("mysql:host=localhost;dbname=saude_digital;charset=utf8", "saude_admin", "digital");

$paciente_id = $_GET['paciente_id'] ?? null;

$sql = "SELECT * FROM prontuarios WHERE paciente_id = :pid ORDER BY data_atendimento DESC";
$stmt = $conn->prepare($sql);
$stmt->execute([':pid' => $paciente_id]);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));