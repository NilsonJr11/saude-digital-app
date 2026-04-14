import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    if (usuarios.find(u => u.email === email)) {
      alert("Este email já está cadastrado!");
      return;
    }

    const novoUsuario = { nome, email, senha };
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert("Conta criada com sucesso! Agora faça seu login.");
    navigate('/login');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        
        <div className="bg-primary p-10 text-center">
          <h2 className="text-white text-3xl font-black italic tracking-tighter">Saúde Digital</h2>
          <p className="text-white/70 text-sm mt-2">Cadastre-se para cuidar da sua saúde</p>
        </div>

        <form onSubmit={handleRegister} className="p-10 space-y-5">
          <div>
            <label className="block text-secondary font-bold mb-2 text-sm">Nome Completo</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="Como quer ser chamado?"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-secondary font-bold mb-2 text-sm">E-mail</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-secondary font-bold mb-2 text-sm">Crie uma Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              placeholder="No mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-secondary text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-opacity-90 transition-all active:scale-95 mt-4"
          >
            FINALIZAR CADASTRO
          </button>

          <p className="text-center text-gray-500 text-sm pt-2">
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