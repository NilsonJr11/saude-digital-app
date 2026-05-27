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

if (!empty($data['nome']) && !empty($data['email'])) {
    $nome = $data['nome'];
    $email = $data['email'];
    $cpf = $data['cpf'] ?? '';
    $telefone = $data['telefone'] ?? '';
    $senha = isset($data['senha']) ? password_hash($data['senha'], PASSWORD_DEFAULT) : '';
    $perfil = 'paciente'; // Todo usuário criado na Home nasce paciente

    // 🔍 Ajustado para bater com as colunas reais da sua tabela 'usuarios'
    $query = "INSERT INTO usuarios (nome, email, cpf, perfil) VALUES (?, ?, ?, ?)";
    $stmt = $conexao->prepare($query);
    $stmt->bind_param("ssss", $nome, $email, $cpf, $perfil);

    if ($stmt->execute()) {
        // Retorna o ID gerado para o React conseguir logar o usuário na hora!
        $novo_id = $conexao->insert_id;
        echo json_encode([
            "success" => true, 
            "message" => "Conta criada com sucesso!",
            "usuario" => [
                "id" => $novo_id,
                "nome" => $nome,
                "email" => $email,
                "perfil" => $perfil
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "error" => $conexao->error]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Dados incompletos."]);
}
?>