import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import mailConfig from '../mail.config';
import { EmpresaModule } from './empresa/empresa.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mailConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      synchronize: true,
    }),
    EmpresaModule,
    NotificacoesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
