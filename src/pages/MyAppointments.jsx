import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar } from 'lucide-react';

export default function MyAppointments() {
  const [agendamentos, setAgendamentos] = useState([]);
  const navigate = useNavigate();

  // Pega os dados do usuário guardados no login
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || 
                        JSON.parse(localStorage.getItem('usuario')) || null;

  const buscarConsultasDoPaciente = async () => {
    if (!usuarioLogado || !usuarioLogado.id) return;

    try {
      // 🔬 Busca as consultas e exames reais direto do banco de dados unificado
      const response = await fetch(`http://localhost/saude-digital-api/listar_consultas_paciente.php?paciente_id=${usuarioLogado.id}`);
      if (response.ok) {
        const dados = await response.json();
        if (Array.isArray(dados)) {
          setAgendamentos(dados);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos do banco:", error);
    }
  };

  useEffect(() => {
    buscarConsultasDoPaciente();
  }, []);

  const handleDesmarcar = async (id) => {
    if (window.confirm("Deseja realmente desmarcar este agendamento?")) {
      try {
        const response = await fetch(`http://localhost/saude-digital-api/desmarcar_consulta.php?id=${id}`, { method: 'POST' });
        const resultado = await response.json();
        if (resultado.success) {
          alert("Agendamento desmarcado com sucesso!");
          buscarConsultasDoPaciente(); // Atualiza a tela
        } else {
          alert("Erro ao desmarcar: " + resultado.error);
        }
      } catch (error) {
        alert("Erro ao conectar com o servidor.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen font-sans bg-gray-50/30">
      
      {/* 🏡 Slogan corrigido: Agora dentro do JSX e funcional, levando para a Home no clique */}
      <div className="flex justify-between items-center mb-10">
        <div onClick={() => navigate('/')} className="cursor-pointer hover:opacity-80 transition-all">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic">Saúde Digital</h1>
          <p className="text-indigo-500 text-xs font-black uppercase mt-1 tracking-widest">Painel do Paciente</p>
        </div>
        <Link to="/" className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase hover:scale-105 transition-all shadow-lg">
          + Novo Agendamento
        </Link>
      </div>

      <div className="space-y-6">
        {agendamentos.length > 0 ? (
          agendamentos.map((agend) => {
            const concluido = agend.status?.toLowerCase() === 'concluido';
            const isExame = agend.tipo === 'exame';

            return (
              <div 
                key={agend.id} 
                className={`bg-white rounded-[40px] p-8 border-2 transition-all ${
                  concluido 
                  ? 'opacity-60 border-gray-100 grayscale-[0.5]' 
                  : 'border-white shadow-xl shadow-gray-200/50 hover:border-indigo-500/20'
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
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                          <Clock size={12} /> {agend.status || 'Confirmado'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${concluido ? 'bg-gray-100' : 'bg-indigo-50 text-indigo-600'}`}>
                        {isExame ? '🔬' : '👨‍⚕️'}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                          {isExame ? agend.nome_exame : agend.medico}
                        </h3>
                        <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                          {isExame ? 'Procedimento / Exame' : agend.especialidade || 'Clínica Geral'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 bg-gray-50/50 p-4 rounded-3xl">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Data</span>
                        <span className="font-bold text-slate-700 flex items-center gap-1"><Calendar size={14}/> {agend.data}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Hora</span>
                        <span className="font-bold text-slate-700 flex items-center gap-1"><Clock size={14}/> {agend.hora}</span>
                      </div>
                      <div className="flex flex-col col-span-2 md:col-span-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Unidade</span>
                        <span className="font-bold text-slate-700 text-xs truncate">📍 Centro Médico Central</span>
                      </div>
                    </div>
                  </div>

                  {!concluido && (
                    <div className="flex flex-row md:flex-col gap-3 justify-center min-w-[140px]">
                      <button 
                        onClick={() => {
                          const msg = `Olá! Sou o(a) ${usuarioLogado?.nome} e confirmo meu agendamento no dia ${agend.data} às ${agend.hora}.`;
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
            <Link to="/" className="text-indigo-600 font-black mt-4 inline-block hover:scale-110 transition-transform">Agendar Agora</Link>
          </div>
        )}
      </div>
    </div>
  );
}