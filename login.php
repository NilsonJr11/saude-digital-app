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

    if (empty($input['email'])) {
        echo json_encode(["success" => false, "error" => "E-mail corporativo é obrigatório."]);
        exit;
    }

    $email = $input['email'];

    // Consulta estruturada e segura
    $stmt = $conn->prepare("SELECT id, nome, email, perfil FROM usuarios WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $dadosUsuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($dadosUsuario) {
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $dadosUsuario['id'],
                "nome" => $dadosUsuario['nome'],
                "email" => $dadosUsuario['email'],
                "perfil" => $dadosUsuario['perfil']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "error" => "Usuário ou e-mail corporativo não encontrado."]);
    }
    exit;

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Erro interno no banco: " . $e->getMessage()]);
    exit;
}