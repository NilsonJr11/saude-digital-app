<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    include 'conexao.php';
    
    // Descobre se a tabela se chama 'consultas', 'agendamentos' ou 'agenda'
    $tabela = 'consultas';
    $ordenacao = "c.data DESC, c.hora DESC"; // Padrão para tabelas com data/hora separadas

    $verificar = $conexao->query("SHOW TABLES LIKE 'consultas'");
    if ($verificar->num_rows == 0) {
        $verificar2 = $conexao->query("SHOW TABLES LIKE 'agendamentos'");
        if ($verificar2->num_rows > 0) {
            $tabela = 'agendamentos';
        } else {
            $verificar3 = $conexao->query("SHOW TABLES LIKE 'agenda'");
            if ($verificar3->num_rows > 0) {
                $tabela = 'agenda';
                $ordenacao = "c.data_hora ASC"; // Ajuste para o padrão da sua tabela agenda
            }
        }
    }

    // Busca os dados fazendo um JOIN inteligente para pegar os nomes do paciente e do médico
    $query = "SELECT c.*, 
                     p.nome as paciente_nome, 
                     m.nome as medico_nome 
              FROM $tabela c
              LEFT JOIN usuarios p ON c.paciente_id = p.id
              LEFT JOIN usuarios m ON c.medico_id = m.id
              ORDER BY $ordenacao";
              
    $resultado = $conexao->query($query);
    
    // Se o JOIN falhar por divergência de colunas (ex: se não existir medico_id na tabela), faz o select simples de segurança
    if (!$resultado) {
        $query = "SELECT * FROM $tabela ORDER BY id DESC";
        $resultado = $conexao->query($query);
    }

    $consultas = [];
    if ($resultado) {
        while ($linha = $resultado->fetch_assoc()) {
            $consultas[] = $linha;
        }
    }

    echo json_encode($consultas, JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "mensagem" => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>