import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GeminiService } from './services/gemini.service'; // Importando o serviço

// Carrega as variáveis do .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Instancia o serviço do Gemini
const geminiService = new GeminiService();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste para garantir que o ZeusIA está vivo
app.get('/health', (req, res) => {
  res.json({ status: 'Ok', message: 'Servidor ZeusIA operante!' });
});

// Nova rota para testar o agente Gemini (ZeusIA)
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'A propriedade "message" é obrigatória.' });
    }

    // Chama o serviço do Gemini passando a mensagem
    const responseText = await geminiService.generateResponse(message);

    res.json({
      status: 'success',
      response: responseText
    });

  } catch (error: any) {
    console.error('Erro na rota /chat:', error);
    res.status(500).json({ error: 'Erro interno ao processar a mensagem.' });
  }
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor do ZeusIA SaaS rodando na porta ${port}`);
});