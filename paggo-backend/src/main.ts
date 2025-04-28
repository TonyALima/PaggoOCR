import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Document Processing API')
    .setDescription('API for image upload, OCR processing and LLM integration')
    .setVersion('1.0')
    .addTag('documents')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Validação global
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Configuração do CORS (ajuste conforme necessário)
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
