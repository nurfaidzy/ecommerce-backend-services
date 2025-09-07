export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
    requestId?: string;
  };
}

export class ResponseHelper {
  /**
   * Create a successful API response
   */
  static success<T>(
    data: T,
    message: string = 'Operation successful',
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }

  /**
   * Create a successful API response for lists
   */
  static successList<T>(
    data: T[],
    message: string = 'Data retrieved successfully',
  ): ApiResponse<T[]> {
    return {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }

  /**
   * Create an error API response
   */
  static error(
    message: string,
    errorCode: string = 'UNKNOWN_ERROR',
    details?: any,
  ): ApiResponse {
    return {
      success: false,
      message,
      error: {
        code: errorCode,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }

  /**
   * Create a validation error response
   */
  static validationError(details: any): ApiResponse {
    return {
      success: false,
      message: 'Validation failed',
      error: {
        code: 'VALIDATION_ERROR',
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };
  }
}
