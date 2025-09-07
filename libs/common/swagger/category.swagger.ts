import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto';

// Reusable response schemas
const CategorySuccessResponse = {
  success: true,
  message: 'Operation completed successfully',
  data: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Electronics',
    slug: 'electronics',
    createdAt: '2024-09-07T10:30:00.000Z',
    updatedAt: '2024-09-07T10:30:00.000Z',
  },
  metadata: {
    timestamp: '2024-09-07T10:30:00.000Z',
    version: 'v1',
  },
};

const CategoryListResponse = {
  success: true,
  message: 'Categories retrieved successfully',
  data: [CategorySuccessResponse.data],
  metadata: CategorySuccessResponse.metadata,
};

const ErrorResponse = {
  success: false,
  message: 'Operation failed',
  metadata: {
    timestamp: '2024-09-07T10:30:00.000Z',
    version: 'v1',
  },
};

const ValidationErrorResponse = {
  success: false,
  message: 'Validation failed',
  data: {
    errors: [
      {
        field: 'name',
        message: 'Name is required',
        value: '',
      },
    ],
  },
  metadata: ErrorResponse.metadata,
};

// Swagger Decorators for Category Operations
export const CategorySwaggerDecorators = {
  // Create Category
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a new category',
        description: `
        Creates a new product category in the system.
        
        **Features:**
        - Auto-generates slug if not provided
        - Validates unique slug constraint
        - Returns standardized API response
        - Supports transaction rollback on failure
        
        **Business Rules:**
        - Category name must be unique
        - Slug is auto-generated from name if not provided
        - Maximum 255 characters for name and slug
        `,
        tags: ['Category Management'],
      }),
      ApiBody({
        description: 'Category creation payload',
        type: CreateCategoryDto,
        examples: {
          electronics: {
            summary: 'Electronics Category',
            description: 'Example of creating an electronics category',
            value: {
              name: 'Electronics',
              slug: 'electronics',
            },
          },
          clothing: {
            summary: 'Clothing Category',
            description: 'Example with auto-generated slug',
            value: {
              name: 'Clothing & Fashion',
            },
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Category created successfully',
        schema: { example: CategorySuccessResponse },
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error or business rule violation',
        schema: { example: ValidationErrorResponse },
      }),
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Category with same name or slug already exists',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Category with this name already exists',
          },
        },
      }),
    ),

  // Get All Categories
  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve all categories',
        description: `
        Fetches all categories in the system with pagination support.
        
        **Features:**
        - Returns all active categories
        - Includes metadata (creation/update timestamps)
        - Supports future pagination
        - Optimized database queries
        
        **Performance:**
        - Cached responses for better performance
        - Indexed queries for fast retrieval
        - Lightweight response payload
        `,
        tags: ['Category Management'],
      }),
      ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination (future feature)',
        example: 1,
      }),
      ApiQuery({
        name: 'limit',
        required: false,
        description: 'Items per page (future feature)',
        example: 10,
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Categories retrieved successfully',
        schema: { example: CategoryListResponse },
      }),
      ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Server error occurred',
        schema: { example: ErrorResponse },
      }),
    ),

  // Find by ID
  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get category by ID',
        description: `
        Retrieves a specific category by its unique identifier.
        
        **Features:**
        - UUID-based lookup
        - Returns full category details
        - Includes related items count (future)
        - Standardized error handling
        
        **Use Cases:**
        - Category detail pages
        - Admin category management
        - API integrations
        `,
        tags: ['Category Management'],
      }),
      ApiParam({
        name: 'id',
        description: 'Category unique identifier (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
        schema: {
          type: 'string',
          format: 'uuid',
        },
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Category found and returned',
        schema: { example: CategorySuccessResponse },
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Category not found',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Category not found',
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid UUID format',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Invalid category ID format',
          },
        },
      }),
    ),

  // Find by Slug
  FindBySlug: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get category by slug',
        description: `
        Retrieves a category using its SEO-friendly slug identifier.
        
        **Features:**
        - URL-friendly lookups
        - SEO optimized
        - Case-insensitive search
        - Perfect for web applications
        
        **Use Cases:**
        - Category pages (/categories/electronics)
        - SEO-friendly URLs
        - Frontend routing
        `,
        tags: ['Category Management'],
      }),
      ApiParam({
        name: 'slug',
        description: 'Category URL-friendly identifier',
        example: 'electronics',
        schema: {
          type: 'string',
          pattern: '^[a-z0-9-]+$',
        },
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Category found by slug',
        schema: { example: CategorySuccessResponse },
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Category with specified slug not found',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Category not found',
          },
        },
      }),
    ),

  // Update Category
  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update an existing category',
        description: `
        Updates category information with partial data support.
        
        **Features:**
        - Partial updates supported
        - Automatic slug regeneration
        - Validation on all fields
        - Optimistic locking (future)
        
        **Business Rules:**
        - Name uniqueness validation
        - Slug auto-update when name changes
        - Audit trail maintenance
        `,
        tags: ['Category Management'],
      }),
      ApiParam({
        name: 'id',
        description: 'Category unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiBody({
        description: 'Category update payload',
        type: UpdateCategoryDto,
        examples: {
          nameOnly: {
            summary: 'Update Name Only',
            description: 'Update just the category name',
            value: {
              name: 'Electronics & Gadgets',
            },
          },
          nameAndSlug: {
            summary: 'Update Name and Slug',
            description: 'Update both name and slug',
            value: {
              name: 'Home & Garden',
              slug: 'home-garden',
            },
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Category updated successfully',
        schema: { example: CategorySuccessResponse },
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Category not found',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Category not found',
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error',
        schema: { example: ValidationErrorResponse },
      }),
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Name or slug conflict',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Category with this name already exists',
          },
        },
      }),
    ),

  // Delete Category
  Delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete a category',
        description: `
        Permanently removes a category from the system.
        
        **⚠️ Warning:**
        - This action is irreversible
        - Associated items will be orphaned
        - Use soft delete in production
        
        **Safety Features:**
        - Cascade delete prevention
        - Associated items check
        - Admin-only operation (future)
        `,
        tags: ['Category Management'],
      }),
      ApiParam({
        name: 'id',
        description: 'Category unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Category deleted successfully',
        schema: {
          example: {
            success: true,
            message: 'Category deleted successfully',
            metadata: {
              timestamp: '2024-09-07T10:30:00.000Z',
              version: 'v1',
            },
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Category not found',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Category not found',
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Cannot delete category with associated items',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Cannot delete category with existing items',
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
        Returns the health status of the Category Service.
        
        **Monitoring:**
        - Database connectivity
        - Service availability
        - Performance metrics
        - Dependency status
        `,
        tags: ['Health & Monitoring'],
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Service is healthy',
        schema: {
          example: 'Category Service is running!',
        },
      }),
    ),
};
