import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, UserPlus, X, Mail, Smartphone, Fingerprint } from 'lucide-react';

export default function CadastroPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [novoPaciente, setNovoPaciente] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: ""
  });

  // Carregar pacientes ao abrir a tela
  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem('cadastro_pacientes') || '[]');
    setPacientes(salvos);
  }, []);

  const salvarPaciente = (e) => {
    e.preventDefault();
    const listaAtualizada = [...pacientes, { ...novoPaciente, id: Date.now().toString() }];
    localStorage.setItem('cadastro_pacientes', JSON.stringify(listaAtualizada));
    setPacientes(listaAtualizada);
    setModalAberto(false);
    setNovoPaciente({ nome: "", cpf: "", email: "", telefone: "" });
  };

  const excluirPaciente = (id) => {
    if (confirm("Deseja realmente excluir este paciente?")) {
      const novaLista = pacientes.filter(p => p.id !== id);
      localStorage.setItem('cadastro_pacientes', JSON.stringify(novaLista));
      setPacientes(novaLista);
    }
  };

  const pacientesFiltrados = pacientes.filter(p => 
    p.nome.toLowerCase().includes(filtro.toLowerCase()) || p.cpf.includes(filtro)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-secondary italic tracking-tighter">Base de Pacientes</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Registro Geral de Prontuários</p>
          </div>
          <button 
            onClick={() => setModalAberto(true)}
            className="bg-primary text-white px-8 py-4 rounded-[25px] font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            <UserPlus size={20} /> CADASTRAR NOVO
          </button>
        </header>

        {/* Tabela de Pacientes */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-black text-secondary text-xl">Pacientes Ativos</h3>
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por nome ou CPF..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-full border-none text-sm font-bold focus:ring-2 ring-primary/20 transition-all"
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-4">Paciente</th>
                  <th className="px-8 py-4">Documento</th>
                  <th className="px-8 py-4">Contato</th>
                  <th className="px-8 py-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pacientesFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center font-black">
                          {p.nome[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-secondary text-lg">{p.nome}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Fingerprint size={14} className="text-gray-300" />
                        {p.cpf}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-500">{p.email}</p>
                      <p className="text-[10px] text-gray-400 font-black">{p.telefone}</p>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => excluirPaciente(p.id)}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Cadastro */}
      {modalAberto && (
        <div className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-secondary italic">Novo Paciente</h2>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={salvarPaciente} className="p-8 grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nome Completo</label>
                <input required className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-secondary focus:ring-2 ring-primary/20" 
                  value={novoPaciente.nome} onChange={e => setNovoPaciente({...novoPaciente, nome: e.target.value})} />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">CPF</label>
                <input required placeholder="000.000.000-00" className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-secondary" 
                  value={novoPaciente.cpf} onChange={e => setNovoPaciente({...novoPaciente, cpf: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Telefone</label>
                <input required placeholder="(11) 99999-9999" className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-secondary" 
                  value={novoPaciente.telefone} onChange={e => setNovoPaciente({...novoPaciente, telefone: e.target.value})} />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">E-mail</label>
                <input type="email" required className="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl font-bold text-secondary" 
                  value={novoPaciente.email} onChange={e => setNovoPaciente({...novoPaciente, email: e.target.value})} />
              </div>

              <button type="submit" className="col-span-2 bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-secondary transition-all">
                FINALIZAR CADASTRO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}