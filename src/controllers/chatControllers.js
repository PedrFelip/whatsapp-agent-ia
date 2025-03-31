const openai = require('src/config/openai.js');
const Imovel = require('src/models/imoveis.js');

// @desc    Processar mensagem do chat e interagir com a IA
// @route   POST /api/chat/message
// @access  Public (ou Private, dependendo da integração com WhatsApp)

exports.tratamentoChat = async (req, res) => {
    const { message, userId, conversationHistory } = req.body;
  
    if (!message) {
      return res.status(400).json({ success: false, error: 'Mensagem não pode ser vazia.' });
    }
  
    try {
      // Prompt para a IA
      const systemPrompt = `Você é um corretor de imóveis virtual assistente chamado 'IA Imob'. Seu objetivo é ajudar clientes a encontrar imóveis, entender opções de financiamento e agendar visitas.
      Seus conhecimentos incluem:
      - Detalhes sobre os imóveis disponíveis em nosso banco de dados.
      - Informações gerais sobre financiamento imobiliário (FGTS, crédito imobiliário).
      - Capacidade de agendar visitas.
      Responda de forma clara, objetiva e amigável em português do Brasil.
      Se não souber responder algo, diga que vai verificar com um especialista humano.
      O objetivo final é sempre tentar agendar uma visita ao imóvel ou à imobiliária, se o cliente demonstrar interesse e o perfil for adequado.`;
  
      const messages = [
        { role: "system", content: systemPrompt },
        ...(conversationHistory || []).map(msg => ({ role: msg.role, content: msg.content })),
        { role: "user", content: message }
      ]; 
      // Chamada da aPI OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });
  
      const aiResponse = completion.choices[0].message.content;
  
      // PARA FAZER: analisar a resposta da IA e tomar ações
      // Caso de uso verificar se a IA sugeriu agendar visita.
  
      // Resposta da IA
      res.status(200).json({
        success: true,
        response: aiResponse,
        updatedHistory: [
            ...messages.slice(1),
            { role: "assistant", content: aiResponse }
        ]
      });
  
    } catch (error) {
      console.error("Erro ao processar mensagem do chat:", error);
      if (error.response) {
        console.error("Erro da API OpenAI:", error.response.status, error.response.data);
        return res.status(502).json({ success: false, error: 'Erro ao comunicar com o serviço de IA.' });
      }
      res.status(500).json({ success: false, error: 'Erro no servidor ao processar mensagem.' });
    }
  };