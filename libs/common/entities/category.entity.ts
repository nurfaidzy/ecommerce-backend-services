import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Item } from './item.entity';

@Entity('categories')
@Index(['slug'], { unique: true })
export class Category {
  @ApiProperty({
    description: 'Unique identifier for the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug for the category',
    example: 'electronics',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @ApiProperty({
    description: 'Date when the category was created',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the category was last updated',
    example: '2024-01-16T14:45:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Items belonging to this category',
    isArray: true,
  })
  @OneToMany(() => Item, (item) => item.category)
  items: Item[];
}
