import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriasExames } from '../data/exames';
import { Beaker, Activity, Search } from 'lucide-react';

export default function ExamsList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black text-secondary mb-4 tracking-tighter">Centro de Exames</h1>
          <p className="text-gray-500 font-medium">Selecione uma categoria para ver os procedimentos disponíveis</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoriasExames.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => navigate(`/exame-detalhes/${cat.id}`)}
              className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                {cat.titulo.includes('Análises') ? <Beaker size={32} /> : <Activity size={32} />}
              </div>
              <h3 className="text-2xl font-black text-secondary mb-2">{cat.titulo}</h3>
              <p className="text-gray-400 font-bold text-sm mb-6">{cat.desc}</p>
              <span className="text-primary font-black flex items-center gap-2">
                Ver exames <Search size={16} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}