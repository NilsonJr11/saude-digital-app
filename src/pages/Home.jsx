import React, { useState } from 'react';
// Importamos o componente e damos o nome de MedicoCard para seguir seu padrão
import MedicoCard from '../components/MedicoCard';
import { DOCTORS } from '../data/doctors';

export default function Home() {
  const [busca, setBusca] = useState("");

  const medicosFiltrados = DOCTORS.filter(doc => 
    doc.nome.toLowerCase().includes(busca.toLowerCase()) || 
    doc.especialidade.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DICA: A Navbar não deve ficar aqui se você já a colocou no App.jsx! 
          Se ela estiver no App.jsx, pode apagar este bloco <nav> abaixo.
      */}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicosFiltrados.map(doc => (
              /* IMPORTANTE: Usar medico={doc} para o MedicoCard.jsx entender */
              <MedicoCard key={doc.id} medico={doc} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">Nenhum médico encontrado.</p>
        )}
      </section>
    </div>
  );
}