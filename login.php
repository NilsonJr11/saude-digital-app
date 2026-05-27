<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'conexao.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['email']) && !empty($data['senha'])) {
    $email = $data['email'];
    $senha = $data['senha'];
    
    $query = "SELECT id, nome, email, senha, perfil FROM usuarios WHERE email = ?";
    $stmt = $conexao->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $resultado = $stmt->get_result()->fetch_assoc();
    
    // Verificação da senha criptografada
    if ($resultado && password_verify($senha, $resultado['senha'])) {
        // Remove a senha do retorno por segurança
        unset($resultado['senha']);
        echo json_encode(["success" => true, "usuario" => $resultado]);
    } else {
        echo json_encode(["success" => false, "error" => "E-mail ou senha incorretos."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Preencha os campos obrigatórios."]);
}

// Exemplo dentro do seu Login.jsx ao receber sucesso do PHP:
if (resposta.success) {
  localStorage.setItem('usuario_logado', JSON.stringify(resposta.usuario));
  window.dispatchEvent(new Event('login_efetuado')); // Destrava o App.jsx na hora!
  
  // Redireciona baseado no perfil retornado pelo MariaDB
  if (resposta.usuario.perfil === 'secretaria') navigate('/dashboard-secretaria');
  else if (resposta.usuario.perfil === 'medico') navigate('/agenda-medica');
  else navigate('/my-appointments');
}
?>

