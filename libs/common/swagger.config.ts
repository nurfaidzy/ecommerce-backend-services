import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
  tag?: string;
  path?: string;
}

export class SwaggerConfigService {
  static setupSwagger(
    app: INestApplication,
    config: SwaggerConfig,
  ): OpenAPIObject {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(config.title)
      .setDescription(config.description)
      .setVersion(config.version)
      .addTag(config.tag || 'API')
      .addBearerAuth() // For future authentication
      .addServer('http://localhost:4000', 'API Gateway (Development)')
      .addServer('http://localhost:4001', 'Category Service (Development)')
      .addServer('http://localhost:4002', 'Item Service (Development)')
      .setContact(
        'E-commerce Backend Team',
        'https://github.com/your-org/ecommerce-backend',
        'support@ecommerce.com',
      )
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    });

    const path = config.path || '/api-docs';
    SwaggerModule.setup(path, app, document, {
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #3b82f6 }
      `,
      customSiteTitle: config.title,
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true,
      },
    });

    return document;
  }

  static getApiTags() {
    return {
      CATEGORIES: 'Categories',
      ITEMS: 'Items',
      HEALTH: 'Health',
      API_GATEWAY: 'API Gateway',
    };
  }
}
