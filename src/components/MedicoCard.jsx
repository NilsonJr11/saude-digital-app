import { Link } from 'react-router-dom';

// Alterado de DoctorCard para MedicoCard para combinar com o nome do arquivo
export default function MedicoCard({ medico }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl font-bold">
          {medico.nome[0]}
        </div>
        <div>
          <h3 className="font-bold text-lg text-secondary">{medico.nome}</h3>
          <p className="text-primary text-sm font-medium">{medico.especialidade}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <span className="text-yellow-500 font-bold">⭐ {medico.avaliacao}</span>
        <Link 
          to={`/medico/${medico.id}`} 
          className="text-primary font-bold hover:underline"
        >
          Ver perfil
        </Link>
      </div>
    </div>
  );
}