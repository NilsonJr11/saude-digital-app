<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'conexao.php';

$paciente_id = $_GET['paciente_id'] ?? null;

if (!$paciente_id) {
    echo json_encode(["erro" => "ID do paciente nao fornecido."]);
    exit;
}

// Busca os registros da tabela prontuarios vinculados ao paciente
$query = "SELECT id, descricao, data_registro FROM prontuarios WHERE paciente_id = ? ORDER BY data_registro DESC";
$stmt = $conexao->prepare($query);
$stmt->bind_param("i", $paciente_id);
$stmt->execute();
$resultado = $stmt->get_result();

$exames = [];
while ($linha = $resultado->fetch_assoc()) {
    $exames[] = $linha;
}

echo json_encode($exames);
?>