import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  slug?: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  slug?: string;
}

export class CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
