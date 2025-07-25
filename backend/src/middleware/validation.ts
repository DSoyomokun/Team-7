import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

// Validation helper functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidAmount = (amount: number): boolean => {
  return typeof amount === 'number' && amount > 0 && isFinite(amount);
};

const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

// Profile update validation
export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { full_name, currency_preference } = req.body;

    if (full_name !== undefined) {
      if (typeof full_name !== 'string' || full_name.trim().length === 0) {
        return errorResponse(res, 'Full name must be a non-empty string', 400);
      }
      if (full_name.length > 100) {
        return errorResponse(res, 'Full name must be less than 100 characters', 400);
      }
    }

    if (currency_preference !== undefined) {
      const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
      if (!validCurrencies.includes(currency_preference)) {
        return errorResponse(res, 'Invalid currency preference', 400);
      }
    }

    next();
  } catch (error: any) {
    errorResponse(res, 'Validation failed', 400);
  }
};

// Preferences update validation
export const validatePreferencesUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currency_preference, language, notifications, theme } = req.body;

    if (currency_preference !== undefined) {
      const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
      if (!validCurrencies.includes(currency_preference)) {
        return errorResponse(res, 'Invalid currency preference', 400);
      }
    }

    if (language !== undefined) {
      const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt'];
      if (!validLanguages.includes(language)) {
        return errorResponse(res, 'Invalid language preference', 400);
      }
    }

    if (notifications !== undefined && typeof notifications !== 'boolean') {
      return errorResponse(res, 'Notifications must be a boolean value', 400);
    }

    if (theme !== undefined) {
      const validThemes = ['light', 'dark', 'auto'];
      if (!validThemes.includes(theme)) {
        return errorResponse(res, 'Invalid theme preference', 400);
      }
    }

    next();
  } catch (error: any) {
    errorResponse(res, 'Validation failed', 400);
  }
};

// Transaction validation
export const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, type, category, description, date } = req.body;

    if (!amount || !isValidAmount(amount)) {
      return errorResponse(res, 'Valid amount is required (must be positive number)', 400);
    }

    if (!type || !['income', 'expense'].includes(type)) {
      return errorResponse(res, 'Valid transaction type is required (income or expense)', 400);
    }

    if (type === 'expense' && (!category || typeof category !== 'string')) {
      return errorResponse(res, 'Category is required for expense transactions', 400);
    }

    if (description !== undefined && typeof description !== 'string') {
      return errorResponse(res, 'Description must be a string', 400);
    }

    if (date !== undefined && !isValidDate(date)) {
      return errorResponse(res, 'Invalid date format', 400);
    }

    next();
  } catch (error: any) {
    errorResponse(res, 'Validation failed', 400);
  }
};

// Password change validation
export const validatePasswordChange = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || typeof currentPassword !== 'string') {
      return errorResponse(res, 'Current password is required', 400);
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return errorResponse(res, 'New password is required', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'New password must be at least 6 characters long', 400);
    }

    if (newPassword.length > 128) {
      return errorResponse(res, 'New password must be less than 128 characters', 400);
    }

    next();
  } catch (error: any) {
    errorResponse(res, 'Validation failed', 400);
  }
};

// Date range validation
export const validateDateRange = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    if (startDate && !isValidDate(startDate as string)) {
      return errorResponse(res, 'Invalid start date format', 400);
    }

    if (endDate && !isValidDate(endDate as string)) {
      return errorResponse(res, 'Invalid end date format', 400);
    }

    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      
      if (start >= end) {
        return errorResponse(res, 'Start date must be before end date', 400);
      }
    }

    next();
  } catch (error: any) {
    errorResponse(res, 'Validation failed', 400);
  }
};

// Pagination validation
export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;

    if (page !== undefined) {
      const pageNum = parseInt(page as string);
      if (isNaN(pageNum) || pageNum < 1) {
        return errorResponse(res, 'Page must be a positive integer', 400);
      }
    }

    if (limit !== undefined) {
      const limitNum = parseInt(limit as string);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return errorResponse(res, 'Limit must be between 1 and 100', 400);
      }
    }

    next();
  } catch (error: any) {
    errorResponse(res, 'Validation failed', 400);
  }
};

// Search query validation
export const validateSearchQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return errorResponse(res, 'Search query is required', 400);
    }

    if (q.trim().length === 0) {
      return errorResponse(res, 'Search query cannot be empty', 400);
    }

    if (q.length > 100) {
      return errorResponse(res, 'Search query must be less than 100 characters', 400);
    }

    next();
  } catch (error: any) {
    errorResponse(res, 'Validation failed', 400);
  }
};
