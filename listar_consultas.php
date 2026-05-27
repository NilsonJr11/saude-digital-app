<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'conexao.php';

try {
    // Seleciona os dados das consultas agendadas no banco de dados
    $query = "SELECT id, paciente_nome, medico_nome, data_consulta, horario_consulta, status FROM consultas";
    $resultado = $conexao->query($query);
    
    $consultas = [];
    if ($resultado) {
        while ($linha = $resultado->fetch_assoc()) {
            $consultas[] = $linha;
        }
    }

    echo json_encode($consultas, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>