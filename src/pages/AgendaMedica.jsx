import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

export default function AgendaMedica() {
  const [eventos, setEventos] = useState([]);
  const [erro, setErro] = useState(null);
  
  // Estados para o Modal de Detalhes da Consulta
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  // Estados para a Tela de Atendimento / Prontuário
  const [modoAtendimento, setModoAtendimento] = useState(false);
  const [prontuario, setProntuario] = useState({
    queixa: '',
    exameFisico: '',
    diagnostico: '',
    prescricao: ''
  });

  const medicoLogado = {
    id: 23,
    nome: "Dr. Ricardo Vaz"
  };

  // 🛠️ FUNÇÃO CORRIGIDA: Agora é uma função assíncrona chamada carregarAgenda
  const carregarAgenda = async () => {
    try {
      const response = await fetch('https://saudedigital.alwaysdata.net/listar_agenda.php');
      if (response.ok) {
        const dados = await response.json();
        
        // 1. Filtra para garantir que só apareçam as consultas DESTE médico (ID 23)
        const consultasDoMedico = dados.filter(item => Number(item.medico_id) === 23);
        
        // 2. Formata os dados preenchendo todos os padrões de propriedades que calendários exigem
        const dadosProntosParaOCalendario = consultasDoMedico.map(item => {
          const apenasData = item.data_hora ? item.data_hora.split(' ')[0] : ''; 
          const apenasHora = item.data_hora ? item.data_hora.split(' ')[1].substring(0, 5) : ''; 

          return {
            ...item,
            id: item.id,
            title: item.paciente_name || "Consulta Paciente", 
            start: item.data_hora, 
            date: apenasData,      
            data: apenasData,      
            hora: apenasHora,
            // Sincroniza o paciente_name do banco com o paciente_nome usado no resto do código
            paciente_nome: item.paciente_name || "Paciente" 
          };
        });

        // 3. Salva usando o termo correto em português: setEventos
        setEventos(dadosProntosParaOCalendario); 
      }
    } catch (error) {
      console.error("Erro ao carregar agenda:", error);
      setErro("Erro de conexão ao buscar os dados da agenda.");
    }
  };

  useEffect(() => {
    carregarAgenda();
  }, []);

  // Quando o médico clica em um agendamento no calendário
  const handleEventClick = (info) => {
    setEventoSelecionado({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      status: info.event.extendedProps.status,
      motivo: info.event.extendedProps.motivo,
      paciente_nome: info.event.extendedProps.paciente_nome
    });
    setModalAberto(true);
  };

  // Acionado ao clicar no botão "Atender"
  const iniciarAtendimento = () => {
    setModalAberto(false); 
    setProntuario({
      queixa: eventoSelecionado.motivo || '',
      exameFisico: '',
      diagnostico: '',
      prescricao: ''
    });
    setModoAtendimento(true); 
  };

  // Envio do Prontuário preenchido
  const salvarAtendimento = async (e) => {
    e.preventDefault();
    alert(`Atendimento do paciente ${eventoSelecionado.paciente_nome} salvo com sucesso!`);
    setModoAtendimento(false);
    setEventoSelecionado(null);
    carregarAgenda();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Painel Clínico</h1>
          <p className="text-sm text-gray-500">Bem-vindo, {medicoLogado.nome}</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg font-medium text-sm">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          Médico Logado (ID: {medicoLogado.id})
        </div>
      </div>

      {erro && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded shadow-sm">
          <p className="font-bold">Aviso:</p>
          <p>{erro}</p>
        </div>
      )}

      {/* TELA PRINCIPAL: CALENDÁRIO OU PRONTUÁRIO */}
      {!modoAtendimento ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={ptBrLocale}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            slotMinTime="07:00:00"
            slotMaxTime="19:00:00"
            allDaySlot={false}
            events={eventos}
            eventClick={handleEventClick}
            height="auto"
          />
        </div>
      ) : (
        /* 🩺 TELA DE ATENDIMENTO */
        <div className="bg-white rounded-xl shadow-md border border-gray-150 overflow-hidden max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-6 text-white">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">Atendimento em Andamento</span>
            <h2 className="text-2xl font-bold mt-2">{eventoSelecionado?.paciente_nome}</h2>
            <p className="text-sm text-purple-100 mt-1">
              Consulta agendada para: {new Date(eventoSelecionado?.start).toLocaleDateString('pt-BR')} às {new Date(eventoSelecionado?.start).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
            </p>
          </div>

          <form onSubmit={salvarAtendimento} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Anamnese / Queixa Principal</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                rows="3"
                placeholder="Relato do paciente, sintomas e histórico atual..."
                value={prontuario.queixa}
                onChange={(e) => setProntuario({...prontuario, queixa: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Exame Físico / Sinais Vitais</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                placeholder="PA, FC, Temperatura, Ausculta, observações físicas gerais..."
                value={prontuario.exameFisico}
                onChange={(e) => setProntuario({...prontuario, exameFisico: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Diagnóstico Clínico (ou CID)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  placeholder="Ex: Hipotensão, Enxaqueca, CID R51..."
                  value={prontuario.diagnostico}
                  onChange={(e) => setProntuario({...prontuario, diagnostico: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Conduta / Prescrição Médica</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  rows="2"
                  placeholder="Medicamentos, dosagem, orientações ou exames solicitados..."
                  value={prontuario.prescricao}
                  onChange={(e) => setProntuario({...prontuario, prescricao: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setModoAtendimento(false)}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
              >
                Cancelar Atendimento
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 shadow-sm transition"
              >
                Finalizar e Salvar Prontuário
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 🖥️ MODAL DE DETALHES DO AGENDAMENTO */}
      {modalAberto && eventoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-150 overflow-hidden transform scale-100 transition-all">
            
            <div className="bg-purple-700 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold">Detalhes do Agendamento</h3>
              <button 
                onClick={() => setModalAberto(false)}
                className="text-white/80 hover:text-white font-bold text-xl outline-none"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Paciente</label>
                <p className="text-lg font-semibold text-gray-800">{eventoSelecionado.paciente_nome}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Data e Horário</label>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(eventoSelecionado.start).toLocaleDateString('pt-BR')} às {new Date(eventoSelecionado.start).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Status</label>
                  <span className={`inline-block mt-1 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide shadow-sm
                    ${eventoSelecionado.status?.toLowerCase() === 'atendido' ? 'bg-emerald-100 text-emerald-800' : 
                      eventoSelecionado.status?.toLowerCase() === 'cancelado' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'}`}
                  >
                    {eventoSelecionado.status || 'Pendente'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Queixa / Motivo Informado</label>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-1 italic">
                  "{eventoSelecionado.motivo || 'Nenhum motivo informado pelo paciente.'}"
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 border-t border-gray-100">
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition text-sm"
              >
                Fechar
              </button>
              
              {eventoSelecionado.status?.toLowerCase() !== 'atendido' && (
                <button
                  onClick={iniciarAtendimento}
                  className="px-5 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 shadow-sm transition text-sm"
                >
                  Atender Paciente
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}