import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardSecretaria from './pages/DashboardSecretaria';
import AgendaMedica from './pages/AgendaMedica';
import MedicalRecord from './pages/MedicalRecord';
import MyAppointments from './pages/MyAppointments';
import Register from './pages/Register';

// Componente para proteger as rotas (Só deixa entrar se estiver logado com o perfil certo)
function RotaProtegida({ children, perfilRequerido }) {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario_logado'));

  if (!usuarioLogado) {
    // Se não estiver logado, chuta de volta para o login
    return <Navigate to="/login" replace />;
  }

  if (perfilRequerido && usuarioLogado.perfil !== perfilRequerido) {
    // Se logou com o perfil errado, chuta para a página inicial correspondente
    return <Navigate to={usuarioLogado.perfil === 'secretaria' ? "/dashboard-secretaria" : "/agenda-medica"} replace />;
  }

  return children;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica se já existe alguém logado ao carregar o app
    const usuario = localStorage.getItem('usuario_logado');
    if (usuario) {
      setUser(JSON.parse(usuario));
    }
  }, []);

  // Função para fazer Logoff do sistema
  const handleLogout = () => {
    localStorage.removeItem('usuario_logado');
    window.location.href = '/saude-digital-app/login';
  };

  return (
    <BrowserRouter basename="/saude-digital-app">
      {/* SE ESTIVER LOGADO, MOSTRA UM HEADER CORPORATIVO EM CIMA DE TUDO */}
      {user && (
        <header className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center font-sans shadow-md">
          <div className="flex items-center gap-3">
            {/* Nova Marca Autêntica Livre de Plágio */}
            <div className="flex flex-col">
              <span className="font-black text-lg italic tracking-tighter text-white uppercase">
                Saúde<span className="text-indigo-400">Digital</span> Pro
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase -mt-1">
                Portal Corporativo Interno
              </span>
            </div>
            
            <span className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-bold uppercase ml-2">
              {user.perfil}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-300">Olá, <strong className="text-white">{user.nome}</strong></span>
            <button 
              onClick={handleLogout}
              className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all"
            >
              Sair do Sistema
            </button>
          </div>
        </header>
      )}

      {/* APENAS UM BLOCO DE ROUTES DELEGA TUDO AGORA */}
      <Routes>
        {/* Rota Padrão: Redireciona para o login ou para o painel se já estiver logado */}
        <Route path="/" element={
          user ? (
            <Navigate to={user.perfil === 'secretaria' ? "/dashboard-secretaria" : "/agenda-medica"} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* Rota de Login Pública */}
        <Route path="/login" element={<Login />} />

        {/* Rota Privada da Secretária */}
        <Route path="/dashboard-secretaria" element={
          <RotaProtegida perfilRequerido="secretaria">
            <DashboardSecretaria />
          </RotaProtegida>
        } />

        {/* Rota Privada do Médico - AGORA DIRECIONANDO PARA O COMPONENTE REAL */}
        <Route path="/agenda-medica" element={
          <RotaProtegida perfilRequerido="medico">
            <AgendaMedica />
          </RotaProtegida>
        } />

        {/* Outras rotas do sistema */}
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/medical-record" element={<MedicalRecord />} />
        <Route path="/register" element={<Register />} />

        {/* Rota de Captura para evitar telas brancas (404 dentro do React) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}