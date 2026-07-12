import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    const emailLimpo = email.trim().toLowerCase();

    try {
      // Faz a requisição POST real para a sua API na Alwaysdata
      const response = await fetch('https://saudedigital.alwaysdata.net/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailLimpo,
          senha: senha
        })
      });

      const dados = await response.json();

      if (dados.success) {
        // Guarda os dados do usuário retornados pelo banco de dados
        localStorage.setItem('usuario_logado', JSON.stringify(dados.usuario));
        
        // Dispara o evento personalizado que seu App.jsx escuta para mudar o Header
        window.dispatchEvent(new Event('login_efetuado'));
        
        // Redirecionamento baseado no perfil real vindo do MariaDB
        const perfil = dados.usuario.perfil;
        if (perfil === 'secretaria') {
          navigate('/dashboard-secretaria');
        } else if (perfil === 'medico') {
          navigate('/agenda-medica');
        } else {
          navigate('/my-appointments');
        }
      } else {
        // Exibe o erro retornado pelo seu script PHP (ex: "Senha incorreta" ou "Usuário não encontrado")
        setErro(dados.error || 'Não foi possível realizar o acesso.');
      }
    } catch (err) {
      console.error("Erro na requisição de login:", err);
      setErro('Erro ao conectar com o servidor médico. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  };

  // Função auxiliar para os botões de acesso rápido preencherem uma senha padrão de teste
  const preencherAcessoRapido = (emailTeste) => {
    setEmail(emailTeste);
    setSenha('123456'); // Insira aqui a senha padrão que você usou ao criar esses usuários no banco
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
              disabled={carregando}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Sua Senha</label>
            <div className="relative flex items-center">
              <input 
                type={mostrarSenha ? "text" : "password"} 
                required
                placeholder="••••••••"
                className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none pr-12"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-4 top-1/2 -translate-y-1/3 text-gray-400 hover:text-slate-600 transition-colors"
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={carregando}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-md shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {carregando ? "AUTENTICANDO..." : "ACESSAR PAINEL"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-5">
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
              <code onClick={() => preencherAcessoRapido('secretaria@saude.com')} className="bg-white px-2 py-0.5 rounded border border-gray-200 text-indigo-600 font-mono font-bold cursor-pointer hover:bg-indigo-50 transition-colors">
                secretaria@saude.com
              </code>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-500">Dra. Ana (Cardio):</span>
              <code onClick={() => preencherAcessoRapido('ana.silva@saude.com')} className="bg-white px-2 py-0.5 rounded border border-gray-200 text-purple-600 font-mono font-bold cursor-pointer hover:bg-purple-50 transition-colors">
                ana.silva@saude.com
              </code>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-500">Dr. Marcos (Pediatra):</span>
              <code onClick={() => preencherAcessoRapido('marcos.souza@saude.com')} className="bg-white px-2 py-0.5 rounded border border-gray-200 text-purple-600 font-mono font-mono font-bold cursor-pointer hover:bg-purple-50 transition-colors">
                marcos.souza@saude.com
              </code>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-500">Dra. Julia (Clínica):</span>
              <code onClick={() => preencherAcessoRapido('julia.lins@saude.com')} className="bg-white px-2 py-0.5 rounded border border-gray-200 text-purple-600 font-mono font-bold cursor-pointer hover:bg-purple-50 transition-colors">
                julia.lins@saude.com
              </code>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-500">Dr. Ricardo (Orto):</span>
              <code onClick={() => preencherAcessoRapido('ricardo.vaz@saude.com')} className="bg-white px-2 py-0.5 rounded border border-gray-200 text-purple-600 font-mono font-bold cursor-pointer hover:bg-purple-50 transition-colors">
                ricardo.vaz@saude.com
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}