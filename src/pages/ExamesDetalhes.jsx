import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { categoriasExames } from '../data/exames';

function ExamesDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoria = categoriasExames.find(c => String(c.id) === String(id));

  const lidarAgendamento = (exame) => {
    // 1. Pega o usuário logado para vincular o agendamento a ele
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    // 2. IMPORTANTE: Usar a mesma chave 'agendamentos' que o MyAppointments usa
    const agendamentosNoBanco = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    
    const novoAgendamento = {
      id: Date.now(),
      medicoNome: exame.nome, 
      especialidade: `Exame: ${categoria.titulo}`,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: 'Horário a confirmar',
      tipo: 'particular', 
      pacienteEmail: usuario?.email || 'anonimo@teste.com',
      unidade: "Laboratório Central"
    };

    // 3. Salva usando a variável correta
    const novaListaGlobal = [...agendamentosNoBanco, novoAgendamento];
    localStorage.setItem('agendamentos', JSON.stringify(novaListaGlobal));

    alert(`Sucesso! O exame ${exame.nome} foi agendado.`);
    navigate('/meus-agendamentos');
  };

  if (!categoria) return <div className="p-20 text-center">Categoria não encontrada</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/exames" className="text-primary font-bold mb-4 inline-block">← Voltar</Link>
        <h1 className="text-3xl font-black text-secondary mb-2">{categoria.titulo}</h1>
        <p className="text-gray-500 mb-8">{categoria.desc}</p>

        <div className="bg-white rounded-[30px] shadow-sm overflow-hidden">
          {categoria.listaExames?.map((exame, index) => (
            <div key={index} className="p-6 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-all">
              <div>
                <span className="font-bold text-secondary block">{exame.nome}</span>
                <span className="text-primary text-sm">{exame.preco}</span>
              </div>
              <button 
                onClick={() => lidarAgendamento(exame)}
                className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Agendar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} // Fechamento da função que faltava

export default ExamesDetalhes;