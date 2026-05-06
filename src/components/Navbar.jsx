import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, LogOut } from 'lucide-react';

// 1. MANTEMOS O SEU SELETOR DE ROLES (SIMULADOR)
function RoleSelector() {
  const alternarRole = (novaRole) => {
    let usuarioParaLogar;

    if (novaRole === 'medico') {
      usuarioParaLogar = {
        nome: 'Dr. Ricardo Vaz', 
        role: 'medico',
        id: 'med-123'
      };
    } else if (novaRole === 'secretaria') {
      usuarioParaLogar = {
        nome: 'Atendimento Clínica', 
        role: 'secretaria',
        id: 'sec-456'
      };
    } else {
      usuarioParaLogar = {
        nome: `Teste Paciente`,
        role: 'paciente',
        id: 'temp-' + Date.now()
      };
    }
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioParaLogar));
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-2xl rounded-2xl p-4 border border-primary/20 z-[999] flex gap-2 items-center no-print">
      <span className="text-[10px] font-black text-gray-400 uppercase mr-2">Simular:</span>
      <button onClick={() => alternarRole('paciente')} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold">Paciente</button>
      <button onClick={() => alternarRole('medico')} className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-xs font-bold">Médico</button>
      <button onClick={() => alternarRole('secretaria')} className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-bold">Secretária</button>
    </div>
  );
}

// 2. NAVBAR PRINCIPAL ATUALIZADO
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const role = usuarioLogado?.role || 'paciente';

  const handleSair = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  // Função para estilizar o link ativo
  const linkStyle = (path) => 
    `flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all ${
      location.pathname === path 
        ? 'bg-primary/10 text-primary' 
        : 'text-gray-400 hover:text-secondary'
    }`;

  return (
    <>
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50 no-print">
        <Link to="/" className="text-2xl font-black text-primary italic tracking-tighter">
          Saúde<span className="text-secondary">Digital</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* MENU DO MÉDICO */}
          {role === 'medico' && (
            <>
              <Link to="/agenda-medica" className={linkStyle('/agenda-medica')}>
                <Calendar size={16} /> MINHA AGENDA
              </Link>
              <Link to="/meus-pacientes" className={linkStyle('/meus-pacientes')}>
                <Users size={16} /> MEUS PACIENTES
              </Link>
            </>
          )}

          {/* MENU DA SECRETÁRIA */}
          {role === 'secretaria' && (
            <>
              <Link to="/dashboard-secretaria" className={linkStyle('/dashboard-secretaria')}>
                <LayoutDashboard size={16} /> DASHBOARD
              </Link>
              <Link to="/cadastro-pacientes" className={linkStyle('/cadastro-pacientes')}>
                <Users size={16} /> BASE DE PACIENTES
              </Link>
            </>
          )}

          {/* PERFIL E SAIR */}
          {usuarioLogado && (
            <div className="flex items-center gap-4 ml-4 border-l pl-6 border-gray-100">
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">{role}</p>
                <p className="text-sm font-black text-secondary">{usuarioLogado.nome}</p>
              </div>
              <button onClick={handleSair} className="p-2 text-gray-300 hover:text-red-500 transition-all">
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </nav>
      
      <RoleSelector />
    </>
  );
}