import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { CreateItemDto, UpdateItemDto } from '../../../../../libs/dto';

@Controller('api/items')
export class ItemsGatewayController {
  private readonly itemServiceUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.itemServiceUrl = `http://localhost:${process.env.ITEM_SERVICE_PORT || 4002}`;
  }

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(`${this.itemServiceUrl}/items`, createItemDto),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get()
  async findAll() {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${this.itemServiceUrl}/items`),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${this.itemServiceUrl}/items/slug/${slug}`),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(
          `${this.itemServiceUrl}/items/category/${categoryId}`,
        ),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${this.itemServiceUrl}/items/${id}`),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.patch(
          `${this.itemServiceUrl}/items/${id}`,
          updateItemDto,
        ),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.delete(`${this.itemServiceUrl}/items/${id}`),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.response) {
      throw new HttpException(
        error.response.data,
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (error.request) {
      throw new HttpException(
        'Item service is unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
