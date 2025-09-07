import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CategoryServiceController } from './category-service.controller';
import { CategoryServiceService } from './category-service.service';
import { Category } from '../../../libs/common/entities';
import { CreateCategoryDto, UpdateCategoryDto } from '../../../libs/dto';
import { ResponseHelper } from '../../../libs/common';

describe('CategoryServiceController', () => {
  let categoryServiceController: CategoryServiceController;
  let categoryService: CategoryServiceService;
  let mockCategoryRepository: Partial<Repository<Category>>;

  const mockCategory: Category = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Electronics',
    slug: 'electronics',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    items: [],
  };

  const mockCategories: Category[] = [
    mockCategory,
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Clothing',
      slug: 'clothing',
      createdAt: new Date('2024-01-02T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      items: [],
    },
  ];

  beforeEach(async () => {
    // Mock repository methods
    mockCategoryRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      query: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CategoryServiceController],
      providers: [
        CategoryServiceService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    categoryServiceController = app.get<CategoryServiceController>(
      CategoryServiceController,
    );
    categoryService = app.get<CategoryServiceService>(CategoryServiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    it('should return service status message', () => {
      const result = categoryServiceController.getHello();
      expect(result).toBe('Category Service is running!');
    });
  });

  describe('create', () => {
    it('should create a new category successfully', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'New Electronics',
        slug: 'new-electronics',
      };

      const expectedCategory = { ...mockCategory, ...createCategoryDto };
      jest.spyOn(categoryService, 'create').mockResolvedValue(expectedCategory);

      const result = await categoryServiceController.create(createCategoryDto);

      expect(categoryService.create).toHaveBeenCalledWith(createCategoryDto);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Category created successfully');
      expect(result.data).toEqual(expectedCategory);
      expect(result.metadata.version).toBe('v1');
      expect(result.metadata.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should handle creation with name only (auto-generate slug)', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Auto Slug Category',
      };

      const expectedCategory = {
        ...mockCategory,
        name: 'Auto Slug Category',
        slug: 'auto-slug-category',
      };
      jest.spyOn(categoryService, 'create').mockResolvedValue(expectedCategory);

      const result = await categoryServiceController.create(createCategoryDto);

      expect(result.data?.slug).toBe('auto-slug-category');
      expect(result.success).toBe(true);
    });

    it('should handle service errors during creation', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Duplicate Category',
        slug: 'electronics',
      };

      jest
        .spyOn(categoryService, 'create')
        .mockRejectedValue(
          new ConflictException(
            "Category with slug 'electronics' already exists",
          ),
        );

      await expect(
        categoryServiceController.create(createCategoryDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all categories with standardized response', async () => {
      jest.spyOn(categoryService, 'findAll').mockResolvedValue(mockCategories);

      const result = await categoryServiceController.findAll();

      expect(categoryService.findAll).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Categories retrieved successfully');
      expect(result.data).toEqual(mockCategories);
      expect(result.metadata.version).toBe('v1');
      expect(result.metadata.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should return empty array when no categories exist', async () => {
      jest.spyOn(categoryService, 'findAll').mockResolvedValue([]);

      const result = await categoryServiceController.findAll();

      expect(result.data).toEqual([]);
      expect(result.success).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return a single category by ID', async () => {
      const categoryId = '550e8400-e29b-41d4-a716-446655440000';
      jest.spyOn(categoryService, 'findOne').mockResolvedValue(mockCategory);

      const result = await categoryServiceController.findOne(categoryId);

      expect(categoryService.findOne).toHaveBeenCalledWith(categoryId);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Category found successfully');
      expect(result.data).toEqual(mockCategory);
      expect(result.metadata.version).toBe('v1');
    });

    it('should handle not found error', async () => {
      const categoryId = 'non-existent-id';
      jest
        .spyOn(categoryService, 'findOne')
        .mockRejectedValue(new NotFoundException('Category not found'));

      await expect(
        categoryServiceController.findOne(categoryId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return a category by slug', async () => {
      const slug = 'electronics';
      jest.spyOn(categoryService, 'findBySlug').mockResolvedValue(mockCategory);

      const result = await categoryServiceController.findBySlug(slug);

      expect(categoryService.findBySlug).toHaveBeenCalledWith(slug);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Category found successfully');
      expect(result.data).toEqual(mockCategory);
      expect(result.metadata.version).toBe('v1');
    });

    it('should handle not found error for invalid slug', async () => {
      const slug = 'non-existent-slug';
      jest
        .spyOn(categoryService, 'findBySlug')
        .mockRejectedValue(new NotFoundException('Category not found'));

      await expect(
        categoryServiceController.findBySlug(slug),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a category successfully', async () => {
      const categoryId = '550e8400-e29b-41d4-a716-446655440000';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Electronics',
      };

      const updatedCategory = {
        ...mockCategory,
        name: 'Updated Electronics',
        updatedAt: new Date(),
      };

      jest.spyOn(categoryService, 'update').mockResolvedValue(updatedCategory);

      const result = await categoryServiceController.update(
        categoryId,
        updateCategoryDto,
      );

      expect(categoryService.update).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe('Category updated successfully');
      expect(result.data).toEqual(updatedCategory);
      expect(result.metadata.version).toBe('v1');
    });

    it('should handle partial updates', async () => {
      const categoryId = '550e8400-e29b-41d4-a716-446655440000';
      const updateCategoryDto: UpdateCategoryDto = {
        slug: 'updated-electronics',
      };

      const updatedCategory = {
        ...mockCategory,
        slug: 'updated-electronics',
        updatedAt: new Date(),
      };

      jest.spyOn(categoryService, 'update').mockResolvedValue(updatedCategory);

      const result = await categoryServiceController.update(
        categoryId,
        updateCategoryDto,
      );

      expect(result.data?.slug).toBe('updated-electronics');
      expect(result.success).toBe(true);
    });

    it('should handle update errors', async () => {
      const categoryId = 'non-existent-id';
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Name',
      };

      jest
        .spyOn(categoryService, 'update')
        .mockRejectedValue(new NotFoundException('Category not found'));

      await expect(
        categoryServiceController.update(categoryId, updateCategoryDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a category successfully', async () => {
      const categoryId = '550e8400-e29b-41d4-a716-446655440000';
      jest.spyOn(categoryService, 'remove').mockResolvedValue(undefined);

      const result = await categoryServiceController.remove(categoryId);

      expect(categoryService.remove).toHaveBeenCalledWith(categoryId);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Category deleted successfully');
      expect(result.data).toBeUndefined();
      expect(result.metadata.version).toBe('v1');
    });

    it('should handle deletion of non-existent category', async () => {
      const categoryId = 'non-existent-id';
      jest
        .spyOn(categoryService, 'remove')
        .mockRejectedValue(new NotFoundException('Category not found'));

      await expect(
        categoryServiceController.remove(categoryId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Response Helper Integration', () => {
    it('should use ResponseHelper for consistent response structure', async () => {
      jest.spyOn(categoryService, 'findAll').mockResolvedValue(mockCategories);

      const result = await categoryServiceController.findAll();

      // Verify the response follows the standardized format
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('metadata');
      expect(result.metadata).toHaveProperty('timestamp');
      expect(result.metadata).toHaveProperty('version');
    });

    it('should handle undefined data correctly', async () => {
      const categoryId = '550e8400-e29b-41d4-a716-446655440000';
      jest.spyOn(categoryService, 'remove').mockResolvedValue(undefined);

      const result = await categoryServiceController.remove(categoryId);

      expect(result.data).toBeUndefined();
      expect(result.success).toBe(true);
    });
  });

  describe('Validation and Error Handling', () => {
    it('should handle service layer exceptions properly', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };

      // Simulate a database connection error
      jest
        .spyOn(categoryService, 'create')
        .mockRejectedValue(new Error('Database connection failed'));

      await expect(
        categoryServiceController.create(createCategoryDto),
      ).rejects.toThrow('Database connection failed');
    });

    it('should preserve error types from service layer', async () => {
      const categoryId = 'invalid-uuid';
      jest
        .spyOn(categoryService, 'findOne')
        .mockRejectedValue(new NotFoundException('Invalid category ID format'));

      await expect(
        categoryServiceController.findOne(categoryId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
