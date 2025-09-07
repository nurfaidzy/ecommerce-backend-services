import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { CategoryServiceModule } from './category-service.module';
import { SwaggerConfigService } from '../../../libs/common/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(CategoryServiceModule);

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
    title: 'Category Service API',
    description: `
      Category Management Microservice
      
      ## Features
      - Create, read, update, delete categories
      - Category search by ID or slug
      - Input validation and error handling
      - Standardized API responses
      
      ## Usage
      This service manages product categories for the e-commerce platform.
      All endpoints return standardized responses with success/error indicators.
    `,
    version: '1.0.0',
    tag: 'Categories',
    path: '/api-docs',
  });

  const port = process.env.CATEGORY_SERVICE_PORT ?? 4001;
  await app.listen(port);

  console.log(`🏷️  Category Service running on: http://localhost:${port}`);
  console.log(`📚 Swagger Documentation: http://localhost:${port}/api-docs`);
}

bootstrap().catch(console.error);
