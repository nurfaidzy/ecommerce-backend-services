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

@Controller('items')
@UsePipes(new ValidationPipe({ transform: true }))
export class ItemServiceController {
  constructor(private readonly itemServiceService: ItemServiceService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemServiceService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemServiceService.findAll();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.itemServiceService.findBySlug(slug);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.itemServiceService.findByCategory(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemServiceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemServiceService.update(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemServiceService.remove(id);
  }

  @Get('health/check')
  getHello(): string {
    return this.itemServiceService.getHello();
  }
}
