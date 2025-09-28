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
import { RedisService } from './redis.service';

@Injectable()
export class AuthServiceService {
  private readonly REFRESH_TOKEN_PREFIX = 'refresh_token:';
  private readonly REFRESH_TOKEN_TTL = 604800; // 7 days in seconds

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
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
    void this.storeRefreshToken(savedUser.id, tokens.refreshToken);

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
    void this.storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      // Verify refresh token with proper typing
      const payload: JwtPayload = this.jwtService.verify(refreshToken);

      // Check if token exists in Redis
      const isValidToken = await this.validateRefreshToken(
        payload.sub,
        refreshToken,
      );

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
      await this.storeRefreshToken(user.id, tokens.refreshToken);
      await this.invalidateRefreshToken(user.id);

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

  async logout(userId: string): Promise<void> {
    // Invalidate all refresh tokens for the user in Redis
    await this.invalidateAllRefreshTokens(userId);
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
  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${userId}`;
    await this.redisService.setWithExpiry(
      key,
      refreshToken,
      this.REFRESH_TOKEN_TTL,
    );
  }

  private async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${userId}`;
    const storedToken = await this.redisService.get(key);
    return storedToken === refreshToken;
  }

  private async invalidateRefreshToken(userId: string): Promise<void> {
    const key = `${this.REFRESH_TOKEN_PREFIX}${userId}`;
    await this.redisService.delete(key);
  }

  private async invalidateAllRefreshTokens(userId: string): Promise<void> {
    const pattern = `${this.REFRESH_TOKEN_PREFIX}${userId}*`;
    await this.redisService.deletePattern(pattern);
  }
}
