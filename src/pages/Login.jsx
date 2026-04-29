import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn } from 'lucide-react';

export default function Login() {
  const [isRegistro, setIsRegistro] = useState(false);
  const [formData, setFormData] = useState({ 
  nome: '', 
  email: '', 
  dataNascimento: '', 
  cpf: '', 
  sexo: 'Masculino', // Valor padrão
  role: 'paciente' 
});
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    
    // Pega a lista total de usuários para validar/salvar
    const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios') || '[]');

    if (isRegistro) {
      // REGISTRO: Verifica se já existe
      if (usuariosCadastrados.some(u => u.email === formData.email)) {
        alert("Este e-mail já está cadastrado!");
        return;
      }
      
      const novoUsuario = { ...formData, id: Date.now() };
      const novaLista = [...usuariosCadastrados, novoUsuario];
      
      localStorage.setItem('usuarios', JSON.stringify(novaLista));
      localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
      window.location.href = "/saude-digital-app/"; // Recarrega para atualizar a Navbar
    } else {
      // LOGIN: Busca na lista
      const usuario = usuariosCadastrados.find(u => u.email === formData.email);
      if (usuario) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        window.location.href = "/saude-digital-app/";
      } else {
        alert("Usuário não encontrado. Crie uma conta!");
        setIsRegistro(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-secondary italic">Saúde Digital</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">
            {isRegistro ? 'Crie sua conta gratuita' : 'Acesse sua conta'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistro && (
          <>
            <input 
              required
              placeholder="Seu nome completo"
              className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary font-bold mb-3"
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input 
                required
                type="date"
                className="bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary font-bold text-gray-500"
                onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
              />
              <input 
                required
                placeholder="CPF"
                className="bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary font-bold"
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
              />
            </div>

    <select 
      className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary font-bold mb-3 appearance-none"
      onChange={(e) => setFormData({...formData, sexo: e.target.value})}
    >
      <option value="Masculino">Masculino</option>
      <option value="Feminino">Feminino</option>
      <option value="Outro">Outro</option>
    </select>
  </>
)}
          
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2">
            {isRegistro ? <><UserPlus size={18} /> CADASTRAR</> : <><LogIn size={18} /> ENTRAR</>}
          </button>
        </form>

        <button 
          onClick={() => setIsRegistro(!isRegistro)}
          className="w-full mt-6 text-xs font-black text-gray-400 hover:text-primary transition-all uppercase tracking-widest"
        >
          {isRegistro ? 'Já tenho uma conta' : 'Ainda não tenho conta (Registrar)'}
        </button>
      </div>
    </div>
  );
}