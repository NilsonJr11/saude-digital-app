import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [genero, setGenero] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [erro, setErro] = useState('');
  
  const navigate = useNavigate();

  // 🛡️ Máscara de CPF em tempo real (000.000.000-00)
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
    
    // Aplica a formatação do CPF
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    
    setCpf(value);
  };

  // 🛡️ Máscara de Telefone em tempo real ((XX) XXXXX-XXXX)
  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    
    setTelefone(value);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErro('');

    const emailLimpo = email.trim().toLowerCase();
    const cpfLimpo = cpf.replace(/\D/g, "");
    const telefoneLimpo = telefone.replace(/\D/g, "");

    // ── VALIDAÇÕES DE SEGURANÇA ──
    if (nome.trim().length < 3) {
      setErro("Por favor, insira o seu nome completo.");
      return;
    }

    if (cpfLimpo.length !== 11) {
      setErro("O CPF digitado está incompleto. Deve conter 11 números.");
      return;
    }

    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      setErro("O telefone digitado é inválido. Inclua o DDD.");
      return;
    }

    if (!emailLimpo.includes('@') || emailLimpo.length < 5) {
      setErro("Por favor, digite um endereço de e-mail válido.");
      return;
    }

    if (senha.length < 6) {
      setErro("Senha muito fraca! Crie uma senha com pelo menos 6 caracteres.");
      return;
    }

    // Gravação unificada na chave 'usuarios' usada pelo seu Login
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    if (usuarios.find(u => u.email === emailLimpo)) {
      setErro("Este endereço de e-mail já está cadastrado no sistema!");
      return;
    }

    const novoUsuario = { 
      nome: nome.trim(), 
      email: emailLimpo, 
      senha, // Em um sistema real seria encriptada, aqui salvamos para o mock bater
      cpf, 
      telefone, 
      nascimento,
      genero,
      perfil: 'paciente',
      dataCriacao: new Date().toLocaleDateString('pt-BR') 
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert("Conta criada com total segurança! Redirecionando para o login...");
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Banner Superior IDÊNTICO ao seu layout */}
        <div className="bg-[#111827] p-10 text-center border-b border-gray-800">
          <h2 className="text-white text-3xl font-black italic tracking-tighter uppercase">
            Saúde<span className="text-indigo-500">Digital</span> Pro
          </h2>
          <p className="text-white/70 text-xs mt-2 font-medium tracking-wide">
            Complete seu cadastro único para agendar consultas e exames
          </p>
        </div>

        <form onSubmit={handleRegister} className="p-10 space-y-6">
          
          {/* Mensagem de Erro Segura */}
          {erro && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold text-center">
              ⚠️ {erro}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nome Completo */}
            <div className="md:col-span-2">
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">Nome Completo</label>
              <input 
                type="text" required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                placeholder="Ex: Nilson Junior"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            {/* CPF formatado */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">CPF</label>
              <input 
                type="text" required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">Data de Nascimento</label>
              <input 
                type="date" required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-600"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
              />
            </div>

            {/* Gênero */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">Gênero</label>
              <select 
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-600"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            {/* Telefone Formatado */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">Telefone/WhatsApp</label>
              <input 
                type="tel" required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={handleTelefoneChange}
              />
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">E-mail</label>
              <input 
                type="email" required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Senha Protegida */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider">Crie uma Senha</label>
              <input 
                type="password" required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-800"
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#111827] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] mt-4 uppercase tracking-tight"
          >
            FINALIZAR MEU CADASTRO
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            Já tem uma conta? {' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Fazer Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}