import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 1. Pega a lista de todos os usuários cadastrados
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // 2. Procura se existe um usuário com esse e-mail e senha
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuarioEncontrado) {
      // 3. Salva apenas o usuário atual que logou
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
      
      // Força um "refresh" na aplicação para a Navbar atualizar
      window.location.href = '/'; 
    } else {
      alert("E-mail ou senha incorretos!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-secondary mb-6 text-center">Entrar</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Seu e-mail"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Sua senha"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary"
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-opacity-90 transition">
            Entrar
          </button>
        </form>
        <p className="mt-6 text-center text-gray-500">
          Não tem conta? <Link to="/cadastro" className="text-primary font-bold hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}