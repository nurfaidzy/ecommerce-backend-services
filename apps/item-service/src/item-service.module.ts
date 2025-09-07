import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ItemServiceController } from './item-service.controller';
import { ItemServiceService } from './item-service.service';
import { Category, Item } from '../../../libs/common/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'ecommerce_db'),
        entities: [Category, Item],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    TypeOrmModule.forFeature([Item, Category]),
  ],
  controllers: [ItemServiceController],
  providers: [ItemServiceService],
})
export class ItemServiceModule {}
