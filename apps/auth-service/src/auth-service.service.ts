import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../../libs/common/entities/user.entity';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  UserProfileDto,
} from '../../../libs/dto/auth.dto';
import { JwtPayload } from './interfaces/auth.interfaces';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, name, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: role || UserRole.USER,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const tokens = this.generateTokens(savedUser);

    // Store refresh token in Redis (placeholder - you'll implement this)
    this.storeRefreshToken(savedUser.id, tokens.refreshToken);

    return tokens;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Store refresh token in Redis (placeholder - you'll implement this)
    this.storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      // Verify refresh token with proper typing
      const payload: JwtPayload = this.jwtService.verify(refreshToken);

      // Check if token exists in Redis (placeholder - you'll implement this)
      const isValidToken = this.validateRefreshToken(payload.sub, refreshToken);

      if (!isValidToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Find user
      const user = await this.userRepository.findOne({
        where: { id: payload.sub, isActive: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      // Store new refresh token and invalidate old one
      this.storeRefreshToken(user.id, tokens.refreshToken);
      this.invalidateRefreshToken(user.id, refreshToken);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  logout(userId: string): void {
    // Invalidate all refresh tokens for the user in Redis
    this.invalidateAllRefreshTokens(userId);
  }

  private generateTokens(user: User): AuthResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour in seconds
      tokenType: 'Bearer',
    };
  }

  // Redis operations (placeholders - you'll implement these)
  private storeRefreshToken(userId: string, refreshToken: string): void {
    // TODO: Store refresh token in Redis with expiration
    // Example: await this.redisService.setex(`refresh_token:${userId}`, 604800, refreshToken);
    console.log(`Storing refresh token for user ${userId}: ${refreshToken}`);
  }

  private validateRefreshToken(userId: string, refreshToken: string): boolean {
    // TODO: Validate refresh token exists in Redis
    // Example: const storedToken = await this.redisService.get(`refresh_token:${userId}`);
    // return storedToken === refreshToken;
    console.log(`Validating refresh token for user ${userId}: ${refreshToken}`);
    return true; // Temporary - always return true for now
  }

  private invalidateRefreshToken(userId: string, refreshToken: string): void {
    // TODO: Remove specific refresh token from Redis
    // Example: await this.redisService.del(`refresh_token:${userId}`);
    console.log(
      `Invalidating refresh token for user ${userId}: ${refreshToken}`,
    );
  }

  private invalidateAllRefreshTokens(userId: string): void {
    // TODO: Remove all refresh tokens for user from Redis
    // Example: await this.redisService.del(`refresh_token:${userId}`);
    console.log(`Invalidating all refresh tokens for user ${userId}`);
  }
}
