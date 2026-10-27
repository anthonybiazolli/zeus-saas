import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('⚠️ ERRO CRÍTICO: GEMINI_API_KEY não foi encontrada no arquivo .env');
      throw new Error('Chave da API do Gemini ausente.');
    }

    // Inicializa o SDK com a chave
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Trocamos para o gemini-pro, que é o modelo mais estável e garantido na API atual
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      systemInstruction: {
        role: "system",
        parts: [{ 
          text: `Você é um assistente de SDR/BDR da Jettax, chamado ZeusIA.
Seu objetivo é pré-qualificar leads recebidos via WhatsApp usando a metodologia BANT (Budget, Authority, Need, Timeline).
Seja amigável, conciso (mensagens curtas de WhatsApp) e profissional.
NÃO VENDA O PRODUTO DIRETAMENTE. Apenas qualifique o interesse e tente agendar uma reunião de demonstração para o BDR humano.

Se o lead estiver qualificado (demonstrou necessidade e tem interesse em ver o sistema), você DEVE sugerir o agendamento de uma reunião.` 
        }]
      }
    });
  }

  async generateResponse(message: string, history: any[] = []) {
    try {
      console.log(`🤖 Recebendo mensagem: "${message}"`);
      
      const chat = this.model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      
      console.log(`✅ Resposta gerada com sucesso!`);
      return response.text();

    } catch (error: any) {
      console.error('❌ Erro detalhado do Gemini:', error.message || error);
      throw new Error('Falha na comunicação com a IA.');
    }
  }
}