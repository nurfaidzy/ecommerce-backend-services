import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item, Category } from '../../../libs/common/entities';
import { CreateItemDto, UpdateItemDto } from '../../../libs/dto';
import {
  generateSlug,
  generateUniqueSlug,
} from '../../../libs/common/utils/slug.util';

@Injectable()
export class ItemServiceService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const {
      name,
      slug: providedSlug,
      description,
      price,
      categoryId,
    } = createItemDto;

    // Verify category exists
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new BadRequestException(`Category with ID ${categoryId} not found`);
    }

    // Generate slug if not provided
    let slug = providedSlug || generateSlug(name);

    // Check for existing slug and make it unique if necessary
    const existingItem = await this.itemRepository.findOne({ where: { slug } });
    if (existingItem) {
      if (providedSlug) {
        throw new ConflictException(`Item with slug '${slug}' already exists`);
      }
      // Auto-generate unique slug if none was provided
      const existingSlugs = await this.getAllSlugs();
      slug = generateUniqueSlug(slug, existingSlugs);
    }

    const item = this.itemRepository.create({
      name,
      slug,
      description,
      price,
      categoryId,
    });

    return this.itemRepository.save(item);
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find({
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async findBySlug(slug: string): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { slug },
      relations: ['category'],
    });

    if (!item) {
      throw new NotFoundException(`Item with slug '${slug}' not found`);
    }

    return item;
  }

  async findByCategory(categoryId: string): Promise<Item[]> {
    // Verify category exists
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return this.itemRepository.find({
      where: { categoryId },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(id);
    const {
      name,
      slug: providedSlug,
      description,
      price,
      categoryId,
    } = updateItemDto;

    // Verify new category exists if provided
    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new BadRequestException(
          `Category with ID ${categoryId} not found`,
        );
      }
      item.categoryId = categoryId;
    }

    // Handle slug update
    if (name && !providedSlug) {
      // Auto-generate new slug from new name
      const newSlug = generateSlug(name);
      const existingItem = await this.itemRepository.findOne({
        where: { slug: newSlug },
      });
      if (existingItem && existingItem.id !== id) {
        const existingSlugs = await this.getAllSlugs();
        item.slug = generateUniqueSlug(newSlug, existingSlugs);
      } else if (!existingItem) {
        item.slug = newSlug;
      }
    } else if (providedSlug) {
      // Use provided slug if given
      const existingItem = await this.itemRepository.findOne({
        where: { slug: providedSlug },
      });
      if (existingItem && existingItem.id !== id) {
        throw new ConflictException(
          `Item with slug '${providedSlug}' already exists`,
        );
      }
      item.slug = providedSlug;
    }

    // Update other fields
    if (name) item.name = name;
    if (description !== undefined) item.description = description;
    if (price) item.price = price;

    return this.itemRepository.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.itemRepository.remove(item);
  }

  private async getAllSlugs(): Promise<string[]> {
    const items = await this.itemRepository.find({ select: ['slug'] });
    return items.map((item) => item.slug);
  }

  getHello(): string {
    return 'Item Service is running!';
  }
}
