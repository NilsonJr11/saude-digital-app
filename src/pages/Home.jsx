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
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* 🌟 BARRA DE NAVEGAÇÃO SUPERIOR ADICIONADA */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex flex-col cursor-pointer" onClick={() => window.location.reload()}>
            <span className="font-black text-2xl italic tracking-tighter text-slate-900 uppercase">
              Saúde<span className="text-indigo-600">Digital</span> Pro
            </span>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase -mt-1">
              Complexo Médico Hospitalar
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')} 
              className="text-sm font-black text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider"
            >
              Área Restrita
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl text-sm font-black uppercase tracking-wider shadow-md hover:bg-indigo-700 transition-all"
            >
              Criar Conta
            </button>
          </div>
        </div>
      </nav>

      {/* 1. SEÇÃO HERO (Mantida idêntica à sua) */}
      <div className="bg-slate-900 pt-20 pb-36 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <h1 className="text-white text-4xl md:text-5xl font-black mb-4 tracking-tight">
          Sua saúde em boas mãos, a um clique.
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">
          Agende consultas online com os melhores especialistas da nossa rede de forma rápida e segura.
        </p>
      </div>

      {/* 2. CARD DE AGENDAMENTO (WIZARD) (Mantido idêntico ao seu) */}
      <div className="container mx-auto max-w-4xl px-4 -mt-20">
        <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-gray-100 relative z-10">
          
          {/* Stepper */}
          <div className="flex justify-between items-center mb-10 border-b border-gray-50 pb-6">
            {[
              { step: 1, label: 'Especialidade' },
              { step: 2, label: 'Profissional' },
              { step: 3, label: 'Finalizar' }
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  etapa >= item.step ? 'bg-indigo-600 text-white scale-110' : 'bg-gray-100 text-gray-400'
                }`}>
                  {item.step}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${
                  etapa >= item.step ? 'text-slate-800' : 'text-gray-300'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="min-h-[250px]">
            {etapa === 1 && (
              <div className="animate-fadeIn">
                <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Qual especialidade você procura?</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {especialidades.map(esp => (
                    <button 
                      key={esp}
                      onClick={() => { setFiltros({...filtros, especialidade: esp}); setEtapa(2); }}
                      className="p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-indigo-600 hover:bg-white hover:shadow-md transition-all text-sm font-bold text-gray-700"
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
                  <h3 className="text-xl font-bold text-slate-800">Escolha o profissional</h3>
                  <button onClick={() => setEtapa(1)} className="text-sm text-gray-400 hover:text-indigo-600 font-bold">← Voltar</button>
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
                          <p className="font-extrabold text-slate-800 text-lg">{med.nome}</p>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">{med.especialidade}</p>
                        </div>
                      </div>
                      <span className="text-indigo-600 font-bold">→</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {etapa === 3 && (
              <div className="animate-fadeIn">
                <div className="bg-indigo-50/50 p-6 rounded-[30px] border border-indigo-100 mb-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Resumo do Agendamento</h3>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm mb-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl border-2 border-white shadow-sm">
                      {medicoSelecionado?.avatarEmoji || "👨‍⚕️"}
                    </div>
                    <div>
                      <p className="font-black text-slate-800">{medicoSelecionado?.nome}</p>
                      <p className="text-xs text-indigo-600 font-bold uppercase">{filtros.especialidade}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/medico/${filtros.medicoId}`)}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all"
                >
                  CONFIRMAR AGENDAMENTO
                </button>
                <button onClick={() => setEtapa(2)} className="w-full mt-4 text-gray-400 font-bold text-sm">Escolher outro médico</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. MÉDICOS EM DESTAQUE (Mantido idêntico ao seu) */}
      <div className="container mx-auto px-4 mt-24 max-w-6xl">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-slate-800">Médicos em Destaque</h2>
          <div className="h-1 flex-1 bg-gray-100 ml-6 hidden md:block"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {DOCTORS.slice(0, 4).map((medico) => (
            <div key={medico.id} className="bg-white rounded-[40px] shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col overflow-hidden group">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-6xl mb-6 border-4 border-white group-hover:scale-110 transition-transform">
                  {medico.avatarEmoji || "👨‍⚕️"}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-1">{medico.nome}</h3>
                <p className="text-indigo-600 font-bold text-xs mb-4 uppercase">{medico.especialidade}</p>
                <button 
                  onClick={() => navigate(`/medico/${medico.id}`)}
                  className="w-full py-4 bg-gray-50 text-slate-700 font-bold rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-colors"
                >
                  Ver perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SEÇÃO DE EXAMES (Mantido idêntico ao seu) */}
      <div className="container mx-auto px-4 mt-20 text-center max-w-4xl">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border-4 border-indigo-50 inline-block w-full">
          <h2 className="text-4xl font-black text-slate-800 mb-4">Precisa de Exames?</h2>
          <p className="text-gray-500 font-bold mb-8 text-lg">
            Agende seus exames laboratoriais e de imagem com rapidez.
          </p>
          <button 
            onClick={() => navigate('/exames')} 
            className="bg-indigo-600 text-white px-12 py-6 rounded-[30px] font-black text-xl shadow-xl hover:bg-slate-900 transition-all active:scale-95"
          >
            ACESSAR PORTAL DE EXAMES
          </button>
        </div>
      </div>
    </div>
  );
}