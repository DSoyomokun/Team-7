import express, { Request, Response } from 'express';
import transactionAdapter from '../adapters/transactionAdapter';
import transactionController from '../controllers/transactionController';
import { authenticateUser } from '../middleware/auth';
import { validateTransaction, validateDateRange, validatePagination } from '../middleware/validation';
import { successResponse, errorResponse, RESPONSE_MESSAGES } from '../utils/response';

const router = express.Router();

// Create transaction (unified income/expense)
router.post(
  '/',
  authenticateUser,
  validateTransaction,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'User not authenticated', 401);
      }
      
      const { amount, type } = req.body;
      
      if (!amount || amount <= 0) {
        return errorResponse(res, 'Amount must be positive', 400);
      }
      
      if (type === 'expense' && !req.body.category) {
        return errorResponse(res, 'Category is required for expenses', 400);
      }
      
      const transaction = await transactionAdapter.createTransaction(userId, req.body);
      successResponse(res, transaction, RESPONSE_MESSAGES.CREATED, 201);
    } catch (error: any) {
      errorResponse(res, error.message || 'Failed to create transaction', 400);
    }
  }
);

// POST /api/transactions/income (legacy support)
router.post('/income', authenticateUser, validateTransaction, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return errorResponse(res, 'User not authenticated', 401);
    }
    
    const { amount, category, description, date } = req.body;
    
    if (!amount || amount <= 0) {
      return errorResponse(res, 'Amount must be positive', 400);
    }
    
    const transactionData = {
      type: 'income' as const,
      amount,
      category,
      description,
      date: date || new Date()
    };
    
    const transaction = await transactionAdapter.createTransaction(userId, transactionData);
    successResponse(res, transaction, 'Income transaction added successfully', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to create income transaction', 400);
  }
});

// POST /api/transactions/expense (legacy support)
router.post('/expense', authenticateUser, validateTransaction, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return errorResponse(res, 'User not authenticated', 401);
    }
    
    const { amount, category, description, date } = req.body;
    
    if (!amount || amount <= 0) {
      return errorResponse(res, 'Amount must be greater than 0', 400);
    }
    if (!category) {
      return errorResponse(res, 'Category is required', 400);
    }
    
    const transactionData = {
      type: 'expense' as const,
      amount,
      category,
      description,
      date: date || new Date()
    };
    
    const transaction = await transactionAdapter.createTransaction(userId, transactionData);
    successResponse(res, transaction, 'Expense transaction added successfully', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to create expense transaction', 400);
  }
});

// Get user transactions
router.get(
  '/',
  authenticateUser,
  validateDateRange,
  validatePagination,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'User not authenticated', 401);
      }
      
      const filters = req.query;
      const transactions = await transactionAdapter.getTransactions(userId, filters);
      successResponse(res, { transactions }, 'Transactions retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message || 'Failed to retrieve transactions', 500);
    }
  }
);

// Get transaction summary
router.get(
  '/summary',
  authenticateUser,
  validateDateRange,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'User not authenticated', 401);
      }
      
      const { startDate, endDate } = req.query;
      const incomeData = await transactionAdapter.getUserIncome(userId);
      const expenseData = await transactionAdapter.getUserExpenses(userId);
      
      const summary = {
        income: incomeData,
        expenses: expenseData,
        netAmount: incomeData.totalIncome - expenseData.totalExpenses
      };
      
      successResponse(res, summary, 'Transaction summary retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message || 'Failed to retrieve transaction summary', 500);
    }
  }
);

export default router;
