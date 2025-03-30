const express = require('express');
const {} = require('src/controllers/imoveisControllers.js'); // Importa as funções do controller

const router = express.Router();

// Define as rotas para os imóveis
router.route('/')
  .get()   // GET /api/imoveis -> buscar todos
  .post();  // POST /api/imoveis -> criar novo

router.route('/:id')
  .get()    // GET /api/imoveis/:id -> buscar por ID
  .put()     // PUT /api/imoveis/:id -> atualizar por ID
  .delete(); // DELETE /api/imoveis/:id -> deletar por ID

module.exports = router; // Exporta o roteador
