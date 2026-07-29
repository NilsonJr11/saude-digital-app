import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function DashboardSecretaria() {
  const [consultas, setConsultas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  
  // Filtro de Médico para a Grade
  const [medicoSelecionado, setMedicoSelecionado] = useState('todos');

  // Filtro de Abas na Lista Rápida ('hoje' | 'pendentes' | 'confirmados' | 'cancelados' | 'todos')
  const [filtroAba, setFiltroAba] = useState('hoje');

  // Controle do Modal de Novo Agendamento
  const [modalAberto, setModalAberto] = useState(false);
  const [novoAgendamento, setNovoAgendamento] = useState({
    paciente_id: '',
    medico_id: '',
    data: new Date().toISOString().split('T')[0],
    hora: '08:00',
    motivo: 'Consulta Geral'
  });

  // Auxiliares para busca de nomes
  const getNomePaciente = (c) => {
    if (c.paciente_nome) return c.paciente_nome;
    const encontrado = pacientes.find(p => Number(p.id) === Number(c.paciente_id));
    return encontrado ? encontrado.nome : `Paciente #${c.paciente_id || '?'}`;
  };

  const getNomeMedico = (c) => {
    if (c.medico_nome) return c.medico_nome;
    const encontrado = medicos.find(m => Number(m.id) === Number(c.medico_id));
    return encontrado ? encontrado.nome : (c.medico_id ? `Dr(a). ID #${c.medico_id}` : 'Não atribuído');
  };

  // Carregar Consultas
  const carregarDadosDoBanco = async () => {
    try {
      const response = await fetch('https://saudedigital.alwaysdata.net/listar_consultas.php');
      if (!response.ok) throw new Error(`Status HTTP: ${response.status}`);
      const dados = await response.json();
      setConsultas(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao listar consultas:", error);
      setConsultas([]);
    }
  };

  // Carregar Usuários
  const carregarUsuariosDoBanco = async () => {
    try {
      const response = await fetch('https://saudedigital.alwaysdata.net/listar_usuarios.php'); 
      if (!response.ok) throw new Error(`Status HTTP: ${response.status}`);
      const dados = await response.json();

      if (Array.isArray(dados)) {
        setMedicos(dados.filter(u => u.perfil?.toLowerCase() === 'medico' || u.perfil?.toLowerCase() === 'médico'));
        setPacientes(dados.filter(u => u.perfil?.toLowerCase() === 'paciente'));
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  useEffect(() => {
    carregarDadosDoBanco();
    carregarUsuariosDoBanco();
  }, []);

  // Alterar Status da Consulta
  const alterarStatusConsulta = async (id, novoStatus) => {
    try {
      const response = await fetch('https://saudedigital.alwaysdata.net/atualizar_status_consulta.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: novoStatus })
      });

      const resultado = await response.json();
      if (resultado.success) {
        carregarDadosDoBanco();
      } else {
        alert("Erro: " + (resultado.error || resultado.mensagem));
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao tentar atualizar o status da consulta.");
    }
  };

  // Salvar Novo Agendamento
  const salvarAgendamentoManual = async (e) => {
    e.preventDefault();
    if (!novoAgendamento.paciente_id || !novoAgendamento.medico_id) {
      alert("Por favor, selecione o Paciente e o Médico.");
      return;
    }

    try {
      const response = await fetch('https://saudedigital.alwaysdata.net/agendar_consulta.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoAgendamento)
      });
      const resultado = await response.json();

      if (resultado.success) {
        alert("Consulta agendada com sucesso!");
        carregarDadosDoBanco();
        setModalAberto(false);
        setNovoAgendamento({
          paciente_id: '',
          medico_id: '',
          data: new Date().toISOString().split('T')[0],
          hora: '08:00',
          motivo: 'Consulta Geral'
        });
      } else {
        alert("Erro ao agendar: " + resultado.error);
      }
    } catch (error) {
      alert("Erro na requisição de agendamento.");
    }
  };

  // Clique no Slot Vago do Calendário
  const handleSlotSelect = (selectInfo) => {
    const dataHoraStr = selectInfo.startStr;
    const [data, horaFull] = dataHoraStr.split('T');
    const hora = horaFull ? horaFull.substring(0, 5) : '08:00';

    setNovoAgendamento(prev => ({
      ...prev,
      data: data,
      hora: hora
    }));
    setModalAberto(true);
  };

  // Notificação WhatsApp
  const enviarNotificacaoWhatsApp = (item) => {
    const telefoneLimpo = item.paciente_telefone?.replace(/\D/g, '') || '';
    const nomePaciente = getNomePaciente(item);
    const nomeMedico = getNomeMedico(item);
    const data = item.data_consulta || item.data_hora?.split(' ')[0] || '';
    const hora = item.horario_consulta?.substring(0, 5) || item.data_hora?.split(' ')[1]?.substring(0, 5) || '';

    const mensagem = encodeURIComponent(
      `Olá ${nomePaciente}! Confirmamos a sua consulta com ${nomeMedico} para o dia ${data} às ${hora}. Responda 1 para CONFIRMAR.`
    );

    window.open(`https://wa.me/55${telefoneLimpo}?text=${mensagem}`, '_blank');
  };

  // Eventos do Calendário
  const eventosCalendarioGeral = consultas
    .filter(c => c.status?.toLowerCase() !== 'cancelado')
    .filter(c => medicoSelecionado === 'todos' || Number(c.medico_id) === Number(medicoSelecionado))
    .map((c) => {
      const data = c.data_consulta || c.data_hora?.split(' ')[0] || '';
      const hora = c.horario_consulta || c.data_hora?.split(' ')[1] || '08:00';
      const startIso = `${data}T${hora.substring(0, 5)}:00`;

      const isConfirmado = c.status?.toLowerCase() === 'confirmado';
      const nomePaciente = getNomePaciente(c);
      const nomeMedico = getNomeMedico(c);

      return {
        id: c.id,
        title: `${nomePaciente} (${nomeMedico})`,
        paciente: nomePaciente,
        medico: nomeMedico,
        start: startIso,
        backgroundColor: isConfirmado ? '#10b981' : '#6366f1',
        borderColor: 'transparent',
      };
    });

  // Lógica de Filtragem Expandida
  const hojeStr = new Date().toISOString().split('T')[0];

  const consultasFiltradas = consultas
    .filter(c => {
      const dataConsulta = c.data_consulta || c.data_hora?.split(' ')[0] || '';
      const statusConsulta = c.status?.toLowerCase() || 'pendente';

      if (filtroAba === 'hoje') return dataConsulta === hojeStr;
      if (filtroAba === 'pendentes') return statusConsulta === 'pendente';
      if (filtroAba === 'confirmados') return statusConsulta === 'confirmado';
      if (filtroAba === 'cancelados') return statusConsulta === 'cancelado';
      return true; // 'todos'
    })
    .sort((a, b) => new Date(b.data_consulta || b.data_hora) - new Date(a.data_consulta || a.data_hora));

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      
      {/* --- CABEÇALHO --- */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel de Controle da Recepção</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Gestão Unificada de Agendamentos e Grade Médica</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white p-2 px-3 rounded-2xl border border-slate-200 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase block">Filtrar Médicos</label>
            <select 
              className="font-bold text-sm text-slate-700 bg-transparent focus:outline-none" 
              value={medicoSelecionado} 
              onChange={e => setMedicoSelecionado(e.target.value)}
            >
              <option value="todos">Todos os Profissionais</option>
              {medicos.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setModalAberto(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2"
          >
            <span className="text-lg">+</span> Novo Agendamento
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* --- CALENDÁRIO --- */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            📅 Grade de Agendamentos Geral
            <span className="text-xs font-normal text-slate-400">(Clique em um horário vago para agendar)</span>
          </h2>
          
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale="pt-br"
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia'
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            selectable={true}
            select={handleSlotSelect}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={eventosCalendarioGeral}
            height="auto"
            slotMinTime="07:00:00"
            slotMaxTime="19:00:00"
            allDaySlot={false}
            expandRows={true}
            eventMinHeight={40}
            slotDuration="00:30:00"
            
            eventContent={(eventInfo) => (
              <div className="p-1 text-white leading-tight overflow-hidden h-full flex flex-col justify-center">
                <div className="font-extrabold text-[11px] truncate text-white">
                  {eventInfo.event.extendedProps.paciente}
                </div>
                <div className="text-[10px] font-semibold opacity-90 truncate text-white mt-0.5">
                  {eventInfo.event.extendedProps.medico}
                </div>
              </div>
            )}
          />
        </div>

        {/* --- LISTA DE AGENDAMENTOS COM NOVAS ABAS --- */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-6">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-black text-slate-800">
              📋 Gestão Rápida de Agendamentos ({consultasFiltradas.length})
            </h2>

            {/* NOVAS ABAS DE FILTRO */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl flex-wrap">
              <button
                onClick={() => setFiltroAba('hoje')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  filtroAba === 'hoje' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Hoje 📅
              </button>

              <button
                onClick={() => setFiltroAba('pendentes')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  filtroAba === 'pendentes' 
                    ? 'bg-white text-amber-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pendentes ⏳
              </button>

              <button
                onClick={() => setFiltroAba('confirmados')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  filtroAba === 'confirmados' 
                    ? 'bg-white text-emerald-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Confirmados ✅
              </button>

              <button
                onClick={() => setFiltroAba('cancelados')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  filtroAba === 'cancelados' 
                    ? 'bg-white text-rose-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Cancelados 🚫
              </button>

              <button
                onClick={() => setFiltroAba('todos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  filtroAba === 'todos' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Todos 📁
              </button>
            </div>
          </div>

          {/* LISTA DE CARDS */}
          <div className="space-y-3">
            {consultasFiltradas.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-medium text-sm">
                Nenhum agendamento encontrado para esta aba.
              </div>
            ) : (
              consultasFiltradas.map((c) => {
                const hora = c.horario_consulta?.substring(0, 5) || c.data_hora?.split(' ')[1]?.substring(0, 5) || "00:00";
                const data = c.data_consulta || c.data_hora?.split(' ')[0] || "";

                const nomePaciente = getNomePaciente(c);
                const nomeMedico = getNomeMedico(c);

                return (
                  <div key={c.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-4 hover:border-slate-200 transition">
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-600 text-white font-black px-3.5 py-2 rounded-xl text-xs tracking-tight text-center">
                        <div>⏱️ {hora}</div>
                        <div className="text-[10px] opacity-80">{data}</div>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">
                          Paciente: {nomePaciente}
                        </h4>
                        <p className="text-xs text-slate-500 font-bold">
                          Médico: <span className="text-indigo-600">{nomeMedico}</span>
                        </p>
                        {c.motivo && <p className="text-xs text-slate-400 italic mt-0.5">Motivo: {c.motivo}</p>}
                      </div>
                    </div>

                    {/* Ações e Badges */}
                    <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        c.status?.toLowerCase() === 'confirmado' ? 'bg-emerald-100 text-emerald-700' :
                        c.status?.toLowerCase() === 'cancelado' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {c.status || 'Pendente'}
                      </span>

                      {/* Botão WhatsApp */}
                      <button
                        onClick={() => enviarNotificacaoWhatsApp(c)}
                        className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm"
                      >
                        <span>💬</span> WhatsApp
                      </button>

                      {/* Botão Confirmar */}
                      {c.status?.toLowerCase() !== 'confirmado' && (
                        <button
                          onClick={() => alterarStatusConsulta(c.id, 'Confirmado')}
                          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm"
                        >
                          <span>✓</span> Confirmar
                        </button>
                      )}

                      {/* Botão Cancelar / Reagendar */}
                      {c.status?.toLowerCase() !== 'cancelado' ? (
                        <button
                          onClick={() => alterarStatusConsulta(c.id, 'Cancelado')}
                          className="flex items-center gap-1 bg-white border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-bold px-3 py-2 rounded-xl transition"
                        >
                          <span>✕</span> Cancelar
                        </button>
                      ) : (
                        <button
                          onClick={() => alterarStatusConsulta(c.id, 'Pendente')}
                          className="flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition"
                        >
                          <span>↺</span> Reativar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* --- MODAL DE AGENDAMENTO --- */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">Novo Agendamento</h3>
              <button 
                onClick={() => setModalAberto(false)} 
                className="text-slate-400 hover:text-slate-600 font-black text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={salvarAgendamentoManual} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 mb-1">Paciente</label>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:border-indigo-600" 
                  value={novoAgendamento.paciente_id} 
                  onChange={e => setNovoAgendamento({...novoAgendamento, paciente_id: e.target.value})}
                >
                  <option value="">Selecione o Paciente...</option>
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 mb-1">Médico</label>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:border-indigo-600" 
                  value={novoAgendamento.medico_id} 
                  onChange={e => setNovoAgendamento({...novoAgendamento, medico_id: e.target.value})}
                >
                  <option value="">Selecione o Médico...</option>
                  {medicos.map(m => (
                    <option key={m.id} value={m.id}>{m.nome} - {m.especialidade || 'Geral'}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 mb-1">Data</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:border-indigo-600" 
                    value={novoAgendamento.data} 
                    onChange={e => setNovoAgendamento({...novoAgendamento, data: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 mb-1">Horário</label>
                  <input 
                    type="time" 
                    className="w-full p-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:border-indigo-600" 
                    value={novoAgendamento.hora} 
                    onChange={e => setNovoAgendamento({...novoAgendamento, hora: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 mb-1">Motivo da Consulta</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:border-indigo-600" 
                  value={novoAgendamento.motivo} 
                  onChange={e => setNovoAgendamento({...novoAgendamento, motivo: e.target.value})} 
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl transition shadow-md"
                >
                  Salvar
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
      
    </div>
  );
}