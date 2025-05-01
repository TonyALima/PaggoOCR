import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ApiKeyGuard } from './modules/auth/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Document Processing API')
    .setDescription('API for image upload, OCR processing and LLM integration')
    .setVersion('1.0')
    .addTag('documents')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Validação global
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Configuração do CORS (ajuste conforme necessário)
  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.useGlobalGuards(new ApiKeyGuard());

  await app.listen(3000);
}
bootstrap();
