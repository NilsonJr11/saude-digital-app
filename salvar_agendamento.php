<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Conexão com o Banco de Dados (Substitua pelos seus dados se necessário)
$host = "localhost";
$usuario_db = "root";
$senha_db = "";
$banco = "saude_digital"; // nome do seu banco de dados

$conn = new mysqli($host, $usuario_db, $senha_db, $banco);

if ($conn->connect_error) {
    echo json_json_encode(["sucesso" => false, "erro" => "Falha na conexão: " . $conn->connect_error]);
    exit;
}

// Recebe os dados enviados pelo React
$dados = json_decode(file_get_contents("php://input"), true);

if (!$dados) {
    echo json_encode(["sucesso" => false, "erro" => "Nenhum dado recebido."]);
    exit;
}

$paciente_id = $dados['paciente_id'] ?? null;
$medico_id   = $dados['medico_id'] ?? null;
$data        = $dados['data'] ?? null;
$hora        = $dados['hora'] ?? null;
$motivo      = $dados['motivo'] ?? 'Consulta';
$status      = $dados['status'] ?? 'Pendente';

// Validação simples
if (!$paciente_id || !$medico_id || !$data || !$hora) {
    echo json_encode(["sucesso" => false, "erro" => "Campos obrigatórios ausentes."]);
    exit;
}

// Ajusta o formato da data e hora para salvar no padrão do MySQL (Y-m-d H:i:s)
// Se no React vier "03/06/2026", precisamos converter para "2026-06-03"
if (strpos($data, '/') !== false) {
    $partes = explode('/', $data);
    $data_formatada = $partes[2] . '-' . $partes[1] . '-' . $partes[0];
} else {
    $data_formatada = $data;
}

// Combina Data + Hora para o campo DATETIME (ex: '2026-06-03 09:00:00')
$data_hora_inicio = $data_formatada . ' ' . $hora . ':00';

// Prepara a Query para evitar SQL Injection
$sql = "INSERT INTO agenda (paciente_id, medico_id, start, motivo, status) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("iisss", $paciente_id, $medico_id, $data_hora_inicio, $motivo, $status);
    
    if ($stmt->execute()) {
        echo json_encode(["sucesso" => true, "mensagem" => "Agendamento salvo com sucesso!"]);
    } else {
        echo json_encode(["sucesso" => false, "erro" => "Erro ao executar query: " . $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(["sucesso" => false, "erro" => "Erro ao preparar banco: " . $conn->error]);
}

$conn->close();
?>