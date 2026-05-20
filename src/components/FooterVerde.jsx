import React from 'react';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

export default function FooterVerde() {
  const VERDE_PRIMARY = "#0d9488";

  return (
    <footer style={{ 
      display: 'block',
      width: '100%',
      backgroundColor: VERDE_PRIMARY, // Fundo verde agora!
      borderTop: `1px solid rgba(255, 255, 255, 0.2)`, 
      padding: '32px 0',
      marginTop: '64px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '8px', borderRadius: '10px', display: 'flex', color: 'white' }}>
            <Activity size={22} />
          </div>
          <span style={{ fontWeight: '900', color: 'white', fontSize: '20px', fontStyle: 'italic', letterSpacing: '-0.05em' }}>
            SaúdeDigital
          </span>
        </div>

        {/* LINKS CENTRAIS - AGORA EM BRANCO SOBRE O VERDE */}
        <div style={{ display: 'flex', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
            <ShieldCheck size={20} />
            <span style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Segurança de Dados
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
            <HeartPulse size={20} />
            <span style={{ fontWeight: '700', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Suporte 24/7
            </span>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)', margin: 0, textTransform: 'uppercase' }}>
            &copy; 2026 SAÚDEDIGITAL SAAS
          </p>
        </div>

      </div>
    </footer>
  );
}