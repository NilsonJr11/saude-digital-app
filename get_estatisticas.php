<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'conexao.php';

// Data atual no formato do banco (AAAA-MM-DD)
$data_hoje = date('Y-m-d');

// 1. Busca os agendamentos do dia juntando o nome do paciente e o nome do médico
// Ajuste os nomes das colunas de acordo com as suas tabelas (ex: consultas, agendamentos)
$query_agenda = "SELECT 
                    a.id, 
                    a.hora, 
                    a.status,
                    p.nome AS paciente, 
                    p.telefone AS paciente_telefone,
                    m.nome AS medico
                 FROM agendamentos a
                 LEFT JOIN usuarios p ON a.paciente_id = p.id
                 LEFT JOIN usuarios m ON a.medico_id = m.id
                 WHERE a.data = ? 
                 ORDER BY a.hora ASC";

$stmt = $conexao->prepare($query_agenda);
$stmt->bind_param("s", $data_hoje);
$stmt->execute();
$resultado_agenda = $stmt->get_result();

$agenda = [];
$total = 0;
$pendentes = 0;
$concluidos = 0;

while ($linha = $resultado_agenda->fetch_assoc()) {
    $agenda[] = $linha;
    $total++;
    
    if (strtolower($linha['status']) === 'concluido') {
        $concluidos++;
    } else {
        $pendentes++;
    }
}

// 2. Monta a resposta exatamente no formato esperado pelo DashboardSecretaria.jsx
$resposta = [
    "cards" => [
        "total" => $total,
        "pendentes" => $pendentes,
        "concluidos" => $concluidos
    ],
    "agenda" => $agenda
];

echo json_encode($resposta);
?>