import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ItemServiceModule } from './item-service.module';
import { SwaggerConfigService } from '../../../libs/common/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(ItemServiceModule);

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
    title: 'Item Service API',
    description: `
      Item Management Microservice
      
      ## Features
      - Create, read, update, delete items
      - Item search by ID or slug
      - Category association
      - Price management
      - Input validation and error handling
      - Standardized API responses
      
      ## Usage
      This service manages products/items for the e-commerce platform.
      Items are associated with categories and include pricing information.
    `,
    version: '1.0.0',
    tag: 'Items',
    path: '/api-docs',
  });

  const port = process.env.ITEM_SERVICE_PORT ?? 4002;
  await app.listen(port);

  console.log(`🛍️  Item Service running on: http://localhost:${port}`);
  console.log(`📚 Swagger Documentation: http://localhost:${port}/api-docs`);
}

bootstrap().catch(console.error);
