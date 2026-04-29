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
  
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    if (usuarios.find(u => u.email === email)) {
      alert("Este email já está cadastrado!");
      return;
    }

    // Agora o "pacotão" contém todas as informações
    const novoUsuario = { 
      nome, 
      email, 
      senha, 
      cpf, 
      telefone, 
      nascimento,
      genero,
      dataCriacao: new Date().toLocaleDateString('pt-BR') 
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert("Conta completa criada com sucesso! Agora faça seu login.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        
        <div className="bg-primary p-10 text-center">
          <h2 className="text-white text-3xl font-black italic tracking-tighter">Saúde Digital</h2>
          <p className="text-white/70 text-sm mt-2">Complete seu cadastro único para agendar consultas e exames</p>
        </div>

        <form onSubmit={handleRegister} className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nome Completo */}
            <div className="md:col-span-2">
              <label className="block text-secondary font-bold mb-2 text-sm">Nome Completo</label>
              <input 
                type="text" required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary transition-all"
                placeholder="Ex: Nilson Junior"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            {/* CPF */}
            <div>
              <label className="block text-secondary font-bold mb-2 text-sm">CPF</label>
              <input 
                type="text" required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary transition-all"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-secondary font-bold mb-2 text-sm">Data de Nascimento</label>
              <input 
                type="date" required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary transition-all text-gray-500"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
              />
            </div>

            {/* Exemplo de estrutura para o campo Gênero */}
            <div>
              <label className="block text-secondary font-bold mb-2 text-sm">Gênero</label>
              <select 
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary transition-all text-gray-500"
                value={genero}
                onChange={(e) => setGenero(e.target.value)} // ALTERADO AQUI
              >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-secondary font-bold mb-2 text-sm">Telefone/WhatsApp</label>
              <input 
                type="tel" required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary transition-all"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-secondary font-bold mb-2 text-sm">E-mail</label>
              <input 
                type="email" required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary transition-all"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Senha */}
            <div className="md:col-span-2">
              <label className="block text-secondary font-bold mb-2 text-sm">Crie uma Senha</label>
              <input 
                type="password" required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary transition-all"
                placeholder="No mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-secondary text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-opacity-90 transition-all active:scale-95 mt-8"
          >
            FINALIZAR MEU CADASTRO
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            Já tem uma conta? {' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Fazer Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}