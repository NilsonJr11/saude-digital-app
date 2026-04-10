import React, { useState } from 'react';
// Aqui dizemos: "Pegue o que está no arquivo MedicoCard e chame de DoctorCard aqui dentro"
import DoctorCard from '../components/MedicoCard';
import { DOCTORS } from '../data/doctors';


export default function Home() {
  const [busca, setBusca] = useState("");

  const medicosFiltrados = DOCTORS.filter(doc => 
    doc.nome.toLowerCase().includes(busca.toLowerCase()) || 
    doc.especialidade.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Saúde Digital</h1>
          <div className="space-x-4">
            <button className="text-gray-600 font-medium">Médicos</button>
            <button className="bg-secondary text-white px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition">Entrar</button>
          </div>
        </div>
      </nav>

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
            <button className="bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition">
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
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">Nenhum médico encontrado para essa busca.</p>
        )}
      </section>
    </div>
  );
}