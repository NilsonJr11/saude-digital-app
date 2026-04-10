import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DOCTORS } from '../data/doctors';

export default function DoctorProfile() {
  const { id } = useParams();
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  const medico = DOCTORS.find(doc => doc.id === parseInt(id));

  if (!medico) return <div className="p-8">Médico não encontrado.</div>;

  // ESTA É A ÚNICA FUNÇÃO QUE DEVE EXISTIR
  const handleAgendar = () => {
    if (!dataSelecionada) {
      alert("Por favor, selecione uma data antes de confirmar.");
      return;
    }

    const novoAgendamento = {
      id: Date.now(),
      medicoNome: medico.nome,
      especialidade: medico.especialidade,
      data: dataSelecionada
    };

    // 1. Pega a lista atual do navegador
    const listaSalva = JSON.parse(localStorage.getItem('meusAgendamentos') || '[]');
    
    // 2. Adiciona o novo agendamento à lista existente (sem apagar os antigos)
    const listaAtualizada = [...listaSalva, novoAgendamento];

    // 3. Salva a lista completa de volta no LocalStorage
    localStorage.setItem('meusAgendamentos', JSON.stringify(listaAtualizada));

    // 4. Muda a tela para sucesso
    setConfirmado(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 mb-8">
        <div className="container mx-auto">
          <Link to="/" className="text-primary font-bold">← Voltar para a Busca</Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-4xl">
        {confirmado ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              ✓
            </div>
            <h2 className="text-3xl font-bold text-secondary mb-2">Consulta Agendada!</h2>
            <p className="text-gray-600 mb-8">
              Sua consulta com <strong>{medico.nome}</strong> foi marcada para o dia <strong>{new Date(dataSelecionada).toLocaleDateString('pt-BR')}</strong>.
            </p>
            <Link to="/meus-agendamentos" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">
              Ver Meus Agendamentos
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-primary p-8 text-white flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                {medico.nome.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{medico.nome}</h1>
                <p className="text-accent font-medium">{medico.especialidade}</p>
              </div>
            </div>
            
            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-secondary mb-4">Sobre o Profissional</h3>
                <p className="text-gray-600 leading-relaxed">{medico.sobre}</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-bold text-secondary mb-4">Agendar Consulta</h3>
                <p className="text-sm text-gray-500 mb-4">Selecione uma data disponível:</p>
                
                <input 
                  type="date" 
                  className="w-full p-3 rounded-lg border border-gray-200 mb-4 outline-none focus:border-primary" 
                  value={dataSelecionada}
                  onChange={(e) => setDataSelecionada(e.target.value)}
                />
                
                <button 
                  onClick={handleAgendar}
                  className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}