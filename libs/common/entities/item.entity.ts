import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';

@Entity('items')
@Index(['slug'], { unique: true })
export class Item {
  @ApiProperty({
    description: 'Unique identifier for the item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the item',
    example: 'iPhone 15 Pro',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug for the item',
    example: 'iphone-15-pro',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @ApiProperty({
    description: 'Detailed description of the item',
    example: 'Latest iPhone with titanium design and advanced camera system',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Price of the item in dollars',
    example: 999.99,
    type: 'number',
    format: 'decimal',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'ID of the category this item belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column({ name: 'category_id' })
  categoryId: string;

  @ApiProperty({
    description: 'Date when the item was created',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the item was last updated',
    example: '2024-01-16T14:45:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Category information for this item',
    type: () => Category,
  })
  @ManyToOne(() => Category, (category) => category.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
