import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CategoriesGatewayController } from './categories-gateway.controller';

@Module({
  imports: [HttpModule],
  controllers: [CategoriesGatewayController],
})
export class CategoriesGatewayModule {}
