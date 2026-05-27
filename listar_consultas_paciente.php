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
    echo json_encode(["erro" => "ID do paciente não fornecido."]);
    exit;
}

try {
    $listaGeral = [];

    // 1. Busca as Consultas Médicas marcadas na tabela 'agenda'
    $queryConsultas = "SELECT 
                        a.id,
                        'consulta' AS tipo,
                        DATE_FORMAT(a.data_hora, '%Y-%m-%d') AS data,
                        DATE_FORMAT(a.data_hora, '%H:%i') AS hora,
                        a.status,
                        m.nome AS medico,
                        m.especialidade
                       FROM agenda a
                       INNER JOIN usuarios m ON a.medico_id = m.id
                       WHERE a.paciente_id = ?
                       ORDER BY a.data_hora DESC";

    $stmt = $conexao->prepare($queryConsultas);
    $stmt->bind_param("i", $paciente_id);
    $stmt->execute();
    $resConsultas = $stmt->get_result();
    while ($row = $resConsultas->fetch_assoc()) {
        $listaGeral[] = $row;
    }

    // 2. Busca os Exames/Prontuários associados ao mesmo paciente
    $queryExames = "SELECT 
                        id,
                        'exame' AS tipo,
                        DATE_FORMAT(data_registro, '%Y-%m-%d') AS data,
                        DATE_FORMAT(data_registro, '%H:%i') AS hora,
                        'Concluído' AS status,
                        descricao AS nome_exame
                    FROM prontuarios 
                    WHERE paciente_id = ?
                    ORDER BY data_registro DESC";

    $stmt2 = $conexao->prepare($queryExames);
    $stmt2->bind_param("i", $paciente_id);
    $stmt2->execute();
    $resExames = $stmt2->get_result();
    while ($row = $resExames->fetch_assoc()) {
        $listaGeral[] = $row;
    }

    // Retorna tudo unificado e ordenado para o painel do cliente
    echo json_encode($listaGeral, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode(["erro" => $e->getMessage()]);
}
?>