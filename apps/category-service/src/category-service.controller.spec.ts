import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryServiceController } from './category-service.controller';
import { CategoryServiceService } from './category-service.service';
import { Category } from '../../../libs/common/entities';

describe('CategoryServiceController', () => {
  let categoryServiceController: CategoryServiceController;
  let mockCategoryRepository: Partial<Repository<Category>>;

  beforeEach(async () => {
    // Mock repository
    mockCategoryRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
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
  });

  describe('health check', () => {
    it('should return "Category Service is running!"', () => {
      expect(categoryServiceController.getHello()).toBe(
        'Category Service is running!',
      );
    });
  });

  describe('findAll', () => {
    it('should return a standardized response with categories array', async () => {
      const mockCategories = [
        {
          id: '1',
          name: 'Test Category',
          slug: 'test-category',
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [],
        },
      ];
      mockCategoryRepository.find = jest.fn().mockResolvedValue(mockCategories);

      const result = await categoryServiceController.findAll();
      
      expect(result).toEqual({
        success: true,
        message: 'Categories retrieved successfully',
        data: mockCategories,
        meta: {
          timestamp: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          ) as string,
          version: '1.0.0',
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a standardized response with single category', async () => {
      const mockCategory = {
        id: '1',
        name: 'Test Category',
        slug: 'test-category',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
      };
      mockCategoryRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockCategory);

      const result = await categoryServiceController.findOne('1');
      
      expect(result).toEqual({
        success: true,
        message: 'Category found successfully',
        data: mockCategory,
        meta: {
          timestamp: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          ) as string,
          version: '1.0.0',
        },
      });
    });
  });

  describe('create', () => {
    it('should return a standardized response with created category', async () => {
      const createCategoryDto = {
        name: 'New Category',
      };
      
      const mockCreatedCategory = {
        id: '2',
        name: 'New Category',
        slug: 'new-category',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
      };

      // Mock the service create method
      jest
        .spyOn(categoryServiceController['categoryServiceService'], 'create')
        .mockResolvedValue(mockCreatedCategory);

      const result = await categoryServiceController.create(createCategoryDto);
      
      expect(result).toEqual({
        success: true,
        message: 'Category created successfully',
        data: mockCreatedCategory,
        meta: {
          timestamp: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          ) as string,
          version: '1.0.0',
        },
      });
    });
  });
});
