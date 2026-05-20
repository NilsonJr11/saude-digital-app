import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, CheckCircle, Search, X, UserPlus, MessageSquare } from 'lucide-react';

export default function DashboardSecretaria() {
  const [modalAberto, setModalAberto] = useState(false);
  const [modalPacienteAberto, setModalPacienteAberto] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [listaPacientes, setListaPacientes] = useState([]);
  const [listaMedicos, setListaMedicos] = useState([]); // Novo Estado para Médicos
  const [dadosDashboard, setDadosDashboard] = useState({ 
    cards: { total: 0, pendentes: 0, concluidos: 0 }, 
    agenda: [] 
  });

  const [novoAgend, setNovoAgend] = useState({
    paciente_id: "",
    medico_id: "", // Novo campo iniciado vazio
    data: new Date().toISOString().split('T')[0],
    hora: "08:00"
  });

  const [novoPaciente, setNovoPaciente] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    data_nascimento: ""
  });

  const aplicarMascaraCPF = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').substring(0, 14);
  };

  const aplicarMascaraTelefone = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 15);
  };

  const buscarDados = async () => {
    try {
      const response = await fetch('http://localhost/saude-digital-api/get_estatisticas.php');
      const data = await response.json();
      setDadosDashboard(data);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    }
  };

  const buscarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost/saude-digital-api/listar_usuarios.php');
      const data = await response.json();
      // Separa quem é paciente e quem é médico baseado no perfil do MariaDB
      setListaPacientes(data.filter(u => u.perfil === 'paciente' || !u.perfil));
      setListaMedicos(data.filter(u => u.perfil === 'medico'));
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  useEffect(() => {
    buscarDados();
    buscarUsuarios();
  }, []);

  const agendaFiltrada = dadosDashboard.agenda.filter(item =>
    item.paciente.toLowerCase().includes(filtro.toLowerCase())
  );

  const salvarAgendamento = async (e) => {
    e.preventDefault();
    if (!novoAgend.paciente_id) { alert("Selecione um paciente."); return; }
    if (!novoAgend.medico_id) { alert("Selecione um médico responsável."); return; }

    try {
      const response = await fetch('http://localhost/saude-digital-api/agendar_consulta.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoAgend)
      });
      const resultado = await response.json();
      if (resultado.success) {
        alert("Consulta agendada com sucesso!");
        setModalAberto(false);
        setNovoAgend({ paciente_id: "", medico_id: "", data: new Date().toISOString().split('T')[0], hora: "08:00" });
        buscarDados();
      } else {
        alert("Erro: " + resultado.error);
      }
    } catch (error) {
      alert("Erro ao conectar ao servidor.");
    }
  };

  const salvarPaciente = async (e) => {
    e.preventDefault();
    if (novoPaciente.cpf && novoPaciente.cpf.length !== 14) { alert("CPF inválido."); return; }
    if (novoPaciente.telefone && novoPaciente.telefone.length < 14) { alert("Telefone inválido."); return; }

    try {
      const response = await fetch('http://localhost/saude-digital-api/cadastrar_paciente.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoPaciente)
      });
      const resultado = await response.json();
      if (resultado.success) {
        alert("Paciente cadastrado com sucesso!");
        setModalPacienteAberto(false);
        setNovoPaciente({ nome: "", email: "", telefone: "", cpf: "", data_nascimento: "" });
        buscarUsuarios();
      } else {
        alert("Erro ao cadastrar: " + resultado.error);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-800 italic tracking-tighter">Painel da Secretária</h1>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Gestão de Fluxo em Tempo Real</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setModalPacienteAberto(true)} className="bg-emerald-600 text-white px-6 py-4 rounded-[25px] font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-emerald-100">
              <UserPlus size={18} /> CADASTRAR PACIENTE
            </button>
            <button onClick={() => setModalAberto(true)} className="bg-indigo-600 text-white px-6 py-4 rounded-[25px] font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-indigo-100">
              <Plus size={18} /> NOVO AGENDAMENTO
            </button>
          </div>
        </header>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 w-full">
          <StatCard icon={<Calendar className="text-blue-500" />} label="Total Hoje" value={dadosDashboard.cards.total} />
          <StatCard icon={<Clock className="text-orange-500" />} label="Pendentes" value={dadosDashboard.cards.pendentes} />
          <StatCard icon={<CheckCircle className="text-emerald-500" />} label="Concluídos" value={dadosDashboard.cards.concluidos} />
        </div>

        {/* TABELA */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-black text-slate-800 text-xl">Agenda do Dia</h3>
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input type="text" placeholder="Buscar paciente..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-full border-none text-sm font-bold shadow-inner" onChange={(e) => setFiltro(e.target.value)} />
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
                  <th className="px-8 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {agendaFiltrada.length > 0 ? agendaFiltrada.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-6 font-black text-slate-700">
                      <div className="flex items-center gap-2"><Clock size={14} className="text-indigo-400" />{item.hora}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-[10px] font-black text-indigo-600">
                          {item.paciente ? item.paciente[0].toUpperCase() : "P"}
                        </div>
                        <span className="font-bold text-slate-700">{item.paciente}</span>
                      </div>
                    </td>
                    {/* --- EXIBE O MÉDICO RETORNADO PELO INNER JOIN --- */}
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-tight">
                        {item.medico || "Não informado"}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        item.status === 'concluido' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                      }`}>{item.status}</span>
                    </td>

                    {/* --- GATILHO INTERNO DO WHATSAPP --- */}
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => {
                          // Remove qualquer espaço, parênteses ou traço que a máscara tenha colocado
                          let limpaFone = item.paciente_telefone ? item.paciente_telefone.replace(/\D/g, '') : '';
                          
                          // Se o número foi digitado sem o 55 no início, nós adicionamos automaticamente
                          if (limpaFone.length > 0 && !limpaFone.startsWith('55')) {
                            limpaFone = '55' + limpaFone;
                          }

                          const msg = encodeURIComponent(`Olá, ${item.paciente}! Confirmamos sua consulta hoje às ${item.hora} com o(a) ${item.medico}. Por favor, chegue com 15 minutos de antecedência.`);
                          
                          // Dispara diretamente para o WhatsApp do paciente real
                          window.open(`https://api.whatsapp.com/send?phone=${limpaFone}&text=${msg}`, '_blank');
                        }}
                        className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase px-3 py-2 rounded-xl transition-all shadow-md shadow-emerald-100"
                      >
                        <MessageSquare size={12} /> Notificar
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="px-8 py-12 text-center text-gray-400 font-bold italic">Nenhum agendamento para hoje.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL NOVO PACIENTE --- */}
      {modalPacienteAberto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-800 italic">Cadastrar Novo Paciente</h2>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Salvar registro no MariaDB</p>
              </div>
              <button onClick={() => setModalPacienteAberto(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={salvarPaciente} className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nome Completo</label>
                <input type="text" required className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-slate-700" value={novoPaciente.nome} onChange={e => setNovoPaciente({...novoPaciente, nome: e.target.value})}/>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">E-mail</label>
                <input type="email" className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-slate-700" value={novoPaciente.email} onChange={e => setNovoPaciente({...novoPaciente, email: e.target.value})}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Telefone</label>
                  <input type="text" placeholder="(11) 99999-9999" className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-slate-700" value={novoPaciente.telefone} onChange={e => setNovoPaciente({...novoPaciente, telefone: aplicarMascaraTelefone(e.target.value)})}/>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">CPF</label>
                  <input type="text" placeholder="000.000.000-00" className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-slate-700" value={novoPaciente.cpf} onChange={e => setNovoPaciente({...novoPaciente, cpf: aplicarMascaraCPF(e.target.value)})}/>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Data de Nascimento</label>
                <input type="date" className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-slate-700" value={novoPaciente.data_nascimento} onChange={e => setNovoPaciente({...novoPaciente, data_nascimento: e.target.value})}/>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-emerald-700 transition-all mt-4">SALVAR PACIENTE</button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL NOVO AGENDAMENTO COM SELEÇÃO DE MÉDICO --- */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-800 italic">Novo Agendamento</h2>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Vincular consulta ao MariaDB</p>
              </div>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={salvarAgendamento} className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Selecionar Paciente</label>
                <select required className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-slate-700 outline-none" value={novoAgend.paciente_id} onChange={e => setNovoAgend({...novoAgend, paciente_id: e.target.value})}>
                  <option value="">Escolha um paciente cadastrado...</option>
                  {listaPacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>

              {/* CAMPO NOVO DE SELEÇÃO DO MÉDICO */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Selecionar Médico Responsável</label>
                <select required className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-slate-700 outline-none" value={novoAgend.medico_id} onChange={e => setNovoAgend({...novoAgend, medico_id: e.target.value})}>
                  <option value="">Escolha um dos 4 médicos fixos...</option>
                  {listaMedicos.map(m => <option key={m.id} value={m.id}>{m.nome} ({m.especialidade})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Data</label>
                  <input type="date" required className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-slate-700" value={novoAgend.data} onChange={e => setNovoAgend({...novoAgend, data: e.target.value})}/>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Horário</label>
                  <input type="time" required className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-slate-700" value={novoAgend.hora} onChange={e => setNovoAgend({...novoAgend, hora: e.target.value})}/>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-indigo-700 transition-all mt-4">CONFIRMAR E SALVAR NO BANCO</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm flex items-center gap-6 min-h-[160px] w-full hover:scale-[1.02] transition-transform">
      <div className="p-4 bg-gray-50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-4xl font-black text-slate-800 leading-none">{value}</p>
      </div>
    </div>
  );
}