import React, { useEffect, useState } from 'react';

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/listar_pacientes.php`)
      .then((response) => {
        if (!response.ok) throw new Error('Erro ao conectar com o servidor da API.');
        return response.json();
      })
      .then((data) => {
        setPacientes(data);
        setCarregando(false);
      })
      .catch((err) => {
        setErro(err.message);
        setCarregando(false);
      });
  }, []);

  // Formatação simples para o CPF (ex: 000.000.000-00)
  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  // Formatação simples para o Telefone (ex: (00) 00000-0000)
  const formatarTelefone = (tel) => {
    if (!tel) return '';
    return tel.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', color: '#333', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '30px' }}>
        <h2 style={{ margin: 0, color: '#007bff', fontWeight: '600' }}>📋 Painel de Controle: Pacientes Cadastrados</h2>
        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Dados em tempo real extraídos do banco de dados</p>
      </div>
      
      {erro && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '15px', borderRadius: '4px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ {erro}
        </div>
      )}

      {carregando ? (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '16px' }}>Carregando dados dos pacientes...</p>
      ) : (
        <div style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '12px 15px', fontWeight: 'bold' }}>ID</th>
                <th style={{ padding: '12px 15px', fontWeight: 'bold' }}>Nome Completo</th>
                <th style={{ padding: '12px 15px', fontWeight: 'bold' }}>CPF</th>
                <th style={{ padding: '12px 15px', fontWeight: 'bold' }}>Telefone</th>
                <th style={{ padding: '12px 15px', fontWeight: 'bold' }}>E-mail</th>
                <th style={{ padding: '12px 15px', fontWeight: 'bold' }}>Perfil</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente, index) => (
                <tr 
                  key={paciente.id} 
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                    borderBottom: '1px solid #e0e0e0',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f7ff'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9'}
                >
                  <td style={{ padding: '12px 15px', fontWeight: '500', color: '#666' }}>{paciente.id}</td>
                  <td style={{ padding: '12px 15px', fontWeight: '500' }}>{paciente.nome}</td>
                  <td style={{ padding: '12px 15px' }}>{formatarCPF(paciente.cpf)}</td>
                  <td style={{ padding: '12px 15px' }}>{formatarTelefone(paciente.telefone)}</td>
                  <td style={{ padding: '12px 15px', color: paciente.email ? '#333' : '#999' }}>
                    {paciente.email || 'Não informado'}
                  </td>
                  <td style={{ padding: '12px 15px' }}>
                    <span style={{ 
                      backgroundColor: '#e1f5fe', 
                      color: '#0288d1', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {paciente.role}
                    </span>
                  </td>
                </tr>
              ))}
              
              {pacientes.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#999' }}>
                    Nenhum paciente localizado no banco de dados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}