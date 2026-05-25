<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'conexao.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['nome']) && !empty($data['cpf'])) {
    $nome = $data['nome'];
    $email = $data['email'] ?? '';
    $telefone = $data['telefone'] ?? '';
    $cpf = $data['cpf'];
    $data_nascimento = $data['data_nascimento'] ?? null;
    
    // 🛡️ Cadastra o registro clínico com perfil fixo e sem chaves de autenticação complexas
    $query = "INSERT INTO usuarios (nome, email, telefone, cpf, data_nascimento, perfil) 
              VALUES (?, ?, ?, ?, ?, 'paciente')";
              
    $stmt = $conexao->prepare($query);
    $stmt->bind_param("sssss", $nome, $email, $telefone, $cpf, $data_nascimento);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conexao->error]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Dados incompletos fornecidos."]);
}
?>