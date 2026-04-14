import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuarioEncontrado) {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
      alert(`Bem-vindo de volta, ${usuarioEncontrado.nome}!`);
      navigate('/');
      window.location.reload(); // Para atualizar a Navbar
    } else {
      alert("Email ou senha incorretos!");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Topo do Card com a Marca */}
        <div className="bg-primary p-10 text-center">
          <h2 className="text-white text-3xl font-black italic tracking-tighter">Saúde Digital</h2>
          <p className="text-white/70 text-sm mt-2">Acesse sua conta para agendar</p>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-6">
          <div>
            <label className="block text-secondary font-bold mb-2 text-sm">Seu E-mail</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-secondary"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-secondary font-bold mb-2 text-sm">Sua Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-secondary"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-secondary text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-opacity-90 transition-all active:scale-95"
          >
            ENTRAR NA CONTA
          </button>

          <p className="text-center text-gray-500 text-sm">
            Ainda não tem conta? {' '}
            <Link to="/cadastro" className="text-primary font-bold hover:underline">
              Crie uma agora
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}