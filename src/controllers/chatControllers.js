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

    let dbcontexto = ""; // Variável para armazenar o contexto do banco de dados

    try {
        // Busca de dados no banco de dados
        try {
            // Usa busca por texto ($text) com base na mensagem do usuário. Limita a 3 resultados.
            const imoveisRelevantes = await Imovel.find(
                { $text: { $search: message } },
                { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } }) // Ordena pelos mais relevantes
            .limit(3); // Limita o número de imóveis

            if (imoveisRelevantes && imoveisRelevantes.length > 0) {
                // Formata os resultados para incluir no prompt
                dbcontexto = "Contexto do Banco de Dados:\n";
                imoveisRelevantes.forEach((imovel, index) => {
                    dbcontexto += `Imóvel ${index + 1}:\n`;
                    dbcontexto += `- Título: ${imovel.tituloAnuncio || 'N/A'}\n`;
                    if(imovel.nomeEmpreendimento) dbcontexto += `- Empreendimento: ${imovel.nomeEmpreendimento}\n`;
                    dbcontexto += `- Tipo: ${imovel.tipo || 'N/A'}\n`;
                    dbcontexto += `- Local: ${imovel.endereco?.bairro || ''}, ${imovel.endereco?.cidade || 'N/A'}\n`;
                    dbcontexto += `- Preço: R$ ${imovel.preco?.toLocaleString('pt-BR') || 'N/A'}\n`;
                    dbcontexto += `- Quartos: ${imovel.quartos || 'N/A'}\n`;
                    dbcontexto += `- Área: ${imovel.area || 'N/A'} m²\n`;
                    dbcontexto += `- Descrição: ${imovel.descricao?.substring(0, 150) || 'N/A'}...\n\n`;
                });
            } else {
                dbcontexto = "Contexto do Banco de Dados: Nenhum imóvel específico encontrado no banco de dados para esta consulta.\n";
            }
        } catch (dbError) {
            console.error("Erro ao buscar imóveis no DB:", dbError);
            dbcontexto = "Contexto do Banco de Dados: Ocorreu um erro ao tentar buscar imóveis.\n";
            // Não interrompe o fluxo, a IA ainda pode responder
        }


        // Prompt para a IA
        const systemPrompt = `Você é um corretor de imóveis virtual assistente chamado 'IA Imob'. Seu objetivo é ajudar clientes a encontrar imóveis, entender opções de financiamento e agendar visitas.
        Seus conhecimentos incluem:
        - Detalhes sobre os imóveis disponíveis em nosso banco de dados (fornecidos no 'Contexto do Banco de Dados' abaixo, se houver).
        - Informações gerais sobre financiamento imobiliário (FGTS, crédito imobiliário).
        - Capacidade de agendar visitas.
        Responda de forma clara, objetiva e amigável em português do Brasil. Use as informações do 'Contexto do Banco de Dados' se forem relevantes para a pergunta do usuário. Se o contexto indicar 'Nenhum imóvel encontrado' ou 'Erro ao buscar', informe ao usuário que não encontrou detalhes específicos no momento, mas pode ajudar com informações gerais.
        Se não souber responder algo, diga que vai verificar com um especialista humano.
        O objetivo final é sempre tentar agendar uma visita ao imóvel ou à imobiliária, se o cliente demonstrar interesse e o perfil for adequado.`;

        // Monta as mensagens para a OpenAI, incluindo o dbcontexto
        const messages = [
            { role: "system", content: systemPrompt },
            // Adiciona o contexto do DB como uma mensagem do sistema antes do histórico
            { role: "system", content: dbcontexto },
            // Adiciona histórico da conversa
            ...(conversationHistory || []).map(msg => ({ role: msg.role, content: msg.content })),
            // Adiciona a mensagem atual do usuário
            { role: "user", content: message }
        ];

        // Chamada da API OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 200
        });

        const aiResponse = completion.choices[0].message.content;

        // PARA FAZER: analisar a resposta da IA e tomar ações
        // (Lógica de análise da resposta da IA permanece aqui)

        // Resposta da API
        res.status(200).json({
            success: true,
            response: aiResponse,
            updatedHistory: [
                ...messages.slice(1), // Remove o prompt principal do sistema do histórico retornado
                { role: "assistant", content: aiResponse }
            ]
        });

    } catch (error) { // Captura erros gerais ou da API OpenAI
        console.error("Erro ao processar mensagem do chat:", error);
        if (error.response) { // Erro específico da API OpenAI
            console.error("Erro da API OpenAI:", error.response.status, error.response.data);
            return res.status(502).json({ success: false, error: 'Erro ao comunicar com o serviço de IA.' });
        }
        // Outros erros do servidor
        res.status(500).json({ success: false, error: 'Erro no servidor ao processar mensagem.' });
    }
};