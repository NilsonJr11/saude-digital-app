<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$host = "localhost";
$db   = "saude_digital";
$user = "saude_admin";
$pass = "digital";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    
    // 1. Insere o prontuário
    $sql = "INSERT INTO prontuarios (paciente_id, medico_id, diagnostico, prescricao) 
            VALUES (:pid, :mid, :diag, :presc)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':pid'  => $data['paciente_id'],
        ':mid'  => $data['medico_id'],
        ':diag' => $data['evolucao'],
        ':presc'=> $data['prescricao']
    ]);

    // 2. Atualiza o status na agenda para 'concluido'
    $sqlStatus = "UPDATE agenda SET status = 'concluido' WHERE id = :aid";
    $stmtStatus = $conn->prepare($sqlStatus);
    $stmtStatus->execute([':aid' => $data['agendamento_id']]);

    echo json_encode(["status" => "success", "message" => "Atendimento finalizado no banco!"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}