import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Calendar } from 'lucide-react';

export default function MyAppointments() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [exameSelecionado, setExameSelecionado] = useState(null); // 🔍 Estado para controlar o modal do exame
  const navigate = useNavigate();

  // Lendo a chave do Local Storage
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario_logado')) || 
                        JSON.parse(localStorage.getItem('usuarioLogado')) || 
                        JSON.parse(localStorage.getItem('usuario')) || null;

  const buscarConsultasDoPaciente = async () => {
    if (!usuarioLogado) {
      console.warn("Nenhum usuário logado encontrado no Local Storage.");
      return;
    }

    const pacienteId = usuarioLogado.id || (usuarioLogado.email === '1@gmail.com' ? 1 : null);

    if (!pacienteId) {
      console.warn("Não foi possível determinar o ID do paciente logado.");
      return;
    }

    let consultasBanco = [];

    // 1️⃣ BUSCA AS CONSULTAS REAIS NO BANCO DE DADOS (PHP)
    try {
      console.log(`Buscando consultas para o paciente ID: ${pacienteId}`);
      const response = await fetch('https://saudedigital.alwaysdata.net/listar_consultas.php?id=' + pacienteId);
      if (response.ok) {
        const dados = await response.json();
        console.log("Dados recebidos do PHP:", dados);
        
        if (Array.isArray(dados)) {
          // 🔄 MAPEAMENTO: Transforma os nomes das colunas do banco para o formato que o seu JSX espera
          consultasBanco = dados.map(item => ({
            ...item,
            data: item.data_consulta || item.data, 
            hora: item.horario || item.hora,       
            medico: item.nome_medico || item.medico || item.nome
          }));
        }
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos do banco:", error);
    }

    // 2️⃣ 🔬 BUSCA OS EXAMES SALVOS LOCALMENTE NO LOCALSTORAGE
    const examesLocaisRaw = localStorage.getItem('agendamentos_exames_local');
    let examesLocais = [];
    
    if (examesLocaisRaw) {
      try {
        const todosExames = JSON.parse(examesLocaisRaw);
        // Filtra para garantir que só exiba os exames do paciente atualmente logado!
        examesLocais = todosExames.filter(exame => Number(exame.paciente_id) === Number(pacienteId));
      } catch (e) {
        console.error("Erro ao processar exames locais:", e);
      }
    }

    // 3️⃣ 🔀 UNIFICA AS DUAS LISTAS EM UMA SÓ (Agora as consultas do banco já estão corrigidas!)
    setAgendamentos([...consultasBanco, ...examesLocais]);
  };

  useEffect(() => {
    buscarConsultasDoPaciente();
  }, []);

  const handleDesmarcar = async (id) => {
  if (window.confirm("Deseja realmente desmarcar este agendamento?")) {
    try {
      // 🔄 CORREÇÃO: Trocando o localhost fixo pela sua variável dinâmica
      const response = await fetch(`https://saudedigital.alwaysdata.net/desmarcar_agendamento.php?id=${id}`);
      
      const resultado = await response.json();
      if (resultado.success) {
        alert("Agendamento desmarcado com sucesso!");
        buscarConsultasDoPaciente(); 
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
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div onClick={() => navigate('/')} className="cursor-pointer hover:opacity-80 transition-all">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic">Saúde Digital</h1>
          <p className="text-indigo-500 text-xs font-black uppercase mt-1 tracking-widest">Painel do Paciente</p>
        </div>
        <Link to="/" className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase hover:scale-105 transition-all shadow-lg">
          + Novo Agendamento
        </Link>
      </div>

      {/* LISTA DE CARDS */}
      <div className="space-y-6">
        {agendamentos.length > 0 ? (
          agendamentos.map((agend) => {
            const statusAtual = agend.status?.toLowerCase();
            const concluido = statusAtual === 'concluido' || statusAtual === 'finalizado';
            const isExame = agend.tipo === 'exame';

            return (
              <div 
                key={agend.id} 
                // Abre o modal se for um exame clicado
                onClick={() => { if (isExame) setExameSelecionado(agend); }}
                className={`bg-white rounded-[40px] p-8 border-2 transition-all ${
                  isExame 
                  ? 'cursor-pointer hover:border-indigo-500/40 border-dashed border-indigo-100 shadow-md' 
                  : concluido 
                    ? 'opacity-60 border-gray-100 grayscale-[0.5]' 
                    : 'border-white shadow-xl shadow-gray-200/50 hover:border-indigo-500/20'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {isExame ? (
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                          <CheckCircle size={12} /> {agend.status || 'Agendado'}
                        </span>
                      ) : concluido ? (
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                          <CheckCircle size={12} /> Concluído
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                          <Clock size={12} /> {agend.status || 'Agendado'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${isExame ? 'bg-indigo-50 text-indigo-600' : concluido ? 'bg-gray-100' : 'bg-indigo-50 text-indigo-600'}`}>
                        {isExame ? '🔬' : '👨‍⚕️'}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                          {isExame ? agend.nome_exame : (agend.medico || agend.medico_nome || 'Médico do Plantão')}
                        </h3>
                        <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                          {isExame ? 'Procedimento / Exame (Clique p/ ver)' : agend.especialidade || 'Clínica Geral'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 bg-gray-50/50 p-4 rounded-3xl">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Data</span>
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <Calendar size={14}/> {agend.data || '---'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Hora</span>
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <Clock size={14}/> {agend.hora || '---'}
                        </span>
                      </div>
                      <div className="flex flex-col col-span-2 md:col-span-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Unidade</span>
                        <span className="font-bold text-slate-700 text-xs truncate">📍 Centro Médico Central</span>
                      </div>
                    </div>
                  </div>

                  {!concluido && !isExame && (
                    <div className="flex flex-row md:flex-col gap-3 justify-center min-w-[140px]">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const msg = `Olá! Sou o(a) ${usuarioLogado?.nome} e confirmo meu agendamento no dia ${agend.data} às ${agend.hora}.`;
                          window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                        className="flex-1 bg-green-500 text-white px-4 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-green-600 transition-all shadow-md"
                      >
                        WhatsApp
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDesmarcar(agend.id);
                        }}
                        className="flex-1 bg-red-500 text-white border border-red-100 px-4 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-md"
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

      {/* 🔬 MODAL INTERATIVO DE DETALHES DO EXAME / PRONTUÁRIO */}
      {exameSelecionado && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[40px] max-w-lg w-full p-8 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setExameSelecionado(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 font-bold text-sm bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            >
              ✕
            </button>
            
            <div className="mb-4">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                🔬 Prontuário Clínico
              </span>
            </div>

            <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-6">
              Laudo do Atendimento
            </h3>

            <div className="bg-gray-50 p-5 rounded-3xl mb-6 space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-xs font-black text-gray-400 uppercase">Data da Realização</span>
                <span className="font-bold text-slate-700">{exameSelecionado.data}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-xs font-black text-gray-400 uppercase">Horário</span>
                <span className="font-bold text-slate-700">{exameSelecionado.hora}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-black text-gray-400 uppercase">Local do Exame</span>
                <span className="font-bold text-slate-700">📍 Centro Médico Central</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Diagnóstico / Observações do Médico</h4>
              <div className="bg-indigo-50/50 text-indigo-950 p-5 rounded-3xl text-sm font-semibold leading-relaxed border border-indigo-100/50">
                {exameSelecionado.nome_exame}
              </div>
            </div>

            <button 
              onClick={() => setExameSelecionado(null)}
              className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-xs uppercase hover:bg-slate-900 transition-all shadow-lg"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}

    </div>
  );
}