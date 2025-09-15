import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarEmpresaDto {
  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Empresa Teste',
  })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  nome: string;

  @ApiProperty({
    description: 'CNPJ da empresa',
    example: 12345678901,
  })
  @IsNotEmpty({ message: 'O CNPJ é obrigatório.' })
  @IsNumber()
  cnpj: string;

  @ApiProperty({
    description: 'Nome fantasia da empresa',
    example: 'Fantasia Teste',
  })
  @IsNotEmpty({ message: 'O nome fantasia é obrigatório.' })
  @IsString({ message: 'O nome fantasia deve ser uma string.' })
  nomeFantasia: string;

  @ApiProperty({
    description: 'Endereço da empresa (opcional)',
    example: 'Rua Exemplo, 123',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O endereço deve ser uma string.' })
  endereco?: string;
}
