import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  // URL de redirecionamento para onde o Google enviará o usuário após o login.
  // Vamos definir essa rota no futuro.
  'http://localhost:3000/auth/google/callback'
);

// Escopos que precisamos: ler calendário, ler/enviar email (opcional para o BDR)
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
];

export class GoogleService {
  /**
   * Gera a URL para o BDR (você) clicar e autorizar o ZeusIA a acessar o Google Workspace.
   */
  getAuthUrl() {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline', // Para receber o refresh_token e manter a sessão
      scope: SCOPES,
      prompt: 'consent',
    });
  }

  /**
   * Troca o código recebido pelo Google pelos tokens de acesso.
   */
  async getTokens(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
  }

  /**
   * Função base para listar eventos futuros na agenda.
   * Isso será usado depois pelo Gemini para checar disponibilidade.
   */
  async listFutureEvents(tokens: any) {
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    try {
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(), // A partir de agora
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return response.data.items;
    } catch (error) {
       console.error('Erro ao buscar eventos no Calendar:', error);
       throw error;
    }
  }
}