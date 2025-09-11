import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RegisterDto, LoginDto, RefreshTokenDto } from '../../dto/auth.dto';

// Reusable response schemas
const AuthSuccessResponse = {
  success: true,
  message: 'Authentication successful',
  data: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      name: 'John Doe',
      role: 'user',
      isActive: true,
      createdAt: '2024-09-07T10:30:00.000Z',
      updatedAt: '2024-09-07T10:30:00.000Z',
    },
  },
  metadata: {
    timestamp: '2024-09-07T10:30:00.000Z',
    version: 'v1',
  },
};

const UserProfileResponse = {
  success: true,
  message: 'Profile retrieved successfully',
  data: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user',
    isActive: true,
    createdAt: '2024-09-07T10:30:00.000Z',
    updatedAt: '2024-09-07T10:30:00.000Z',
  },
  metadata: {
    timestamp: '2024-09-07T10:30:00.000Z',
    version: 'v1',
  },
};

const TokenRefreshResponse = {
  success: true,
  message: 'Token refreshed successfully',
  data: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
  metadata: {
    timestamp: '2024-09-07T10:30:00.000Z',
    version: 'v1',
  },
};

const LogoutSuccessResponse = {
  success: true,
  message: 'Logout successful',
  data: null,
  metadata: {
    timestamp: '2024-09-07T10:30:00.000Z',
    version: 'v1',
  },
};

const ErrorResponse = {
  success: false,
  message: 'Operation failed',
  metadata: {
    timestamp: '2024-09-07T10:30:00.000Z',
    version: 'v1',
  },
};

const ValidationErrorResponse = {
  success: false,
  message: 'Validation failed',
  data: {
    errors: [
      {
        field: 'email',
        message: 'Email must be a valid email address',
        value: 'invalid-email',
      },
      {
        field: 'password',
        message: 'Password must be at least 8 characters long',
        value: '',
      },
    ],
  },
  metadata: ErrorResponse.metadata,
};

const UnauthorizedResponse = {
  success: false,
  message: 'Invalid credentials',
  metadata: ErrorResponse.metadata,
};

const ConflictResponse = {
  success: false,
  message: 'User with this email already exists',
  metadata: ErrorResponse.metadata,
};

// Swagger Decorators for Auth Operations
export const AuthSwaggerDecorators = {
  // Register User
  Register: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Register a new user',
        description: `
        Creates a new user account in the system.
        
        **Features:**
        - Email validation and uniqueness check
        - Password hashing with bcrypt (12 rounds)
        - JWT token generation (access + refresh)
        - Refresh token stored in Redis with 7-day TTL
        - Role-based access control support
        
        **Security:**
        - Passwords are never stored in plain text
        - Refresh tokens are securely stored in Redis
        - JWT tokens include user roles for authorization
        - Rate limiting applied (future feature)
        
        **Business Rules:**
        - Email must be unique across the system
        - Password must meet security requirements
        - Default role is 'user' unless specified
        - Account is active by default
        `,
        tags: ['User Management'],
      }),
      ApiBody({
        description: 'User registration payload',
        type: RegisterDto,
        examples: {
          regularUser: {
            summary: 'Regular User Registration',
            description: 'Standard user account creation',
            value: {
              email: 'john.doe@example.com',
              password: 'SecurePassword123!',
              name: 'John Doe',
              role: 'user',
            },
          },
          adminUser: {
            summary: 'Admin User Registration',
            description: 'Admin account creation (requires permissions)',
            value: {
              email: 'admin@example.com',
              password: 'AdminPassword123!',
              name: 'System Administrator',
              role: 'admin',
            },
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User registered successfully',
        schema: { example: AuthSuccessResponse },
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error',
        schema: { example: ValidationErrorResponse },
      }),
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'User with this email already exists',
        schema: { example: ConflictResponse },
      }),
    ),

  // Login User
  Login: () =>
    applyDecorators(
      ApiOperation({
        summary: 'User login',
        description: `
        Authenticates a user and returns JWT tokens.
        
        **Authentication Flow:**
        1. Validates email and password
        2. Generates JWT access token (1 hour expiry)
        3. Generates refresh token (7 days expiry)
        4. Stores refresh token in Redis
        5. Returns both tokens to client
        
        **Token Management:**
        - Access Token: Short-lived, contains user info + permissions
        - Refresh Token: Long-lived, stored in Redis for security
        - Automatic token rotation on refresh
        - Secure logout invalidates all tokens
        
        **Security Features:**
        - Password verification with bcrypt
        - Brute force protection (future feature)
        - Session management via Redis
        - Audit logging (future feature)
        `,
        tags: ['User Authentication'],
      }),
      ApiBody({
        description: 'User login credentials',
        type: LoginDto,
        examples: {
          userLogin: {
            summary: 'User Login',
            description: 'Standard user authentication',
            value: {
              email: 'john.doe@example.com',
              password: 'SecurePassword123!',
            },
          },
          adminLogin: {
            summary: 'Admin Login',
            description: 'Administrator authentication',
            value: {
              email: 'admin@example.com',
              password: 'AdminPassword123!',
            },
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Login successful',
        schema: { example: AuthSuccessResponse },
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error',
        schema: { example: ValidationErrorResponse },
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
        schema: { example: UnauthorizedResponse },
      }),
    ),

  // Refresh Token
  RefreshToken: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Refresh access token',
        description: `
        Generates a new access token using a valid refresh token.
        
        **Token Refresh Flow:**
        1. Validates refresh token from request
        2. Checks token exists and is valid in Redis
        3. Generates new access + refresh token pair
        4. Updates refresh token in Redis
        5. Invalidates old refresh token
        6. Returns new token pair
        
        **Security Benefits:**
        - Automatic token rotation prevents token reuse
        - Redis-based validation ensures token revocation
        - Configurable token expiry times
        - Maintains user session without re-login
        
        **Best Practices:**
        - Call this endpoint before access token expires
        - Store new tokens securely on client
        - Handle token refresh failures gracefully
        `,
        tags: ['Token Management'],
      }),
      ApiBody({
        description: 'Refresh token payload',
        type: RefreshTokenDto,
        examples: {
          refreshToken: {
            summary: 'Token Refresh',
            description: 'Refresh expired access token',
            value: {
              refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Token refreshed successfully',
        schema: { example: TokenRefreshResponse },
      }),
      ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid refresh token format',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Invalid refresh token format',
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Refresh token expired or invalid',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Refresh token expired or invalid',
          },
        },
      }),
    ),

  // Get User Profile
  GetProfile: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get user profile',
        description: `
        Retrieves the authenticated user's profile information.
        
        **Authorization Required:**
        - Valid JWT access token in Authorization header
        - Token must not be expired or revoked
        - User account must be active
        
        **Profile Information:**
        - User ID, email, name
        - Account role and permissions
        - Account status (active/inactive)
        - Creation and update timestamps
        
        **Privacy & Security:**
        - No sensitive information (passwords, tokens) returned
        - Rate limiting applied per user
        - Audit logging for profile access
        - GDPR compliant data handling
        `,
        tags: ['User Profile'],
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Profile retrieved successfully',
        schema: { example: UserProfileResponse },
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid or expired access token',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Invalid or expired access token',
          },
        },
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found or account deactivated',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'User not found or account deactivated',
          },
        },
      }),
    ),

  // Logout User
  Logout: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'User logout',
        description: `
        Logs out the user and invalidates all refresh tokens.
        
        **Logout Process:**
        1. Validates JWT access token
        2. Extracts user ID from token
        3. Invalidates all refresh tokens for user in Redis
        4. Adds access token to blacklist (future feature)
        5. Clears user session data
        
        **Security Features:**
        - Complete session termination
        - Multi-device logout support
        - Token invalidation prevents reuse
        - Audit trail for logout events
        
        **Client Responsibilities:**
        - Clear stored tokens after successful logout
        - Redirect to login page
        - Handle logout failures gracefully
        - Update UI to reflect logged-out state
        `,
        tags: ['User Authentication'],
      }),
      ApiResponse({
        status: HttpStatus.OK,
        description: 'Logout successful',
        schema: { example: LogoutSuccessResponse },
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid or expired access token',
        schema: {
          example: {
            ...ErrorResponse,
            message: 'Invalid or expired access token',
          },
        },
      }),
    ),
};
