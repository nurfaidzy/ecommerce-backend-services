import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseMetadata {
  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'API version',
    example: 'v1',
  })
  version: string;

  constructor() {
    this.timestamp = new Date().toISOString();
    this.version = 'v1';
  }
}

export class ApiResponse<T> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable message describing the result',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'The actual data payload',
    required: false,
  })
  data?: T;

  @ApiProperty({
    description: 'Additional metadata about the response',
    type: ApiResponseMetadata,
  })
  metadata: ApiResponseMetadata;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.metadata = new ApiResponseMetadata();
  }
}

export class ResponseHelper {
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  static error(message: string): ApiResponse<null> {
    return new ApiResponse(false, message, null);
  }
}
