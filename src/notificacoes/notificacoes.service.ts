import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Empresa } from '../empresa/empresa.entity';

@Injectable()
export class NotificacoesService {
  private readonly logger = new Logger(NotificacoesService.name);

  constructor(private readonly mailerService: MailerService) {}

  async enviarNotificacaoCriacaoEmpresa(empresa: Empresa) {
    const recebedores = (process.env.NOTIFICATION_EMAILS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (recebedores.length === 0) {
      this.logger.warn(
        'Nenhum destinatário configurado em NOTIFICATION_EMAILS',
      );
      return;
    }

    const assunto = `Nova empresa cadastrada: ${empresa.nome}`;
    const html = `
      <p>Uma nova empresa foi cadastrada:</p>
      <ul>
        <li><strong>Nome:</strong> ${empresa.nome}</li>
        <li><strong>CNPJ:</strong> ${empresa.cnpj}</li>
        <li><strong>Nome Fantasia:</strong> ${empresa.nomeFantasia}</li>
        <li><strong>Endereço:</strong> ${empresa.endereco}</li>
      </ul>
    `;

    const data = {
      NOTIFICATION_EMAILS: process.env.NOTIFICATION_EMAILS,
    };
    console.log('Dados de notificação:', data);

    try {
      await this.mailerService.sendMail({
        to: recebedores,
        subject: assunto,
        html,
      });
      this.logger.log(`E-mail enviado para: ${recebedores.join(', ')}`);
    } catch (err) {
      this.logger.error('Falha ao enviar e-mail de nova empresa', err as any);
    }
  }
}
