import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Category, Item } from '../../../libs/common/entities';
import { CategoriesGatewayModule } from './modules/categories/categories-gateway.module';
import { ItemsGatewayModule } from './modules/items/items-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'ecommerce_db',
      entities: [Category, Item],
      synchronize: process.env.NODE_ENV !== 'production', // Only for development
      logging: process.env.NODE_ENV === 'development',
    }),
    CategoriesGatewayModule,
    ItemsGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
