import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
    minLength: 1,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug for the category',
    example: 'electronics',
    minLength: 1,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  slug?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
    minLength: 1,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @ApiProperty({
    description: 'URL-friendly slug for the category',
    example: 'electronics',
    minLength: 1,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  slug?: string;
}

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
  })
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug for the category',
    example: 'electronics',
  })
  slug: string;

  @ApiProperty({
    description: 'Date when the category was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the category was last updated',
    example: '2024-01-16T14:45:00Z',
  })
  updatedAt: Date;
}
