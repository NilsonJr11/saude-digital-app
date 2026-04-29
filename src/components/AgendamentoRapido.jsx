import React, { useState } from 'react';
import { DOCTORS } from '../data/doctors';

export default function AgendamentoRapido() {
  const [etapa, setEtapa] = useState(1);
  const [filtros, setFiltros] = useState({ especialidade: '', medico: '' });

  // Pegamos especialidades únicas da sua lista de médicos
  const especialidades = [...new Set(DOCTORS.map(d => d.especialidade))];
  
  const medicosFiltrados = DOCTORS.filter(d => d.especialidade === filtros.especialidade);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto -mt-10 relative z-10 border border-gray-100">
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map(num => (
          <div key={num} className={`flex items-center gap-2 ${etapa >= num ? 'text-primary font-bold' : 'text-gray-300'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${etapa >= num ? 'border-primary bg-primary/10' : 'border-gray-200'}`}>
              {num}
            </span>
            <span className="hidden md:inline">
              {num === 1 ? 'Especialidade' : num === 2 ? 'Profissional' : 'Data e Hora'}
            </span>
          </div>
        ))}
      </div>

      {etapa === 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {especialidades.map(esp => (
            <button 
              key={esp}
              onClick={() => { setFiltros({...filtros, especialidade: esp}); setEtapa(2); }}
              className="p-4 rounded-2xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition text-left font-medium"
            >
              {esp}
            </button>
          ))}
        </div>
      )}

      {etapa === 2 && (
        <div className="space-y-4">
          <button onClick={() => setEtapa(1)} className="text-sm text-gray-500">← Voltar</button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicosFiltrados.map(med => (
              <div key={med.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-200">
                <div>
                  <p className="font-bold">{med.nome}</p>
                  <p className="text-xs text-gray-500">{med.localizacao || 'Presencial ou Telemedicina'}</p>
                </div>
                <button 
                  onClick={() => { setFiltros({...filtros, medico: med.id}); setEtapa(3); }}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold"
                >
                  Selecionar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/*<div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto py-10">
        {categoriasExames.map((cat) => (
            <CardCategoria key={cat.id} {...cat} />
        ))}
      </div>}

      {/* Na etapa 3, redirecionamos para o seu DoctorProfile já existente */}
      {etapa === 3 && (
        <div className="text-center py-10">
          <p className="text-lg mb-4">Ótima escolha! Vamos ver os horários disponíveis.</p>
          <button 
            onClick={() => window.location.href = `/medico/${filtros.medico}`}
            className="bg-secondary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-secondary/30"
          >
            Ver Calendário de Agendamento
          </button>
        </div>
      )}
    </div>
  );
}