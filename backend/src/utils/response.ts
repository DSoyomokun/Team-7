import { Response } from 'express';

// Standard response interface
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Success response helper
export const successResponse = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200,
  meta?: ApiResponse['meta']
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message: message || 'Operation successful',
    data,
    ...(meta && { meta })
  };
  
  res.status(statusCode).json(response);
};

// Error response helper
export const errorResponse = (
  res: Response,
  error: string,
  statusCode: number = 400,
  details?: any
): void => {
  const response: ApiResponse = {
    success: false,
    error,
    ...(details && { data: details })
  };
  
  res.status(statusCode).json(response);
};

// Pagination helper
export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
): void => {
  const totalPages = Math.ceil(total / limit);
  
  successResponse(
    res,
    data,
    message,
    200,
    {
      page,
      limit,
      total,
      totalPages
    }
  );
};

// Common response messages
export const RESPONSE_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION_ERROR: 'Validation failed',
  SERVER_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  DUPLICATE_ENTRY: 'Resource already exists'
} as const; 