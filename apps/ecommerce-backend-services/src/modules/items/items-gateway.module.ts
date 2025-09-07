import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ItemsGatewayController } from './items-gateway.controller';

@Module({
  imports: [HttpModule],
  controllers: [ItemsGatewayController],
})
export class ItemsGatewayModule {}
