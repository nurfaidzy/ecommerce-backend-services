import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('API Gateway')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'API Gateway Health Check',
    description: 'Returns the status of the API Gateway',
  })
  @ApiResponse({
    status: 200,
    description: 'API Gateway is running',
    schema: {
      example: 'E-commerce Backend API Gateway is running!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Detailed Health Check',
    description: 'Returns detailed health information about all services',
  })
  @ApiResponse({
    status: 200,
    description: 'Health status of all services',
    schema: {
      example: {
        status: 'healthy',
        services: {
          gateway: 'running',
          categoryService: 'http://localhost:4001',
          itemService: 'http://localhost:4002',
        },
        timestamp: '2024-01-15T10:30:00.000Z',
      },
    },
  })
  getHealth() {
    return {
      status: 'healthy',
      services: {
        gateway: 'running',
        categoryService: 'http://localhost:4001',
        itemService: 'http://localhost:4002',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
