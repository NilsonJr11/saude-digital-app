<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

try {
    include 'conexao.php';

    $medico_id = (int)($_GET['medico_id'] ?? 23);

    // 🎯 O Segredo desvendado: Relacionando a agenda com a tabela 'usuarios'
    $sql = "SELECT 
                a.id, 
                a.data_hora, 
                a.motivo, 
                a.status, 
                a.paciente_id, 
                a.medico_id, 
                p.nome AS paciente_nome 
            FROM agenda a
            LEFT JOIN usuarios p ON a.paciente_id = p.id 
            WHERE a.medico_id = ? 
            ORDER BY a.data_hora ASC";
    
    $stmt = $conexao->prepare($sql);
    if (!$stmt) {
        throw new Exception("Erro na estrutura da tabela: " . $conexao->error);
    }
    
    $stmt->bind_param("i", $medico_id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $eventos = [];

    while ($linha = $resultado->fetch_assoc()) {
        $cor = '#7c3aed'; // Roxo (Pendente)
        $status_limpo = strtolower($linha['status']);
        
        if ($status_limpo === 'atendido') {
            $cor = '#10b981'; // Verde
        } elseif ($status_limpo === 'cancelado') {
            $cor = '#ef4444'; // Vermelho
        }

        $horario = date('H:i', strtotime($linha['data_hora']));
        
        // Se o usuário não tiver nome por algum motivo, usa o ID como plano B
        $nome_paciente = !empty($linha['paciente_nome']) ? $linha['paciente_nome'] : "Paciente #" . $linha['paciente_id'];

        $eventos[] = [
            "id" => $linha['id'],
            "title" => $horario . " - " . $nome_paciente, 
            "start" => str_replace(' ', 'T', $linha['data_hora']),
            "backgroundColor" => $cor,
            "borderColor" => $cor,
            "extendedProps" => [
                "status" => $linha['status'],
                "motivo" => $linha['motivo'],
                "paciente_nome" => $nome_paciente
            ]
        ];
    }

    echo json_encode($eventos, JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "mensagem" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>