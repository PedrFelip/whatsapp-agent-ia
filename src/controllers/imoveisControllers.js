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

// @desc    Criar um novo imóvel
// @route   POST /api/imoveis
// @access  Private (Exemplo: futuramente adicionar autenticação)
exports.criarImovel = async (req, res) => {
    try {
      const novoImovel = await Imovel.create(req.body);
      res.status(201).json({ success: true, data: novoImovel });
    } catch (error) {
      console.error("Erro ao criar imóvel:", error);
      if (error.name === 'ValidationError') {
          // As mensagens de erro virão baseadas nos requisitos do modelo
          const messages = Object.values(error.errors).map(val => val.message);
          return res.status(400).json({ success: false, error: messages });
      }
      res.status(500).json({ success: false, error: 'Erro no servidor ao criar imóvel.' });
    }
  };

// @desc    Atualizar um imóvel pelo ID
// @route   PUT /api/imoveis/:id
// @access  Private
exports.atualizarImovel = async (req, res) => {
    try {
      const imovelAtualizado = await Imovel.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Retorna o modificado
        runValidators: true, // Roda as validações do modelo na atualização
      });
      if (!imovelAtualizado) {
        return res.status(404).json({ success: false, error: 'Imóvel não encontrado para atualização.' });
      }
      res.status(200).json({ success: true, data: imovelAtualizado });
    } catch (error) {
      console.error("Erro ao atualizar imóvel:", error);
       if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(val => val.message);
          return res.status(400).json({ success: false, error: messages });
      }
       if (error.kind === 'ObjectId') {
          return res.status(400).json({ success: false, error: 'ID do imóvel inválido.' });
      }
      res.status(500).json({ success: false, error: 'Erro no servidor ao atualizar imóvel.' });
    }
  };

  // @desc    Deletar um imóvel pelo ID
  // @route   DELETE /api/imoveis/:id
  // @access  Private
  exports.removerImovel = async (req, res) => {
    try {
      const imovelDeletado = await Imovel.findByIdAndDelete(req.params.id);
      if (!imovelDeletado) {
        return res.status(404).json({ success: false, error: 'Imóvel não encontrado para exclusão.' });
      }
      res.status(200).json({ success: true, data: {} }); // Retorna sucesso sem dados
    } catch (error) {
      console.error("Erro ao deletar imóvel:", error);
      if (error.kind === 'ObjectId') {
          return res.status(400).json({ success: false, error: 'ID do imóvel inválido.' });
      }
      res.status(500).json({ success: false, error: 'Erro no servidor ao deletar imóvel.' });
    }
  };