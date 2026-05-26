// src/modules/whatsapp/whatsapp.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  async sendMessage(phone: string, message: string): Promise<void> {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    if (!token || !phoneId) {
      this.logger.warn(`[SIMULADO] Para ${phone}: ${message}`);
      return;
    }

    const url = `https://graph.facebook.com/v22.0/${phoneId}/messages`;

    try {
      await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`Mensagem enviada para ${phone}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar para ${phone}: ${error.message}`);
      throw error;
    }
  }
}
