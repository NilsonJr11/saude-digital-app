import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardSecretaria from './pages/DashboardSecretaria';
import AgendaMedica from './pages/AgendaMedica';
import MedicalRecord from './pages/MedicalRecord';
import MyAppointments from './pages/MyAppointments';
import Register from './pages/Register';
import Home from './pages/Home';
import { Link } from 'react-router-dom';
import ExamesDetalhes from './pages/ExamesDetalhes';
import ExamsList from './pages/ExamsList';
import NotFound from './pages/NotFound';
import AgendamentoExames from './pages/AgendamentoExames';


// Componente de proteção de rotas restritas
function RotaProtegida({ children, perfilRequerido }) {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario_logado'));

  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }

  if (perfilRequerido && usuarioLogado.perfil !== perfilRequerido) {
    if (usuarioLogado.perfil === 'secretaria') return <Navigate to="/dashboard-secretaria" replace />;
    if (usuarioLogado.perfil === 'medico') return <Navigate to="/agenda-medica" replace />;
    return <Navigate to="/my-appointments" replace />;
  }

  return children;
}

function ConteudoApp() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Função para checar o usuário logado no localStorage
  const checarUsuario = () => {
    const usuario = localStorage.getItem('usuario_logado');
    if (usuario) {
      setUser(JSON.parse(usuario));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checarUsuario();

    // 🛡️ O SEGREDO PARA NÃO TRAVAR: Escuta mudanças de login em tempo real
    window.addEventListener('storage', checarUsuario);
    window.addEventListener('login_efetuado', checarUsuario);

    return () => {
      window.removeEventListener('storage', checarUsuario);
      window.removeEventListener('login_efetuado', checarUsuario);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario_logado');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      {/* HEADER DINÂMICO: Aparece para QUALQUEER usuário logado (inclusive pacientes) */}
      {user && (
        <header className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center font-sans shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <Link to="/" className="flex items-center gap-2"><span className="font-black text-lg italic tracking-tighter text-white uppercase">
                Saúde<span className="text-indigo-400">Digital</span> Pro
              </span>
              </Link>
            </div>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full font-bold uppercase ml-2">
              {user.perfil}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-300">Olá, <strong className="text-white">{user.nome}</strong></span>
            {user.perfil === 'paciente' && (
              <button 
                onClick={() => navigate('/')}
                className="text-xs text-slate-300 hover:text-white font-bold bg-slate-800 px-3 py-1.5 rounded-xl transition-all"
              >
                Ir para o Portal
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all"
            >
              Sair
            </button>
          </div>
        </header>
      )}

      <Routes>
        {/* Rota Raiz */}
        <Route path="/" element={<Home />} />

        {/* Rotas de Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Paineis Protegidos */}
        <Route path="/dashboard-secretaria" element={
          <RotaProtegida perfilRequerido="secretaria">
            <DashboardSecretaria />
          </RotaProtegida>
        } />

        <Route path="/agenda-medica" element={
          <RotaProtegida perfilRequerido="medico">
            <AgendaMedica />
          </RotaProtegida>
        } />

        <Route path="/my-appointments" element={
          <RotaProtegida perfilRequerido="paciente">
            <MyAppointments />
          </RotaProtegida>
        } />
        
        <Route path="/medical-record" element={
          <RotaProtegida perfilRequerido="medico">
            <MedicalRecord />
          </RotaProtegida>
        } />

        {/* 🩺 CONEXÃO DE SEGURANÇA: Redireciona médicos se tentarem agendar */}
        <Route path="/medico/:id" element={user ? <Navigate to="/my-appointments" replace /> : <Navigate to="/login" replace />} />

        {/* 📋 Rotas de Exames */}
        <Route path="/exames" element={<ExamsList />} />
        <Route path="/exames/:id" element={<ExamesDetalhes />} />

        {/* Rota Coringa para links corrompidos ou 404 (Redireciona para a Home) */}
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* 📋 Rotas de Exames */}
        <Route path="/agendamento-exames" element={<AgendamentoExames />} /> {/* 🌟 Adicione esta linha */}
        <Route path="/exames" element={<ExamsList />} />
        <Route path="/exames/:id" element={<ExamesDetalhes />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ConteudoApp />
    </BrowserRouter>
  );
}