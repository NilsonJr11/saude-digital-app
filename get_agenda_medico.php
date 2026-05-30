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

    // Aceita o ID do médico tanto por URL (GET) quanto por JSON (POST)
    $medico_id = $_GET['medico_id'] ?? $_GET['medico'] ?? null;
    
    if (!$medico_id) {
        $dados = json_decode(file_get_contents("php://input"), true);
        $medico_id = $dados['medico_id'] ?? $dados['medico'] ?? null;
    }

    // Se não for passado nenhum ID, podemos usar temporariamente o ID 1 (Dr. Ricardo) para não travar a tela
    if (!$medico_id) {
        $medico_id = 1; 
    }

    // Query robusta trazendo os dados da agenda juntamente com o nome do paciente
    $sql = "SELECT 
                a.id, 
                a.data_hora, 
                a.motivo, 
                a.status,
                p.nome AS paciente_nome 
            FROM agenda a
            LEFT JOIN pacientes p ON a.paciente_id = p.id
            WHERE a.medico_id = ?
            ORDER BY a.data_hora ASC";

    $stmt = $conexao->prepare($sql);
    $stmt->bind_param("i", $medico_id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $eventos = [];

    while ($linha = $resultado->fetch_assoc()) {
        // Define a cor do card no calendário baseado no status atual
        $cor = '#7c3aed'; // Roxo padrão (Pendente)
        if ($linha['status'] === 'atendido' || $linha['status'] === 'ATENDIDO') {
            $cor = '#10b981'; // Verde
        } elseif ($linha['status'] === 'cancelado' || $linha['status'] === 'CANCELADO') {
            $cor = '#ef4444'; // Vermelho
        }

        // Extrai apenas o horário (HH:MM) para o título
        $horario = date('H:i', strtotime($linha['data_hora']));

        $eventos[] = [
            "id" => $linha['id'],
            "title" => $horario . " - " . ($linha['paciente_nome'] ?? 'Paciente Não Identificado'),
            "start" => str_replace(' ', 'T', $linha['data_hora']), // Formato ISO exigido pelo FullCalendar
            "backgroundColor" => $cor,
            "borderColor" => $cor,
            "extendedProps" => [
                "status" => $linha['status'],
                "motivo" => $linha['motivo']
            ]
        ];
    }

    echo json_encode($eventos, JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "mensagem" => "Erro ao carregar agenda: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>