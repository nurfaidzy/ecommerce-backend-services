import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../libs/common/entities';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../libs/dto';
import {
  generateSlug,
  generateUniqueSlug,
} from '../../../libs/common/utils/slug.util';

@Injectable()
export class CategoryServiceService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, slug: providedSlug } = createCategoryDto;

    // Generate slug if not provided
    let slug = providedSlug || generateSlug(name);

    // Check for existing slug and make it unique if necessary
    const existingCategory = await this.categoryRepository.findOne({
      where: { slug },
    });
    if (existingCategory) {
      if (providedSlug) {
        throw new ConflictException(
          `Category with slug '${slug}' already exists`,
        );
      }
      // Auto-generate unique slug if none was provided
      const existingSlugs = await this.getAllSlugs();
      slug = generateUniqueSlug(slug, existingSlugs);
    }

    const category = this.categoryRepository.create({
      name,
      slug,
    });

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['items'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    const { name, slug: providedSlug } = updateCategoryDto;

    // Handle slug update
    if (name && !providedSlug) {
      // Auto-generate new slug from new name
      const newSlug = generateSlug(name);
      const existingCategory = await this.categoryRepository.findOne({
        where: { slug: newSlug },
      });
      if (existingCategory && existingCategory.id !== id) {
        const existingSlugs = await this.getAllSlugs();
        category.slug = generateUniqueSlug(newSlug, existingSlugs);
      } else if (!existingCategory) {
        category.slug = newSlug;
      }
    } else if (providedSlug) {
      // Use provided slug if given
      const existingCategory = await this.categoryRepository.findOne({
        where: { slug: providedSlug },
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException(
          `Category with slug '${providedSlug}' already exists`,
        );
      }
      category.slug = providedSlug;
    }

    if (name) {
      category.name = name;
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  private async getAllSlugs(): Promise<string[]> {
    const categories = await this.categoryRepository.find({ select: ['slug'] });
    return categories.map((cat) => cat.slug);
  }

  getHello(): string {
    return 'Category Service is running!';
  }
}
