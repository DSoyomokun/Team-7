"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSearchQuery = exports.validatePagination = exports.validateDateRange = exports.validatePasswordChange = exports.validateTransaction = exports.validatePreferencesUpdate = exports.validateProfileUpdate = void 0;
const response_1 = require("../utils/response");
// Validation helper functions
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const isValidAmount = (amount) => {
    return typeof amount === 'number' && amount > 0 && isFinite(amount);
};
const isValidDate = (date) => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
};
// Profile update validation
const validateProfileUpdate = (req, res, next) => {
    try {
        const { full_name, currency_preference } = req.body;
        if (full_name !== undefined) {
            if (typeof full_name !== 'string' || full_name.trim().length === 0) {
                return (0, response_1.errorResponse)(res, 'Full name must be a non-empty string', 400);
            }
            if (full_name.length > 100) {
                return (0, response_1.errorResponse)(res, 'Full name must be less than 100 characters', 400);
            }
        }
        if (currency_preference !== undefined) {
            const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
            if (!validCurrencies.includes(currency_preference)) {
                return (0, response_1.errorResponse)(res, 'Invalid currency preference', 400);
            }
        }
        next();
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 'Validation failed', 400);
    }
};
exports.validateProfileUpdate = validateProfileUpdate;
// Preferences update validation
const validatePreferencesUpdate = (req, res, next) => {
    try {
        const { currency_preference, language, notifications, theme } = req.body;
        if (currency_preference !== undefined) {
            const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
            if (!validCurrencies.includes(currency_preference)) {
                return (0, response_1.errorResponse)(res, 'Invalid currency preference', 400);
            }
        }
        if (language !== undefined) {
            const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt'];
            if (!validLanguages.includes(language)) {
                return (0, response_1.errorResponse)(res, 'Invalid language preference', 400);
            }
        }
        if (notifications !== undefined && typeof notifications !== 'boolean') {
            return (0, response_1.errorResponse)(res, 'Notifications must be a boolean value', 400);
        }
        if (theme !== undefined) {
            const validThemes = ['light', 'dark', 'auto'];
            if (!validThemes.includes(theme)) {
                return (0, response_1.errorResponse)(res, 'Invalid theme preference', 400);
            }
        }
        next();
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 'Validation failed', 400);
    }
};
exports.validatePreferencesUpdate = validatePreferencesUpdate;
// Transaction validation
const validateTransaction = (req, res, next) => {
    try {
        const { amount, type, category, description, date } = req.body;
        if (!amount || !isValidAmount(amount)) {
            return (0, response_1.errorResponse)(res, 'Valid amount is required (must be positive number)', 400);
        }
        if (!type || !['income', 'expense'].includes(type)) {
            return (0, response_1.errorResponse)(res, 'Valid transaction type is required (income or expense)', 400);
        }
        if (type === 'expense' && (!category || typeof category !== 'string')) {
            return (0, response_1.errorResponse)(res, 'Category is required for expense transactions', 400);
        }
        if (description !== undefined && typeof description !== 'string') {
            return (0, response_1.errorResponse)(res, 'Description must be a string', 400);
        }
        if (date !== undefined && !isValidDate(date)) {
            return (0, response_1.errorResponse)(res, 'Invalid date format', 400);
        }
        next();
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 'Validation failed', 400);
    }
};
exports.validateTransaction = validateTransaction;
// Password change validation
const validatePasswordChange = (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || typeof currentPassword !== 'string') {
            return (0, response_1.errorResponse)(res, 'Current password is required', 400);
        }
        if (!newPassword || typeof newPassword !== 'string') {
            return (0, response_1.errorResponse)(res, 'New password is required', 400);
        }
        if (newPassword.length < 6) {
            return (0, response_1.errorResponse)(res, 'New password must be at least 6 characters long', 400);
        }
        if (newPassword.length > 128) {
            return (0, response_1.errorResponse)(res, 'New password must be less than 128 characters', 400);
        }
        next();
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 'Validation failed', 400);
    }
};
exports.validatePasswordChange = validatePasswordChange;
// Date range validation
const validateDateRange = (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        if (startDate && !isValidDate(startDate)) {
            return (0, response_1.errorResponse)(res, 'Invalid start date format', 400);
        }
        if (endDate && !isValidDate(endDate)) {
            return (0, response_1.errorResponse)(res, 'Invalid end date format', 400);
        }
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start >= end) {
                return (0, response_1.errorResponse)(res, 'Start date must be before end date', 400);
            }
        }
        next();
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 'Validation failed', 400);
    }
};
exports.validateDateRange = validateDateRange;
// Pagination validation
const validatePagination = (req, res, next) => {
    try {
        const { page, limit } = req.query;
        if (page !== undefined) {
            const pageNum = parseInt(page);
            if (isNaN(pageNum) || pageNum < 1) {
                return (0, response_1.errorResponse)(res, 'Page must be a positive integer', 400);
            }
        }
        if (limit !== undefined) {
            const limitNum = parseInt(limit);
            if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
                return (0, response_1.errorResponse)(res, 'Limit must be between 1 and 100', 400);
            }
        }
        next();
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 'Validation failed', 400);
    }
};
exports.validatePagination = validatePagination;
// Search query validation
const validateSearchQuery = (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return (0, response_1.errorResponse)(res, 'Search query is required', 400);
        }
        if (q.trim().length === 0) {
            return (0, response_1.errorResponse)(res, 'Search query cannot be empty', 400);
        }
        if (q.length > 100) {
            return (0, response_1.errorResponse)(res, 'Search query must be less than 100 characters', 400);
        }
        next();
    }
    catch (error) {
        (0, response_1.errorResponse)(res, 'Validation failed', 400);
    }
};
exports.validateSearchQuery = validateSearchQuery;
//# sourceMappingURL=validation.js.map