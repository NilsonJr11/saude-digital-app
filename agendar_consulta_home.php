<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'conexao.php';

$data = json_decode(file_get_contents("php://input"), true);

// Verifica se os dados mínimos chegaram do formulário do paciente
if (!empty($data['paciente_id']) && !empty($data['medico_id']) && !empty($data['data']) && !empty($data['hora'])) {
    
    $paciente_id = $data['paciente_id'];
    $medico_id = $data['medico_id'];
    $status = 'pendente'; 
    $motivo = $data['motivo'] ?? 'Consulta Geral';
    
    // Une a data e hora recebidas no padrão DATETIME (YYYY-MM-DD HH:MM:SS)
    $data_hora = $data['data'] . ' ' . $data['hora'] . ':00';

    $query = "INSERT INTO agenda (paciente_id, medico_id, data_hora, status, motivo, whatsapp_enviado) VALUES (?, ?, ?, ?, ?, 0)";
    $stmt = $conexao->prepare($query);
    $stmt->bind_param("iisss", $paciente_id, $medico_id, $data_hora, $status, $motivo);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Consulta agendada com sucesso!"]);
    } else {
        echo json_encode(["success" => false, "error" => $conexao->error]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Dados incompletos recebidos no servidor."]);
}
?>