import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    // Mudamos para bg-primary e texto branco
    <footer className="bg-primary text-white pt-16 pb-8 px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Coluna 1: Branding */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-black italic tracking-tighter">Saúde Digital</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Sua plataforma de saúde completa. Agende consultas com especialistas de forma rápida, segura e humanizada.
          </p>
        </div>

        {/* Coluna 2: Navegação */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-white">Navegação</h3>
          <ul className="flex flex-col gap-3 text-sm text-white/80">
            <li><Link to="/" className="hover:text-secondary transition-colors font-medium">Início</Link></li>
            <li><button onClick={() => document.getElementById('medicos-destaque')?.scrollIntoView({behavior:'smooth'})} className="hover:text-secondary transition-colors font-medium text-left">Médicos</button></li>
            <li><Link to="/meus-agendamentos" className="hover:text-secondary transition-colors font-medium">Minhas Consultas</Link></li>
          </ul>
        </div>

        {/* Coluna 3: Institucional */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-white">Institucional</h3>
          <ul className="flex flex-col gap-3 text-sm text-white/80">
            <li className="hover:text-secondary cursor-pointer transition-colors font-medium">Sobre a Rede</li>
            <li className="hover:text-secondary cursor-pointer transition-colors font-medium">Termos de Privacidade</li>
            <li className="hover:text-secondary cursor-pointer transition-colors font-medium">Unidades Atendimento</li>
          </ul>
        </div>

        {/* Coluna 4: Contato & Social */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-white">Fale Conosco</h3>
          <p className="text-sm text-white/80 mb-4">suporte@saudedigital.com.br</p>
          <div className="flex gap-3">
            <div className="flex gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer border border-white/20 group">
                <span className="text-[10px] font-bold group-hover:scale-110 transition-transform">INSTA</span>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer border border-white/20 group">
                <span className="text-[10px] font-bold group-hover:scale-110 transition-transform">FACE</span>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linha Final de Copyright */}
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-16 pt-8 text-center text-xs text-white/50">
        <p>© 2026 Saúde Digital - Desenvolvido para facilitar o seu acesso à saúde.</p>
      </div>
    </footer>
  );
}