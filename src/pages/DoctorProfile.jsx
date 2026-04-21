import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DOCTORS } from '../data/doctors';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const medico = DOCTORS.find(doc => doc.id === parseInt(id));
  
  // ESTADOS DO FORMULÁRIO
  const [dataConsulta, setDataConsulta] = useState("");
  const [horaSelecionada, setHoraSelecionada] = useState("");
  const [tipoAtendimento, setTipoAtendimento] = useState('plano');
  const [dadosPaciente, setDadosPaciente] = useState({
    nascimento: '',
    genero: '',
    planoSaude: '',
    unidade: 'Unidade Central - Av. Paulista, 1000'
  });

  const hoje = new Date().toISOString().split('T')[0];

  // Regra do Domingo (Correção para o seletor de data)
  const verificarDomingo = (dataString) => {
    if (!dataString) return false;
    const data = new Date(dataString + 'T12:00:00'); // Força meio-dia para evitar erro de fuso
    return data.getDay() === 0;
  };

  // Dentro do seu componente DoctorProfile, antes do return:

  // 1. Pegar todos os agendamentos do banco
  const agendamentosNoBanco = JSON.parse(localStorage.getItem('agendamentos') || '[]');

  // 2. Função para verificar se um horário específico já está tomado para este médico nesta data
  const verificarHorarioOcupado = (hora) => {
    return agendamentosNoBanco.some(agend => 
      agend.medicoNome === medico.nome && 
      agend.data === dataConsulta && 
      agend.hora === hora
    );
  };

  const handleAgendar = () => {
    const usuarioLogadoRaw = localStorage.getItem('usuarioLogado');

    if (verificarDomingo(dataConsulta)) {
    if (tipoAtendimento === 'particular') {
      alert("Indisponível: Este especialista não atende Particular aos domingos.");
      return;
    } else {
      alert("Unidade Fechada: Agendamentos via Convênio estão disponíveis apenas de Segunda a Sábado.");
      return;
    }
  }
    
    if (!usuarioLogadoRaw) {
      alert("Você precisa estar logado para agendar!");
      navigate('/login');
      return;
    }

    // Validação de campos obrigatórios
    if (!dataConsulta || !horaSelecionada || !dadosPaciente.genero || !dadosPaciente.nascimento) {
      alert("Por favor, preencha: Data, Horário, Nascimento e Gênero.");
      return;
    }

    const usuarioLogado = JSON.parse(usuarioLogadoRaw);
    const agendamentosAntigos = JSON.parse(localStorage.getItem('agendamentos') || '[]');

    const novoAgendamento = {
      id: Date.now(),
      pacienteEmail: usuarioLogado.email.toLowerCase(),
      pacienteNome: usuarioLogado.nome,
      medicoNome: medico.nome,
      especialidade: medico.especialidade,
      data: dataConsulta,
      hora: horaSelecionada,
      nascimento: dadosPaciente.nascimento,
      genero: dadosPaciente.genero,
      tipo: tipoAtendimento,
      planoSaude: tipoAtendimento === 'plano' ? (dadosPaciente.planoSaude || 'Não informado') : 'Particular',
      unidade: dadosPaciente.unidade,
      status: "Confirmado"
    };

    // NOVA TRAVA DE CONFLITO
  const conflito = agendamentosAntigos.some(agend => 
    agend.medicoNome === medico.nome && 
    agend.data === dataConsulta && 
    agend.hora === horaSelecionada
  );

  if (conflito) {
    alert("Ops! Alguém acabou de agendar esse horário. Por favor, escolha outro.");
    return;
  }

    // Salvando
    localStorage.setItem('agendamentos', JSON.stringify([...agendamentosAntigos, novoAgendamento]));

    // WhatsApp
    const msg = `Olá! Confirmo meu agendamento de ${novoAgendamento.especialidade} com ${novoAgendamento.medicoNome} para o dia ${novoAgendamento.data} às ${novoAgendamento.hora}.`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');

    alert(`Consulta agendada com sucesso!`);
    navigate('/meus-agendamentos');
  };

  if (!medico) return <div className="text-center py-20 font-bold">Médico não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <button onClick={() => navigate(-1)} className="text-primary font-bold mb-6 flex items-center gap-2 hover:underline">
          ← Voltar
        </button>

        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          {/* CABEÇALHO COM ESTILO RESTAURADO */}
          <div className="bg-primary p-10 text-white flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center text-5xl font-black border-4 border-white/30 shadow-inner">
              {medico.nome[0]}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tighter">{medico.nome}</h1>
              <p className="text-xl opacity-80 font-medium uppercase tracking-widest text-sm mt-1">{medico.especialidade}</p>
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* SEÇÃO 1: VALORES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <label className="block text-secondary font-black text-xs uppercase mb-2">Local de Atendimento</label>
                <p className="text-gray-600 font-bold text-sm">📍 {dadosPaciente.unidade}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <label className="block text-secondary font-black text-xs uppercase mb-2">Valor da Consulta</label>
                <p className="text-primary text-2xl font-black">{medico.valor || "R$ 350,00"}</p>
              </div>
            </div>

            {/* SEÇÃO 2: DADOS PACIENTE */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-secondary border-b pb-2">Informações do Paciente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Data de Nascimento</label>
                  <input 
                    type="date" 
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100"
                    value={dadosPaciente.nascimento}
                    onChange={(e) => setDadosPaciente({...dadosPaciente, nascimento: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Gênero</label>
                  <select 
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100"
                    value={dadosPaciente.genero}
                    onChange={(e) => setDadosPaciente({...dadosPaciente, genero: e.target.value})}
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: AGENDAMENTO (CALENDÁRIO ESTILO REDE D'OR) */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-secondary border-b pb-2">Agendamento e Pagamento</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Escolha a Data</label>
                <input 
                  type="date" 
                  min={hoje}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold mb-4"
                  onChange={(e) => {
                    setDataConsulta(e.target.value);
                    setHoraSelecionada("");
                  }}
                />

              {dataConsulta && (
                <div className="grid grid-cols-3 gap-3 animate-fadeIn">
                  {[
                    {h: '08:00', t: 'n'}, {h: '08:30', t: 'e'}, {h: '09:00', t: 'n'}, 
                    {h: '09:30', t: 'e'}, {h: '10:00', t: 'n'}, {h: '10:30', t: 'n'}
                  ].map(item => {
                    const eDomingo = verificarDomingo(dataConsulta);
                    const ocupado = verificarHorarioOcupado(item.h); // Verifica se já agendaram

                    return (
                      <button
                        key={item.h}
                        type="button"
                        disabled={eDomingo || ocupado} // Bloqueia se for domingo OU se estiver ocupado
                        onClick={() => setHoraSelecionada(item.h)}
                        className={`relative p-3 px-4 rounded-xl border-2 font-bold transition-all flex items-center justify-between 
                          ${(eDomingo || ocupado) ? 'opacity-30 cursor-not-allowed bg-gray-200 border-transparent' : ''} 
                          ${horaSelecionada === item.h ? 'border-primary bg-primary text-white' : 'border-gray-50 bg-gray-50 text-gray-600'}`}
                      >
                        <span className="text-sm">
                          {ocupado ? "Ocupado" : item.h} 
                        </span>
                        
                        {item.t === 'e' && !eDomingo && !ocupado && (
                          <span className={`${horaSelecionada === item.h ? 'bg-white text-primary' : 'bg-orange-500 text-white'} text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center`}>
                            E
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              </div>

              {/* TIPO DE PAGAMENTO */}
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setTipoAtendimento('plano')}
                  className={`flex-1 py-4 rounded-2xl border-2 font-black transition-all ${tipoAtendimento === 'plano' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400'}`}
                >
                  CONVÊNIO
                </button>
                <button 
                  type="button"
                  onClick={() => setTipoAtendimento('particular')}
                  className={`flex-1 py-4 rounded-2xl border-2 font-black transition-all ${tipoAtendimento === 'particular' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400'}`}
                >
                  PARTICULAR
                </button>
              </div>

              {tipoAtendimento === 'plano' && (
                <div className="animate-fadeIn">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Selecione seu Convênio</label>
                  <select 
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-primary/20"
                    onChange={(e) => setDadosPaciente({...dadosPaciente, planoSaude: e.target.value})}
                  >
                    <option value="">Selecione um plano...</option>
                    <option value="Unimed">Unimed</option>
                    <option value="SulAmérica">SulAmérica</option>
                    <option value="Bradesco Saúde">Bradesco Saúde</option>
                    <option value="Amil">Grupo Amil</option>
                    <option value="Porto Saúde">Porto Saúde</option>
                  </select>
                </div>
              )}
            </div>

            <button 
              onClick={handleAgendar}
              className="w-full bg-secondary text-white py-6 rounded-[30px] font-black text-xl shadow-xl hover:scale-[1.02] transition-all active:scale-95"
            >
              CONFIRMAR AGENDAMENTO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}