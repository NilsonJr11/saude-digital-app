import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // 👈 Adicionado useNavigate aqui
import Login from './pages/Login';
import DashboardSecretaria from './pages/DashboardSecretaria';
import AgendaMedica from './pages/AgendaMedica';
import MedicalRecord from './pages/MedicalRecord';
import MyAppointments from './pages/MyAppointments';
import Register from './pages/Register';

// Componente para proteger as rotas
function RotaProtegida({ children, perfilRequerido }) {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario_logado'));

  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }

  if (perfilRequerido && usuarioLogado.perfil !== perfilRequerido) {
    return <Navigate to={usuarioLogado.perfil === 'secretaria' ? "/dashboard-secretaria" : "/agenda-medica"} replace />;
  }

  return children;
}

// 📦 Criamos um componente interno para podermos usar o hook useNavigate com segurança
function ConteudoApp() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // 👈 Inicializa o navegador do React

  useEffect(() => {
    const usuario = localStorage.getItem('usuario_logado');
    if (usuario) {
      setUser(JSON.parse(usuario));
    }
  }, []);

  // Função para fazer Logoff corrigida sem caminhos fixos antigos!
  const handleLogout = () => {
    localStorage.removeItem('usuario_logado');
    setUser(null); // Limpa o estado local
    navigate('/login'); // 👈 Navegação limpa e correta para a Vercel
  };

  return (
    <>
      {/* SE ESTIVER LOGADO, MOSTRA O HEADER CORPORATIVO */}
      {user && (
        <header className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center font-sans shadow-md">
          <div className="flex items-center gap-3">
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

      <Routes>
        <Route path="/" element={
          user ? (
            <Navigate to={user.perfil === 'secretaria' ? "/dashboard-secretaria" : "/agenda-medica"} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        <Route path="/login" element={<Login />} />

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
        
        <Route path="/medical-record" element={<MedicalRecord />} />
        <Route path="/register" element={<Register />} />

        <Route path="/%" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

// O export padrão apenas envelopa tudo com o BrowserRouter externo
export default function App() {
  return (
    <BrowserRouter>
      <ConteudoApp />
    </BrowserRouter>
  );
}