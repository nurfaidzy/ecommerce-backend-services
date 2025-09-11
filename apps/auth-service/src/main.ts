import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AuthServiceModule } from './auth-service.module';
import { SwaggerConfigService } from '../../../libs/common/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Setup Swagger Documentation
  SwaggerConfigService.setupSwagger(app, {
    title: 'Authentication Service API',
    description: `
      Authentication and Authorization Microservice
      
      ## Features
      - User registration and login
      - JWT-based authentication with refresh tokens
      - Role-based access control (RBAC)
      - Redis-based token management
      - Secure password hashing with bcrypt
      - Session management and logout
      
      ## Security
      - Access tokens: 1 hour expiry
      - Refresh tokens: 7 days expiry (stored in Redis)
      - Password requirements: minimum 8 characters
      - Automatic token rotation on refresh
      - Complete session invalidation on logout
      
      ## Usage
      1. Register or login to get tokens
      2. Use access token in Authorization header: Bearer <token>
      3. Refresh tokens before expiry
      4. Logout to invalidate all sessions
    `,
    version: '1.0.0',
    tag: 'Authentication',
    path: '/api-docs',
  });

  const port = process.env.AUTH_SERVICE_PORT || 4003;
  await app.listen(port);

  console.log(`🚀 Auth Service is running on: http://localhost:${port}`);
  console.log(
    `📖 Swagger docs available at: http://localhost:${port}/api/docs`,
  );
}
void bootstrap();
