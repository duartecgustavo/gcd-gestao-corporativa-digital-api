import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmpresaService } from './empresa.service';
import { CriarEmpresaDto } from './dtos/criar-empresa.dto';
import { AtualizarEmpresaDto } from './dtos/atualizar-empresa.dto';

@ApiTags('Empresas')
@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova empresa' })
  @ApiBody({
    type: CriarEmpresaDto,
    description: 'Dados necessários para criar uma nova empresa',
    examples: {
      exemplo: {
        summary: 'Exemplo de criação de empresa',
        value: {
          nome: 'Empresa Teste',
          cnpj: 12345678901,
          nomeFantasia: 'Fantasia Teste',
          endereco: 'Rua Exemplo, 123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Empresa criada com sucesso.',
    schema: {
      example: {
        message: 'Empresa com CNPJ 12345678901 foi criada com sucesso.',
        status: 'success',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito: CNPJ já cadastrado.',
    schema: {
      example: {
        statusCode: 409,
        message: 'Empresa com CNPJ 12345678901 já está cadastrada.',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos dados enviados.',
    schema: {
      example: {
        statusCode: 400,
        message: ['O nome é obrigatório.', 'O CNPJ é obrigatório.'],
        error: 'Bad Request',
      },
    },
  })
  async criar(@Body() data: CriarEmpresaDto) {
    return this.empresaService.criar(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as empresas com paginação' })
  @ApiQuery({
    name: 'pagina',
    type: Number,
    required: false,
    description: 'Número da página para a paginação (valor padrão: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limite',
    type: Number,
    required: false,
    description: 'Quantidade de itens por página (valor padrão: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de empresas retornada com sucesso.',
    schema: {
      example: {
        data: [
          {
            cnpj: 12345678901,
            nomeFantasia: 'Fantasia Teste',
            endereco: 'Rua Exemplo, 123',
            criadoEm: '2023-01-01T00:00:00.000Z',
            alteradoEm: '2023-01-02T00:00:00.000Z',
          },
          {
            cnpj: 98765432101,
            nomeFantasia: 'Fantasia 2',
            endereco: 'Rua Nova, 456',
            criadoEm: '2023-01-03T00:00:00.000Z',
            alteradoEm: '2023-01-04T00:00:00.000Z',
          },
        ],
        total: 2,
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPage: null,
        prevPage: null,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos parâmetros de paginação.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'O parâmetro "pagina" deve ser um número.',
          'O parâmetro "limite" deve ser um número.',
        ],
        error: 'Bad Request',
      },
    },
  })
  async buscarTodas(
    @Query('pagina') pagina: number = 1,
    @Query('limite') limite: number = 10,
  ) {
    return this.empresaService.buscarTodas(Number(pagina), Number(limite));
  }

  @Get(':cnpj')
  @ApiOperation({ summary: 'Buscar uma empresa pelo CNPJ' })
  @ApiParam({
    name: 'cnpj',
    type: Number,
    description: 'CNPJ da empresa que será buscada',
    example: 12345678901,
  })
  @ApiResponse({
    status: 200,
    description: 'Empresa encontrada com sucesso.',
    schema: {
      example: {
        id: 1,
        nome: 'Empresa Teste',
        cnpj: 12345678901,
        nomeFantasia: 'Fantasia Teste',
        endereco: 'Rua Exemplo, 123',
        criadoEm: '2023-01-01T00:00:00.000Z',
        alteradoEm: '2023-01-02T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa não encontrada.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Empresa com CNPJ 12345678901 não encontrada.',
        error: 'Not Found',
      },
    },
  })
  async encontrarEmpresaPorCnpj(@Param('cnpj') cnpj: number) {
    return this.empresaService.encontrarEmpresaPorCnpj(cnpj);
  }

  @Put(':cnpj')
  @ApiOperation({ summary: 'Atualizar uma empresa pelo CNPJ' })
  @ApiParam({
    name: 'cnpj',
    type: Number,
    description: 'CNPJ da empresa que será atualizada',
    example: 12345678901,
  })
  @ApiBody({
    type: AtualizarEmpresaDto,
    description: 'Dados para atualizar a empresa',
    examples: {
      exemplo: {
        summary: 'Exemplo de atualização',
        value: {
          nome: 'Empresa Atualizada',
          cnpj: 12345678901,
          nomeFantasia: 'Fantasia Atualizada',
          endereco: 'Rua Nova, 456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Empresa atualizada com sucesso.',
    schema: {
      example: {
        message: 'Empresa com CNPJ 12345678901 foi atualizada com sucesso.',
        status: 'success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa não encontrada.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Empresa com CNPJ 12345678901 não encontrada.',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos dados enviados.',
    schema: {
      example: {
        statusCode: 400,
        message: ['O nome deve ser uma string.', 'O CNPJ é obrigatório.'],
        error: 'Bad Request',
      },
    },
  })
  async atualizar(
    @Param('cnpj') cnpj: number,
    @Body() data: AtualizarEmpresaDto,
  ) {
    return this.empresaService.atualizar(cnpj, data);
  }

  @Delete(':cnpj')
  @ApiOperation({ summary: 'Excluir uma empresa pelo CNPJ' })
  @ApiParam({
    name: 'cnpj',
    type: Number,
    description: 'CNPJ da empresa que será excluída',
    example: 12345678901,
  })
  @ApiResponse({
    status: 200,
    description: 'Empresa excluída com sucesso.',
    schema: {
      example: {
        message: 'Empresa com CNPJ 12345678901 foi excluída com sucesso.',
        status: 'success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa não encontrada.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Empresa com CNPJ 12345678901 não encontrada.',
        error: 'Not Found',
      },
    },
  })
  async excluir(@Param('cnpj') cnpj: number) {
    return this.empresaService.excluir(cnpj);
  }
}
