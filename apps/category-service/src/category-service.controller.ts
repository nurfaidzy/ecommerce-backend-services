import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { CategoryServiceService } from './category-service.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../libs/dto';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    timestamp: string;
    version: string;
  };
}

class ResponseHelper {
  static success<T>(
    data: T,
    message: string = 'Operation successful',
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }

  static successList<T>(
    data: T[],
    message: string = 'Data retrieved successfully',
  ): ApiResponse<T[]> {
    return {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }
}

@Controller('categories')
@UsePipes(new ValidationPipe({ transform: true }))
export class CategoryServiceController {
  constructor(
    private readonly categoryServiceService: CategoryServiceService,
  ) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category =
      await this.categoryServiceService.create(createCategoryDto);
    return ResponseHelper.success(category, 'Category created successfully');
  }

  @Get()
  async findAll() {
    const categories = await this.categoryServiceService.findAll();
    return ResponseHelper.successList(
      categories,
      'Categories retrieved successfully',
    );
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const category = await this.categoryServiceService.findBySlug(slug);
    return ResponseHelper.success(category, 'Category found successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryServiceService.findOne(id);
    return ResponseHelper.success(category, 'Category found successfully');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryServiceService.update(
      id,
      updateCategoryDto,
    );
    return ResponseHelper.success(category, 'Category updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoryServiceService.remove(id);
    return ResponseHelper.success(null, 'Category deleted successfully');
  }

  @Get('health/check')
  getHello(): string {
    return this.categoryServiceService.getHello();
  }
}
