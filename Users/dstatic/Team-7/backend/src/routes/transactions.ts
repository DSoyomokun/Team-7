/**
 * Transaction Routes
 * Express route definitions for transaction endpoints with category support
 */

import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Transaction validation schemas
const createTransactionSchema = {
  account_id: {
    isUUID: true,
    errorMessage: 'Account ID must be a valid UUID'
  },
  category_id: {
    optional: true,
    isUUID: true,
    errorMessage: 'Category ID must be a valid UUID'
  },
  amount: {
    isNumeric: true,
    toFloat: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: 'Amount must be greater than 0'
    }
  },
  description: {
    isString: true,
    isLength: { options: { min: 1, max: 255 } },
    trim: true,
    errorMessage: 'Description must be a string between 1 and 255 characters'
  },
  date: {
    isISO8601: true,
    errorMessage: 'Date must be a valid ISO 8601 date'
  },
  is_expense: {
    isBoolean: true,
    errorMessage: 'is_expense must be a boolean'
  }
};

const updateTransactionSchema = {
  account_id: {
    optional: true,
    isUUID: true,
    errorMessage: 'Account ID must be a valid UUID'
  },
  category_id: {
    optional: true,
    isUUID: true,
    errorMessage: 'Category ID must be a valid UUID'
  },
  amount: {
    optional: true,
    isNumeric: true,
    toFloat: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: 'Amount must be greater than 0'
    }
  },
  description: {
    optional: true,
    isString: true,
    isLength: { options: { min: 1, max: 255 } },
    trim: true,
    errorMessage: 'Description must be a string between 1 and 255 characters'
  },
  date: {
    optional: true,
    isISO8601: true,
    errorMessage: 'Date must be a valid ISO 8601 date'
  },
  is_expense: {
    optional: true,
    isBoolean: true,
    errorMessage: 'is_expense must be a boolean'
  }
};

// Routes
router.post('/', ...validateRequest(createTransactionSchema), TransactionController.createTransaction);
router.get('/', TransactionController.getTransactions);
router.put('/:id', ...validateRequest(updateTransactionSchema), TransactionController.updateTransaction);

// Analytics routes
router.get('/analytics/by-category', TransactionController.getTransactionsByCategory);

export default router;