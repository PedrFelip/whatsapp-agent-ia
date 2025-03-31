const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const allRoutes = require('./routes/index');

dotenv.config();

// Conecta ao banco de dados MongoDB
connectDB();

// Inicializa o aplicativo Express
const app = express();

// Middleware para permitir o parsing de JSON no corpo das requisições
app.use(express.json());

// Middleware para permitir o parsing de dados de formulário (url-encoded)
app.use(express.urlencoded({ extended: true }));

// Monta as rotas principais da API sob o prefixo /api
app.use('/api', allRoutes);

// Rota raiz simples
app.get('/', (req, res) => {
  res.send('API do Corretor IA está no ar!');
});


app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err.stack);
  res.status(500).send('Algo deu errado no servidor!');
});

// Define a porta a partir das variáveis de ambiente ou usa 3000 como padrão
const PORT = process.env.PORT;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em modo ${process.env.NODE_ENV || 'development'} na porta ${PORT}`);
});