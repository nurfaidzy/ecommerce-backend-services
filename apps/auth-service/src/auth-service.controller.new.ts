import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthServiceService } from './auth-service.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  AuthResponseDto,
  UserProfileDto,
} from '../../../libs/dto/auth.dto';
import {
  ResponseHelper,
  ApiResponse as ApiResponseType,
} from '../../../libs/common';
import { AuthSwaggerDecorators } from '../../../libs/common/swagger/auth.swagger';

interface AuthenticatedRequest {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) {}

  @AuthSwaggerDecorators.Register()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ApiResponseType<AuthResponseDto>> {
    const result = await this.authService.register(registerDto);
    return ResponseHelper.success('User registered successfully', result);
  }

  @AuthSwaggerDecorators.Login()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ApiResponseType<AuthResponseDto>> {
    const result = await this.authService.login(loginDto);
    return ResponseHelper.success('Login successful', result);
  }

  @AuthSwaggerDecorators.RefreshToken()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ApiResponseType<{ accessToken: string; refreshToken: string }>> {
    const result = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return ResponseHelper.success('Token refreshed successfully', result);
  }

  @AuthSwaggerDecorators.GetProfile()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<ApiResponseType<UserProfileDto>> {
    const result = await this.authService.getProfile(req.user.id);
    return ResponseHelper.success('Profile retrieved successfully', result);
  }

  @AuthSwaggerDecorators.Logout()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Request() req: AuthenticatedRequest,
  ): Promise<ApiResponseType<null>> {
    await this.authService.logout(req.user.id);
    return ResponseHelper.success('Logout successful', null);
  }
}
