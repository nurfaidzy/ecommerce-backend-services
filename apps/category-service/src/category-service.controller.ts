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
import { ApiTags } from '@nestjs/swagger';
import { CategoryServiceService } from './category-service.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../libs/dto';
import {
  ResponseHelper,
  ApiResponse as ApiResponseType,
} from '../../../libs/common';
import { CategorySwaggerDecorators } from '../../../libs/common/swagger/category.swagger';

@ApiTags('Categories')
@Controller('categories')
@UsePipes(new ValidationPipe({ transform: true }))
export class CategoryServiceController {
  constructor(
    private readonly categoryServiceService: CategoryServiceService,
  ) {}

  @CategorySwaggerDecorators.Create()
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ApiResponseType<any>> {
    const category =
      await this.categoryServiceService.create(createCategoryDto);
    return ResponseHelper.success('Category created successfully', category);
  }

  @CategorySwaggerDecorators.FindAll()
  @Get()
  async findAll(): Promise<ApiResponseType<any[]>> {
    const categories = await this.categoryServiceService.findAll();
    return ResponseHelper.success(
      'Categories retrieved successfully',
      categories,
    );
  }

  @CategorySwaggerDecorators.FindBySlug()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<ApiResponseType<any>> {
    const category = await this.categoryServiceService.findBySlug(slug);
    return ResponseHelper.success('Category found successfully', category);
  }

  @CategorySwaggerDecorators.FindOne()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponseType<any>> {
    const category = await this.categoryServiceService.findOne(id);
    return ResponseHelper.success('Category found successfully', category);
  }

  @CategorySwaggerDecorators.Update()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponseType<any>> {
    const category = await this.categoryServiceService.update(
      id,
      updateCategoryDto,
    );
    return ResponseHelper.success('Category updated successfully', category);
  }

  @CategorySwaggerDecorators.Delete()
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponseType<null>> {
    await this.categoryServiceService.remove(id);
    return ResponseHelper.success('Category deleted successfully');
  }

  @CategorySwaggerDecorators.HealthCheck()
  @Get('health/check')
  getHello(): string {
    return this.categoryServiceService.getHello();
  }
}
