import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './empresa.entity';
import { NotificacoesService } from 'src/notificacoes/notificacoes.service';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly notificacoesService: NotificacoesService,
  ) {}

  private readonly logger = new Logger(EmpresaService.name);

  async criar(
    data: Partial<Empresa>,
  ): Promise<{ message: string; status: string }> {
    try {
      const empresaExistente = await this.empresaRepository.findOne({
        where: { cnpj: data.cnpj },
      });

      if (empresaExistente) {
        this.logger.warn(`Empresa com CNPJ ${data.cnpj} já está cadastrada.`);
        throw new ConflictException({
          statusCode: 409,
          message: `Empresa com CNPJ ${data.cnpj} já está cadastrada.`,
          error: 'Conflict',
        });
      }

      const empresa = this.empresaRepository.create(data);
      const empresaSalva = await this.empresaRepository.save(empresa);

      this.notificacoesService
        .enviarNotificacaoCriacaoEmpresa(empresaSalva)
        .catch((err) => {
          this.logger.error(
            'Erro no envio de notificação (não bloqueante):',
            err,
          );
        });

      return {
        message: `Empresa com CNPJ ${empresaSalva.cnpj} foi criada com sucesso.`,
        status: 'success',
      };
    } catch (error) {
      this.logger.error('Erro ao criar empresa:', error);

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new Error(
        `Erro ao criar empresa. Detalhes: ${error.message} (statusCode: 500, error: Internal Server Error)`,
      );
    }
  }

  async buscarTodas(
    pagina: number = 1,
    limite: number = 10,
  ): Promise<{
    data: Array<{
      cnpj: string;
      nomeFantasia: string;
      endereco: string;
      criadoEm: Date;
      alteradoEm: Date;
    }>;
    total: number;
    paginaAtual: number;
    totalPaginas: number;
    existeProximaPagina: boolean;
    existePaginaAnterior: boolean;
    proximaPagina: number | null;
    paginaAnterior: number | null;
    mensagem: string;
    status: string;
  }> {
    try {
      pagina = Math.max(1, Number(pagina) || 1);
      limite = Math.min(Math.max(1, Number(limite) || 10), 100);

      const pule = (pagina - 1) * limite;

      const [data, total] = await this.empresaRepository.findAndCount({
        skip: pule,
        take: limite,
        order: { criadoEm: 'DESC' },
      });

      const totalPaginas = Math.ceil(total / limite);

      const respostaMapeada = data.map((empresa) =>
        this.mapearRespostaBuscarTodas(empresa),
      );

      return {
        data: respostaMapeada,
        total,
        paginaAtual: pagina,
        totalPaginas,
        existeProximaPagina: pagina < totalPaginas,
        existePaginaAnterior: pagina > 1,
        proximaPagina: pagina < totalPaginas ? pagina + 1 : null,
        paginaAnterior: pagina > 1 ? pagina - 1 : null,
        mensagem: 'Empresas listadas com sucesso.',
        status: 'success',
      };
    } catch (error) {
      this.logger.error('Erro ao buscar empresas:', error);

      throw new Error(
        `Erro ao buscar empresas. Detalhes: ${error.message} (statusCode: 500, error: Internal Server Error)`,
      );
    }
  }

  private mapearRespostaBuscarTodas(empresa: Empresa) {
    return {
      cnpj: empresa.cnpj,
      nomeFantasia: empresa.nomeFantasia,
      endereco: empresa.endereco,
      criadoEm: empresa.criadoEm,
      alteradoEm: empresa.alteradoEm,
    };
  }

  async atualizar(
    cnpj: string,
    data: Partial<Empresa>,
  ): Promise<{ message: string; status: string }> {
    try {
      const empresa = await this.encontrarEmpresaPorCnpj(cnpj);
      Object.assign(empresa, data);
      await this.empresaRepository.save(empresa);

      return {
        message: `Empresa com CNPJ ${cnpj} foi atualizada com sucesso.`,
        status: 'success',
      };
    } catch (error) {
      this.logger.error(`Erro ao atualizar empresa com CNPJ ${cnpj}:`, error);

      throw new NotFoundException({
        statusCode: 404,
        message: `Erro ao atualizar empresa com CNPJ ${cnpj}. Detalhes: ${error.message}`,
        error: 'Not Found',
      });
    }
  }

  async excluir(cnpj: string): Promise<{ message: string; status: string }> {
    try {
      const empresa = await this.encontrarEmpresaPorCnpj(cnpj);
      await this.empresaRepository.remove(empresa);

      return {
        message: `Empresa com CNPJ ${empresa.cnpj} foi excluída com sucesso.`,
        status: 'success',
      };
    } catch (error) {
      this.logger.error(`Erro ao excluir empresa com CNPJ ${cnpj}:`, error);

      throw new NotFoundException({
        statusCode: 404,
        message: `Erro ao excluir empresa com CNPJ ${cnpj}. Detalhes: ${error.message}`,
        error: 'Not Found',
      });
    }
  }

  async encontrarEmpresaPorCnpj(cnpj: string): Promise<Empresa> {
    try {
      const empresa = await this.empresaRepository.findOne({
        where: { cnpj: cnpj },
      });

      if (!empresa) {
        this.logger.warn(`Empresa com CNPJ ${cnpj} não encontrada.`);
        throw new NotFoundException({
          statusCode: 404,
          message: `Empresa com CNPJ ${cnpj} não encontrada.`,
          error: 'Not Found',
        });
      }

      return this.mapearRespostaEncontrarEmpresaCnpj(empresa);
    } catch (error) {
      this.logger.error(`Erro ao buscar empresa com CNPJ ${cnpj}:`, error);
      throw error;
    }
  }

  private mapearRespostaEncontrarEmpresaCnpj(empresa: Empresa) {
    return {
      id: empresa.id,
      cnpj: empresa.cnpj,
      nome: empresa.nome,
      nomeFantasia: empresa.nomeFantasia,
      endereco: empresa.endereco,
      criadoEm: empresa.criadoEm,
      alteradoEm: empresa.alteradoEm,
    };
  }
}
