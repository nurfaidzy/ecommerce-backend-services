import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemServiceController } from './item-service.controller';
import { ItemServiceService } from './item-service.service';
import { Item, Category } from '../../../libs/common/entities';

describe('ItemServiceController', () => {
  let itemServiceController: ItemServiceController;
  let mockItemRepository: Partial<Repository<Item>>;
  let mockCategoryRepository: Partial<Repository<Category>>;

  beforeEach(async () => {
    // Mock repositories
    mockItemRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    mockCategoryRepository = {
      findOne: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ItemServiceController],
      providers: [
        ItemServiceService,
        {
          provide: getRepositoryToken(Item),
          useValue: mockItemRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    itemServiceController = app.get<ItemServiceController>(
      ItemServiceController,
    );
  });

  describe('health check', () => {
    it('should return "Item Service is running!"', () => {
      expect(itemServiceController.getHello()).toBe('Item Service is running!');
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const result = [
        {
          id: '1',
          name: 'Test Item',
          slug: 'test-item',
          description: 'Test description',
          price: 99.99,
          categoryId: 'category-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: 'category-1',
            name: 'Test Category',
            slug: 'test-category',
          },
        },
      ];
      mockItemRepository.find = jest.fn().mockResolvedValue(result);

      expect(await itemServiceController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an item by id', async () => {
      const result = {
        id: '1',
        name: 'Test Item',
        slug: 'test-item',
        description: 'Test description',
        price: 99.99,
        categoryId: 'category-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 'category-1',
          name: 'Test Category',
          slug: 'test-category',
        },
      };
      mockItemRepository.findOne = jest.fn().mockResolvedValue(result);

      expect(await itemServiceController.findOne('1')).toBe(result);
    });
  });
});
