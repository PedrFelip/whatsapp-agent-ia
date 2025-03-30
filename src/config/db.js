const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = async () => {
  try {
    // Tenta conectar ao MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,

    });
    console.log('MongoDB conectado com sucesso!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    // Encerra o processo com erro
    process.exit(1);
  }
};

// Exporta a função de conexão para ser ultilizada no server.js
module.exports = connectDB;