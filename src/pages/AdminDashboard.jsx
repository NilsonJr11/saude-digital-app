import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Microscope, Trash2, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos"); // todos, medico, exame

  // Carrega os dados do "banco"
  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    setAgendamentos(dados.sort((a, b) => b.id - a.id)); // Mais recentes primeiro
  }, []);

  // Lógica de Deletar
  const excluirAgendamento = (id) => {
    if (window.confirm("Deseja realmente excluir este registro?")) {
      const novaLista = agendamentos.filter(a => a.id !== id);
      localStorage.setItem('agendamentos', JSON.stringify(novaLista));
      setAgendamentos(novaLista);
    }
  };

  // Lógica de Filtro Combinada (Busca + Tipo)
  const agendamentosFiltrados = agendamentos.filter(item => {
    const matchesBusca = 
      item.paciente?.toLowerCase().includes(busca.toLowerCase()) ||
      item.medicoNome?.toLowerCase().includes(busca.toLowerCase()) ||
      item.exame?.toLowerCase().includes(busca.toLowerCase());
    
    const matchesTipo = filtroTipo === "todos" || item.tipo === filtroTipo;

    return matchesBusca && matchesTipo;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        
        {/* HEADER COM STATUS */}
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-secondary tracking-tighter">Painel de Controle</h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Gestão da Recepção • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex gap-6">
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase">Total</p>
              <p className="text-xl font-black text-primary">{agendamentos.length}</p>
            </div>
            <div className="w-px bg-gray-100"></div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase">Hoje</p>
              <p className="text-xl font-black text-secondary">
                {agendamentos.filter(a => a.data === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
          </div>
        </header>

        {/* BARRA DE FERRAMENTAS (BUSCA E FILTROS) */}
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por paciente, médico ou exame..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary outline-none font-bold transition-all"
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl">
            {['todos', 'medico', 'exame'].map(tipo => (
              <button
                key={tipo}
                onClick={() => setFiltroTipo(tipo)}
                className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  filtroTipo === tipo ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tipo === 'todos' ? 'Todos' : tipo === 'medico' ? 'Consultas' : 'Exames'}
              </button>
            ))}
          </div>
        </div>

        {/* LISTA DE AGENDAMENTOS */}
        <div className="grid grid-cols-1 gap-4">
          {agendamentosFiltrados.length > 0 ? (
            agendamentosFiltrados.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
                    item.tipo === 'exame' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {item.tipo === 'exame' ? <Microscope /> : <Calendar />}
                  </div>
                  
                  <div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                      item.tipo === 'exame' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {item.tipo === 'exame' ? 'Procedimento' : 'Consulta Médica'}
                    </span>
                    <h3 className="text-xl font-black text-secondary">{item.paciente}</h3>
                    <p className="text-sm font-bold text-gray-400">
                      {item.tipo === 'exame' ? item.exame : `Dr(a). ${item.medicoNome}`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-end items-center gap-8 w-full md:w-auto">
                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-black text-gray-300 uppercase">Data e Hora</p>
                    <p className="font-black text-secondary">{item.data} às {item.hora || item.horario}</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert("Funcionalidade: Confirmar Presença")}
                      className="p-3 bg-gray-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                      title="Confirmar Presença"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button 
                      onClick={() => excluirAgendamento(item.id)}
                      className="p-3 bg-gray-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      title="Excluir Registro"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold">Nenhum agendamento encontrado para este filtro.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}