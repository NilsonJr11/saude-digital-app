<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Trata requisições OPTIONS (Preflight do CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = "localhost";
$db   = "saude_digital";
$user = "saude_admin";
$pass = "digital";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Captura os dados enviados pelo React
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['paciente_id']) || !isset($input['medico_id']) || !isset($input['data']) || !isset($input['hora'])) {
        echo json_encode(["success" => false, "error" => "Dados incompletos fornecidos para o agendamento."]);
        exit;
    }

    $paciente_id = $input['paciente_id'];
    $medico_id   = $input['medico_id'];
    $data_hora   = $input['data'] . ' ' . $input['hora'] . ':00';
    $status      = 'pendente';

    // Monta a query garantindo exatamente 4 tokens (colunas) e 4 valores vinculados
    $sql = "INSERT INTO agenda (paciente_id, medico_id, data_hora, status) VALUES (:paciente_id, :medico_id, :data_hora, :status)";
    
    $stmt = $conn->prepare($sql);
    
    // Executa casando perfeitamente os nomes dos tokens com as variáveis
    $resultado = $stmt->execute([
        ':paciente_id' => $paciente_id,
        ':medico_id'   => $medico_id,
        ':data_hora'   => $data_hora,
        ':status'      => $status
    ]);

    if ($resultado) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Não foi possível inserir o registro."]);
    }

} catch (PDOException $e) {
    // Retorna o erro exato do MariaDB para sabermos o que houve
    echo json_encode(["success" => false, "error" => "Erro no banco de dados: " . $e->getMessage()]);
}
?>