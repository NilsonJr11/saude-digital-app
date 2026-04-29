import React, { useState } from 'react'; // Unifiquei as importações aqui
import { useParams, Link, useNavigate } from 'react-router-dom';
import { categoriasExames } from '../data/exames';
import { Clock, User, CheckCircle } from 'lucide-react';

function ExamesDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [exameSelecionado, setExameSelecionado] = useState(null);
  const [etapa, setEtapa] = useState(1);

  const categoria = categoriasExames.find(c => String(c.id) === String(id));
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const iniciarAgendamento = (exame) => {
    setExameSelecionado(exame);
    setEtapa(2);
    window.scrollTo(0, 0);
  };

  const finalizarAgendamento = (turno) => {
    const agendamentosExistentes = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    
   const novoAgendamento = {
    id: Date.now(),
    tipo: 'exame', // Diferenciador
    exame: exameSelecionado.nome, // A tela Meus Agendamentos deve ler item.exame
    categoria: categoria.titulo,
    horario: turno,
    data: new Date().toLocaleDateString('pt-BR'),
    paciente: usuarioLogado?.nome,
    status: 'Agendado'
  };

    const novaLista = [...agendamentosExistentes, novoAgendamento];
    localStorage.setItem('agendamentos', JSON.stringify(novaLista));

    alert("Exame agendado com sucesso!");
    navigate('/meus-agendamentos');
  };

  if (!categoria) return <div className="p-20 text-center font-bold">Categoria não encontrada</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* TELA 1: LISTA DE EXAMES */}
        {etapa === 1 && (
          <div className="animate-fadeIn">
            <Link to="/exames" className="text-primary font-bold mb-4 inline-block hover:underline">
              ← Voltar para categorias
            </Link>
            
            <div className="mb-8">
              <h1 className="text-4xl font-black text-secondary mb-2 tracking-tighter">{categoria.titulo}</h1>
              <p className="text-gray-500 text-lg font-medium">{categoria.desc}</p>
            </div>

            <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-gray-100">
              <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Selecione o procedimento</span>
              </div>

              <div className="divide-y divide-gray-100">
                {categoria.listaExames?.map((exame, index) => (
                  <div key={index} className="p-8 flex justify-between items-center hover:bg-gray-50 transition-all">
                    <div>
                      <span className="font-black text-secondary block text-xl">{exame.nome}</span>
                      <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded text-sm">{exame.preco}</span>
                    </div>
                    <button 
                      onClick={() => iniciarAgendamento(exame)}
                      className="bg-secondary text-white px-8 py-3 rounded-2xl font-black hover:bg-primary transition-all"
                    >
                      Agendar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TELA 2: CONFIRMAÇÃO ESTILO REDE D'OR */}
        {etapa === 2 && (
          <div className="animate-fadeIn">
            <button onClick={() => setEtapa(1)} className="text-primary font-bold mb-6">← Voltar para a lista</button>
            
            <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-primary p-10 text-center text-white">
                <CheckCircle className="mx-auto mb-4" size={48} />
                <h2 className="text-3xl font-black italic">Saúde Digital</h2>
                <p className="opacity-80">Confirmação de Agendamento</p>
              </div>

              <div className="p-10 space-y-8">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-primary uppercase mb-2">Procedimento Selecionado</p>
                  <p className="text-2xl font-black text-secondary">{exameSelecionado?.nome}</p>
                  <p className="text-gray-500 font-bold">{categoria.titulo} • {exameSelecionado?.preco}</p>
                </div>

                <div>
                  <h3 className="text-xl font-black text-secondary mb-4 flex items-center gap-2">
                    <User size={20} className="text-primary" /> Dados do Paciente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Nome</p>
                      <p className="font-bold text-secondary">{usuarioLogado?.nome}</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase">CPF</p>
                      <p className="font-bold text-secondary">{usuarioLogado?.cpf}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <p className="text-center font-bold text-secondary mb-4 text-lg">Em qual período deseja ser atendido?</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => finalizarAgendamento("Manhã (07h às 12h)")}
                      className="bg-gray-100 hover:bg-secondary hover:text-white py-5 rounded-2xl font-black transition-all"
                    >
                      MANHÃ
                    </button>
                    <button 
                      onClick={() => finalizarAgendamento("Tarde (13h às 17h)")}
                      className="bg-gray-100 hover:bg-secondary hover:text-white py-5 rounded-2xl font-black transition-all"
                    >
                      TARDE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ExamesDetalhes;