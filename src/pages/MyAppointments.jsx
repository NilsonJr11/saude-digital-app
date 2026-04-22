import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MyAppointments() {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');

    if (usuario && usuario.email) {
      const meusDados = todosAgendamentos.filter(
        a => a.pacienteEmail?.toLowerCase() === usuario.email.toLowerCase() || 
             a.clienteEmail?.toLowerCase() === usuario.email.toLowerCase()
      );
      setAgendamentos(meusDados);
    }
  }, []);

  const handleDesmarcar = (id) => {
    if (window.confirm("Deseja realmente desmarcar esta consulta? Esta ação não pode ser desfeita.")) {
      // 1. Filtra a lista local para sumir da tela na hora
      const novaListaLocal = agendamentos.filter(item => item.id !== id);
      setAgendamentos(novaListaLocal);

      // 2. Filtra a lista global do banco
      const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const novaListaGlobal = todosAgendamentos.filter(item => item.id !== id);
      
      localStorage.setItem('agendamentos', JSON.stringify(novaListaGlobal));
      alert("Consulta desmarcada com sucesso!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-secondary tracking-tighter">Meus Agendamentos</h1>
          <p className="text-gray-400 text-sm font-bold uppercase mt-1">Gestão de consultas e exames</p>
        </div>
        <Link to="/" className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm uppercase hover:scale-105 transition-all shadow-lg shadow-primary/20">
          + Novo
        </Link>
      </div>

      {agendamentos.length > 0 ? (
        <div className="space-y-6">
          {agendamentos.map((agendamento) => (
            <div key={agendamento.id} className="bg-white border-l-[6px] border-primary rounded-[30px] shadow-sm p-8 hover:shadow-xl transition-all border border-gray-100 relative overflow-hidden">
              
              <div className="flex flex-col md:flex-row justify-between gap-6">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {agendamento.especialidade.toLowerCase().includes('exame') ? '🔬' : '👨‍⚕️'}
                    </span>
                    <h3 className="text-2xl font-black text-secondary tracking-tight">
                      {agendamento.medicoNome}
                    </h3>
                  </div>
                  
                  <p className="text-primary font-black text-xs uppercase tracking-widest bg-primary/5 inline-block px-3 py-1 rounded-lg">
                    {agendamento.especialidade}
                  </p>
                  
                  <div className="flex flex-wrap gap-6 mt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Data</span>
                      <span className="font-bold text-secondary">📅 {agendamento.data}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Horário</span>
                      <span className="font-bold text-secondary">⏰ {agendamento.hora}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Local</span>
                      <span className="font-bold text-secondary text-sm">📍 {agendamento.unidade || "Unidade Central"}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-sm ${
                      agendamento.tipo === 'plano' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                      {agendamento.tipo === 'plano' ? `Convênio: ${agendamento.planoSaude}` : 'Atendimento Particular'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[150px]">
                  <button 
                    onClick={() => {
                      const msg = `Olá! Gostaria de falar sobre meu agendamento com ${agendamento.medicoNome} no dia ${agendamento.data}.`;
                      window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="flex-1 bg-green-50 text-green-600 border border-green-100 px-4 py-3 rounded-2xl font-black text-xs uppercase hover:bg-green-600 hover:text-white transition-all"
                  >
                    WhatsApp
                  </button>
                  
                  <button 
                    onClick={() => handleDesmarcar(agendamento.id)}
                    className="flex-1 bg-red-50 text-red-500 border border-red-100 px-4 py-3 rounded-2xl font-black text-xs uppercase hover:bg-red-500 hover:text-white transition-all"
                  >
                    Desmarcar
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[50px] border-4 border-dashed border-gray-100">
          <div className="text-6xl mb-4">🗓️</div>
          <p className="text-gray-400 font-bold text-xl">Sua agenda está vazia.</p>
          <Link to="/" className="text-primary font-black mt-4 inline-block hover:underline uppercase text-sm tracking-widest">
            Agendar minha primeira consulta
          </Link>
        </div>
      )}
    </div>
  );
}