import { NestFactory } from '@nestjs/core';
import { ItemServiceModule } from './item-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ItemServiceModule);
  await app.listen(process.env.ITEM_SERVICE_PORT ?? 4002);
}
bootstrap().catch(console.error);
