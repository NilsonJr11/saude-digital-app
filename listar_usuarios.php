<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Força o PHP a mostrar qualquer erro oculto
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    if (!file_exists('conexao.php')) {
        throw new Exception("O arquivo conexao.php nao foi encontrado na pasta da API!");
    }
    
    include 'conexao.php';
    
    if (!isset($conexao)) {
        throw new Exception("A variavel de conexao com o banco nao existe. Verifique o seu conexao.php");
    }

    // Tenta uma consulta simples primeiro
    $query = "SELECT id, nome, perfil FROM usuarios";
    
    // Verifica se a coluna especialidade existe de verdade antes de pedir ela
    $testeColuna = $conexao->query("SHOW COLUMNS FROM usuarios LIKE 'especialidade'");
    if ($testeColuna && $testeColuna->num_rows > 0) {
        $query = "SELECT id, nome, perfil, especialidade FROM usuarios";
    }

    $resultado = $conexao->query($query);
    
    if (!$resultado) {
        throw new Exception("Erro na consulta ao banco: " . $conexao->error);
    }

    $usuarios = [];
    while ($linha = $resultado->fetch_assoc()) {
        $usuarios[] = $linha;
    }

    echo json_encode($usuarios, JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    // Captura Erros Fatais do PHP que antes faziam a tela ficar branca
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "mensagem" => $e->getMessage(),
        "arquivo" => $e->getFile(),
        "linha" => $e->getLine()
    ], JSON_UNESCAPED_UNICODE);
}
?>