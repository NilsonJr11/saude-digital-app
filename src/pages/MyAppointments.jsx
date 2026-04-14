import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MyAppointments() {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    // Usamos sempre a mesma chave: 'agendamentos'
    const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');

    if (usuario && usuario.email) {
      // Ajustado para filtrar pelo email do usuário logado
      const meusDados = todosAgendamentos.filter(
        a => a.pacienteEmail?.toLowerCase() === usuario.email.toLowerCase() || 
             a.clienteEmail?.toLowerCase() === usuario.email.toLowerCase()
      );
      setAgendamentos(meusDados);
    }
  }, []);

  const handleDesmarcar = (id) => {
    if (window.confirm("Tem certeza que deseja desmarcar esta consulta?")) {
      // 1. Filtra a lista local
      const novaListaLocal = agendamentos.filter(item => item.id !== id);
      setAgendamentos(novaListaLocal);

      // 2. Filtra a lista global do banco para não apagar consultas de outros usuários
      const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const novaListaGlobal = todosAgendamentos.filter(item => item.id !== id);
      
      // 3. Salva de volta na chave correta
      localStorage.setItem('agendamentos', JSON.stringify(novaListaGlobal));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-secondary tracking-tighter">Meus Agendamentos</h1>
        <Link to="/" className="text-primary font-bold hover:underline">
          + Novo Agendamento
        </Link>
      </div>

      {agendamentos.length > 0 ? (
        agendamentos.map((agendamento) => (
          <div key={agendamento.id} className="bg-white border-l-4 border-primary rounded-2xl shadow-sm p-6 mb-4 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-secondary">{agendamento.medicoNome}</h3>
                <p className="text-primary font-bold text-sm uppercase">{agendamento.especialidade}</p>
                
                <div className="flex gap-4 mt-4 text-gray-500 text-sm font-medium">
                  <span className="flex items-center gap-1">📅 {agendamento.data}</span>
                  <span className="flex items-center gap-1">⏰ {agendamento.hora}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    agendamento.tipo === 'plano' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {agendamento.tipo === 'plano' ? `Plano: ${agendamento.planoSaude}` : 'Particular'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-black uppercase">
                    📍 {agendamento.unidade || "Unidade Central"}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => handleDesmarcar(agendamento.id)}
                className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition font-black text-xs uppercase tracking-widest"
              >
                Desmarcar
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20 bg-gray-100 rounded-[40px] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">Você ainda não possui agendamentos.</p>
        </div>
      )}
    </div>
  );
}