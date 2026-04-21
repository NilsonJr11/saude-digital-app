// Adicione o 'export' aqui no início da linha
export const categoriasExames = [
  { 
    id: 1, 
    titulo: 'Saúde da Mulher', 
    desc: 'Exames periódicos e preventivos.', 
    icone: '👩‍⚕️',
    tipo: 'exames' ,// Importante para o seu filtro funcionar!
    listaExames: [
      { nome: 'Papanicolau', preco: 'R$ 80,00' },
      { nome: 'Mamografia Digital', preco: 'R$ 150,00' },
      { nome: 'Ultrassom Transvaginal', preco: 'R$ 120,00' }
    ]
  },
  { 
    id: 2, 
    titulo: 'Saúde do Homem', 
    desc: 'Check-ups completos e exames de rotina.', 
    icone: '👨‍⚕️',
    tipo: 'exames',
    listaExames: [
      { nome: 'Exame de Sangue', preco: 'R$ 60,00' },
      { nome: 'Eletrocardiograma', preco: 'R$ 90,00' },
      { nome: 'Ecocardiograma Doppler', preco: 'R$ 250,00' }
    ] 
  },
  { 
    id: 3, 
    titulo: 'Saúde do Coração',
    desc: 'Avaliações cardiovasculares e exames de imagem.', 
    icone: '❤️',
    tipo: 'exames',
    listaExames: [
      { nome: 'Eletrocardiograma', preco: 'R$ 90,00' },
      { nome: 'Ecocardiograma Doppler', preco: 'R$ 250,00' }
    ]
  },
  { 
    id: 4, 
    titulo: 'Saúde da Gestante', 
    desc: 'Acompanhamento pré-natal e ultrassonografias.', 
    icone: '🤰',
    tipo: 'exames',
    listaExames: [
      { nome: 'Ultrassom Transvaginal', preco: 'R$ 120,00' }
    ]
  },
  { 
    id: 5, 
    titulo: 'Gripe (Influenza)', 
    desc: 'Proteção anual contra os principais vírus da gripe.', 
    icone: '💉',
    tipo: 'vacinas',
    listaExames: [
      { nome: 'Vacina Influenza Tri-viral', preco: 'R$ 45,00' }
    ] 
  },
  { 
    id: 6, 
    titulo: 'Covid-19', 
    desc: 'Vacina contra a Covid-19.', 
    icone: '💉',
    tipo: 'vacinas',
    listaExames: [
      { nome: 'Vacina Covid-19', preco: 'R$ 20,00' }
    ] // Se não tiver nada ainda, deixe o array vazio assim []
  }, 
];