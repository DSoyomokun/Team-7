import { Response } from 'express';
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
export declare const successResponse: <T>(res: Response, data?: T, message?: string, statusCode?: number, meta?: ApiResponse["meta"]) => void;
export declare const errorResponse: (res: Response, error: string, statusCode?: number, details?: any) => void;
export declare const paginatedResponse: <T>(res: Response, data: T[], page: number, limit: number, total: number, message?: string) => void;
export declare const RESPONSE_MESSAGES: {
    readonly CREATED: "Resource created successfully";
    readonly UPDATED: "Resource updated successfully";
    readonly DELETED: "Resource deleted successfully";
    readonly NOT_FOUND: "Resource not found";
    readonly UNAUTHORIZED: "Unauthorized access";
    readonly VALIDATION_ERROR: "Validation failed";
    readonly SERVER_ERROR: "Internal server error";
    readonly INVALID_CREDENTIALS: "Invalid credentials";
    readonly DUPLICATE_ENTRY: "Resource already exists";
};
export {};
