import React from 'react';
import { Link } from 'react-router-dom'; // Importante para as rotas!

export default function MedicoCard({ doctor }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-xl">
          {doctor.nome.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-secondary text-lg">{doctor.nome}</h4>
          <p className="text-primary font-medium text-sm">{doctor.especialidade}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
        <span className="text-gray-500 text-xs">⭐ {doctor.avaliacao}</span>
        {/* Usando o Link para a rota que criamos */}
        <Link 
          to={`/medico/${doctor.id}`} 
          className="text-primary font-bold text-sm hover:underline"
        >
          Ver Perfil
        </Link>
      </div>
    </div>
  );
}