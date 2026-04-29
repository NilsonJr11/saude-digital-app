import React, { useState, useEffect } from 'react';
import { Search, User, FileText, X } from 'lucide-react';

export default function MyPatients() {
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null); // Para o Modal
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const atendidos = todosAgendamentos.filter(
      a => a.medicoNome === usuarioLogado?.nome && a.status === 'Finalizado'
    );
    const listaUnica = atendidos.reduce((acc, atual) => {
      if (!acc.find(p => p.paciente === atual.paciente)) acc.push(atual);
      return acc;
    }, []);
    setPacientes(listaUnica);
  }, [usuarioLogado?.nome]);

  const filtrados = pacientes.filter(p => p.paciente.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-secondary tracking-tighter">Meus Pacientes</h1>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Arquivo Histórico Digital</p>
        </header>

        {/* BUSCA */}
        <div className="bg-white p-5 rounded-[30px] shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
          <Search className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome..."
            className="w-full outline-none font-bold text-secondary"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* LISTA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtrados.map((p, index) => (
            <div key={index} className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><User /></div>
                <div>
                  <h3 className="font-black text-secondary">{p.paciente}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Visto em: {p.data}</p>
                </div>
              </div>
              <button 
                onClick={() => setPacienteSelecionado(p)}
                className="w-full py-3 bg-secondary text-white rounded-2xl font-bold text-xs hover:bg-primary transition-all flex items-center justify-center gap-2"
              >
                <FileText size={14} /> DETALHES DO PRONTUÁRIO
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE DETALHES */}
      {pacienteSelecionado && (
        <div className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-primary p-8 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase opacity-70">Histórico Clínico</p>
                <h2 className="text-2xl font-black">{pacienteSelecionado.paciente}</h2>
              </div>
              <button onClick={() => setPacienteSelecionado(null)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Evolução do Quadro</label>
                <div className="bg-gray-50 p-6 rounded-3xl text-secondary font-medium italic border border-gray-100">
                  "{pacienteSelecionado.evolucao || "Nenhuma evolução registrada para este atendimento."}"
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Prescrição e Conduta</label>
                <div className="bg-blue-50 p-6 rounded-3xl text-blue-900 font-mono text-sm border border-blue-100">
                  {pacienteSelecionado.prescricao || "Nenhuma prescrição registrada."}
                </div>
              </div>

              <button 
                onClick={() => window.print()}
                className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 font-black rounded-2xl hover:border-primary hover:text-primary transition-all"
              >
                GERAR PDF / IMPRIMIR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}