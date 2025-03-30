const Imovel = require('src/models/imoveis.js');

// @desc    Buscar todos os imóveis (com filtros básicos)
// @route   GET /api/imoveis
// @access  Public
exports.buscarImoveis = async (req, res) => {
    try {
      // Para Fazer: Implementar filtros mais avançados (preco, tipo, localizacao, etc.) 
      const imoveis = await Imovel.find(req.query);
      res.status(200).json({ success: true, count: imoveis.length, data: imoveis });
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
      res.status(500).json({ success: false, error: 'Erro no servidor ao buscar imóveis.' });
    }
  };