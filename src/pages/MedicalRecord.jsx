import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardList, Pill, Save, ArrowLeft, Printer } from 'lucide-react';

export default function MedicalRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agendamento, setAgendamento] = useState(null);
  const [evolucao, setEvolucao] = useState("");
  const [prescricao, setPrescricao] = useState("");
  
  const imprimirPrescricao = () => {
  window.print();
};

  const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
  const concluidos = agendamentos.filter(a => a.status === 'concluido');

  // Supondo um valor fixo de R$ 200,00 por consulta para o teste
  const totalFaturado = concluidos.length * 200;
  const totalPacientes = concluidos.length;

  // Pegamos o médico logado para registrar quem fez o atendimento
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    // Buscamos o agendamento específico pelo ID vindo da Agenda
    const atual = todos.find(a => String(a.id) === String(id));
    
    if (atual) {
      setAgendamento(atual);
    } else {
      // Se não achar o ID (ex: refresh na página), tenta pegar o último agendamento fake ou volta
      console.warn("Agendamento não encontrado para o ID:", id);
    }
  }, [id]);

  const finalizarAtendimento = () => {
    if (!evolucao || !prescricao) {
      alert("Por favor, preencha a evolução e a prescrição antes de finalizar.");
      return;
    }

    const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const historicoProntuarios = JSON.parse(localStorage.getItem('prontuarios') || '[]');

    // 1. Criar o registro histórico
    const novoProntuario = {
      idAgendamento: id,
      paciente: agendamento.paciente,
      medico: usuarioLogado?.nome || "Dr. Ricardo Vaz",
      data: new Date().toLocaleDateString('pt-BR'),
      evolucao: evolucao,
      prescricao: prescricao,
    };

    // 2. Marcar como concluído na agenda para o bloco talvez mudar de cor ou sumir
    const agendamentosAtualizados = todosAgendamentos.map(a => {
      if (String(a.id) === String(id)) return { ...a, status: 'concluido' };
      return a;
    });

    // 3. Salvar nos dois bancos locais
    localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));
    localStorage.setItem('prontuarios', JSON.stringify([novoProntuario, ...historicoProntuarios]));

    alert(`Atendimento de ${agendamento.paciente} finalizado!`);
    navigate('/meus-pacientes'); // Leva o médico para ver a lista de pacientes atualizada
  };

  if (!agendamento) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-bold text-gray-500">Agendamento não localizado.</p>
        <button onClick={() => navigate('/agenda-medica')} className="text-primary font-black uppercase text-xs">Voltar para Agenda</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-4 md:p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => navigate('/agenda-medica')}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-secondary font-bold transition-all"
        >
          <ArrowLeft size={20} /> VOLTAR PARA AGENDA
        </button>

        {/* CABEÇALHO ESTILIZADO */}
        <div className="bg-secondary p-10 rounded-t-[50px] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black opacity-60 uppercase tracking-[4px] mb-2">Prontuário Digital</p>
            <h1 className="text-4xl font-black italic tracking-tighter">{agendamento.paciente}</h1>
            <div className="flex gap-6 mt-4">
              <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">📅 {agendamento.data}</span>
              <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">⏰ {agendamento.hora}</span>
            </div>
          </div>
          {/* Elemento visual de fundo */}
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-white p-10 rounded-b-[50px] shadow-xl space-y-10 border border-gray-100">
          
          {/* EVOLUÇÃO */}
          <div className="group">
            <label className="flex items-center gap-3 text-secondary font-black uppercase text-xs tracking-widest mb-4 group-focus-within:text-primary transition-colors">
              <div className="p-2 bg-gray-100 rounded-lg group-focus-within:bg-primary/10">
                <ClipboardList size={18} />
              </div>
              Evolução Clínica e Diagnóstico
            </label>
            <textarea 
              className="w-full p-8 bg-gray-50 border-2 border-transparent rounded-[30px] min-h-[200px] outline-none focus:bg-white focus:border-primary/20 transition-all font-medium text-gray-700 shadow-inner"
              placeholder="Descreva detalhadamente o que o paciente relatou e suas observações..."
              value={evolucao}
              onChange={(e) => setEvolucao(e.target.value)}
            />
          </div>

          {/* PRESCRIÇÃO */}
          <div className="group">
            <label className="flex items-center gap-3 text-secondary font-black uppercase text-xs tracking-widest mb-4 group-focus-within:text-primary transition-colors">
              <div className="p-2 bg-gray-100 rounded-lg group-focus-within:bg-primary/10">
                <Pill size={18} />
              </div>
              Prescrição de Medicamentos
            </label>
            <textarea 
              className="w-full p-8 bg-blue-50/30 border-2 border-dashed border-blue-100 rounded-[30px] min-h-[150px] outline-none focus:bg-white focus:border-primary/20 transition-all font-mono text-sm text-blue-900"
              placeholder="Ex: Amoxicilina 500mg - 1 comprimido de 8/8h por 7 dias."
              value={prescricao}
              onChange={(e) => setPrescricao(e.target.value)}
            />
          </div>

          <button 
            onClick={imprimirPrescricao}
            className="flex-1 bg-gray-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            <Printer size={20} /> GERAR RECEITA (PDF)
          </button>

          {/* BOTÃO FINAL */}
          <div className="pt-4">
            <button 
              onClick={finalizarAtendimento}
              className="w-full bg-primary text-white py-8 rounded-[40px] font-black text-xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 tracking-tighter"
            >
              <Save size={28} /> CONCLUIR ATENDIMENTO
            </button>
            <p className="text-center mt-6 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              Ao concluir, os dados serão salvos no histórico permanente do paciente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}