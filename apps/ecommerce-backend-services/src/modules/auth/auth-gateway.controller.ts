import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
} from '../../../../../libs/dto/auth.dto';
import { AuthSwaggerDecorators } from '../../../../../libs/common/swagger/auth.swagger';

@Controller('api/auth')
export class AuthGatewayController {
  private readonly authServiceUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.authServiceUrl = `http://localhost:${process.env.AUTH_SERVICE_PORT || 4003}`;
  }

  @AuthSwaggerDecorators.Register()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}/auth/register`,
          registerDto,
        ),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  @AuthSwaggerDecorators.Login()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/login`, loginDto),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  @AuthSwaggerDecorators.RefreshToken()
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}/auth/refresh`,
          refreshTokenDto,
        ),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  @AuthSwaggerDecorators.GetProfile()
  @Get('profile')
  async getProfile(@Headers('authorization') authorization?: string) {
    try {
      const headers: Record<string, string> = {};
      if (authorization) {
        headers['authorization'] = authorization;
      }

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/auth/profile`, {
          headers,
        }),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  @AuthSwaggerDecorators.Logout()
  @Post('logout')
  async logout(@Headers('authorization') authorization?: string) {
    try {
      const headers: Record<string, string> = {};
      if (authorization) {
        headers['authorization'] = authorization;
      }

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}/auth/logout`,
          {},
          {
            headers,
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new HttpException(
        error.response.data || 'Auth service error',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new HttpException(
        'Auth service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
