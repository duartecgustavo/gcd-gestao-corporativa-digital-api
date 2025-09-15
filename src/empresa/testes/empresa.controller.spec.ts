import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaController } from '../empresa.controller';
import { EmpresaService } from '../empresa.service';

describe('EmpresaController', () => {
  let controller: EmpresaController;
  let service: EmpresaService;

  const mockEmpresaService = {
    criar: jest.fn(),
    buscarTodas: jest.fn(),
    encontrarEmpresaPorCnpj: jest.fn(),
    atualizar: jest.fn(),
    excluir: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpresaController],
      providers: [
        {
          provide: EmpresaService,
          useValue: mockEmpresaService,
        },
      ],
    }).compile();

    controller = module.get<EmpresaController>(EmpresaController);
    service = module.get<EmpresaService>(EmpresaService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar o método criar do serviço', async () => {
    const dto = {
      nome: 'Empresa Teste',
      cnpj: '12345678901',
      nomeFantasia: 'Fantasia Teste',
      endereco: 'Endereço Teste',
    };
    await controller.criar(dto);
    expect(service.criar).toHaveBeenCalledWith(dto);
  });

  it('deve chamar o método buscarTodas do serviço', async () => {
    await controller.buscarTodas(1, 10);
    expect(service.buscarTodas).toHaveBeenCalledWith(1, 10);
  });

  it('deve chamar o método encontrarEmpresaPorCnpj do serviço', async () => {
    await controller.encontrarEmpresaPorCnpj('1');
    expect(service.encontrarEmpresaPorCnpj).toHaveBeenCalledWith('1');
  });

  it('deve chamar o método atualizar do serviço', async () => {
    const dto = { nome: 'Empresa Atualizada', cnpj: '12345678901' };
    await controller.atualizar('1', dto);
    expect(service.atualizar).toHaveBeenCalledWith('1', dto);
  });

  it('deve chamar o método excluir do serviço', async () => {
    await controller.excluir('1');
    expect(service.excluir).toHaveBeenCalledWith('1');
  });
});
