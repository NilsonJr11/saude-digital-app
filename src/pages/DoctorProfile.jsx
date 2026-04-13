import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DOCTORS } from '../data/doctors';

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Primeiro buscamos o médico
  const medico = DOCTORS.find(doc => doc.id === parseInt(id));

  // 2. Depois criamos os estados e variáveis que dependem de lógica
  const [dataConsulta, setDataConsulta] = useState("");
  const hoje = new Date().toISOString().split('T')[0];

  // 3. Verificação de segurança: se o médico não existir, para aqui
  if (!medico) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Médico não encontrado.</h2>
        <button onClick={() => navigate('/')} className="text-primary underline mt-4">
          Voltar para o início
        </button>
      </div>
    );
  }

  const handleAgendar = () => {
    const usuarioLogadoRaw = localStorage.getItem('usuarioLogado');
    
    if (!usuarioLogadoRaw) {
      alert("Você precisa estar logado para agendar!");
      navigate('/login');
      return;
    }

    if (!dataConsulta) {
      alert("Por favor, selecione uma data.");
      return;
    }

    const usuarioLogado = JSON.parse(usuarioLogadoRaw);

    const novoAgendamento = {
      id: Date.now(),
      clienteEmail: usuarioLogado.email.toLowerCase(),
      medicoNome: medico.nome,
      especialidade: medico.especialidade,
      data: dataConsulta
    };

    const agendamentosSalvos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    agendamentosSalvos.push(novoAgendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentosSalvos));

    alert(`Consulta com ${medico.nome} agendada com sucesso!`);
    navigate('/meus-agendamentos');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <button onClick={() => navigate(-1)} className="text-primary font-bold mb-6 flex items-center gap-2 hover:underline">
          ← Voltar
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header do Médico */}
          <div className="bg-primary p-8 text-white flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center text-4xl font-bold border-4 border-white/30">
              {medico.nome[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{medico.nome}</h1>
              <p className="text-xl opacity-90">{medico.especialidade}</p>
              <div className="mt-2">
                <span className="bg-yellow-400 text-secondary text-xs font-bold px-2 py-1 rounded-lg">
                  ⭐ {medico.rating || "5.0"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Informações de Valor e Localização (O que deixa atrativo!) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Valor da Consulta</p>
                <p className="text-xl font-bold text-secondary">{medico.valor || "R$ 250,00"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Localização</p>
                <p className="text-sm font-bold text-secondary">{medico.localizacao || "São Paulo - SP"}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-secondary mb-4">Sobre o Especialista</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {medico.bio || "Médico especialista focado em atendimento humanizado."}
            </p>

            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">
                Data da Consulta
              </label>
              <input 
                type="date" 
                min={hoje}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                value={dataConsulta}
                onChange={(e) => setDataConsulta(e.target.value)}
              />
            </div>

            <button 
              onClick={handleAgendar}
              className="w-full bg-secondary text-white py-5 rounded-2xl font-bold text-xl shadow-lg hover:bg-opacity-90 transition active:scale-[0.98]"
            >
              Agendar Consulta Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}