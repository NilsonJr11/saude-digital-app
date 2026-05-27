<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'conexao.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id']) && isset($data['status'])) {
    $id = intval($data['id']);
    $status = trim($data['status']);

    try {
        $query = "UPDATE agenda SET status = ? WHERE id = ?";
        $stmt = $conexao->prepare($query);
        $stmt->bind_param("si", $status, $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Status atualizado com sucesso!"]);
        } else {
            echo json_encode(["success" => false, "error" => "Erro ao atualizar no banco: " . $stmt->error]);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => "Exceção: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Dados incompletos para atualização."]);
}
?>