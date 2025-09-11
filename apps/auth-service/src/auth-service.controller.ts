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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
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

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation errors',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - email already exists',
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ApiResponseType<AuthResponseDto>> {
    const result = await this.authService.register(registerDto);
    return ResponseHelper.success('User registered successfully', result);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ApiResponseType<AuthResponseDto>> {
    const result = await this.authService.login(loginDto);
    return ResponseHelper.success('Login successful', result);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid refresh token',
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ApiResponseType<AuthResponseDto>> {
    const result = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return ResponseHelper.success('Token refreshed successfully', result);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid token',
  })
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<ApiResponseType<UserProfileDto>> {
    const profile = await this.authService.getProfile(req.user.id);
    return ResponseHelper.success('Profile retrieved successfully', profile);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user (invalidate tokens)' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid token',
  })
  async logout(
    @Request() req: AuthenticatedRequest,
  ): Promise<ApiResponseType<null>> {
    await this.authService.logout(req.user.id);
    return ResponseHelper.success('Logged out successfully', null);
  }
}
