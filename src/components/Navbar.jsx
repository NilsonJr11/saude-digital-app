import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Busca o usuário no localStorage ao carregar a barra
    const dadosUsuario = localStorage.getItem('usuarioLogado');
    if (dadosUsuario) {
      setUsuario(JSON.parse(dadosUsuario));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setUsuario(null);
    navigate('/');
  };

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white shadow-sm">
      <Link to="/" className="text-2xl font-bold text-primary">
        Saúde Digital
      </Link>

      <nav className="flex items-center gap-6">
        <Link to="/" className="text-gray-600 hover:text-primary font-medium">
          Médicos
        </Link>

        {usuario ? (
          /* Se o usuário estiver logado, mostra o nome e o botão Sair */
          <div className="flex items-center gap-4">
            <span className="text-secondary font-medium">Olá, {usuario.nome}</span>
            <button 
              onClick={handleLogout}
              className="text-red-500 hover:underline text-sm font-bold"
            >
              Sair
            </button>
          </div>
        ) : (
          /* Se não estiver logado, mostra o botão Entrar */
          <Link 
            to="/cadastro" 
            className="bg-secondary text-white px-6 py-2 rounded-xl font-bold hover:bg-opacity-90 transition"
          >
            Entrar
          </Link>
        )}
      </nav>
    </header>
  );
}