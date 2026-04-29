import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardList, Pill, Save, User } from 'lucide-react';

export default function MedicalRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agendamento, setAgendamento] = useState(null);
  const [evolucao, setEvolucao] = useState("");
  const [prescricao, setPrescricao] = useState("");

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const atual = todos.find(a => String(a.id) === String(id));
    if (atual) setAgendamento(atual);
  }, [id]);

  const finalizarAtendimento = () => {
    const todos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    const novaLista = todos.map(a => {
      if (String(a.id) === String(id)) {
        return { 
          ...a, 
          status: 'Finalizado', 
          evolucao, 
          prescricao,
          dataFinalizacao: new Date().toLocaleString() 
        };
      }
      return a;
    });

    localStorage.setItem('agendamentos', JSON.stringify(novaLista));
    alert("Atendimento finalizado e prontuário salvo!");
    navigate('/agenda-medica');
  };

  if (!agendamento) return <div className="p-20 text-center">Carregando prontuário...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* CABEÇALHO DO PACIENTE */}
        <div className="bg-secondary p-8 rounded-t-[40px] text-white flex justify-between items-center">
          <div>
            <p className="text-xs font-black opacity-70 uppercase mb-1">Paciente em Atendimento</p>
            <h1 className="text-3xl font-black">{agendamento.paciente}</h1>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-black opacity-70 uppercase">Data da Consulta</p>
            <p className="font-bold">{agendamento.data}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-b-[40px] shadow-xl space-y-8">
          
          {/* CAMPO: EVOLUÇÃO CLÍNICA */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-secondary font-black uppercase text-sm">
              <ClipboardList size={18} /> Evolução Clínica (Sintomas e Diagnóstico)
            </label>
            <textarea 
              className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl min-h-[150px] outline-none focus:border-primary transition-all font-medium"
              placeholder="Descreva o quadro clínico do paciente..."
              value={evolucao}
              onChange={(e) => setEvolucao(e.target.value)}
            />
          </div>

          {/* CAMPO: PRESCRIÇÃO */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-secondary font-black uppercase text-sm">
              <Pill size={18} /> Prescrição Médica
            </label>
            <textarea 
              className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl min-h-[120px] outline-none focus:border-primary transition-all font-mono text-sm"
              placeholder="1. Medicamento X - Tomar de 8 em 8 horas..."
              value={prescricao}
              onChange={(e) => setPrescricao(e.target.value)}
            />
          </div>

          {/* BOTÃO SALVAR */}
          <button 
            onClick={finalizarAtendimento}
            className="w-full bg-primary text-white py-6 rounded-[30px] font-black text-xl shadow-lg hover:bg-secondary transition-all flex items-center justify-center gap-3"
          >
            <Save /> FINALIZAR E SALVAR PRONTUÁRIO
          </button>
        </div>
      </div>
    </div>
  );
}