import { Link } from 'react-router-dom';

// No seu componente de Navegação/Header:
<header className="flex justify-between items-center py-4 px-8 bg-white shadow-sm">
  <Link to="/" className="text-2xl font-bold text-primary">
    Saúde Digital
  </Link>

  <nav className="flex items-center gap-6">
    <Link to="/" className="text-gray-600 hover:text-primary font-medium">
      Médicos
    </Link>
    
    {/* Trocando o botão "Entrar" pelo link para os agendamentos */}
    <Link 
      to="/meus-agendamentos" 
      className="bg-secondary text-white px-6 py-2 rounded-xl font-bold hover:bg-opacity-90 transition"
    >
      Meus Agendamentos
    </Link>
  </nav>
</header>