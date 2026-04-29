import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EXAMS } from '../data/exams';

export default function ExamBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exame = EXAMS.find(e => e.id === parseInt(id));

  const [dataExame, setDataExame] = useState("");
  const [horaSelecionada, setHoraSelecionada] = useState("");
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const finalizarExame = () => {
    if (!dataExame || !horaSelecionada) return alert("Selecione data e hora.");

    const agendamentosExistentes = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    
    // Validação de conflito para a sala de exame
    const ocupado = agendamentosExistentes.some(a => 
      a.exame === exame.nome && a.data === dataExame && a.hora === horaSelecionada
    );

    if (ocupado) return alert("Este horário para este exame já está ocupado.");

    const novo = {
      id: Date.now(),
      paciente: usuarioLogado?.nome || "Paciente",
      exame: exame.nome,
      categoria: exame.categoria,
      data: dataExame,
      hora: horaSelecionada,
      status: 'Confirmado',
      tipo: 'exame' // Crucial para a secretária identificar
    };

    localStorage.setItem('agendamentos', JSON.stringify([...agendamentosExistentes, novo]));
    alert("Exame agendado com sucesso!");
    navigate('/meus-agendamentos');
  };

  if (!exame) return <p>Exame não encontrado.</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-3xl shadow-xl mt-10">
      <h1 className="text-2xl font-black text-primary uppercase">{exame.nome}</h1>
      <p className="text-gray-400 font-bold mb-6">{exame.categoria}</p>

      <div className="space-y-6">
        <input 
          type="date" 
          className="w-full p-4 border rounded-xl font-bold" 
          onChange={(e) => setDataExame(e.target.value)} 
        />

        <div className="grid grid-cols-3 gap-2">
          {['08:00', '09:00', '10:00', '11:00'].map(h => (
            <button 
              key={h} 
              onClick={() => setHoraSelecionada(h)}
              className={`p-3 rounded-xl border-2 font-bold ${horaSelecionada === h ? 'bg-primary text-white' : 'bg-gray-50'}`}
            >
              {h}
            </button>
          ))}
        </div>

        <button 
          onClick={finalizarExame}
          className="w-full bg-secondary text-white py-4 rounded-2xl font-black text-xl"
        >
          CONFIRMAR EXAME
        </button>
      </div>
    </div>
  );
}