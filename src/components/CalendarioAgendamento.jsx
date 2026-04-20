// src/components/CalendarioAgendamento.jsx
import React, { useState } from 'react';

export default function CalendarioAgendamento({ aoSelecionarHorario }) {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  // Simulação da regra da Rede D'Or:
  // Domingo (0) quase não tem horário. Sábado (6) reduzido.
  const gerarHorarios = (data) => {
    const diaSemana = data.getDay();
    
    if (diaSemana === 0) return []; // Domingo vazio (Regra de negócio)

    return [
      { hora: '08:00', tipo: 'normal' },
      { hora: '08:15', tipo: 'encaixe' }, // O "E" que você viu
      { hora: '08:30', tipo: 'normal' },
      { hora: '09:00', tipo: 'encaixe' },
      { hora: '09:30', tipo: 'normal' },
    ];
  };

  const horariosDisponiveis = gerarHorarios(dataSelecionada);

  return (
    <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-secondary mb-4">Selecione o Horário</h3>
      
      <div className="grid grid-cols-3 gap-3">
        {horariosDisponiveis.length > 0 ? (
          horariosDisponiveis.map((h, index) => (
            <button
              key={index}
              onClick={() => aoSelecionarHorario(h)}
              className="relative py-3 px-4 rounded-xl border-2 border-gray-50 hover:border-primary hover:bg-blue-50 transition-all group"
            >
              <span className="text-sm font-bold text-gray-700">{h.hora}</span>
              
              {/* O marcador "E" de Encaixe */}
              {h.tipo === 'encaixe' && (
                <span 
                  title="Horário de Encaixe (Sujeito a espera)"
                  className="absolute -top-2 -right-1 bg-orange-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                >
                  E
                </span>
              )}
            </button>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-400 py-4 text-sm italic">
            Sem horários disponíveis para este dia.
          </p>
        )}
      </div>
      
      {/* Legenda igual ao site da Rede D'Or */}
      <div className="mt-6 flex gap-4 text-[10px] uppercase font-bold text-gray-400">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center text-white text-[7px]">E</span>
          Encaixe
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-gray-200 rounded-md"></span>
          Normal
        </div>
      </div>
    </div>
  );
}