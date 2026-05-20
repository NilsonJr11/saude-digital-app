import React from 'react';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

export default function RodapeNovo() {
  const verdeVibrante = "#0d9488";

  return (
    <footer style={{ 
      backgroundColor: 'white', 
      borderTop: `2px solid ${verdeVibrante}`, 
      padding: '2rem 0',
      width: '100%',
      marginTop: '40px' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        
        {/* LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: verdeVibrante, padding: '8px', borderRadius: '10px' }}>
            <Activity size={20} color="white" />
          </div>
          <span style={{ fontWeight: '900', color: '#1e293b', fontSize: '1.2rem' }}>SaúdeDigital</span>
        </div>

        {/* LINKS FORÇADOS */}
        <div style={{ display: 'flex', gap: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color={verdeVibrante} />
            <span style={{ color: verdeVibrante, fontWeight: 'bold', fontSize: '12px' }}>SEGURANÇA DE DADOS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartPulse size={20} color={verdeVibrante} />
            <span style={{ color: verdeVibrante, fontWeight: 'bold', fontSize: '12px' }}>SUPORTE 24/7</span>
          </div>
        </div>

        <div style={{ color: '#94a3b8', fontSize: '10px' }}>
          © 2026 SAÚDEDIGITAL
        </div>
      </div>
    </footer>
  );
}