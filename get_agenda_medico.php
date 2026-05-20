<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "localhost";
$db   = "saude_digital";
$user = "saude_admin";
$pass = "digital";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Pega o ID do médico vindo do painel React
    $medico_id = isset($_GET['medico_id']) ? $_GET['medico_id'] : null;

    if (!$medico_id) {
        echo json_encode(["success" => false, "error" => "ID do médico não fornecido."]);
        exit;
    }

    // Busca apenas as consultas deste médico para o dia atual
    $sql = "SELECT 
                a.id, 
                DATE_FORMAT(a.data_hora, '%H:%i') as hora, 
                u.nome as paciente, 
                u.telefone as paciente_telefone,
                a.status 
            FROM agenda a
            INNER JOIN usuarios u ON a.paciente_id = u.id
            WHERE a.medico_id = :medico_id AND DATE(a.data_hora) = CURDATE()
            ORDER BY a.data_hora ASC";

    $stmt = $conn->prepare($sql);
    $stmt->execute([':medico_id' => $medico_id]);
    $agenda = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($agenda);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>