import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateItemDto, UpdateItemDto } from '../../dto';

// Reusable response schemas
const ItemSuccessResponse = {
  success: true,
  message: 'Operation completed successfully',
  data: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    description:
      'Latest iPhone with titanium design and advanced camera system',
    price: 999.99,
    categoryId: '550e8400-e29b-41d4-a716-446655440000',
    createdAt: '2024-09-07T10:30:00.000Z',
    updatedAt: '2024-09-07T10:30:00.000Z',
  },
  metadata: {
    timestamp: '2024-09-07T10:30:00.000Z',
    version: 'v1',
  },
};

const ItemListResponse = {
  success: true,
  message: 'Items retrieved successfully',
  data: [ItemSuccessResponse.data],
  metadata: ItemSuccessResponse.metadata,
};

const ErrorResponse = {
  success: false,
  message: 'Operation failed',
  metadata: {
    timestamp: '2024-09-07T10:30:00.000Z',
    version: 'v1',
  },
};

// Swagger Decorators for Item Operations
export const ItemSwaggerDecorators = {
  // Create Item
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a new item/product',
        description: `
        Creates a new product item in the e-commerce catalog.
        
        **Features:**
        - Auto-generates slug from name if not provided
        - Price validation (must be positive)
        - Category association required
        - Rich product descriptions supported
        
        **Business Rules:**
        - Item name must be unique within category
        - Price must be greater than 0
        - Category must exist
        - Slug auto-generated if not provided
        `,
        tags: ['Product Management'],
      }),
      ApiBody({
        description: 'Item creation payload',
        type: CreateItemDto,
        examples: {
          smartphone: {
            summary: 'Smartphone Product',
            description: 'Example of creating a smartphone product',
            value: {
              name: 'iPhone 15 Pro',
              slug: 'iphone-15-pro',
              description: 'Latest iPhone with titanium design',
              price: 999.99,
              categoryId: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
          laptop: {
            summary: 'Laptop Product',
            description: 'Example with auto-generated slug',
            value: {
              name: 'MacBook Pro 16"',
              description: 'Professional laptop for developers',
              price: 2499.99,
              categoryId: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Item created successfully',
        schema: { example: ItemSuccessResponse },
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error',
        schema: {
          example: {
            success: false,
            message: 'Validation failed',
            data: {
              errors: [
                {
                  field: 'price',
                  message: 'Price must be a positive number',
                  value: -10,
                },
              ],
            },
            metadata: ErrorResponse.metadata,
          },
        },
      }),
    ),

  // Find All Items
  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve all items',
        description: `
        Fetches all items with optional filtering and pagination.
        
        **Features:**
        - Pagination support
        - Category filtering
        - Price range filtering
        - Search by name
        - Sorting options
        `,
        tags: ['Product Management'],
      }),
      ApiQuery({
        name: 'category',
        required: false,
        description: 'Filter by category ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiQuery({
        name: 'minPrice',
        required: false,
        description: 'Minimum price filter',
        example: 100,
      }),
      ApiQuery({
        name: 'maxPrice',
        required: false,
        description: 'Maximum price filter',
        example: 1000,
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Items retrieved successfully',
        schema: { example: ItemListResponse },
      }),
    ),

  // Find by Slug
  FindBySlug: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get item by slug',
        description: `
        Retrieves an item using its SEO-friendly slug identifier.
        
        **Features:**
        - URL-friendly lookups
        - SEO optimized
        - Perfect for product pages
        `,
        tags: ['Product Management'],
      }),
      ApiParam({
        name: 'slug',
        description: 'Item URL-friendly identifier',
        example: 'iphone-15-pro',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Item found by slug',
        schema: { example: ItemSuccessResponse },
      }),
    ),

  // Find by Category
  FindByCategory: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get items by category',
        description: `
        Retrieves all items belonging to a specific category.
        
        **Use Cases:**
        - Category product listings
        - E-commerce category pages
        - Inventory management
        `,
        tags: ['Product Management'],
      }),
      ApiParam({
        name: 'categoryId',
        description: 'Category unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Items found for category',
        schema: { example: ItemListResponse },
      }),
    ),

  // Find One
  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get item by ID',
        description: `
        Retrieves a specific item by its unique identifier.
        
        **Features:**
        - UUID-based lookup
        - Returns full item details
        - Includes category information
        `,
        tags: ['Product Management'],
      }),
      ApiParam({
        name: 'id',
        description: 'Item unique identifier (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440001',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Item found and returned',
        schema: { example: ItemSuccessResponse },
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Item not found',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Item not found',
          },
        },
      }),
    ),

  // Update Item
  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update an existing item',
        description: `
        Updates item information with partial data support.
        
        **Features:**
        - Partial updates supported
        - Price validation
        - Category validation
        - Slug auto-update
        `,
        tags: ['Product Management'],
      }),
      ApiParam({
        name: 'id',
        description: 'Item unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440001',
      }),
      ApiBody({
        description: 'Item update payload',
        type: UpdateItemDto,
        examples: {
          priceUpdate: {
            summary: 'Update Price Only',
            description: 'Update just the item price',
            value: {
              price: 899.99,
            },
          },
          fullUpdate: {
            summary: 'Update Multiple Fields',
            description: 'Update name, description, and price',
            value: {
              name: 'iPhone 15 Pro Max',
              description: 'Latest iPhone with enhanced features',
              price: 1199.99,
            },
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Item updated successfully',
        schema: { example: ItemSuccessResponse },
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Item not found',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Item not found',
          },
        },
      }),
    ),

  // Delete Item
  Delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete an item',
        description: `
        Permanently removes an item from the catalog.
        
        **⚠️ Warning:**
        - This action is irreversible
        - Consider soft delete for production
        `,
        tags: ['Product Management'],
      }),
      ApiParam({
        name: 'id',
        description: 'Item unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440001',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Item deleted successfully',
        schema: {
          example: {
            success: true,
            message: 'Item deleted successfully',
            metadata: {
              timestamp: '2024-09-07T10:30:00.000Z',
              version: 'v1',
            },
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Item not found',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Item not found',
          },
        },
      }),
    ),

  // Health Check
  HealthCheck: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Service health check',
        description: `
        Returns the health status of the Item Service.
        `,
        tags: ['Health & Monitoring'],
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Service is healthy',
        schema: {
          example: 'Item Service is running!',
        },
      }),
    ),
};
