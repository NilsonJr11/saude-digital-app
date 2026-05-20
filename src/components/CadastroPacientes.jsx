import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function CadastroPacientes() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    nascimento: '',
    cpf: '',
    telefone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;

    if (name === 'cpf') {
      v = v.replace(/\D/g, "").slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    if (name === 'telefone') {
      v = v.replace(/\D/g, "").slice(0, 11);
      v = v.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
    }

    setFormData(prev => ({ ...prev, [name]: v }));
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.nome.trim().includes(' ')) {
      toast.error("O campo Nome deve conter nome e sobrenome.");
      return;
    }

    // Preparando os dados exatamente como o PHP espera
    const dadosParaEnviar = {
      ...formData,
      role: 'paciente' // Forçamos o papel de paciente aqui
    };

    try {
      const response = await fetch('http://localhost/saude-digital-api/cadastro_usuario.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Paciente cadastrado com sucesso!");
        // Limpa o formulário após o sucesso
        setFormData({ nome: '', email: '', nascimento: '', cpf: '', telefone: '' });
      } else {
        toast.error("Erro: " + result.message);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
      console.error("Erro no fetch:", error);
    }
  };

  return (
    <div className="flex justify-center items-center p-8">
      <div style={cardStyle}>
        <h2 style={{ color: '#1e293b', textAlign: 'center', fontWeight: '900', fontSize: '1.5rem' }}>Registro de Paciente</h2>
        <p style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', marginBottom: '30px' }}>GATILHOS DE SEGURANÇA ATIVOS</p>

        <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>NOME COMPLETO</label>
            <input name="nome" value={formData.nome} onChange={handleChange} required style={inputStyle} placeholder="Ex: João Silva" />
          </div>

          <div>
            <label style={labelStyle}>E-MAIL</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} placeholder="email@exemplo.com" />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>CPF</label>
              <input name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>NASCIMENTO</label>
              <input type="date" name="nascimento" max="2026-05-14" value={formData.nascimento} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>TELEFONE</label>
            <input name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" required style={inputStyle} />
          </div>

          <button type="submit" style={buttonStyle}>CADASTRAR PACIENTE</button>
        </form>
      </div>
    </div>
  );
}

// Estilos
const cardStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '25px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' };
const labelStyle = { fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none' };
const buttonStyle = { backgroundColor: '#0d9488', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '900', cursor: 'pointer', marginTop: '10px' };