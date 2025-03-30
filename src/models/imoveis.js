const mongoose = require('mongoose');

// Define o modelo para os imóveis/empreendimentos
const ImovelModel = new mongoose.Schema({
  tituloAnuncio: { // Título do imóvel ou empreendimento
    type: String,
    required: [true, 'O título é obrigatório.'],
    trim: true,
  },
  nomeEmpreendimento: { // Nome do empreendimento (ex: "Residencial Veneza")
    type: String,
    trim: true,
  },
  descricao: { // Descrição detalhada do imóvel ou empreendimento
    type: String,
    required: [true, 'A descrição é obrigatória.'],
  },
  endereco: { // Endereço
    enderecocompleto: String,   // Rua, número, conjunto, lote (ex: "QS 320 conjunto 06 lote 02")
    bairro: String,       // Bairro
    cidade: String,       // Cidade (ex: "Samambaia")
    estado: String,       // Estado (ex: "DF")
    cep: String,          // CEP
    regiao: String,       // Região administrativa/geral (ex: "Samambaia Sul")
  },
  preco: { // Preço do imóvel ou empreendimento
    type: Number,
    required: [true, 'O preço é obrigatório.'],
  },
  tipo: { // Tipo principal do imóvel (Apartamento, Casa, etc.)
    type: String,
    required: true,
    enum: ['Apartamento', 'Casa', 'Terreno', 'Comercial', 'Rural', 'Kitnet'], // Adicione mais se necessário
  },
  descricaocompleto: { // Descrição textual da(s) tipologia(s) das unidades
    type: String, // Ex: "02 quartos, 01 sala de estar, 01 cozinha e 01 banheiro social."
  },
  quartos: { // Número de quartos
    type: Number,
    default: 0,
  },
  banheiros: { // Número de banheiros
    type: Number,
    default: 0,
  },
  area: { // Área principal/padrão em m²
    type: Number,
  },
  areasComuns: { // Lista das áreas comuns do empreendimento
    type: [String], // Ex: ["Recepção", "Central GLP", "Hall dos Elevadores", "Bicicletário"]
    default: [],
  },
  infoFinanciamento: { // Informações relevantes para financiamento
    aceitaFGTS: Boolean,
    aceitaFinanciamento: Boolean,
    observacoes: String, // Observações adicionais sobre financiamento
  },
  fotos: { // URLs das fotos
    type: [String],
    default: [],
  },
  status: { // Status do anúncio/imóvel
    type: String,
    enum: ['Disponível', 'Vendido', 'Alugado', 'Em Lançamento', 'Em Construção'],
    default: 'Disponível',
  },
  criadoEm: {
      type: Date,
      default: Date.now
  }
}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente

// Indexes para otimizar consultas
ImovelModel.index({ 'endereco.cidade': 1, 'endereco.estado': 1 });
ImovelModel.index({ preco: 1 });
ImovelModel.index({ tipo: 1 });

// Novo index para buscar por texto util para pesquisa e contexto para IA
ImovelModel.index({
    tituloAnuncio: 'text',
    descricao: 'text',
    'endereco.cidade': 'text',
    'endereco.bairro': 'text',
    nomeEmpreendimento: 'text'
}, { default_language: 'portuguese' });

// Cria e exporta o modelo 'Imovel'
module.exports = mongoose.model('Imovel', ImovelModel);
