<?php
// Inclui a conexão central, o CORS e o charset corretos
require_once 'conexao.php'; 

// Consulta SQL com o JOIN do paciente
$sql = "SELECT a.*, u.nome as paciente_nome 
        FROM agenda a 
        JOIN usuarios u ON a.paciente_id = u.id 
        ORDER BY a.data_hora ASC";

$resultado = $conexao->query($sql);

if ($resultado) {
    $agenda = [];
    while ($linha = $resultado->fetch_assoc()) {
        $agenda[] = $linha;
    }
    
    // Devolve os dados em JSON para o React
    header('Content-Type: application/json');
    echo json_encode($agenda);
} else {
    // Se a tabela 'agenda' não existir ou o SQL falhar, avisa o React com elegância
    header('Content-Type: application/json', true, 500);
    echo json_encode([
        "error" => true,
        "mensagem" => "Erro ao listar agenda: " . $conexao->error
    ]);
}
?>