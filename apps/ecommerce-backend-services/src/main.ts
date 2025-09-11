import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerConfigService } from '../../../libs/common/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Setup Swagger Documentation
  SwaggerConfigService.setupSwagger(app, {
    title: 'E-commerce Backend API',
    description: `
      A comprehensive microservices-based e-commerce backend system.
      
      ## Features
      - Category Management
      - Item Management
      - Standardized API Responses
      - Input Validation
      - Error Handling
      
      ## Architecture
      This API Gateway routes requests to the following microservices:
      - Category Service (Port 4001)
      - Item Service (Port 4002)
    `,
    version: '1.0.0',
    tag: 'E-commerce API',
    path: '/api-docs',
  });

  const port = process.env.API_GATEWAY_PORT ?? 4000;
  await app.listen(port);

  console.log(`🚀 API Gateway running on: http://localhost:${port}`);
  console.log(`📚 Swagger Documentation: http://localhost:${port}/api-docs`);
}

bootstrap().catch(console.error);
