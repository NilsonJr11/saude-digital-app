import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DOCTORS } from '../data/doctors';

// --- FUNÇÕES DE MÁSCARA ---
const aplicarMascaraCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

const aplicarMascaraCelular = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const medico = DOCTORS.find(doc => doc.id === parseInt(id));

  // --- 1. ESTADOS ---
  const [passo, setPasso] = useState(1); 
  const [dataConsulta, setDataConsulta] = useState("");
  const [horaSelecionada, setHoraSelecionada] = useState("");
  const [tipoAtendimento, setTipoAtendimento] = useState('plano');
  
  const [dadosPaciente, setDadosPaciente] = useState({
    nascimento: '',
    genero: '',
    planoSaude: '',
    unidade: 'Unidade Central - Av. Paulista, 1000'
  });

  const [dadosPessoais, setDadosPessoais] = useState({
    nomeCompleto: '',
    cpf: '',
    email: '',
    celular: ''
  });

  const hoje = new Date().toISOString().split('T')[0];

  // --- 2. LÓGICAS DE APOIO ---
  const verificarDomingo = (dataString) => {
    if (!dataString) return false;
    const data = new Date(dataString + 'T12:00:00');
    return data.getDay() === 0;
  };

  const verificarHorarioOcupado = (hora) => {
  // Busca a lista atualizada do banco local
  const agendamentosNoBanco = JSON.parse(localStorage.getItem('agendamentos') || '[]');
  
  return agendamentosNoBanco.some(agend => 
    agend.medicoNome === medico.nome && 
    agend.data === dataConsulta && 
    agend.hora === hora &&
    agend.status !== "Cancelado" // Opcional: permite agendar se o anterior foi cancelado
  );
};

  // --- 3. FUNÇÃO DE FINALIZAÇÃO ---
  const handleAgendar = () => {
    const { cpf, nomeCompleto, email, celular } = dadosPessoais;

    if (nomeCompleto.trim().split(' ').length < 2) return alert("Digite nome e sobrenome.");
    if (cpf.replace(/\D/g, '').length !== 11) return alert("CPF inválido.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("E-mail inválido.");
    if (celular.replace(/\D/g, '').length < 11) return alert("Celular inválido.");

    const usuarioLogadoRaw = localStorage.getItem('usuarioLogado');
    if (!usuarioLogadoRaw) {
      alert("Sessão expirada. Faça login novamente.");
      navigate('/login');
      return;
    }
    const usuarioLogado = JSON.parse(usuarioLogadoRaw);

    const novoAgendamento = {
      id: Date.now(),
      ...dadosPessoais,
      pacienteEmail: usuarioLogado.email.toLowerCase(),
      medicoNome: medico.nome,
      especialidade: medico.especialidade,
      data: dataConsulta,
      hora: horaSelecionada,
      tipo: tipoAtendimento,
      planoSaude: tipoAtendimento === 'plano' ? (dadosPaciente.planoSaude || 'Não informado') : 'Particular',
      unidade: dadosPaciente.unidade,
      status: "Confirmado"
    };

    const agendamentosAtuais = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    localStorage.setItem('agendamentos', JSON.stringify([...agendamentosAtuais, novoAgendamento]));

    const msg = `Olá! Sou o paciente ${nomeCompleto}. Confirmo meu agendamento com ${medico.nome} para o dia ${dataConsulta} às ${horaSelecionada}.`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');

    alert("Sucesso! Seu agendamento foi salvo.");
    navigate('/meus-agendamentos');
  };

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
              <div className="space-y-10 animate-fadeIn">
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
                  <h3 className="text-xl font-black text-secondary border-b pb-2">Informações Iniciais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="date" className="p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold outline-none focus:border-primary" value={dadosPaciente.nascimento} onChange={(e) => setDadosPaciente({...dadosPaciente, nascimento: e.target.value})} />
                    <select className="p-4 rounded-2xl bg-gray-50 border border-gray-100 font-bold outline-none focus:border-primary" value={dadosPaciente.genero} onChange={(e) => setDadosPaciente({...dadosPaciente, genero: e.target.value})}>
                      <option value="">Gênero</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-secondary border-b pb-2">Escolha Data e Hora</h3>
                  <input type="date" min={hoje} className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 font-bold mb-4 outline-none focus:border-primary" onChange={(e) => { setDataConsulta(e.target.value); setHoraSelecionada(""); }} />

                  {dataConsulta && (
                    <>
                      <div className="grid grid-cols-3 gap-3">
                      {[
                        { h: '08:00', t: 'n' }, { h: '08:30', t: 'e' }, 
                        { h: '09:00', t: 'n' }, { h: '09:30', t: 'e' }, 
                        { h: '10:00', t: 'n' }, { h: '10:30', t: 'e' }
                      ].map(item => {
                        const eDom = verificarDomingo(dataConsulta);
                        const ocupado = verificarHorarioOcupado(item.h);
                        const selecionado = horaSelecionada === item.h;

                        return (
                          <button 
                            key={item.h} 
                            // Desabilita se for domingo OU se o horário já estiver no localStorage
                            disabled={eDom || ocupado} 
                            onClick={() => setHoraSelecionada(item.h)} 
                            className={`relative p-3 px-4 rounded-xl border-2 font-bold transition-all flex items-center justify-between 
                              ${ocupado || eDom 
                                ? 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed opacity-60' 
                                : selecionado 
                                  ? 'bg-primary border-primary text-white shadow-md' 
                                  : 'bg-white text-gray-700 border-gray-100 hover:border-primary'}`}
                          >
                            <span className="text-sm">
                              {ocupado ? "Ocupado" : item.h}
                            </span>
                            
                            {/* Ícone de Encaixe "E" só aparece se não estiver ocupado */}
                            {item.t === 'e' && !ocupado && !eDom && (
                              <span className={`w-5 h-5 rounded-lg text-[10px] font-black flex items-center justify-center 
                                ${selecionado ? 'bg-white text-primary' : 'bg-orange-100 text-orange-600'}`}>
                                E
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                      <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 flex items-center justify-center bg-orange-100 text-orange-600 text-[10px] font-bold rounded-lg">E</span>
                          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Encaixe</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-200 rounded-lg border border-gray-300"></div>
                          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Ocupado</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setTipoAtendimento('plano')} className={`flex-1 py-4 rounded-2xl border-2 font-black transition-all ${tipoAtendimento === 'plano' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400'}`}>CONVÊNIO</button>
                  <button onClick={() => setTipoAtendimento('particular')} className={`flex-1 py-4 rounded-2xl border-2 font-black transition-all ${tipoAtendimento === 'particular' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-400'}`}>PARTICULAR</button>
                </div>

                {tipoAtendimento === 'plano' && (
                  <select className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-primary/20 font-bold outline-none" onChange={(e) => setDadosPaciente({...dadosPaciente, planoSaude: e.target.value})}>
                    <option value="">Selecione seu plano...</option>
                    <option value="Unimed">Unimed</option>
                    <option value="SulAmérica">SulAmérica</option>
                    <option value="Bradesco">Bradesco Saúde</option>
                  </select>
                )}

                <button 
                  onClick={() => {
                    if(!horaSelecionada || !dataConsulta || !dadosPaciente.genero) return alert("Preencha todos os campos e escolha o horário.");
                    if(verificarDomingo(dataConsulta)) return alert("Unidade fechada aos domingos.");
                    setPasso(2);
                  }}
                  className="w-full bg-secondary text-white py-6 rounded-[30px] font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  PROSSEGUIR PARA CADASTRO
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-primary/5 p-6 rounded-2xl border-l-4 border-primary">
                  <p className="text-sm text-primary font-bold">📍 Agendamento: <span className="text-secondary">{dataConsulta} às {horaSelecionada}</span></p>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase font-black">Modalidade: {tipoAtendimento === 'plano' ? `Convênio (${dadosPaciente.planoSaude})` : 'Particular'}</p>
                </div>

                <h2 className="text-2xl font-black text-secondary border-b pb-4">Dados do Paciente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Nome Completo</label>
                    <input type="text" placeholder="Nome e Sobrenome" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all" value={dadosPessoais.nomeCompleto} onChange={(e) => setDadosPessoais({...dadosPessoais, nomeCompleto: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">CPF</label>
                    <input type="text" placeholder="000.000.000-00" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all" value={dadosPessoais.cpf} onChange={(e) => setDadosPessoais({...dadosPessoais, cpf: aplicarMascaraCPF(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">E-mail</label>
                    <input type="email" placeholder="seuemail@gmail.com" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all" value={dadosPessoais.email} onChange={(e) => setDadosPessoais({...dadosPessoais, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Celular</label>
                    <input type="text" placeholder="(11) 99999-9999" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all" value={dadosPessoais.celular} onChange={(e) => setDadosPessoais({...dadosPessoais, celular: aplicarMascaraCelular(e.target.value)})} />
                  </div>
                </div>

                <button onClick={handleAgendar} className="w-full bg-secondary text-white py-6 rounded-[30px] font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
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