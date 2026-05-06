import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, Clock, CheckCircle, Search, Trash2, X } from 'lucide-react';

export default function DashboardSecretaria() {
  // --- ESTADOS (Todos dentro do componente) ---
  const [agendamentos, setAgendamentos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [listaPacientes, setListaPacientes] = useState([]);
  const [novoAgend, setNovoAgend] = useState({
    paciente: "",
    data: new Date().toISOString().split('T')[0],
    hora: "08:00",
    medicoNome: "Dr. Ricardo Vaz",
    status: "confirmado"
  });

  // --- EFEITOS (Carregar dados) ---
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const cadastrados = JSON.parse(localStorage.getItem('cadastro_pacientes') || '[]');
    setAgendamentos(dados);
    setListaPacientes(cadastrados);
  }, [modalAberto]);

  // --- FUNÇÕES DE LÓGICA ---
  const salvarAgendamento = (e) => {
    e.preventDefault();
    const agendamentosExistentes = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const finalAgend = { ...novoAgend, id: Date.now().toString() };
    const novosDados = [...agendamentosExistentes, finalAgend];
    
    localStorage.setItem('agendamentos', JSON.stringify(novosDados));
    setAgendamentos(novosDados);
    setModalAberto(false);
    setNovoAgend({ paciente: "", data: new Date().toISOString().split('T')[0], hora: "08:00", medicoNome: "Dr. Ricardo Vaz", status: "confirmado" });
    alert("Consulta agendada com sucesso!");
  };

  // Métricas
  const hoje = new Date().toLocaleDateString();
  const agendamentosHoje = agendamentos.filter(a => a.data === hoje || a.data === new Date().toISOString().split('T')[0]);
  const concluidos = agendamentosHoje.filter(a => a.status === 'concluido').length;
  const pendentes = agendamentosHoje.length - concluidos;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-secondary italic tracking-tighter">Painel da Secretária</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Gestão de Fluxo e Agendamentos</p>
          </div>
          <button 
            onClick={() => setModalAberto(true)}
            className="bg-primary text-white px-8 py-4 rounded-[25px] font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={20} /> NOVO AGENDAMENTO
          </button>
        </header>

        {/* Cards de Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 w-full">
          <StatCard icon={<Calendar className="text-blue-500" />} label="Total Hoje" value={agendamentosHoje.length} />
          <StatCard icon={<Clock className="text-orange-500" />} label="Pendentes" value={pendentes} />
          <StatCard icon={<CheckCircle className="text-primary" />} label="Concluídos" value={concluidos} />
        </div>

        {/* Lista de Agendamentos */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-black text-secondary text-xl">Agenda do Dia</h3>
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input 
                type="text" 
                placeholder="Buscar paciente..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-full border-none text-sm font-bold shadow-inner"
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-4">Horário</th>
                  <th className="px-8 py-4">Paciente</th>
                  <th className="px-8 py-4">Médico</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
            {agendamentosHoje.length > 0 ? agendamentosHoje.map((agend, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                {/* Horário com destaque */}
                <td className="px-8 py-6 font-black text-secondary">
                    <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-300" />
                    {agend.hora || "08:00"}
                    </div>
                </td>
                
                {/* Paciente com Avatar */}
                <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-[10px] font-black text-primary">
                        {agend.paciente ? agend.paciente[0].toUpperCase() : "P"}
                    </div>
                    <span className="font-bold text-secondary">{agend.paciente}</span>
                    </div>
                </td>

                {/* Médico (Garantindo que apareça) */}
                <td className="px-8 py-6">
                    <p className="text-sm font-bold text-gray-500">{agend.medicoNome || "Dr. Ricardo Vaz"}</p>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Clínico Geral</p>
                </td>

                {/* Status estilizado */}
                <td className="px-8 py-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    agend.status === 'concluido' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                    {agend.status === 'confirmado' ? '• agendado' : agend.status}
                    </span>
                </td>
                </tr>
            )) : (
                <tr>
                <td colSpan="4" className="px-8 py-12 text-center">
                    <p className="text-gray-400 font-bold italic">Nenhum agendamento para hoje.</p>
                </td>
                </tr>
            )}
            </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL DE NOVO AGENDAMENTO --- */}
      {modalAberto && (
        <div className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-secondary italic">Novo Agendamento</h2>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Marcar Consulta no Sistema</p>
              </div>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={salvarAgendamento} className="p-8 space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Selecionar Paciente</label>
                <select 
                  required
                  className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-secondary outline-none appearance-none"
                  value={novoAgend.paciente}
                  onChange={(e) => setNovoAgend({...novoAgend, paciente: e.target.value})}
                >
                  <option value="">Escolha um paciente...</option>
                  {listaPacientes.map(p => (
                    <option key={p.id} value={p.nome}>{p.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Data</label>
                  <input 
                    type="date"
                    className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-secondary"
                    value={novoAgend.data}
                    onChange={(e) => setNovoAgend({...novoAgend, data: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Horário</label>
                  <input 
                    type="time"
                    className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-secondary"
                    value={novoAgend.hora}
                    onChange={(e) => setNovoAgend({...novoAgend, hora: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-secondary transition-all mt-4">
                CONFIRMAR AGENDAMENTO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    // Adicionado min-h e flex-col para forçar a simetria entre os 3 cards
    <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm flex items-center gap-6 min-h-[160px] w-full transition-transform hover:scale-[1.02]">
      <div className="p-4 bg-gray-50 rounded-2xl flex-shrink-0">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <div className="flex flex-col">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-4xl font-black text-secondary leading-none">{value}</p>
      </div>
    </div>
  );
}