import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificacoesService } from '../notificacoes.service';
import { Empresa } from 'src/empresa/empresa.entity';

describe('NotificacoesService', () => {
  let service: NotificacoesService;
  let mailerService: MailerService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificacoesService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<NotificacoesService>(NotificacoesService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve enviar e-mail quando os destinatários estiverem configurados', async () => {
    process.env.NOTIFICATION_EMAILS = 'test@example.com';
    const mockEmpresa: Empresa = {
      id: 1,
      nome: 'Empresa Teste',
      cnpj: '12345678901',
      nomeFantasia: 'Fantasia Teste',
      endereco: 'Endereço Teste',
      criadoEm: new Date(),
      alteradoEm: new Date(),
    };

    await service.enviarNotificacaoCriacaoEmpresa(mockEmpresa);

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: ['test@example.com'],
      subject: `Nova empresa cadastrada: Empresa Teste`,
      html: expect.stringContaining('<p>Uma nova empresa foi cadastrada:</p>'),
    });
  });

  it('não deve enviar e-mail quando nenhum destinatário estiver configurado', async () => {
    process.env.NOTIFICATION_EMAILS = '';
    const mockEmpresa: Empresa = {
      id: 1,
      nome: 'Empresa Teste',
      cnpj: '12345678901',
      nomeFantasia: 'Fantasia Teste',
      endereco: 'Endereço Teste',
      criadoEm: new Date(),
      alteradoEm: new Date(),
    };

    jest.clearAllMocks();

    await service.enviarNotificacaoCriacaoEmpresa(mockEmpresa);

    expect(mailerService.sendMail).not.toHaveBeenCalled();
  });

  it('deve registrar um erro quando o envio de e-mail falhar', async () => {
    process.env.NOTIFICATION_EMAILS = 'test@example.com';
    const mockEmpresa: Empresa = {
      id: 1,
      nome: 'Empresa Teste',
      cnpj: '12345678901',
      nomeFantasia: 'Fantasia Teste',
      endereco: 'Endereço Teste',
      criadoEm: new Date(),
      alteradoEm: new Date(),
    };

    jest
      .spyOn(mailerService, 'sendMail')
      .mockRejectedValue(new Error('SMTP Error'));

    const loggerSpy = jest.spyOn(service['logger'], 'error');

    await service.enviarNotificacaoCriacaoEmpresa(mockEmpresa);

    expect(mailerService.sendMail).toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalledWith(
      'Falha ao enviar e-mail de nova empresa',
      expect.any(Error),
    );
  });
});
