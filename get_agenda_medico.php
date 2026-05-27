<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'conexao.php';

// Captura o ID do médico passado pelo React
$medico_id = $_GET['medico_id'] ?? null;

if (!$medico_id) {
    echo json_encode(["erro" => "ID do medico nao fornecido."]);
    exit;
}

try {
    // 🔍 Busca as consultas do médico fazendo o JOIN correto
    $query = "SELECT 
                a.id,
                DATE_FORMAT(a.data_hora, '%H:%i') AS hora,
                a.status,
                a.motivo,
                p.nome AS paciente,
                p.telefone AS paciente_telefone
              FROM agenda a
              INNER JOIN usuarios p ON a.paciente_id = p.id
              WHERE a.medico_id = ?
              ORDER BY a.data_hora ASC";

    $stmt = $conexao->prepare($query);
    
    // "i" indica que o parâmetro é um Integer (Inteiro)
    $stmt->bind_param("i", $medico_id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $agenda = [];
    while ($linha = $resultado->fetch_assoc()) {
        $agenda[] = $linha;
    }

    // Retorna a lista para o React (se estiver vazia, retorna um array vazio [])
    echo json_encode($agenda, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["erro" => $e->getMessage()]);
}
?>