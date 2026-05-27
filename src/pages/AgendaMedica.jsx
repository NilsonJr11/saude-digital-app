import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert } from 'lucide-react';

export default function AgendaMedica() {
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  
  // Pega as informações do médico logado no sistema
  const medicoLogado = JSON.parse(localStorage.getItem('usuario_logado'));

  const buscarConsultasDoBanco = async () => {
    if (!medicoLogado || !medicoLogado.id) {
      setErro("Acesso negado: Perfil de médico não identificado no sistema.");
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      // 🌐 Consome a mesma API unificada que a secretaria usa!
      const response = await fetch('http://localhost/saude-digital-api/listar_consultas.php');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // 🔍 Filtra dinamicamente os agendamentos pertencentes apenas a este Médico ID logado
        const minhasConsultas = data.filter(item => 
          Number(item.medico_id) === Number(medicoLogado.id)
        );
        setConsultas(minhasConsultas);
      } else {
        setErro("Formato de dados inválido retornado pelo servidor.");
      }
    } catch (err) {
      console.error("Erro ao carregar agenda do médico:", err);
      setErro("Não foi possível sincronizar com o banco de dados MariaDB.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarConsultasDoBanco();
  }, []);

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-12 font-sans text-slate-500 font-bold">
        <div className="text-center space-y-2">
          <div className="animate-spin text-indigo-600 font-black text-2xl">🔄</div>
          <p className="uppercase tracking-widest text-[10px] font-black">Conectando ao MariaDB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-800 italic tracking-tighter">Minha Agenda</h1>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">
            Plantão Médico: {medicoLogado?.nome || 'Médico Clínico'}
          </p>
        </header>

        {erro && (
          <div className="mb-6 p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-xs border border-red-100">
            <ShieldAlert size={16} />
            <span>{erro}</span>
          </div>
        )}

        {/* TABELA DE ATENDIMENTO */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Fila de Pacientes para Hoje</h3>
          </div>

          {consultas.length === 0 ? (
            <div className="p-16 text-center text-gray-400 font-bold italic">
              🌴 Nenhuma consulta agendada para o seu perfil no banco hoje.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {consultas.map((item) => {
                // Separa com segurança o Horário ("HH:MM") contido na string DATETIME do banco
                const horaExibicao = item.data_hora?.split(' ')[1]?.substring(0, 5) || "00:00";
                
                return (
                  <div key={item.id} className="p-8 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
                    <div className="flex items-center gap-6">
                      <span className="font-black text-lg text-indigo-600 bg-indigo-50 px-4 py-2.5 rounded-2xl flex items-center gap-2">
                        <Clock size={16} /> {horaExibicao}
                      </span>
                      <div>
                        <p className="font-black text-slate-800 text-lg">{item.paciente_nome || `Paciente #${item.paciente_id}`}</p>
                        <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          item.status === 'Atendido' ? 'bg-emerald-100 text-emerald-600' : 
                          item.status === 'Cancelado' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {item.status || 'Pendente'}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => alert(`Iniciando Prontuário Eletrônico para: ${item.paciente_nome || 'Paciente'}`)}
                      className="bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-2xl transition-all shadow-md"
                    >
                      Atender Paciente
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}