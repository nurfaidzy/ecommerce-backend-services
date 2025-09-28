import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string; // This won't be exposed in API responses

  @ApiProperty({
    description: 'User role',
    example: UserRole.USER,
    enum: UserRole,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @Column({ length: 255, nullable: true })
  name?: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'When the user was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'When the user was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
