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
import { ItemServiceService } from './item-service.service';
import { CreateItemDto, UpdateItemDto } from '../../../libs/dto';
import { ItemSwaggerDecorators } from '../../../libs/common/swagger/item.swagger';

@Controller('items')
@UsePipes(new ValidationPipe({ transform: true }))
export class ItemServiceController {
  constructor(private readonly itemServiceService: ItemServiceService) {}

  @ItemSwaggerDecorators.Create()
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemServiceService.create(createItemDto);
  }

  @ItemSwaggerDecorators.FindAll()
  @Get()
  findAll() {
    return this.itemServiceService.findAll();
  }

  @ItemSwaggerDecorators.FindBySlug()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.itemServiceService.findBySlug(slug);
  }

  @ItemSwaggerDecorators.FindByCategory()
  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.itemServiceService.findByCategory(categoryId);
  }

  @ItemSwaggerDecorators.FindOne()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemServiceService.findOne(id);
  }

  @ItemSwaggerDecorators.Update()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemServiceService.update(id, updateItemDto);
  }

  @ItemSwaggerDecorators.Delete()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemServiceService.remove(id);
  }

  @ItemSwaggerDecorators.HealthCheck()
  @Get('health/check')
  getHello(): string {
    return this.itemServiceService.getHello();
  }
}
