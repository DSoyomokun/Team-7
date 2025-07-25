import express, { Request, Response } from 'express';
import transactionAdapter from '../adapters/transactionAdapter';
import transactionController from '../controllers/transactionController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

// Create transaction (unified income/expense)
router.post(
  '/',
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user.id;
      const { amount, type } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be positive' });
      }
      
      if (type === 'expense' && !req.body.category) {
        return res.status(400).json({ error: 'Category is required for expenses' });
      }
      
      const transaction = await transactionAdapter.createTransaction(userId, req.body);
      res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// POST /api/transactions/income (legacy support)
router.post('/income', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { amount, category, description, date } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }
    
    const transactionData = {
      type: 'income' as const,
      amount,
      category,
      description,
      date: date || new Date()
    };
    
    const transaction = await transactionAdapter.createTransaction(userId, transactionData);
    res.status(201).json({ message: 'Income transaction added successfully', data: transaction });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/transactions/expense (legacy support)
router.post('/expense', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { amount, category, description, date } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    
    const transactionData = {
      type: 'expense' as const,
      amount,
      category,
      description,
      date: date || new Date()
    };
    
    const transaction = await transactionAdapter.createTransaction(userId, transactionData);
    res.status(201).json({ message: 'Expense transaction added successfully', data: transaction });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get user transactions
router.get(
  '/',
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user.id;
      const filters = req.query;
      const transactions = await transactionAdapter.getTransactions(userId, filters);
      res.json({ transactions });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// GET /api/transactions/income/summary (legacy support)
router.get('/income/summary', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const transactions = await transactionAdapter.getTransactions(userId, { type: 'income' });
    res.json({ success: true, data: transactions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/expense/summary (legacy support)
router.get('/expense/summary', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const transactions = await transactionAdapter.getTransactions(userId, { type: 'expense' });
    res.json({ success: true, data: transactions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/expense (with category filter, legacy support)
router.get('/expense', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { category } = req.query;
    const filters: any = { type: 'expense' };
    if (category) filters.category = category;
    
    const transactions = await transactionAdapter.getTransactions(userId, filters);
    res.json({ success: true, data: { transactions } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze spending by category
router.get(
  '/analyze/:category',
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user.id;
      const { category } = req.params;
      const totalSpending = await transactionAdapter.analyzeSpending(userId, category);
      res.json({ category, totalSpending });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get recurring payments
router.get(
  '/recurring',
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user.id;
      const recurringPayments = await transactionAdapter.detectRecurringPayments(userId);
      res.json({ recurringPayments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// New account-integrated endpoints
// POST /api/transactions/with-account - Create transaction with account balance update
router.post('/with-account', authenticateUser, transactionController.createTransaction);

// GET /api/transactions/with-account - Get transactions with account filtering
router.get('/with-account', authenticateUser, transactionController.getTransactions);

export default router;
