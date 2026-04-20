// src/components/CardCategoria.jsx
import { Link } from 'react-router-dom';

const CardCategoria = ({ id, titulo, desc, icone }) => {
  return (
    <div className="bg-white border-2 border-gray-100 p-8 rounded-[30px] shadow-sm hover:shadow-md hover:border-primary transition-all group text-center">
      <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all">
        {icone}
      </div>
      <h3 className="text-xl font-black text-secondary mb-3">{titulo}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">{desc}</p>
      
      {/* O Link deve envolver o texto do botão */}
      <Link 
        to={`/exames/${id}`} 
        className="text-primary font-bold text-xs uppercase tracking-widest border-b-2 border-transparent hover:border-primary transition-all inline-block"
      >
        Veja os Exames
      </Link>
    </div>
  );
};

export default CardCategoria;