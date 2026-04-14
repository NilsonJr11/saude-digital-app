import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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

  // A FUNÇÃO PRECISA FICAR AQUI DENTRO!
  const handleScrollToMedicos = (e) => {
    e.preventDefault();

    const scrollToElement = () => {
      const section = document.getElementById('medicos-destaque');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToElement, 300);
    } else {
      scrollToElement();
    }
  };

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white shadow-sm sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-primary italic">
        Saúde Digital
      </Link>

      <nav className="flex items-center gap-6">
        {/* Botão de Scroll */}
        <button 
          onClick={handleScrollToMedicos}
          className="text-gray-600 hover:text-primary font-bold transition-colors cursor-pointer"
        >
          Médicos
        </button>

        {usuario ? (
          <div className="flex items-center gap-4">
            <Link to="/meus-agendamentos" className="text-gray-600 hover:text-primary font-medium">
              Minhas Consultas
            </Link>
            <div className="h-6 w-[1px] bg-gray-200"></div>
            <span className="text-secondary font-bold">Olá, {usuario.nome}</span>
            <button 
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 text-sm font-black uppercase tracking-tighter"
            >
              Sair
            </button>
          </div>
        ) : (
          <Link 
            to="/login" 
            className="bg-secondary text-white px-6 py-2 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg shadow-secondary/20"
          >
            Entrar
          </Link>
        )}
      </nav>
    </header>
  );
}