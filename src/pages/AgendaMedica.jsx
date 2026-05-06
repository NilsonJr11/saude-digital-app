import React, { useState, useEffect } from 'react';
import { X, Clock, User, Activity, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Imports do FullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

export default function AgendaMedica() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [consultaFocada, setConsultaFocada] = useState(null);
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // 1. Carregar Agendamentos
  useEffect(() => {
    const carregarDados = () => {
      const dados = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const formatados = dados
        .filter(agend => agend.medicoNome?.toLowerCase() === usuarioLogado?.nome?.toLowerCase())
        .map(item => ({
          id: item.id,
          title: item.paciente,
          start: `${item.data}T${item.hora}`,
          extendedProps: item 
        }));
      setAgendamentos(formatados);
    };

    carregarDados();
    window.addEventListener('storage', carregarDados);
    return () => window.removeEventListener('storage', carregarDados);
  }, [usuarioLogado?.nome]);

  // 2. Listener de Notificações
  useEffect(() => {
    const escutarMudancas = (e) => {
      if (e.key === 'agendamentos') {
        const novosDados = JSON.parse(e.newValue);
        const antigosDados = JSON.parse(e.oldValue || '[]');
        if (novosDados.length > antigosDados.length) {
          const ultimo = novosDados[novosDados.length - 1];
          toast.success(`Novo agendamento: ${ultimo.paciente} às ${ultimo.hora}`);
        }
      }
    };
    window.addEventListener('storage', escutarMudancas);
    return () => window.removeEventListener('storage', escutarMudancas);
  }, []);

  const handleEventClick = (info) => {
    setConsultaFocada(info.event.extendedProps);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Container Principal */}
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8 px-2">
          <h1 className="text-4xl font-black text-slate-800 italic tracking-tighter">Minha Agenda</h1>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Gestão de Fluxo e Atendimentos</p>
        </div>

        {/* Card do Calendário */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-6 md:p-10 overflow-hidden">
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              locale="pt-br"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear'
              }}
              buttonText={{
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
                year: 'Ano'
              }}
              events={agendamentos}
              eventClick={handleEventClick}
              height="auto"
              aspectRatio={1.35}
              stickyHeaderDates={true}
              eventBackgroundColor="#6366f1"
              eventBorderColor="transparent"
              dayMaxEvents={true}
            />
          </div>
        </div>
      </div>

      {/* --- MODAL DE DETALHES --- */}
      {consultaFocada && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-8 text-white relative">
              <button onClick={() => setConsultaFocada(null)} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full">
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic">{consultaFocada.paciente}</h3>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Detalhes do Agendamento</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center"><Clock size={20}/></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Horário Marcado</p>
                  <p className="font-bold text-secondary">{consultaFocada.hora}</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={() => navigate(`/atendimento/${consultaFocada.id}`)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg"
                >
                  INICIAR ATENDIMENTO <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => setConsultaFocada(null)}
                  className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all"
                >
                  FECHAR JANELA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS para alinhar o FullCalendar */}
      <style>{`
        .fc { max-width: 100% !important; }
        .fc-toolbar-title { 
          font-size: 1.25rem !important; 
          font-weight: 900 !important; 
          text-transform: capitalize;
          color: #1e293b;
        }
        .fc .fc-button-primary {
          background-color: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          color: #64748b !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          font-size: 10px !important;
          letter-spacing: 0.1em !important;
          padding: 8px 16px !important;
          border-radius: 12px !important;
        }
        .fc .fc-button-primary:hover {
          background-color: #6366f1 !important;
          color: white !important;
        }
        .fc .fc-button-active {
          background-color: #1e293b !important;
          border-color: #1e293b !important;
          color: white !important;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border: 1px solid #f1f5f9 !important;
        }
      `}</style>
    </div>
  );
}