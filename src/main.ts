import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const config = new DocumentBuilder()
    .setTitle('Gerenciador de Empresas API')
    .setDescription('Documentação da API para o Gerenciador de Empresas')
    .setVersion('1.0')
    .addTag('empresas')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}

// Para desenvolvimento local
if (require.main === module) {
  bootstrap();
}

// Export para Vercel
export default async (req, res) => {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const config = new DocumentBuilder()
    .setTitle('Gerenciador de Empresas API')
    .setDescription('Documentação da API para o Gerenciador de Empresas')
    .setVersion('1.0')
    .addTag('empresas')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
};
