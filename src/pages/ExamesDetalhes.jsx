import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { categoriasExames } from '../data/exames';
import { Clock } from 'lucide-react'; // Certifique-se de ter o lucide-react instalado

function ExamesDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoria = categoriasExames.find(c => String(c.id) === String(id));

  const realizarAgendamento = (exame) => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    const agendamentosExistentes = JSON.parse(localStorage.getItem('agendamentos') || '[]');

    // 1. Lógica de sugestão de turnos
    const turnoManha = window.confirm(`Deseja agendar "${exame.nome}" para o período da MANHÃ?\n(Clique em Cancelar para selecionar o período da TARDE)`);
    
    const horarioDefinido = turnoManha 
      ? "Manhã (07h às 12h)" 
      : "Tarde (13h às 17h)";

    // 2. Criar o objeto de agendamento
    const novoAgendamento = {
      id: Date.now(),
      medicoNome: exame.nome, 
      especialidade: `Exame: ${categoria.titulo}`,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: horarioDefinido, 
      tipo: 'particular', 
      pacienteEmail: usuario?.email || 'anonimo@teste.com',
      unidade: "Laboratório Central",
      status: "Confirmado"
    };

    // 3. Salvar e navegar
    const novaLista = [...agendamentosExistentes, novoAgendamento];
    localStorage.setItem('agendamentos', JSON.stringify(novaLista));

    alert(`Sucesso! Exame agendado para o período da ${turnoManha ? 'Manhã' : 'Tarde'}.`);
    navigate('/meus-agendamentos');
  };

  if (!categoria) return <div className="p-20 text-center">Categoria não encontrada</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/exames" className="text-primary font-bold mb-4 inline-block hover:underline">
          ← Voltar para categorias
        </Link>
        
        <div className="mb-8">
          <h1 className="text-4xl font-black text-secondary mb-2 tracking-tighter">{categoria.titulo}</h1>
          <p className="text-gray-500 text-lg font-medium">{categoria.desc}</p>
        </div>

        <div className="bg-white rounded-[30px] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Selecione um exame abaixo
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {categoria.listaExames?.map((exame, index) => (
              <div key={index} className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-blue-50/30 transition-all group">
                <div>
                  <span className="font-black text-secondary block text-xl group-hover:text-primary transition-colors">
                    {exame.nome}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-primary font-bold bg-blue-50 px-2 py-0.5 rounded text-sm">
                      {exame.preco}
                    </span>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-tighter">
                      • Resultado em até 48h
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => realizarAgendamento(exame)}
                  className="w-full md:w-auto bg-secondary text-white px-10 py-4 rounded-2xl font-black hover:bg-primary shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                >
                  Agendar Turno
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-start gap-3">
          <span className="text-orange-500">⚠️</span>
          <p className="text-orange-800 text-sm font-medium">
            <strong>Informação Importante:</strong> Para exames laboratoriais, o atendimento é realizado por ordem de chegada dentro do turno escolhido (Manhã ou Tarde). Não esqueça de levar um documento com foto.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExamesDetalhes;