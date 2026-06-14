import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardList, Pill, Save, ArrowLeft, Printer } from 'lucide-react';
import { toast } from 'react-hot-toast'; 

export default function MedicalRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agendamento, setAgendamento] = useState(null);
  const [evolucao, setEvolucao] = useState("");
  const [prescricao, setPrescricao] = useState("");

  const imprimirPrescricao = () => {
    window.print();
  };

  // 1. Carrega os dados do paciente via API
  useEffect(() => {
    fetch (`${import.meta.env.VITE_API_BASE_URL}/listar_agendamentos.php`)
      .then(res => res.json())
      .then(dados => {
        const atual = dados.find(a => String(a.id) === String(id));
        if (atual) {
          setAgendamento({
            id: atual.id,
            paciente: atual.paciente_nome,
            paciente_id: atual.paciente_id,
            data: new Date(atual.data_hora).toLocaleDateString('pt-BR'),
            hora: new Date(atual.data_hora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
          });
        }
      })
      .catch(err => toast.error("Erro ao carregar dados do paciente"));
  }, [id]);

  // 2. Função Corrigida e Interligada com suas variáveis
  const finalizarAtendimento = async () => {
    // 🕵️‍♂️ Resgata o médico logado com segurança de chaves alternadas do localStorage
    const doutor = JSON.parse(localStorage.getItem('usuarioLogado')) || JSON.parse(localStorage.getItem('usuario_logado'));
    const medicoId = doutor?.id || doutor?.id_usuario || 27; // ID 27 como fallback de segurança para testes

    const payload = {
      agenda_id: Number(id),                       // Pega direto da URL (/prontuario/12)
      paciente_id: Number(agendamento?.paciente_id), // Pega do estado preenchido pelo useEffect
      medico_id: Number(medicoId),                 // ID do médico autenticado
      sintomas: evolucao,                          // Seu textarea de Evolução Clínica
      diagnostico: "Atendimento Realizado",         // Campo padrão exigido pelo banco
      prescricao: prescricao                       // Seu textarea de Prescrição
    };

    // Validação de segurança antes de disparar o fetch
    if (!payload.agenda_id || !payload.paciente_id) {
      toast.error("Erro: Dados do agendamento ou paciente não localizados.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/finalizar_consulta.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Resposta inválida do servidor.");
      
      const resultado = await response.json();

      if (resultado.sucesso) {
        toast.success("🎉 Prontuário salvo e consulta finalizada!");
        
        // Limpa os campos após salvar
        setEvolucao('');
        setPrescricao('');
        
        // Retorna para a agenda médica após 1.5 segundos para o médico ver o toast de sucesso
        setTimeout(() => {
          navigate('/agenda-medica');
        }, 1500);
        
      } else {
        toast.error("Erro no PHP: " + resultado.erro);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao conectar com o servidor para salvar.");
    }
  };

  if (!agendamento) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-bold text-gray-500">Buscando agendamento no banco...</p>
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

        <div className="bg-secondary p-10 rounded-t-[50px] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black opacity-60 uppercase tracking-[4px] mb-2">Prontuário Digital</p>
            <h1 className="text-4xl font-black italic tracking-tighter">{agendamento.paciente}</h1>
            <div className="flex gap-6 mt-4">
              <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">📅 {agendamento.data}</span>
              <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">⏰ {agendamento.hora}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-b-[50px] shadow-xl space-y-10 border border-gray-100">
          <div className="group">
            <label className="flex items-center gap-3 text-secondary font-black uppercase text-xs tracking-widest mb-4">
              <ClipboardList size={18} /> Evolução Clínica e Diagnóstico
            </label>
            <textarea 
              className="w-full p-8 bg-gray-50 border-2 border-transparent rounded-[30px] min-h-[200px] outline-none focus:bg-white focus:border-primary/20 transition-all shadow-inner"
              placeholder="Descreva o atendimento..."
              value={evolucao}
              onChange={(e) => setEvolucao(e.target.value)}
            />
          </div>

          <div className="group">
            <label className="flex items-center gap-3 text-secondary font-black uppercase text-xs tracking-widest mb-4">
              <Pill size={18} /> Prescrição de Medicamentos
            </label>
            <textarea 
              className="w-full p-8 bg-blue-50/30 border-2 border-dashed border-blue-100 rounded-[30px] min-h-[150px] outline-none focus:bg-white focus:border-primary/20 transition-all font-mono text-sm text-blue-900"
              placeholder="Medicação e dosagem..."
              value={prescricao}
              onChange={(e) => setPrescricao(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={imprimirPrescricao}
              className="w-full bg-gray-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
            >
              <Printer size={20} /> GERAR RECEITA (PDF)
            </button>

            <button 
              onClick={finalizarAtendimento}
              className="w-full bg-primary text-white py-8 rounded-[40px] font-black text-xl shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
            >
              <Save size={28} /> CONCLUIR ATENDIMENTO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}