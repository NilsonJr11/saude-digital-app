<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'conexao.php';

// Recebe o JSON enviado pelo React Home.jsx
$data = json_decode(file_get_contents("php://input"), true);

// Verifica se os campos vitais vieram na requisição
if (
    isset($data['paciente_id']) && 
    isset($data['medico_id']) && 
    isset($data['data']) && 
    isset($data['hora'])
) {
    $paciente_id = intval($data['paciente_id']);
    $medico_id = intval($data['medico_id']);
    
    // Junta a Data e a Hora no formato DATETIME exigido pelo MariaDB (Ex: 2026-05-26 09:00:00)
    $data_hora = $data['data'] . ' ' . $data['hora'] . ':00';
    
    $motivo = $data['motivo'] ?? 'Consulta agendada pelo Portal Online';
    $status = 'Confirmado';
    $whatsapp_enviado = 0; // Valor padrão para evitar erros de restrição de coluna

    try {
        // Realiza o INSERT exatamente com a estrutura correta da sua tabela agenda
        $query = "INSERT INTO agenda (paciente_id, medico_id, data_hora, status, motivo, whatsapp_enviado) 
                  VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $conexao->prepare($query);
        
        // i = integer, s = string
        $stmt->bind_param("iisssi", $paciente_id, $medico_id, $data_hora, $status, $motivo, $whatsapp_enviado);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Consulta agendada perfeitamente!"]);
        } else {
            echo json_encode(["success" => false, "error" => "Erro ao executar no banco: " . $stmt->error]);
        }

    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => "Exceção no banco: " . $e->getMessage()]);
    }

} else {
    // Se faltar alguma propriedade, avisa o React detalhadamente
    echo json_encode([
        "success" => false, 
        "error" => "Dados incompletos recebidos pelo servidor PHP.",
        "recebido" => $data
    ]);
}
?>