import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificacoesService } from 'src/notificacoes/notificacoes.service';
import { Repository } from 'typeorm';
import { Empresa } from '../empresa.entity';
import { EmpresaService } from '../empresa.service';

describe('EmpresaService', () => {
  let service: EmpresaService;
  let repository: Repository<Empresa>;

  const mockNotificacoesService = {
    enviarNotificacaoCriacaoEmpresa: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpresaService,
        {
          provide: getRepositoryToken(Empresa),
          useClass: Repository,
        },
        {
          provide: NotificacoesService,
          useValue: mockNotificacoesService,
        },
      ],
    }).compile();

    service = module.get<EmpresaService>(EmpresaService);
    repository = module.get<Repository<Empresa>>(getRepositoryToken(Empresa));
  });

  it('deve retornar resultados paginados e mapeados', async () => {
    const mockData: Empresa[] = [
      {
        id: 1,
        nome: 'Empresa 1',
        cnpj: '12345678901',
        nomeFantasia: 'Fantasia 1',
        endereco: 'Endereço 1',
        criadoEm: new Date('2023-01-01'),
        alteradoEm: new Date('2023-01-02'),
      },
      {
        id: 2,
        nome: 'Empresa 2',
        cnpj: '98765432101',
        nomeFantasia: 'Fantasia 2',
        endereco: 'Endereço 2',
        criadoEm: new Date('2023-01-03'),
        alteradoEm: new Date('2023-01-04'),
      },
    ];

    jest.spyOn(repository, 'findAndCount').mockResolvedValue([mockData, 2]);

    const result = await service.buscarTodas(1, 10);

    expect(result).toEqual({
      data: [
        {
          cnpj: '12345678901',
          nomeFantasia: 'Fantasia 1',
          endereco: 'Endereço 1',
          criadoEm: new Date('2023-01-01'),
          alteradoEm: new Date('2023-01-02'),
        },
        {
          cnpj: '98765432101',
          nomeFantasia: 'Fantasia 2',
          endereco: 'Endereço 2',
          criadoEm: new Date('2023-01-03'),
          alteradoEm: new Date('2023-01-04'),
        },
      ],
      total: 2,
      paginaAtual: 1,
      totalPaginas: 1,
      existeProximaPagina: false,
      existePaginaAnterior: false,
      proximaPagina: null,
      paginaAnterior: null,
      mensagem: 'Empresas listadas com sucesso.',
      status: 'success',
    });
    expect(repository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      order: { criadoEm: 'DESC' },
    });
  });

  it('deve criar uma nova empresa e retornar uma mensagem de sucesso', async () => {
    const mockEmpresa: Empresa = {
      id: 1,
      nome: 'Empresa Teste',
      cnpj: '12345678901',
      nomeFantasia: 'Fantasia Teste',
      endereco: 'Endereço Teste',
      criadoEm: new Date(),
      alteradoEm: new Date(),
    };

    // Mocka findOne para retornar null (CNPJ não cadastrado)
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    jest.spyOn(repository, 'create').mockReturnValue(mockEmpresa);
    jest.spyOn(repository, 'save').mockResolvedValue(mockEmpresa);
    jest
      .spyOn(mockNotificacoesService, 'enviarNotificacaoCriacaoEmpresa')
      .mockResolvedValue(undefined);

    const result = await service.criar({
      nome: 'Empresa Teste',
      cnpj: '12345678901',
      nomeFantasia: 'Fantasia Teste',
      endereco: 'Endereço Teste',
    });

    expect(result).toEqual({
      message: 'Empresa com CNPJ 12345678901 foi criada com sucesso.',
      status: 'success',
    });
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { cnpj: '12345678901' },
    });
    expect(repository.create).toHaveBeenCalledWith({
      nome: 'Empresa Teste',
      cnpj: '12345678901',
      nomeFantasia: 'Fantasia Teste',
      endereco: 'Endereço Teste',
    });
    expect(repository.save).toHaveBeenCalledWith(mockEmpresa);
    expect(
      mockNotificacoesService.enviarNotificacaoCriacaoEmpresa,
    ).toHaveBeenCalledWith(mockEmpresa);
  });

  it('deve lançar ConflictException se o CNPJ já estiver cadastrado', async () => {
    const mockEmpresa: Empresa = {
      id: 1,
      nome: 'Empresa Teste',
      cnpj: '12345678901',
      nomeFantasia: 'Fantasia Teste',
      endereco: 'Endereço Teste',
      criadoEm: new Date(),
      alteradoEm: new Date(),
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(mockEmpresa); // Mocka findOne para retornar uma empresa
    jest.spyOn(repository, 'save').mockImplementation(jest.fn()); // Mocka save como uma função do Jest

    await expect(
      service.criar({
        nome: 'Empresa Teste',
        cnpj: '12345678901',
        nomeFantasia: 'Fantasia Teste',
        endereco: 'Endereço Teste',
      }),
    ).rejects.toThrow(ConflictException);

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { cnpj: '12345678901' },
    });
    expect(repository.save).not.toHaveBeenCalled(); // Verifica que save não foi chamado
  });

  it('deve lançar um erro se a criação falhar', async () => {
    jest.spyOn(repository, 'create').mockImplementation(() => {
      throw new Error('Erro ao criar empresa');
    });

    await expect(
      service.criar({
        nome: 'Empresa Teste',
        cnpj: '12345678901',
        nomeFantasia: 'Fantasia Teste',
        endereco: 'Endereço Teste',
      }),
    ).rejects.toThrow('Erro ao criar empresa');
  });

  it('deve atualizar uma empresa e retornar uma mensagem de sucesso', async () => {
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
      .spyOn(service, 'encontrarEmpresaPorCnpj')
      .mockResolvedValue(mockEmpresa);
    jest.spyOn(repository, 'save').mockResolvedValue({
      ...mockEmpresa,
      nome: 'Empresa Atualizada',
      cnpj: '12345678901',
    });

    const result = await service.atualizar('1', { nome: 'Empresa Atualizada' });

    expect(result).toEqual({
      message: 'Empresa com CNPJ 1 foi atualizada com sucesso.',
      status: 'success',
    });
    expect(repository.save).toHaveBeenCalledWith({
      ...mockEmpresa,
      nome: 'Empresa Atualizada',
      cnpj: '12345678901',
    });
  });

  it('deve lançar NotFoundException se a empresa não for encontrada', async () => {
    jest.spyOn(service, 'encontrarEmpresaPorCnpj').mockRejectedValue(
      new NotFoundException({
        statusCode: 404,
        message: 'Empresa com CNPJ 1 não encontrada.',
        error: 'Not Found',
      }),
    );

    jest.spyOn(repository, 'save').mockImplementation(jest.fn());

    await expect(
      service.atualizar('1', { nome: 'Empresa Atualizada' }),
    ).rejects.toThrow(NotFoundException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('deve excluir uma empresa e retornar uma mensagem de sucesso', async () => {
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
      .spyOn(service, 'encontrarEmpresaPorCnpj')
      .mockResolvedValue(mockEmpresa);
    jest.spyOn(repository, 'remove').mockResolvedValue(mockEmpresa);

    const result = await service.excluir('1');

    expect(result).toEqual({
      message: 'Empresa com CNPJ 12345678901 foi excluída com sucesso.',
      status: 'success',
    });
    expect(repository.remove).toHaveBeenCalledWith(mockEmpresa);
  });

  it('deve lançar NotFoundException se a empresa não for encontrada', async () => {
    jest.spyOn(service, 'encontrarEmpresaPorCnpj').mockRejectedValue(
      new NotFoundException({
        statusCode: 404,
        message: 'Empresa com CNPJ 12345678901 não encontrada.',
        error: 'Not Found',
      }),
    );

    jest.spyOn(repository, 'remove').mockImplementation(jest.fn());

    await expect(service.excluir('1')).rejects.toThrow(NotFoundException);
    expect(repository.remove).not.toHaveBeenCalled();
  });

  it('deve retornar uma empresa formatada pelo CNPJ', async () => {
    const mockEmpresa: Empresa = {
      id: 1,
      nome: 'Empresa Teste',
      cnpj: '12345678901',
      nomeFantasia: 'Fantasia Teste',
      endereco: 'Endereço Teste',
      criadoEm: new Date('2023-01-01'),
      alteradoEm: new Date('2023-01-02'),
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(mockEmpresa);

    const result = await service.encontrarEmpresaPorCnpj('12345678901');

    expect(result).toEqual({
      id: 1,
      nome: 'Empresa Teste',
      cnpj: '12345678901',
      nomeFantasia: 'Fantasia Teste',
      endereco: 'Endereço Teste',
      criadoEm: new Date('2023-01-01'),
      alteradoEm: new Date('2023-01-02'),
    });
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { cnpj: '12345678901' },
    });
  });
});
