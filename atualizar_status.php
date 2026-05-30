<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Trata a pré-validação do CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

try {
    include 'conexao.php';

    // Captura os dados enviados pelo corpo da requisição (JSON do React)
    $dados = json_decode(file_get_contents("php://input"), true);

    if (!$dados) {
        $dados = $_POST;
    }

    // Mapeamento tolerante para capturar o ID e o Status enviados pelo Frontend
    $id     = $dados['id']     ?? $dados['agenda_id'] ?? $dados['consulta_id'] ?? $dados['agendaId'] ?? null;
    $status = $dados['status'] ?? null;

    // Se não receber o ID ou o Status, avisa o frontend o que está faltando
    if (!$id || !$status) {
        http_response_code(400);
        echo json_encode([
            "error" => true,
            "mensagem" => "Dados incompletos. ID e Status são obrigatórios.",
            "dados_recebidos" => $dados
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Prepara a Query para atualizar o status na tabela 'agenda'
    $stmt = $conexao->prepare("UPDATE agenda SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);

    if ($stmt->execute()) {
        // Verifica se realmente alguma linha foi alterada (se o ID existia)
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                "success" => true,
                "error" => false,
                "mensagem" => "Status atualizado com sucesso para: " . $status
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode([
                "success" => true,
                "error" => false,
                "mensagem" => "O status já era o mesmo ou o agendamento não sofreu alterações."
            ], JSON_UNESCAPED_UNICODE);
        }
    } else {
        throw new Exception($stmt->error);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "mensagem" => "Erro interno ao atualizar status: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>