import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    const emailLimpo = email.trim().toLowerCase();

    // 1. Corpo clínico fixo (MOCK)
    const usuariosSimulados = {
      'secretaria@saude.com': { nome: 'Renata Souza', perfil: 'secretaria', email: 'secretaria@saude.com' },
      'ana.silva@saude.com': { nome: 'Dra. Ana Silva', perfil: 'medico', email: 'ana.silva@saude.com' },
      'marcos.souza@saude.com': { nome: 'Dr. Marcos Souza', perfil: 'medico', email: 'marcos.souza@saude.com' },
      'julia.lins@saude.com': { nome: 'Dra. Julia Lins', perfil: 'medico', email: 'julia.lins@saude.com' },
      'ricardo.vaz@saude.com': { nome: 'Dr. Ricardo Vaz', perfil: 'medico', email: 'ricardo.vaz@saude.com' }
    };

    // 2. BUSCA NA MESMA CHAVE DO SEU REGISTRO ('usuarios')
    const pacientesCadastrados = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const pacienteEncontrado = pacientesCadastrados.find(p => p.email.trim().toLowerCase() === emailLimpo);

    let usuarioLogado = null;

    if (usuariosSimulados[emailLimpo]) {
      usuarioLogado = usuariosSimulados[emailLimpo];
    } else if (pacienteEncontrado) {
      // Força o perfil para paciente caso ele tenha vindo do cadastro dinâmico
      usuarioLogado = {
        ...pacienteEncontrado,
        perfil: pacienteEncontrado.perfil || 'paciente'
      };
    }

    // 3. Redirecionamento correto por Perfil
    if (usuarioLogado) {
      localStorage.setItem('usuario_logado', JSON.stringify(usuarioLogado));
      
      if (usuarioLogado.perfil === 'secretaria') {
        navigate('/dashboard-secretaria');
      } else if (usuarioLogado.perfil === 'medico') {
        navigate('/agenda-medica');
      } else {
        // Redireciona o cliente/paciente para a rota dele
        navigate('/my-appointments');
      }
      
      window.location.reload();
    } else {
      setErro('E-mail corporativo ou de paciente não encontrado.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">Saúde Digital</h2>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Portal Corporativo Interno</p>
        </div>

        {erro && (
          <div className="mb-6 p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-xs border border-red-100">
            <ShieldAlert size={16} />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">E-mail de Acesso</label>
            <input 
              type="email" 
              required
              placeholder="exemplo@saude.com"
              className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-md shadow-xl hover:bg-slate-800 transition-all">
            ACESSAR PAINEL
          </button>
        </form>

        {/* LINK PARA A TELA DE CADASTRO QUE VOCÊ CRIOU */}
        <p className="text-center text-gray-500 text-xs mt-4">
          É um paciente novo? {' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Criar minha conta agora
          </Link>
        </p>

        {/* SEÇÃO DE ACESSOS RÁPIDOS INTERATIVOS */}
        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Acessos Rápidos de Teste (Clique para preencher):
          </p>
          
          <div className="flex flex-col gap-2 max-w-xs mx-auto text-left bg-slate-50 p-3 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-500">Secretaria:</span>
              <code onClick={() => setEmail('secretaria@saude.com')} className="bg-white px-2 py-0.5 rounded border border-gray-200 text-indigo-600 font-mono font-bold cursor-pointer hover:bg-indigo-50 transition-colors">
                secretaria@saude.com
              </code>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-500">Dra. Ana (Cardio):</span>
              <code onClick={() => setEmail('ana.silva@saude.com')} className="bg-white px-2 py-0.5 rounded border border-gray-200 text-purple-600 font-mono font-bold cursor-pointer hover:bg-purple-50 transition-colors">
                ana.silva@saude.com
              </code>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-500">Dr. Marcos (Pediatra):</span>
              <code onClick={() => setEmail('marcos.souza@saude.com')} className="bg-white px-2 py-0.5 rounded border border-gray-200 text-purple-600 font-mono font-bold cursor-pointer hover:bg-purple-50 transition-colors">
                marcos.souza@saude.com
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}