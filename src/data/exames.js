export const categoriasExames = [
  {
    id: 1,
    titulo: "Análises Clínicas",
    desc: "Sangue, urina, fezes e outros fluidos.",
    tipo: "exames", // 🌟 ESSENCIAL: Diz ao React que este card pertence à aba "Exames"
    icone: "🧪",    // 🌟 ADICIONADO: Evita que o card fique sem ícone
    listaExames: [
      { nome: "Hemograma Completo", preco: "R$ 45,00" },
      { nome: "Glicemia de Jejum", preco: "R$ 20,00" }
    ]
  },
  {
    id: 2,
    titulo: "Exames de Imagem",
    desc: "Radiologia, ultrassonografia e Ressonância.",
    tipo: "exames", // 🌟 ESSENCIAL: Diz ao React que este card pertence à aba "Exames"
    icone: "🩻",    // 🌟 ADICIONADO: Evita que o card fique sem ícone
    listaExames: [
      { nome: "Raio-X de Tórax", preco: "R$ 120,00" },
      { nome: "Ultrasson Abdominal", preco: "R$ 180,00" }
    ]
  },
  {
    id: 3,
    titulo: "Vacinas Essenciais",
    desc: "Proteção e imunização para todas as idades.",
    tipo: "vacinas", // 🌟 ESSENCIAL: Diz ao React que este card pertence à aba "Vacinas"
    icone: "💉",     // 🌟 ADICIONADO: Evita que o card fique sem ícone
    listaExames: [
      { nome: "Vacina da Gripe (Quadrivalente)", preco: "R$ 89,00" },
      { nome: "Antitetânica", preco: "R$ 45,00" }
    ]
  }
];