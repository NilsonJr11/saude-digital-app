<?php
// 1. Configurações de erro agressivas para não aceitar tela branca
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 2. Headers de CORS limpos
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = "localhost";
$db   = "saude_digital";
$user = "saude_admin";
$pass = "digital";

try {
    // Tenta conectar ao banco de dados que acabamos de reerguer
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $hoje = date('Y-m-d');

    // 1. Query Total
    $stmtTotal = $conn->prepare("SELECT COUNT(*) FROM agenda WHERE DATE(data_hora) = :hoje");
    $stmtTotal->execute([':hoje' => $hoje]);
    $total = (int)$stmtTotal->fetchColumn();

    // 2. Query Pendentes
    $stmtPendentes = $conn->prepare("SELECT COUNT(*) FROM agenda WHERE DATE(data_hora) = :hoje AND status != 'concluido'");
    $stmtPendentes->execute([':hoje' => $hoje]);
    $pendentes = (int)$stmtPendentes->fetchColumn();

    // 3. Query Concluídos
    $stmtConcluidos = $conn->prepare("SELECT COUNT(*) FROM agenda WHERE DATE(data_hora) = :hoje AND status = 'concluido'");
    $stmtConcluidos->execute([':hoje' => $hoje]);
    $concluidos = (int)$stmtConcluidos->fetchColumn();

    // 4. Query Listagem da Agenda
    $sqlAgenda = "SELECT 
                a.id, 
                DATE_FORMAT(a.data_hora, '%H:%i') as hora, 
                u_paciente.nome as paciente, 
                u_paciente.telefone as paciente_telefone,
                u_medico.nome as medico, 
                a.status,
                a.whatsapp_enviado
              FROM agenda a
              INNER JOIN usuarios u_paciente ON a.paciente_id = u_paciente.id
              INNER JOIN usuarios u_medico ON a.medico_id = u_medico.id
              WHERE DATE(a.data_hora) = CURDATE()
              ORDER BY a.data_hora ASC";

    $stmtAgenda = $conn->prepare($sqlAgenda);
    $stmtAgenda->execute();
    $agenda = $stmtAgenda->fetchAll(PDO::FETCH_ASSOC);

    // Monta o JSON de sucesso
    echo json_encode([
        "cards" => [
            "total" => $total, 
            "pendentes" => $pendentes, 
            "concluidos" => $concluidos
        ],
        "agenda" => $agenda ? $agenda : []
    ]);
    exit;

} catch (PDOException $e) {
    // Se a conexão falhar ou tabelas não existirem, expõe o erro no formato JSON para o React não quebrar
    echo json_encode([
        "cards" => ["total" => 0, "pendentes" => 0, "concluidos" => 0],
        "agenda" => [],
        "erro_banco" => $e->getMessage()
    ]);
    exit;
}