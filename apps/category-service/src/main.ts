import { NestFactory } from '@nestjs/core';
import { CategoryServiceModule } from './category-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CategoryServiceModule);
  await app.listen(process.env.CATEGORY_SERVICE_PORT ?? 4001);
}
bootstrap().catch(console.error);
