import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Empresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString()
  nome: string;

  @Column({ unique: true })
  @IsNotEmpty({ message: 'O CNPJ é obrigatório.' })
  @IsNumber()
  @Matches(/^\d{14}$/, { message: 'CNPJ deve ter 14 dígitos numéricos.' })
  cnpj: number;

  @Column()
  @IsNotEmpty({ message: 'O nome fantasia é obrigatório.' })
  @IsString()
  nomeFantasia: string;

  @Column()
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  @IsString()
  endereco: string;

  @CreateDateColumn({ type: 'datetime' })
  criadoEm: Date;

  @UpdateDateColumn({ type: 'datetime' })
  alteradoEm: Date;
}
