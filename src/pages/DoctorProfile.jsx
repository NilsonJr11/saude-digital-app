import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DOCTORS } from '../data/doctors';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const medico = DOCTORS.find(doc => doc.id === parseInt(id));

  // --- 1. ESTADOS ---
  const [passo, setPasso] = useState(1); 
  const [dataConsulta, setDataConsulta] = useState("");
  const [horaSelecionada, setHoraSelecionada] = useState("");
  const [tipoAtendimento, setTipoAtendimento] = useState('plano');
  
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // --- 2. DADOS CARREGADOS DO BANCO (Escopo Global do Componente) ---
  const agendamentosExistentes = JSON.parse(localStorage.getItem('agendamentos') || '[]');

  const [dadosPaciente, setDadosPaciente] = useState({
    nascimento: '',
    genero: '',
    planoSaude: '',
    unidade: 'Unidade Central - Av. Paulista, 1000'
  });

  const hoje = new Date().toISOString().split('T')[0];

  // --- 3. LÓGICAS DE APOIO ---
  const verificarDomingo = (dataString) => {
    if (!dataString) return false;
    const data = new Date(dataString + 'T12:00:00');
    return data.getDay() === 0;
  };

  const finalizarAgendamento = () => {
    if (!usuarioLogado) {
      alert("Você precisa estar logado!");
      navigate('/login');
      return;
    }

    // Verifica conflito novamente antes de salvar
    const jaOcupado = agendamentosExistentes.some(a => 
      a.medicoNome === medico.nome && a.data === dataConsulta && a.hora === horaSelecionada && a.status !== "Cancelado"
    );

    if (jaOcupado) {
      alert("Este horário acabou de ser reservado. Por favor, escolha outro.");
      setPasso(1);
      return;
    }

    try {
      const novoAgendamento = {
        id: Date.now(),
        paciente: usuarioLogado.nome,
        medicoNome: medico.nome,
        especialidade: medico.especialidade,
        data: dataConsulta,
        hora: horaSelecionada,
        status: 'Confirmado',
        tipo: 'medico'
      };

      localStorage.setItem('agendamentos', JSON.stringify([...agendamentosExistentes, novoAgendamento]));

      // WhatsApp agora fica dentro da função de sucesso
      const msg = `Olá! Confirmo agendamento com ${medico.nome} para ${dataConsulta} às ${horaSelecionada}.`;
      window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');

      alert("Agendamento confirmado!");
      navigate('/meus-agendamentos');
    } catch (e) {
      console.error(e);
    }
  };

  /*const filtradosPorMedico = todosAgendamentos.filter(agend => 
  //agend.medicoNome.trim() === usuarioLogado?.nome.trim()
);*/

  if (!medico) return <div className="text-center py-20 font-bold">Médico não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans text-gray-900">
      <div className="container mx-auto max-w-4xl">
        <button 
          onClick={() => passo === 2 ? setPasso(1) : navigate(-1)} 
          className="text-primary font-bold mb-6 flex items-center gap-2 hover:underline transition-all"
        >
          ← {passo === 2 ? 'Voltar para Horários' : 'Voltar'}
        </button>

        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-primary p-10 text-white flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center text-5xl font-black border-4 border-white/30 shadow-inner">
              {medico.nome[0]}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tighter">{medico.nome}</h1>
              <p className="text-xl opacity-80 font-medium uppercase tracking-widest text-xs mt-1">{medico.especialidade}</p>
            </div>
          </div>

          <div className="p-10">
            {passo === 1 ? (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <label className="block text-secondary font-black text-[10px] uppercase mb-2 tracking-widest">Local</label>
                    <p className="text-gray-600 font-bold text-sm">📍 {dadosPaciente.unidade}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <label className="block text-secondary font-black text-[10px] uppercase mb-2 tracking-widest">Valor</label>
                    <p className="text-primary text-2xl font-black">{medico.valor || "R$ 350,00"}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-secondary border-b pb-2">Escolha Data e Hora</h3>
                  <input 
                    type="date" 
                    min={hoje} 
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 font-bold outline-none" 
                    onChange={(e) => { setDataConsulta(e.target.value); setHoraSelecionada(""); }} 
                  />

                  {dataConsulta && (
                    <div className="grid grid-cols-3 gap-3">
                      {['08:00', '08:30', '09:00', '09:30'].map(hora => {
                        // AQUI FUNCIONA AGORA: agendamentosExistentes está no topo!
                        const ocupado = agendamentosExistentes.some(a => 
                          a.medicoNome === medico.nome && a.data === dataConsulta && a.hora === hora && a.status !== "Cancelado"
                        );

                        return (
                          <button 
                            key={hora} 
                            disabled={ocupado || verificarDomingo(dataConsulta)}
                            onClick={() => setHoraSelecionada(hora)}
                            className={`p-3 rounded-xl border-2 font-bold transition-all ${
                              ocupado ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 
                              horaSelecionada === hora ? 'bg-primary border-primary text-white' : 'bg-white border-gray-100 hover:border-primary'
                            }`}
                          >
                            {ocupado ? "Ocupado" : hora}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    if(!horaSelecionada) return alert("Selecione o horário.");
                    setPasso(2);
                  }}
                  className="w-full bg-secondary text-white py-6 rounded-[30px] font-black text-xl shadow-lg"
                >
                  PROSSEGUIR
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white rounded-[35px] border border-gray-100 p-8">
                  <h3 className="text-xl font-black text-secondary mb-6">Confirmar Dados</h3>
                  {usuarioLogado && (
                    <div className="bg-gray-50 p-6 rounded-[25px] grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><p className="text-[10px] font-black text-primary uppercase">Nome</p><p className="font-bold">{usuarioLogado.nome}</p></div>
                      <div><p className="text-[10px] font-black text-primary uppercase">CPF</p><p className="font-bold">{usuarioLogado.cpf}</p></div>
                      <div><p className="text-[10px] font-black text-primary uppercase">E-mail</p><p className="font-bold">{usuarioLogado.email}</p></div>
                      <div><p className="text-[10px] font-black text-primary uppercase">Telefone</p><p className="font-bold">{usuarioLogado.telefone}</p></div> 
                    </div>
                  )}
                </div>
                <button 
                  onClick={finalizarAgendamento}
                  className="w-full bg-[#009b7f] text-white py-6 rounded-[30px] font-black text-xl shadow-xl active:scale-95 transition-all"
                >
                  FINALIZAR AGENDAMENTO
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}