import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Trash2, X } from 'lucide-react';

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', role: 'paciente' });

  useEffect(() => {
    const usersDB = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usersDB.length === 0) {
      const baseUsers = [
        { id: 1, nome: "Admin Central", email: "admin@saude.com", role: "secretaria" },
        { id: 2, nome: "Dra. Ana Silva", email: "ana@saude.com", role: "medico" }
      ];
      localStorage.setItem('usuarios', JSON.stringify(baseUsers));
      setUsuarios(baseUsers);
    } else {
      setUsuarios(usersDB);
    }
  }, []);

  const salvarUsuario = (e) => {
  e.preventDefault();

  // 1. REGRA DE SEGURANÇA: Verificar se o e-mail já existe
  const emaiJaCadastrado = usuarios.some(
    (u) => u.email.toLowerCase() === novoUsuario.email.toLowerCase()
  );

  if (emaiJaCadastrado) {
    alert("⚠️ Erro: Este e-mail já está em uso por outro usuário!");
    return; // O 'return' para a execução aqui e não deixa salvar
  }

  // 2. REGRA DE SEGURANÇA: Verificar se o nome está vazio (evita cadastros fantasmas)
  if (novoUsuario.nome.trim().length < 3) {
    alert("Por favor, insira o nome completo do usuário.");
    return;
  }

  // Se passou pelas validações, salva normalmente
  const userComId = { ...novoUsuario, id: Date.now() };
  const listaAtualizada = [...usuarios, userComId];
  
  setUsuarios(listaAtualizada);
  localStorage.setItem('usuarios', JSON.stringify(listaAtualizada));
  
  // Fecha o modal e limpa o formulário
  setShowModal(false);
  setNovoUsuario({ nome: '', email: '', role: 'paciente' });
};

  const alterarRole = (id, novaRole) => {
    const atualizados = usuarios.map(u => u.id === id ? { ...u, role: novaRole } : u);
    localStorage.setItem('usuarios', JSON.stringify(atualizados));
    setUsuarios(atualizados);
  };

  const deletarUsuario = (id) => {
    if(window.confirm("Remover acesso deste usuário?")) {
      const atualizados = usuarios.filter(u => u.id !== id);
      localStorage.setItem('usuarios', JSON.stringify(atualizados));
      setUsuarios(atualizados);
    }
  };

  const filtrados = usuarios.filter(u => 
    u.nome.toLowerCase().includes(busca.toLowerCase()) || 
    u.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* CABEÇALHO COM O BOTÃO CORRETO */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-secondary tracking-tighter">Gestão de Usuários</h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Controle de Acessos</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} // AQUI ESTÁ O GATILHO!
            className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
          >
            <UserPlus size={18} /> NOVO USUÁRIO
          </button>
        </header>

        {/* BUSCA */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
          <Search className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar usuário..."
            className="w-full outline-none font-bold text-secondary"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* TABELA */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase">Usuário</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase">Nível</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtrados.map(user => (
                <tr key={user.id}>
                  <td className="px-8 py-6 font-black text-secondary">{user.nome}</td>
                  <td className="px-8 py-6 uppercase text-[10px] font-black text-primary">{user.role}</td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => deletarUsuario(user.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (FORA DA TABELA PARA NÃO QUEBRAR O CSS) */}
      {showModal && (
        <div className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-secondary">Novo Usuário</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            
            <form onSubmit={salvarUsuario} className="space-y-4">
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nome Completo</label>
                <input 
                required
                placeholder="Ex: João Silva"
                className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-secondary outline-none focus:ring-2 ring-primary"
                value={novoUsuario.nome}
                onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})}
                />
            </div>

            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">E-mail</label>
                <input 
                required
                type="email"
                placeholder="email@exemplo.com"
                className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-secondary outline-none focus:ring-2 ring-primary"
                value={novoUsuario.email}
                onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
                />
            </div>

            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nível de Acesso</label>
                <select 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-secondary outline-none focus:ring-2 ring-primary appearance-none"
                value={novoUsuario.role}
                onChange={(e) => setNovoUsuario({...novoUsuario, role: e.target.value})}
                >
                <option value="paciente">Paciente</option>
                <option value="medico">Médico</option>
                <option value="secretaria">Secretária/Admin</option>
                </select>
            </div>

            <button 
                type="submit"
                className="w-full bg-primary text-white py-5 rounded-3xl font-black shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all mt-4 uppercase tracking-tighter"
            >
                Cadastrar Usuário
            </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}