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

// @desc    Buscar um imóvel específico pelo ID
// @route   GET /api/imoveis/:id
// @access  Public
exports.buscarImovelPorId = async (req, res) => {
    try {
      const imovel = await Imovel.findById(req.params.id);
      if (!imovel) {
        return res.status(404).json({ success: false, error: 'Imóvel não encontrado.' });
      }
      res.status(200).json({ success: true, data: imovel });
    } catch (error) {
      console.error("Erro ao buscar imóvel por ID:", error);
      if (error.kind === 'ObjectId') {
          return res.status(400).json({ success: false, error: 'ID do imóvel inválido.' });
      }
      res.status(500).json({ success: false, error: 'Erro no servidor ao buscar imóvel.' });
    }
  };