import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MyAppointments() {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('meusAgendamentos') || '[]');
    setAgendamentos(dados);
  }, []);

  // Lógica para Desmarcar (Remover do localStorage)
  const handleDesmarcar = (id) => {
    if (window.confirm("Tem certeza que deseja desmarcar esta consulta?")) {
      const novaLista = agendamentos.filter(item => item.id !== id);
      setAgendamentos(novaLista);
      localStorage.setItem('meusAgendamentos', JSON.stringify(novaLista));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-2xl">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Meus Agendamentos</h1>
          <Link to="/" className="text-primary font-bold hover:underline">← Novo Agendamento</Link>
        </header>

        {agendamentos.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl shadow-sm text-center border-2 border-dashed border-gray-100 mt-10">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-secondary mb-2">Nenhuma consulta por aqui</h3>
                <p className="text-gray-500 mb-8">Você ainda não agendou nenhum horário com nossos especialistas.</p>
                <Link to="/" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition">
                Procurar Médicos
                </Link>
            </div>
            ) : (
          <div className="space-y-4">
            {agendamentos.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-primary flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-secondary">{item.medicoNome}</h3>
                  <p className="text-primary text-sm font-medium">{item.especialidade}</p>
                  <p className="text-gray-500 mt-2 text-sm capitalize">
                    {/* Data formatada com mês por extenso */}
                    📅 {new Date(item.data + "T00:00:00").toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                <button 
                  onClick={() => handleDesmarcar(item.id)}
                  className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition"
                >
                  Desmarcar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}