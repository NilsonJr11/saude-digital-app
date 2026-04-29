import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. O SELETOR DE ROLES (AGORA SEM O "DEFAULT")
function RoleSelector() {
  const alternarRole = (novaRole) => {
  const perfisDeTeste = {
    paciente: { nome: 'Nilson Júnior', email: 'nilson@teste.com', role: 'paciente' },
    medico: { nome: 'Dr. Arnaldo Silva', email: 'arnaldo@saude.com', role: 'medico' },
    secretaria: { nome: 'Cláudia (Admin)', email: 'claudia@saude.com', role: 'secretaria' }
  };

  // 1. Pegamos o perfil correto baseado no botão clicado
  const perfilEscolhido = perfisDeTeste[novaRole];

  // 2. Agora sim, salvamos o objeto correto no localStorage
  localStorage.setItem('usuarioLogado', JSON.stringify(perfilEscolhido));
  
  // 3. Recarregamos a página para aplicar a nova role
  window.location.reload();
};

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-2xl rounded-2xl p-4 border border-primary/20 z-[999] flex gap-2 items-center">
      <span className="text-[10px] font-black text-gray-400 uppercase mr-2">Simular:</span>
      <button onClick={() => alternarRole('paciente')} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-200 text-[10px]">Paciente</button>
      <button onClick={() => alternarRole('medico')} className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-200 text-[10px]">Médico</button>
      <button onClick={() => alternarRole('secretaria')} className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-bold hover:bg-green-200 text-[10px]">Secretária</button>
    </div>
  );
}

// 2. O NAVBAR PRINCIPAL (O ÚNICO DEFAULT)
export default function Navbar() {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const role = usuarioLogado?.role || 'paciente'; // Padrão é paciente

  const handleSair = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="text-2xl font-black text-primary italic">
          Saúde Digital
        </Link>

        <div className="flex items-center gap-8">
          {/* LINKS DINÂMICOS BASEADOS NA ROLE */}
          {role === 'paciente' && (
            <>
              <Link to="/medicos" className="text-sm font-bold text-secondary hover:text-primary transition-colors">Médicos</Link>
              <Link to="/exames" className="text-sm font-bold text-secondary hover:text-primary transition-colors">Exames</Link>
              <Link to="/meus-agendamentos" className="text-sm font-bold text-secondary hover:text-primary transition-colors">Minhas Consultas</Link>
            </>
          )}

          {role === 'medico' && (
            <>
              <Link to="/agenda-medica" className="text-sm font-bold text-primary hover:underline">Minha Agenda</Link>
              <Link to="/meus-pacientes" className="text-sm font-bold text-secondary hover:text-primary transition-colors">
                Meus Pacientes
              </Link>
            </>
          )}

          {role === 'secretaria' && (
            <>
              <Link to="/admin" className="text-sm font-bold text-green-600 hover:underline">Painel Geral (Admin)</Link>
              <Link to="/gestao-usuarios" className="text-sm font-bold text-secondary">Usuários</Link>
            </>
          )}

          {/* ÁREA DO PERFIL */}
          {usuarioLogado ? (
            <div className="flex items-center gap-4 ml-4 border-l pl-8 border-gray-100">
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{role}</p>
                <p className="text-sm font-black text-secondary">Olá, {usuarioLogado.nome}</p>
              </div>
              
              {/* REMOVA o botão "Entrar" daqui de dentro, deixe apenas o SAIR */}
              <button 
                onClick={handleSair}
                className="text-xs font-black text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
              >
                SAIR
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-xl font-black text-xs uppercase shadow-lg shadow-primary/20">
              Entrar
            </Link>
          )}
        </div>
      </nav>

      {/* Renderiza o seletor apenas em ambiente de desenvolvimento */}
      <RoleSelector />
    </>
  );
}