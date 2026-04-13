import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importação que estava faltando
import { DOCTORS } from '../data/doctors';

export default function Home() {
  const [busca, setBusca] = useState("");
  const navigate = useNavigate(); // Inicialização do navigate

  // Filtramos os médicos com base na busca
  const medicosFiltrados = DOCTORS.filter(doc => 
    doc.nome.toLowerCase().includes(busca.toLowerCase()) || 
    doc.especialidade.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-primary py-16 px-4">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Sua saúde em boas mãos, a um clique.
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Agende consultas online com os melhores especialistas.
          </p>
          
          <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-2 bg-white p-2 rounded-2xl shadow-xl">
            <input 
              type="text" 
              placeholder="Busque por nome ou especialidade..." 
              className="flex-1 p-3 text-gray-800 outline-none rounded-xl"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button className="bg-secondary text-white px-8 py-3 rounded-xl font-bold">
              Buscar
            </button>
          </div>
        </div>
      </header>

      {/* Seção de Médicos */}
      <section className="container mx-auto py-12 px-4">
        <h3 className="text-2xl font-bold text-secondary mb-8">
          {busca ? `Resultados para "${busca}"` : "Médicos em Destaque"}
        </h3>

        {medicosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicosFiltrados.map((medico) => (
              <div key={medico.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-2xl">
                    {medico.nome[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{medico.nome}</h3>
                    <p className="text-primary text-sm">{medico.especialidade}</p>
                  </div>
                </div>
                
                {/* Selo de Avaliação Estilizado */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-yellow-400 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    ⭐ {medico.rating || "5.0"} ({medico.reviews || "100+ avaliações"})
                  </span>
                </div>

                <button 
                  onClick={() => navigate(`/medico/${medico.id}`)}
                  className="w-full py-3 bg-gray-50 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition"
                >
                  Ver perfil
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">Nenhum médico encontrado.</p>
        )}
      </section>
    </div>
  );
}