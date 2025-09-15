import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacoesModule } from 'src/notificacoes/notificacoes.module';
import { EmpresaController } from './empresa.controller';
import { Empresa } from './empresa.entity';
import { EmpresaService } from './empresa.service';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa]), NotificacoesModule],
  controllers: [EmpresaController],
  providers: [EmpresaService],
  exports: [EmpresaService],
})
export class EmpresaModule {}
