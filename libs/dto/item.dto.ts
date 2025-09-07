import {
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({
    description: 'Name of the item',
    example: 'iPhone 15 Pro',
    minLength: 1,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug for the item',
    example: 'iphone-15-pro',
    minLength: 1,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  slug?: string;

  @ApiProperty({
    description: 'Detailed description of the item',
    example: 'Latest iPhone with titanium design and advanced camera system',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Price of the item in dollars',
    example: 999.99,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'ID of the category this item belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}

export class UpdateItemDto {
  @ApiProperty({
    description: 'Name of the item',
    example: 'iPhone 15 Pro',
    minLength: 1,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @ApiProperty({
    description: 'URL-friendly slug for the item',
    example: 'iphone-15-pro',
    minLength: 1,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  slug?: string;

  @ApiProperty({
    description: 'Detailed description of the item',
    example: 'Latest iPhone with titanium design and advanced camera system',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Price of the item in dollars',
    example: 999.99,
    minimum: 0.01,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @ApiProperty({
    description: 'ID of the category this item belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class ItemResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the item',
    example: 'iPhone 15 Pro',
  })
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug for the item',
    example: 'iphone-15-pro',
  })
  slug: string;

  @ApiProperty({
    description: 'Detailed description of the item',
    example: 'Latest iPhone with titanium design and advanced camera system',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Price of the item in dollars',
    example: 999.99,
  })
  price: number;

  @ApiProperty({
    description: 'ID of the category this item belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Date when the item was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the item was last updated',
    example: '2024-01-16T14:45:00Z',
  })
  updatedAt: Date;
}
