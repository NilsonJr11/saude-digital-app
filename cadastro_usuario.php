<?php
// Headers para evitar erro de CORS com o React
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Se o navegador enviar um OPTIONS (preflight), encerramos aqui
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// 1. Configurações de Conexão
$host = "localhost";
$db   = "saude_digital";
$user = "saude_admin"; // Usuário que criamos anteriormente
$pass = "digital";     // Senha que definimos

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 2. Recebendo os dados do formulário (JSON do React)
    $data = json_decode(file_get_contents("php://input"), true);

    if ($data) {
        $nome = $data['nome'] ?? '';
        $email = $data['email'] ?? '';
        // Limpamos CPF e Telefone para salvar apenas números no banco
        $cpf = preg_replace('/\D/', '', $data['cpf'] ?? '');
        $telefone = preg_replace('/\D/', '', $data['telefone'] ?? '');
        $nascimento = !empty($data['nascimento']) ? $data['nascimento'] : '1900-01-01';
        $role = $data['role'] ?? 'paciente';

        // 3. Executando o INSERT
        $sql = "INSERT INTO usuarios (nome, email, cpf, telefone, nascimento, role) 
                VALUES (:nome, :email, :cpf, :telefone, :nascimento, :role)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':nome' => $nome,
            ':email' => $email,
            ':cpf' => $cpf,
            ':telefone' => $telefone,
            ':nascimento' => $nascimento,
            ':role' => $role
        ]);

        echo json_encode(["status" => "success", "message" => "Usuário cadastrado com sucesso!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Nenhum dado recebido."]);
    }

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erro: " . $e->getMessage()]);
}
?>