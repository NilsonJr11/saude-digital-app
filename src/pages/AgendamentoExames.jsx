import React, { useState } from 'react';
import CardCategoria from '../components/CardCategoria'; 
import { categoriasExames } from '../data/exames';

export default function AgendamentoExames() {
  const [abaAtiva, setAbaAtiva] = useState('exames');

  // Aqui você definiu o nome como 'cardsParaExibir'
  const cardsParaExibir = categoriasExames.filter(card => card.tipo === abaAtiva);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-black text-secondary mb-8">Agendamento de Exames e Vacinas</h1>

        {/* Seleção de Abas */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setAbaAtiva('exames')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${
              abaAtiva === 'exames' ? 'bg-primary text-white shadow-lg' : 'bg-white text-primary border border-primary/20'
            }`}
          >
            Exames
          </button>
          <button 
            onClick={() => setAbaAtiva('vacinas')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${
              abaAtiva === 'vacinas' ? 'bg-primary text-white shadow-lg' : 'bg-white text-primary border border-primary/20'
            }`}
          >
            Vacinas
          </button>
        </div>

        {/* Lista de Cards organizada no Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardsParaExibir.map((item) => (
            <CardCategoria 
              key={item.id} 
              id={item.id} 
              titulo={item.titulo} 
              desc={item.desc} 
              icone={item.icone} 
            />
          ))}
        </div>

        {/* Se não houver nada na categoria, mostra um aviso */}
        {cardsParaExibir.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            Nenhum item encontrado nesta categoria.
          </div>
        )}
      </div>
    </div>
  );
}