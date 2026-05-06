import React, { useState, useEffect } from 'react';
import { Search, User, FileText, X, Calendar, ClipboardList } from 'lucide-react';

export default function MeusPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [historico, setHistorico] = useState([]);
  
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    // 1. Pega os dados do localStorage (dentro do efeito para evitar re-criações)
    const usuarioAtivo = JSON.parse(localStorage.getItem('usuarioLogado'));
    const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');

    // 2. Filtra os agendamentos do médico logado
    const meusAgendamentos = todosAgendamentos.filter(a => 
      a.medicoNome?.toLowerCase() === usuarioAtivo?.nome?.toLowerCase()
    );

    const listaUnica = [];
    const nomesProcessados = new Set();

    meusAgendamentos.forEach(agend => {
      if (!nomesProcessados.has(agend.paciente)) {
        nomesProcessados.add(agend.paciente);
        listaUnica.push({ 
          nome: agend.paciente, 
          ultimaConsulta: agend.data 
        });
      }
    });

    setPacientes(listaUnica);
    
    // Deixamos vazio [] para que ele rode APENAS quando a página carregar
    // ou quando o médico mudar no simulador (que já dá um window.location.reload)
  }, []);

  // Função para abrir o histórico
  const abrirHistorico = (nomePaciente) => {
    const todosProntuarios = JSON.parse(localStorage.getItem('prontuarios') || '[]');
    const filtrados = todosProntuarios.filter(p => p.paciente === nomePaciente);
    
    setHistorico(filtrados.sort((a, b) => new Date(b.data) - new Date(a.data)));
    setPacienteSelecionado(nomePaciente);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-secondary mb-10 italic">Meus Pacientes</h1>

        {/* Busca */}
        <div className="relative mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            type="text"
            placeholder="Buscar por nome..."
            className="w-full pl-16 pr-8 py-6 rounded-[30px] shadow-sm border-none font-bold"
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* Lista */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pacientes.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase())).map((p, i) => (
            <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black">
                  {p.nome[0]}
                </div>
                <div>
                  <h3 className="font-black text-secondary">{p.nome}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase">Visto em: {p.ultimaConsulta}</p>
                </div>
              </div>
              <button 
                onClick={() => abrirHistorico(p.nome)}
                className="p-4 bg-secondary text-white rounded-2xl hover:scale-110 transition-all"
              >
                <FileText size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL DE HISTÓRICO --- */}
      {pacienteSelecionado && (
        <div className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-[50px] shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header do Modal */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-black text-secondary italic">{pacienteSelecionado}</h2>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Histórico de Prontuários</p>
              </div>
              <button onClick={() => setPacienteSelecionado(null)} className="p-3 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-8 overflow-y-auto space-y-8">
              {historico.length > 0 ? historico.map((item, idx) => (
                <div key={idx} className="border-l-4 border-primary pl-6 py-2">
                  <div className="flex items-center gap-2 mb-4 text-primary font-black text-sm">
                    <Calendar size={16} /> {item.data}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase mb-1">Evolução Clínica</h4>
                      <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                        "{item.evolucao}"
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase mb-1">Prescrição</h4>
                      <p className="text-secondary font-bold text-sm bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        💊 {item.prescricao}
                      </p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <ClipboardList size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold">Nenhum prontuário registrado para este paciente.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}