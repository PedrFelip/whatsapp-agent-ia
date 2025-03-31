const express = require('express');
const imoveisRoutes = require('./imoveisRoutes');
const chatRoutes = require('./chatRoutes');

const router = express.Router();

router.use('/imoveis', imoveisRoutes); 
router.use('/chat', chatRoutes);     
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'API está funcionando!' });
});

module.exports = router;
