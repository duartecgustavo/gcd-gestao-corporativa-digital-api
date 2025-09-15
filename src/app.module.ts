import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaModule } from './empresa/empresa.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { ConfigModule } from '@nestjs/config';
import mailConfig from 'mail.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mailConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    EmpresaModule,
    NotificacoesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
