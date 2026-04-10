import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // 1. Criamos o objeto do usuário com os dados do estado
    const novoUsuario = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha // Em um app real, nunca salvaríamos a senha pura assim
    };

    // 2. Salvamos na lista geral de usuários (para o futuro Login)
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // 3. Salvamos quem é o usuário atual (para a Navbar mostrar o nome)
    localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
    
    alert("Cadastro realizado com sucesso!");
    window.location.href = '/';}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-secondary mb-6 text-center">Criar Conta</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nome Completo</label>
            <input 
              type="text" 
              required
              value={formData.nome}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">E-mail</label>
            <input 
              type="email" 
              required
              value={formData.email}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Senha</label>
            <input 
              type="password" 
              required
              value={formData.senha}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
              onChange={(e) => setFormData({...formData, senha: e.target.value})}
            />
          </div>
          
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:bg-opacity-90 transition mt-4">
            Cadastrar
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-500">
          Já tem uma conta? <Link to="/" className="text-primary font-bold hover:underline">Voltar para Home</Link>
        </p>
      </div>
    </div>
  );
}