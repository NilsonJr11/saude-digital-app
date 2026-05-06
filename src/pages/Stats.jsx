import React, { useState, useEffect } from 'react';
import { DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';

export default function DashboardMedico() {
  const [stats, setStats] = useState({
    faturamento: 0,
    atendimentos: 0,
    ticketMedio: 0
  });

  useEffect(() => {
    const calcularMetricas = () => {
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      
      // Filtramos apenas os atendimentos que o médico realmente finalizou
      const concluidos = agendamentos.filter(a => a.status === 'concluido');
      
      const valorPorConsulta = 250; // Valor hipotético da sua consulta
      const totalFaturado = concluidos.length * valorPorConsulta;
      
      setStats({
        faturamento: totalFaturado,
        atendimentos: concluidos.length,
        ticketMedio: concluidos.length > 0 ? valorPorConsulta : 0
      });
    };

    calcularMetricas();
    window.addEventListener('storage', calcularMetricas);
    return () => window.removeEventListener('storage', calcularMetricas);
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-[400px] rounded-[40px] mt-8">
      <h2 className="text-2xl font-black text-secondary mb-8 italic tracking-tighter">
        Performance do Mês
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Faturamento */}
        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 group hover:border-primary transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <DollarSign size={24} />
            </div>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Faturamento Total</p>
          <h3 className="text-3xl font-black text-secondary mt-1">
            R$ {stats.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>

        {/* Card Atendimentos */}
        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 group hover:border-primary transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-all">
              <Users size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Pacientes Atendidos</p>
          <h3 className="text-3xl font-black text-secondary mt-1">{stats.atendimentos}</h3>
        </div>

        {/* Card Ticket Médio */}
        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 group hover:border-primary transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl group-hover:bg-purple-500 group-hover:text-white transition-all">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Valor por Consulta</p>
          <h3 className="text-3xl font-black text-secondary mt-1">
            R$ {stats.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>
    </div>
  );
}