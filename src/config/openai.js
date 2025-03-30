const OpenAI = require('openai');
require('dotenv').config(); 

if (!process.env.OPENAI_API_KEY) {
  throw new Error("A variável de ambiente OPENAI_API_KEY não está definida.");
}

// Cria e configura a API da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Exporta a instância configurada
module.exports = openai;