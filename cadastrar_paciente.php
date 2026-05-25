<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'conexao.php';

$data = json_decode(file_get_contents("php://input"), true);

$host = "localhost";
$db   = "saude_digital";
$user = "saude_admin";
$pass = "digital";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = json_decode(file_get_contents('php://input'), TRUE);

    if (empty($input['nome'])) {
        echo json_encode(["success" => false, "error" => "O nome do paciente é obrigatório."]);
        exit;
    }

    // Preparar dados vindos do React
    $nome = $input['nome'];
    $email = !empty($input['email']) ? $input['email'] : null;
    $telefone = !empty($input['telefone']) ? $input['telefone'] : null;
    $cpf = !empty($input['cpf']) ? $input['cpf'] : null;
    $data_nasc = !empty($input['data_nascimento']) ? $input['data_nascimento'] : null;
    $perfil = 'paciente'; // Força o cadastro como perfil paciente

    // Verifica se o CPF já está cadastrado para evitar duplicidade
    if ($cpf) {
        $stmtCheck = $conn->prepare("SELECT id FROM usuarios WHERE cpf = :cpf");
        $stmtCheck->execute([':cpf' => $cpf]);
        if ($stmtCheck->fetch()) {
            echo json_encode(["success" => false, "error" => "Este CPF já está cadastrado no sistema."]);
            exit;
        }
    }

    // Inserir paciente no banco de dados
    $sql = "INSERT INTO usuarios (nome, email, telefone, cpf, data_nascimento, perfil) 
            VALUES (:nome, :email, :telefone, :cpf, :data_nasc, :perfil)";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':nome'       => $nome,
        ':email'      => $email,
        ':telefone'   => $telefone,
        ':cpf'        => $cpf,
        ':data_nasc'  => $data_nasc,
        ':perfil'     => $perfil 
    ]);

    echo json_encode(["success" => true, "id" => $conn->lastInsertId()]);
    exit;

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Erro no servidor: " . $e->getMessage()]);
    exit;
}