const express = require('express');
const { tratamentoChat } = require('src/controllers/chatControllers.js'); 

const router = express.Router();

// Rota para processar mensagens do chat
router.post('/message', tratamentoChat); // POST /api/chat/message

// PARA FAZER: Adicionar rota para o WhatsApp

module.exports = router;