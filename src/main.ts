// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedApp: any = null;

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

  await app.init();
  return app;
}

// Para desenvolvimento local
if (require.main === module) {
  bootstrap().then((app) => {
    const port = process.env.PORT || 3000;
    app.listen(port, '0.0.0.0');
    console.log(`Servidor rodando na porta ${port}`);
  });
}

// Export para Vercel
export default async (req, res) => {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }

  const server = cachedApp.getHttpAdapter().getInstance();
  return server(req, res);
};
