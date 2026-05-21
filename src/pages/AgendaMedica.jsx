//import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, User, RefreshCw } from 'lucide-react';

export default function AgendaMedica() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('usuario_logado'));

  const carregarAgenda = async () => {
    if (!user || !user.id) return;
    try {
      const response = await fetch(`http://localhost/saude-digital-api/get_agenda_medico.php?medico_id=${user.id}`);
      const dados = await response.json();
      setConsultas(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao buscar agenda do médico:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgenda();
  }, []);

  const concluirConsulta = async (id) => {
    try {
      const response = await fetch('http://localhost/saude-digital-api/atualizar_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agenda_id: id, status: 'concluido' })
      });
      const dados = await response.json();
      if (dados.success) {
        carregarAgenda(); // Atualiza a lista em tempo real
      }
    } catch (error) {
      alert("Erro ao finalizar atendimento.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabeçalho Interno */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">MINHA AGENDA</h1>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">
              Consultas agendadas para o seu plantão de hoje
            </p>
          </div>
          <button 
            onClick={carregarAgenda}
            className="p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl shadow-sm text-slate-600 transition-all flex items-center gap-2 font-bold text-xs uppercase"
          >
            <RefreshCw size={14} /> Atualizar
          </button>
        </div>

        {/* Lista de Consultas */}
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h2 className="font-black text-slate-700 text-sm uppercase tracking-wide">Fila de Atendimento</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400 font-bold">Carregando consultas...</div>
          ) : consultas.length === 0 ? (
            <div className="p-16 text-center text-gray-400 font-bold italic">
              Nenhum paciente agendado para você hoje.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {consultas.map((item) => (
                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-6">
                    {/* Horário */}
                    <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl font-black text-sm">
                      <Clock size={14} className="text-indigo-400" />
                      {item.hora}
                    </div>

                    {/* Paciente */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-xs font-black text-indigo-600">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-base">{item.paciente}</div>
                        <div className="text-xs text-gray-400 font-medium">{item.paciente_telefone || 'Sem telefone'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Status / Ações */}
                  <div className="flex items-center gap-4">
                    {item.status === 'concluido' ? (
                      <span className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> Concluído
                      </span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                          Pendente
                        </span>
                        <button
                          onClick={() => concluirConsulta(item.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-indigo-100 transition-all"
                        >
                          Finalizar Consulta
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}