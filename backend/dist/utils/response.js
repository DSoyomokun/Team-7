"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPONSE_MESSAGES = exports.paginatedResponse = exports.errorResponse = exports.successResponse = void 0;
// Success response helper
const successResponse = (res, data, message, statusCode = 200, meta) => {
    const response = {
        success: true,
        message: message || 'Operation successful',
        data,
        ...(meta && { meta })
    };
    res.status(statusCode).json(response);
};
exports.successResponse = successResponse;
// Error response helper
const errorResponse = (res, error, statusCode = 400, details) => {
    const response = {
        success: false,
        error,
        ...(details && { data: details })
    };
    res.status(statusCode).json(response);
};
exports.errorResponse = errorResponse;
// Pagination helper
const paginatedResponse = (res, data, page, limit, total, message) => {
    const totalPages = Math.ceil(total / limit);
    (0, exports.successResponse)(res, data, message, 200, {
        page,
        limit,
        total,
        totalPages
    });
};
exports.paginatedResponse = paginatedResponse;
// Common response messages
exports.RESPONSE_MESSAGES = {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    VALIDATION_ERROR: 'Validation failed',
    SERVER_ERROR: 'Internal server error',
    INVALID_CREDENTIALS: 'Invalid credentials',
    DUPLICATE_ENTRY: 'Resource already exists'
};
//# sourceMappingURL=response.js.map