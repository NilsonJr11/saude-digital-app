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
    sexo: 'Masculino',
    role: 'paciente' 
  });
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios') || '[]');

    if (isRegistro) {
      if (usuariosCadastrados.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        alert("Este e-mail já está cadastrado!");
        return;
      }
      const novoUsuario = { ...formData, id: Date.now() };
      const novaLista = [...usuariosCadastrados, novoUsuario];
      localStorage.setItem('usuarios', JSON.stringify(novaLista));
      localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
      window.location.href = "/saude-digital-app/"; 
    } else {
      const usuario = usuariosCadastrados.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
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
          {/* CAMPO DE E-MAIL (Obrigatório para Login e Registro) */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">E-mail</label>
            <input 
              required
              type="email"
              placeholder="seu@email.com"
              className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary font-bold"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* CAMPOS EXCLUSIVOS DE REGISTRO */}
          {isRegistro && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nome Completo</label>
                <input 
                  required
                  placeholder="Nome do Usuário"
                  className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary font-bold"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nascimento</label>
                  <input 
                    required
                    type="date"
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary font-bold text-gray-500"
                    onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">CPF</label>
                  <input 
                    required
                    placeholder="000.000.000-00"
                    className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary font-bold"
                    onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Sexo</label>
                <select 
                  className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary font-bold appearance-none"
                  value={formData.sexo}
                  onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Tipo de Conta</label>
                <select 
                  className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-primary font-bold appearance-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="paciente">Paciente (Padrão)</option>
                  <option value="medico">Médico</option>
                  <option value="secretaria">Secretária / Admin</option>
                </select>
              </div>
            </div>
          )}
          
          <button type="submit" className="w-full bg-primary text-white py-5 rounded-3xl font-black shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
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