<?php
// 1. LIBERAÇÃO DE CORS: Permite que o React (porta 5173) consuma a API
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");

// Se for uma requisição de verificação (OPTIONS), para a execução aqui
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = "localhost";
$usuario = "root";
$senha = ""; // Se o erro de "Access Denied" continuar, vamos resolver no passo abaixo
$banco = "saude_digital";

$conexao = new mysqli($host, $usuario, $senha, $banco);

// Garante o funcionamento de caracteres acentuados
if (!$conexao->connect_error) {
    $conexao->set_charset("utf8mb4");
} else {
    // Se der erro, responde em JSON para o React capturar o erro com elegância
    header('Content-Type: application/json');
    echo json_encode([
        "error" => true,
        "mensagem" => "Falha na conexão com o banco: " . $conexao->connect_error
    ]);
    exit;
}
?>