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
import { CreateCategoryDto, UpdateCategoryDto } from '../../../../../libs/dto';

@Controller('api/categories')
export class CategoriesGatewayController {
  private readonly categoryServiceUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.categoryServiceUrl = `http://localhost:${process.env.CATEGORY_SERVICE_PORT || 4001}`;
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.categoryServiceUrl}/categories`,
          createCategoryDto,
        ),
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
        this.httpService.get(`${this.categoryServiceUrl}/categories`),
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
        this.httpService.get(
          `${this.categoryServiceUrl}/categories/slug/${slug}`,
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
        this.httpService.get(`${this.categoryServiceUrl}/categories/${id}`),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.patch(
          `${this.categoryServiceUrl}/categories/${id}`,
          updateCategoryDto,
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
        this.httpService.delete(`${this.categoryServiceUrl}/categories/${id}`),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new HttpException(
        error.response.data,
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new HttpException(
        'Category service is unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
