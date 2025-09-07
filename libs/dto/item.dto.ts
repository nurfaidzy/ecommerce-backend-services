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

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class ItemResponseDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
