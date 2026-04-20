import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DOCTORS } from '../data/doctors';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const medico = DOCTORS.find(doc => doc.id === parseInt(id));
  const [dataConsulta, setDataConsulta] = useState("");
  const [tipoAtendimento, setTipoAtendimento] = useState('plano');
  const [dadosPaciente, setDadosPaciente] = useState({
    nascimento: '',
    genero: '',
    planoSaude: '',
    unidade: 'Unidade Central - Av. Paulista, 1000'
  });

  const hoje = new Date().toISOString().split('T')[0];

  const handleAgendar = () => {
    const usuarioLogadoRaw = localStorage.getItem('usuarioLogado');
    
    if (!usuarioLogadoRaw) {
      alert("Você precisa estar logado para agendar!");
      navigate('/login');
      return;
    }

    if (!dataConsulta || !dadosPaciente.genero || !dadosPaciente.nascimento) {
      alert("Por favor, preencha todos os campos obrigatórios.");
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
      nascimento: dadosPaciente.nascimento,
      genero: dadosPaciente.genero,
      tipo: tipoAtendimento,
      planoSaude: tipoAtendimento === 'plano' ? dadosPaciente.planoSaude : 'Particular',
      unidade: dadosPaciente.unidade,
      status: "Confirmado"
    };

    localStorage.setItem('agendamentos', JSON.stringify([...agendamentosAntigos, novoAgendamento]));
    alert(`Consulta com ${medico.nome} agendada com sucesso!`);
    navigate('/meus-agendamentos');

    const confirmarAgendamento = (dados) => {
    // 1. Salva no LocalStorage (como você já faz)
    const banco = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    localStorage.setItem('agendamentos', JSON.stringify([...banco, dados]));

    // 2. Dispara o WhatsApp (O Gatilho)
    const msg = `Olá! Confirmo meu agendamento de ${dados.especialidade} com ${dados.medicoNome} para o dia ${dados.data} às ${dados.hora}.`;
    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`;
    
    window.open(url, '_blank'); // Abre o Zap em nova aba
    
    // 3. Navega para a página de sucesso
    navigate('/meus-agendamentos');
  };

  };

  if (!medico) {
    return <div className="text-center py-20 font-bold">Médico não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <button onClick={() => navigate(-1)} className="text-primary font-bold mb-6 flex items-center gap-2 hover:underline">
          ← Voltar
        </button>

        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          {/* Cabeçalho */}
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
            {/* Seção 1: Valores */}
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

            {/* Seção 2: Dados Paciente */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-secondary border-b pb-2">Informações do Paciente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Data de Nascimento</label>
                  <input 
                    type="date" 
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100"
                    onChange={(e) => setDadosPaciente({...dadosPaciente, nascimento: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Gênero</label>
                  <select 
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100"
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

            {/* Seção 3: Agendamento */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-secondary border-b pb-2">Agendamento e Pagamento</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Escolha a Data</label>
                <input 
                  type="date" 
                  min={hoje}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold"
                  value={dataConsulta}
                  onChange={(e) => setDataConsulta(e.target.value)}
                />
              </div>

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
                    <option value="Outro">Outro...</option>
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