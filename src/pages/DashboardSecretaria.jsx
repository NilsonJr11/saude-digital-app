import React, { useState, useEffect } from 'react';

export default function DashboardSecretaria() {
  const [consultas, setConsultas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  
  // Filtros da Agenda
  const [medicoSelecionado, setMedicoSelecionado] = useState('todos');
  const [dataFiltro, setDataFiltro] = useState(new Date().toISOString().split('T')[0]);

  // Formulário de Novo Agendamento Direto pela Administração
  const [novoAgendamento, setNovoAgendamento] = useState({
    paciente_id: '',
    medico_id: '',
    data: new Date().toISOString().split('T')[0],
    hora: '08:00',
    motivo: 'Consulta Geral'
  });

  // 1. Carrega as Consultas do Banco
  const carregarDadosDoBanco = async () => {
    try {
      const response = await fetch (`${import.meta.env.VITE_API_BASE_URL}/listar_consultas.php`);
      if (!response.ok) {
        throw new Error(`Servidor respondeu com status ${response.status}`);
      }
      const dados = await response.json();
      
      if (Array.isArray(dados)) {
        setConsultas(dados);
      } else {
        console.warn("A API de consultas não retornou uma lista válida:", dados);
        setConsultas([]);
      }
    } catch (error) {
      console.error("Erro ao listar consultas:", error);
      setConsultas([]);
    }
  };

  // 2. Carrega os Usuários do Banco e Separa Médicos de Pacientes
  const carregarUsuariosDoBanco = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/listar_usuarios.php`);
      if (!response.ok) {
        throw new Error(`Servidor respondeu com status ${response.status}`);
      }
      const dados = await response.json();

      if (Array.isArray(dados)) {
        // Filtra os usuários com base na coluna 'perfil' vinda do banco
        const listaMedicos = dados.filter(u => u.perfil?.toLowerCase() === 'medico' || u.perfil?.toLowerCase() === 'médico');
        const listaPacientes = dados.filter(u => u.perfil?.toLowerCase() === 'paciente');
        
        setMedicos(listaMedicos);
        setPacientes(listaPacientes);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários para os filtros:", error);
    }
  };

  useEffect(() => {
    carregarDadosDoBanco();
    carregarUsuariosDoBanco(); // Alimenta os dropdowns ao carregar a página
  }, []);

  // 3. Altera o Status da Consulta dinamicamente (Confirmar, Cancelar, Atendido)
  const alterarStatusConsulta = async (id, novoStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/atualizar_status_consulta.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: novoStatus })
      });
      const resultado = await response.json();
      if (resultado.success) {
        carregarDadosDoBanco();
      } else {
        alert("Erro ao atualizar status: " + resultado.error);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  // 4. Cria um agendamento manual pela Administração
  const salvarAgendamentoManual = async (e) => {
    e.preventDefault();
    if (!novoAgendamento.paciente_id || !novoAgendamento.medico_id) {
      alert("Por favor, selecione o Paciente e o Médico.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/agendar_consulta.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoAgendamento)
      });
      const resultado = await response.json();
      if (resultado.success) {
        alert("Consulta agendada com sucesso na grade!");
        carregarDadosDoBanco();
        setNovoAgendamento({ ...novoAgendamento, paciente_id: '', medico_id: '' });
      } else {
        alert("Erro: " + resultado.error);
      }
    } catch (error) {
      alert("Erro ao salvar agendamento.");
    }
  };

  // 5. Filtra as consultas de forma resiliente (Suporta data_consulta ou data_hora)
  const consultasFiltradas = consultas.filter(c => {
    const dataConsulta = c.data_consulta || c.data_hora?.split(' ')[0];
    const bateData = dataConsulta === dataFiltro;
    const bateMedico = medicoSelecionado === 'todos' || Number(c.medico_id) === Number(medicoSelecionado);
    return bateData && bateMedico;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      
      {/* CABEÇALHO */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel de Controle da Administração</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Gestão e Monitoramento de Grade Dinâmica</p>
        </div>
        
        {/* FILTROS DA AGENDA */}
        <div className="flex flex-wrap gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 mb-1">Data da Grade</label>
            <input type="date" className="p-2 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:border-indigo-600" value={dataFiltro} onChange={e => setDataFiltro(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 mb-1">Filtrar por Médico</label>
            <select className="p-2 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:border-indigo-600" value={medicoSelecionado} onChange={e => setMedicoSelecionado(e.target.value)}>
              <option value="todos">Todos os Profissionais</option>
              {medicos.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* GRADE DE HORÁRIOS */}
        <div className="lg:col-span-2 bg-white rounded-[40px] shadow-sm border border-slate-100 p-6">
          <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            📅 Horários Marcados para o Dia <span className="text-indigo-600 font-medium text-base">({consultasFiltradas.length})</span>
          </h2>

          {consultasFiltradas.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <span className="text-4xl block mb-2">🏖️</span>
              <p className="text-slate-400 font-bold">Nenhuma consulta agendada para os critérios selecionados.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {consultasFiltradas.map(c => {
                // Suporta o formato direto ou o extraído por string split
                const horaExibicao = c.horario_consulta?.substring(0, 5) || c.data_hora?.split(' ')[1]?.substring(0, 5) || "00:00";
                
                return (
                  <div key={c.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-600 text-white font-black px-4 py-2.5 rounded-xl text-sm shadow-sm tracking-tight">
                        ⏱️ {horaExibicao}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-base">Paciente: {c.paciente_nome || `ID #${c.paciente_id}`}</h4>
                        <p className="text-xs text-slate-500 font-bold">Médico: <span className="text-indigo-600">{c.medico_nome || `ID #${c.medico_id}`}</span></p>
                        <p className="text-xs text-slate-400 italic mt-0.5">Motivo: {c.motivo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mr-2 ${
                        c.status === 'Confirmado' || c.status === 'Agendado' ? 'bg-emerald-100 text-emerald-700' :
                        c.status === 'Cancelado' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {c.status}
                      </span>
                      
                      {c.status !== 'Atendido' && c.status !== 'Cancelado' && (
                        <>
                          <button onClick={() => alterarStatusConsulta(c.id, 'Atendido')} className="bg-white hover:bg-emerald-600 hover:text-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all">✓ Atender</button>
                          <button onClick={() => alterarStatusConsulta(c.id, 'Cancelado')} className="bg-white hover:bg-rose-600 hover:text-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all">✕ Cancelar</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FORMULÁRIO DE NOVO AGENDAMENTO */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-6 h-fit">
          <h3 className="text-xl font-black text-slate-800 mb-6">Novo Agendamento</h3>
          
          <form onSubmit={salvarAgendamentoManual} className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 mb-1">Selecionar Paciente</label>
              <select className="w-full p-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:border-indigo-600" value={novoAgendamento.paciente_id} onChange={e => setNovoAgendamento({...novoAgendamento, paciente_id: e.target.value})}>
                <option value="">Selecione o Paciente...</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 mb-1">Selecionar Profissional</label>
              <select className="w-full p-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:border-indigo-600" value={novoAgendamento.medico_id} onChange={e => setNovoAgendamento({...novoAgendamento, medico_id: e.target.value})}>
                <option value="">Selecione o Médico...</option>
                {medicos.map(m => (
                  <option key={m.id} value={m.id}>{m.nome} - {m.especialidade || 'Geral'}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 mb-1">Data</label>
                <input type="date" className="w-full p-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:border-indigo-600" value={novoAgendamento.data} onChange={e => setNovoAgendamento({...novoAgendamento, data: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 mb-1">Horário</label>
                <input type="time" className="w-full p-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:border-indigo-600" value={novoAgendamento.hora} onChange={e => setNovoAgendamento({...novoAgendamento, hora: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block ml-1 mb-1">Motivo da Consulta</label>
              <input type="text" className="w-full p-3 border border-slate-200 rounded-xl font-bold text-sm text-slate-700 focus:outline-none focus:border-indigo-600" value={novoAgendamento.motivo} onChange={e => setNovoAgendamento({...novoAgendamento, motivo: e.target.value})} />
            </div>

            <button type="submit" className="w-full mt-2 bg-indigo-600 text-white py-4 rounded-xl font-black uppercase text-sm tracking-wider shadow-md hover:bg-indigo-700 transition-all">
              Inserir na Grade Real
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}