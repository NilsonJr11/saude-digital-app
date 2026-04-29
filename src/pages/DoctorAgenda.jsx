import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, CheckCircle, Search } from 'lucide-react';

export default function DoctorAgenda() {
  const navigate = useNavigate();
  const [minhaAgenda, setMinhaAgenda] = useState([]);
  const [filtro, setFiltro] = useState('');
  
  // Pegamos os dados do médico que está logado no momento
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    const carregarAgenda = () => {
      const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      
      // FILTRO CRUCIAL: Só mostra agendamentos para este médico específico
      const filtradosPorMedico = todosAgendamentos.filter(
        agend => agend.medicoNome === usuarioLogado?.nome && agend.tipo === 'medico'
      );
      
      // Ordenar por data e hora (mais próximos primeiro)
      const ordenados = filtradosPorMedico.sort((a, b) => {
        return new Date(a.data + 'T' + a.hora) - new Date(b.data + 'T' + b.hora);
      });

      setMinhaAgenda(ordenados);
    };

    carregarAgenda();
  }, [usuarioLogado?.nome]);

  const agendaFiltrada = minhaAgenda.filter(a => 
    a.paciente.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-secondary">Minha Agenda</h1>
          <p className="text-gray-500 font-bold">Bem-vindo(a), Dr(a). {usuarioLogado?.nome}</p>
        </header>

        {/* RESUMO DO DIA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Pacientes Hoje</p>
            <p className="text-3xl font-black text-primary">{agendaFiltrada.length}</p>
          </div>
        </div>

        {/* BUSCA */}
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-4">
          <Search className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar paciente na agenda..."
            className="w-full outline-none font-medium"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {/* LISTA DE ATENDIMENTOS */}
        <div className="space-y-4">
          {agendaFiltrada.length > 0 ? (
            agendaFiltrada.map((slot) => (
              <div key={slot.id} className="...">
                {/* ... dados do paciente ... */}

            <div className="flex items-center gap-3">
              {slot.status === 'Finalizado' ? (
                <div className="flex items-center gap-2 text-green-600 font-black uppercase text-xs bg-green-50 px-4 py-2 rounded-xl">
                  <CheckCircle size={16} /> Atendimento Concluído
                </div>
              ) : (
                <>
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    {slot.status || 'Confirmado'}
                  </span>
                  <button 
                    onClick={() => navigate(`/atendimento/${slot.id}`)}
                    className="bg-secondary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary transition-all shadow-md"
                  >
                    Iniciar Atendimento
                  </button>
                </>
              )}
            </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold">Nenhum paciente agendado para os critérios selecionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}