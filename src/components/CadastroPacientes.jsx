import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Phone, CreditCard, Hash, Trash2, ChevronRight } from 'lucide-react';

export default function CadastroPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [novoPaciente, setNovoPaciente] = useState({ nome: "", cpf: "", telefone: "", convenio: "Particular" });

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem('cadastro_pacientes') || '[]');
    setPacientes(salvos);
  }, []);

  const salvarPaciente = (e) => {
    e.preventDefault();
    const atualizados = [...pacientes, { ...novoPaciente, id: Date.now() }];
    localStorage.setItem('cadastro_pacientes', JSON.stringify(atualizados));
    setPacientes(atualizados);
    setModalAberto(false);
    setNovoPaciente({ nome: "", cpf: "", telefone: "", convenio: "Particular" });
  };

  const excluirPaciente = (id) => {
    const filtrados = pacientes.filter(p => p.id !== id);
    localStorage.setItem('cadastro_pacientes', JSON.stringify(filtrados));
    setPacientes(filtrados);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-secondary italic">Base de Pacientes</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gerenciamento de Cadastros</p>
          </div>
          <button 
            onClick={() => setModalAberto(true)}
            className="bg-secondary text-white px-8 py-4 rounded-[25px] font-black flex items-center gap-2 hover:bg-primary transition-all shadow-lg"
          >
            <UserPlus size={20} /> CADASTRAR NOVO
          </button>
        </header>

        {/* Busca */}
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou CPF..."
            className="w-full pl-16 pr-8 py-5 rounded-3xl border-none shadow-sm font-bold text-secondary"
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* Grid de Pacientes */}
        <div className="grid grid-cols-1 gap-4">
          {pacientes.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase())).map(p => (
            <div key={p.id} className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary font-black text-xl">
                  {p.nome[0]}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase italic">Nome Completo</p>
                    <p className="font-bold text-secondary">{p.nome}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase italic">CPF</p>
                    <p className="font-medium text-gray-600">{p.cpf}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase italic">Convênio</p>
                    <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">
                      {p.convenio}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => excluirPaciente(p.id)}
                className="p-4 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Cadastro */}
      {modalAberto && (
        <div className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-8">
            <h2 className="text-2xl font-black text-secondary mb-6 italic">Novo Cadastro</h2>
            <form onSubmit={salvarPaciente} className="space-y-4">
              <input 
                required
                placeholder="Nome Completo"
                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold outline-none focus:ring-2 focus:ring-primary/20"
                value={novoPaciente.nome}
                onChange={e => setNovoPaciente({...novoPaciente, nome: e.target.value})}
              />
              <input 
                required
                placeholder="CPF"
                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold outline-none"
                value={novoPaciente.cpf}
                onChange={e => setNovoPaciente({...novoPaciente, cpf: e.target.value})}
              />
              <input 
                required
                placeholder="Telefone (WhatsApp)"
                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold outline-none"
                value={novoPaciente.telefone}
                onChange={e => setNovoPaciente({...novoPaciente, telefone: e.target.value})}
              />
              <select 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold outline-none appearance-none"
                value={novoPaciente.convenio}
                onChange={e => setNovoPaciente({...novoPaciente, convenio: e.target.value})}
              >
                <option>Particular</option>
                <option>Unimed</option>
                <option>Bradesco Saúde</option>
                <option>SulAmérica</option>
              </select>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setModalAberto(false)} className="flex-1 py-4 font-black text-gray-400">CANCELAR</button>
                <button type="submit" className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black shadow-lg">SALVAR PACIENTE</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}