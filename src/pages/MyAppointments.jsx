import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Calendar, AlertCircle } from 'lucide-react';

export default function MyAppointments() {
  const [agendamentos, setAgendamentos] = useState([]);
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    if (usuarioLogado) {
      const meusDados = todosAgendamentos.filter(a => 
        a.pacienteEmail?.toLowerCase() === usuarioLogado.email?.toLowerCase() || 
        a.paciente?.toLowerCase() === usuarioLogado.nome?.toLowerCase()
      );
      
      // Ordenar: Futuros primeiro, depois os passados
      setAgendamentos(meusDados.sort((a, b) => new Date(b.data) - new Date(a.data)));
    }
  }, []);

  // Função para verificar se a consulta já passou
  const verificarStatus = (dataAgendada) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataConsulta = new Date(dataAgendada + 'T12:00:00');
    return dataConsulta < hoje;
  };

  const handleDesmarcar = (id) => {
    if (window.confirm("Deseja realmente desmarcar?")) {
      const todos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const novaLista = todos.filter(i => i.id !== id);
      localStorage.setItem('agendamentos', JSON.stringify(novaLista));
      setAgendamentos(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen font-sans bg-gray-50/30">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-secondary tracking-tighter italic">Saúde Digital</h1>
          <p className="text-gray-400 text-xs font-black uppercase mt-1 tracking-widest">Painel do Paciente</p>
        </div>
        <Link to="/medicos" className="bg-primary text-white px-8 py-4 rounded-3xl font-black text-xs uppercase hover:scale-105 transition-all shadow-lg">
          + Novo Agendamento
        </Link>
      </div>

      <div className="space-y-6">
        {agendamentos.length > 0 ? (
          agendamentos.map((agend) => {
            const concluido = verificarStatus(agend.data);
            const isExame = agend.tipo === 'exame';

            return (
              <div 
                key={agend.id} 
                className={`bg-white rounded-[40px] p-8 border-2 transition-all ${
                  concluido 
                  ? 'opacity-60 border-gray-100 grayscale-[0.5]' 
                  : 'border-white shadow-xl shadow-gray-200/50 hover:border-primary/20'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {concluido ? (
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                          <CheckCircle size={12} /> Concluído
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 animate-pulse">
                          <Clock size={12} /> Confirmado
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${concluido ? 'bg-gray-100' : 'bg-primary/10 text-primary'}`}>
                        {isExame ? '🔬' : '👨‍⚕️'}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-secondary tracking-tight">
                          {isExame ? agend.exame : agend.medicoNome}
                        </h3>
                        <p className="text-primary font-black text-[10px] uppercase tracking-widest">
                          {isExame ? agend.categoria : agend.especialidade}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 bg-gray-50/50 p-4 rounded-3xl">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Data</span>
                        <span className="font-bold text-secondary flex items-center gap-1"><Calendar size={14}/> {agend.data}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Hora</span>
                        <span className="font-bold text-secondary flex items-center gap-1"><Clock size={14}/> {agend.hora || agend.horario}</span>
                      </div>
                      <div className="flex flex-col col-span-2 md:col-span-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Unidade</span>
                        <span className="font-bold text-secondary text-xs truncate">📍 {agend.unidade || "Centro Médico Central"}</span>
                      </div>
                    </div>
                  </div>

                  {!concluido && (
                    <div className="flex flex-row md:flex-col gap-3 justify-center min-w-[140px]">
                      <button 
                        onClick={() => {
                          const msg = `Olá! Sou o(a) ${usuarioLogado.nome} e confirmo meu agendamento no dia ${agend.data}.`;
                          window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                        className="flex-1 bg-green-500 text-white px-4 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-green-600 transition-all shadow-md"
                      >
                        WhatsApp
                      </button>
                      <button 
                        onClick={() => handleDesmarcar(agend.id)}
                        className="flex-1 bg-white text-red-500 border border-red-100 px-4 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-red-50 transition-all"
                      >
                        Desmarcar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-[50px] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-black uppercase text-sm tracking-widest">Sua agenda está limpa</p>
            <Link to="/medicos" className="text-primary font-black mt-4 inline-block hover:scale-110 transition-transform">Agendar Agora</Link>
          </div>
        )}
      </div>
    </div>
  );
}