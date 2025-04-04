const express = require('express');
const { buscarImoveis, buscarImovelPorId, criarImovel, atualizarImovel, removerImovel } = require('../controllers/imoveisControllers'); // Importa as funções do controller
const router = express.Router();

// Define as rotas para os imóveis
router.route('/')
  .get(buscarImoveis)   // GET /api/imoveis -> buscar todos
  .post(criarImovel);  // POST /api/imoveis -> criar novo

router.route('/:id')
  .get(buscarImovelPorId)    // GET /api/imoveis/:id -> buscar por ID
  .put(atualizarImovel)     // PUT /api/imoveis/:id -> atualizar por ID
  .delete(removerImovel); // DELETE /api/imoveis/:id -> deletar por ID

module.exports = router; // Exporta o roteador
