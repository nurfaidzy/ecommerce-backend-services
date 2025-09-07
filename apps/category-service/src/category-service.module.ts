import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryServiceController } from './category-service.controller';
import { CategoryServiceService } from './category-service.service';
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
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [CategoryServiceController],
  providers: [CategoryServiceService],
})
export class CategoryServiceModule {}
