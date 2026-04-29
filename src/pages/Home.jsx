import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOCTORS } from '../data/doctors';

export default function Home() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1);
  const [filtros, setFiltros] = useState({ especialidade: '', medicoId: null });

  const especialidades = [...new Set(DOCTORS.map(d => d.especialidade))];
  const medicosFiltrados = DOCTORS.filter(d => d.especialidade === filtros.especialidade);
  const medicoSelecionado = DOCTORS.find(d => d.id === filtros.medicoId);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. SEÇÃO HERO */}
      <div className="bg-primary pt-16 pb-32 px-4 text-center">
        <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Sua saúde em boas mãos, a um clique.
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Agende consultas online com os melhores especialistas da nossa rede.
        </p>
      </div>

      {/* 2. CARD DE AGENDAMENTO (WIZARD) */}
      <div className="container mx-auto max-w-4xl px-4 -mt-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative z-10">
          
          {/* Stepper */}
          <div className="flex justify-between items-center mb-10 border-b border-gray-50 pb-6">
            {[
              { step: 1, label: 'Especialidade' },
              { step: 2, label: 'Profissional' },
              { step: 3, label: 'Finalizar' }
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  etapa >= item.step ? 'bg-primary text-white scale-110' : 'bg-gray-100 text-gray-400'
                }`}>
                  {item.step}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  etapa >= item.step ? 'text-secondary' : 'text-gray-300'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="min-h-[250px]">
            {etapa === 1 && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-secondary mb-6 text-center">Qual especialidade você procura?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {especialidades.map(esp => (
                    <button 
                      key={esp}
                      onClick={() => { setFiltros({...filtros, especialidade: esp}); setEtapa(2); }}
                      className="p-4 rounded-2xl border-2 border-gray-50 bg-gray-50 hover:border-primary hover:bg-white hover:shadow-md transition-all text-sm font-bold text-gray-700"
                    >
                      {esp}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {etapa === 2 && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-secondary">Escolha o profissional</h3>
                  <button onClick={() => setEtapa(1)} className="text-sm text-gray-400 hover:text-primary font-bold">← Voltar</button>
                </div>
                <div className="space-y-3">
                  {medicosFiltrados.map(med => (
                    <div 
                      key={med.id} 
                      onClick={() => { setFiltros({...filtros, medicoId: med.id}); setEtapa(3); }}
                      className="group flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-3xl shadow-inner border border-gray-100">
                          {med.avatarEmoji || "👨‍⚕️"}
                        </div>
                        <div>
                          <p className="font-extrabold text-secondary text-lg">{med.nome}</p>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{med.especialidade}</p>
                        </div>
                      </div>
                      <span className="text-primary font-bold">→</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {etapa === 3 && (
              <div className="animate-fadeIn">
                <div className="bg-primary/5 p-6 rounded-[30px] border border-primary/10 mb-8">
                  <h3 className="text-xl font-bold text-secondary mb-4 text-center">Resumo do Agendamento</h3>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm mb-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl border-2 border-white shadow-sm">
                      {medicoSelecionado?.avatarEmoji || "👨‍⚕️"}
                    </div>
                    <div>
                      <p className="font-black text-secondary">{medicoSelecionado?.nome}</p>
                      <p className="text-xs text-primary font-bold uppercase">{filtros.especialidade}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/medico/${filtros.medicoId}`)}
                  className="w-full bg-secondary text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-all"
                >
                  CONFIRMAR AGENDAMENTO
                </button>
                <button onClick={() => setEtapa(2)} className="w-full mt-4 text-gray-400 font-bold text-sm">Escolher outro médico</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. MÉDICOS EM DESTAQUE */}
      <div className="container mx-auto px-4 mt-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-secondary">Médicos em Destaque</h2>
          <div className="h-1 flex-1 bg-gray-100 ml-6 hidden md:block"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {DOCTORS.slice(0, 4).map((medico) => (
            <div key={medico.id} className="bg-white rounded-[40px] shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col overflow-hidden group">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-6xl mb-6 border-4 border-white group-hover:scale-110 transition-transform">
                  {medico.avatarEmoji || "👨‍⚕️"}
                </div>
                <h3 className="text-xl font-black text-secondary mb-1">{medico.nome}</h3>
                <p className="text-primary font-bold text-xs mb-4 uppercase">{medico.especialidade}</p>
                <button 
                  onClick={() => navigate(`/medico/${medico.id}`)}
                  className="w-full py-4 bg-gray-50 text-secondary font-bold rounded-2xl group-hover:bg-secondary group-hover:text-white transition-colors"
                >
                  Ver perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SEÇÃO DE EXAMES (FINAL DA PÁGINA) */}
      <div className="container mx-auto px-4 mt-20 text-center">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border-4 border-primary/10 inline-block w-full max-w-4xl">
          <h2 className="text-4xl font-black text-secondary mb-4">Precisa de Exames?</h2>
          <p className="text-gray-500 font-bold mb-8 text-lg">
            Agende seus exames laboratoriais e de imagem com rapidez.
          </p>
          <button 
            onClick={() => navigate('/exames')} 
            className="bg-primary text-white px-12 py-6 rounded-[30px] font-black text-2xl shadow-xl hover:bg-secondary transition-all active:scale-95"
          >
            ACESSAR PORTAL DE EXAMES
          </button>
        </div>
      </div>
    </div>
  );
}