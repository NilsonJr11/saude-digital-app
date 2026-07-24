import React, { useState } from 'react';

export default function CalendarioAgendamento({ aoSelecionarHorario, consultas = [], medicoId = null }) {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  // Simulação da regra de horários da clínica
  const gerarHorarios = (data) => {
    const diaSemana = data.getDay();
    if (diaSemana === 0) return []; // Domingo vazio

    return [
      { hora: '08:00', tipo: 'normal' },
      { hora: '08:15', tipo: 'encaixe' },
      { hora: '08:30', tipo: 'normal' },
      { hora: '09:00', tipo: 'encaixe' },
      { hora: '09:30', tipo: 'normal' },
      { hora: '10:00', tipo: 'normal' },
      { hora: '14:00', tipo: 'normal' },
      { hora: '15:00', tipo: 'normal' },
    ];
  };

  const horariosDisponiveis = gerarHorarios(dataSelecionada);

  // 1. FUNÇÃO QUE VERIFICA SE O HORÁRIO JÁ FOI AGENDADO
  const isHorarioOcupado = (horarioTexto) => {
    const dataFormatada = dataSelecionada.toISOString().split('T')[0];

    return consultas.some(c => {
      const dataC = c.data_consulta || c.data_hora?.split(' ')[0];
      const horaC = c.horario_consulta?.substring(0, 5) || c.data_hora?.split(' ')[1]?.substring(0, 5);

      const mesmoMedico = medicoId ? Number(c.medico_id) === Number(medicoId) : true;
      const mesmaData = dataC === dataFormatada;
      const mesmoHorario = horaC === horarioTexto;
      const naoCancelado = c.status?.toLowerCase() !== 'cancelado';

      return mesmoMedico && mesmaData && mesmoHorario && naoCancelado;
    });
  };

  return (
    <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-secondary mb-4">Selecione o Horário</h3>

      <div className="grid grid-cols-3 gap-3">
        {horariosDisponiveis.length > 0 && horariosDisponiveis.map((h, index) => {
          // 2. CHECA SE ESTÁ OCUPADO
          const ocupado = isHorarioOcupado(h.hora);

          return (
            <button
              key={index}
              disabled={ocupado} // Desabilita o clique se estiver ocupado
              onClick={() => !ocupado && aoSelecionarHorario(h)}
              className={`relative py-3 px-4 rounded-xl border-2 transition-all text-center ${
                ocupado
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through" // Visual desabilitado
                  : "border-gray-50 hover:border-primary hover:bg-blue-50 cursor-pointer"      // Visual disponível
              }`}
            >
              <span className="text-sm font-bold text-gray-700">
                {h.hora} {ocupado && <span className="text-xs text-red-500 font-normal block">(Ocupado)</span>}
              </span>

              {/* Marcador "E" de Encaixe (mantido do seu código original) */}
              {!ocupado && h.tipo === 'encaixe' && (
                <span 
                  title="Horário de Encaixe"
                  className="absolute -top-2 -right-1 bg-orange-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                >
                  E
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}