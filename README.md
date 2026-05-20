# 🏥 SaúdeDigital Pro — Portal Corporativo Interno

O **SaúdeDigital Pro** é um ecossistema completo de gestão clínica e fluxo de atendimento interno desenvolvido para otimizar a comunicação entre recepção, corpo médico e pacientes. O sistema centraliza agendamentos dinâmicos, controle de status de consultas em tempo real e automação de notificações em uma interface moderna e responsiva.

---

## 🚀 Principais Funcionalidades

### 🔐 1. Controle de Acesso Inteligente (RBAC)
* Sistema de login com autenticação baseada em perfis corporativos (`secretaria` e `medico`).
* Rotas totalmente protegidas no Front-end (`RotaProtegida`), impedindo acessos cruzados ou não autorizados.
* Painel de login otimizado com atalhos interativos ("Clique para preencher") para homologação ágil de personas.

### 💼 2. Painel Administrativo da Secretaria
* Visualização centralizada dos agendamentos do dia em formato de cards de indicadores (Total de consultas, pendentes e concluídas).
* Tabela dinâmica alimentada por banco de dados relacional.
* Formulário de cadastro de novos pacientes.

### 💬 3. Integração e Automação com WhatsApp API
* Disparo de notificações de confirmação de consulta com clique único (`Gatilho Nativo`).
* Limpeza automática de strings de telefone no Front-end, garantindo formatação internacional (`+55`) e prevenindo falhas de envio.
* Mensagens dinâmicas customizadas contendo nome do paciente, horário e médico responsável.

### 🩺 4. Fila de Atendimento Médica Dinâmica
* Interface exclusiva para o corpo clínico onde cada médico visualiza **apenas as suas próprias consultas filtradas para o dia atual**.
* Atualização de status em tempo real via requisições assíncronas (Pendente ➡️ Concluído), refletindo instantaneamente no painel da secretaria.

---

## 🛠️ Stack Tecnológica

### Front-end
* **React.js** (com **Vite** para empacotamento de alta performance)
* **Tailwind CSS** (Design minimalista, premium e utilitário)
* **React Router DOM** (Gestão de rotas e navegação SPA)
* **Lucide React** (Pacote de ícones vetoriais modernos)

### Back-end & Banco de Dados
* **PHP 8.x** (Construção de APIs RESTful estruturadas com entrega de payloads JSON)
* **MariaDB / MySQL** (Modelagem relacional e persistência de dados íntegra)
* **PDO (PHP Data Objects)** (Garantia de consultas seguras e preparadas)

---

## 📁 Estrutura do Projeto Front-end

```text
src/
├── pages/
│   ├── Login.jsx                 # Login com atalhos de teste
│   ├── DashboardSecretaria.jsx   # Painel da recepção & disparo WhatsApp
│   └── AgendaMedica.jsx          # Fila de atendimento clínica do médico
├── App.jsx                       # Core de rotas protegidas e cabeçalho global
└── main.jsx                      # Inicialização do React