import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AtualizarEmpresaDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  nome?: string;

  @IsNotEmpty({ message: 'O CNPJ é obrigatório.' })
  @IsNumber()
  cnpj: number;

  @IsOptional()
  @IsString({ message: 'O nome fantasia deve ser uma string.' })
  nomeFantasia?: string;

  @IsOptional()
  @IsString({ message: 'O endereço deve ser uma string.' })
  endereco?: string;
}
