import express, { Request, Response, NextFunction } from 'express';
import transactionAdapter from '../adapters/transactionAdapter';

const router = express.Router();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  req.userId = token.split('_')[2];
  next();
};

// POST /api/transactions/income
router.post('/income', authMiddleware, (req: Request, res: Response) => {
  const { amount, category, description, date } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Amount must be positive' });
  }
  const transactionData = {
    userId: req.userId as string,
    type: 'income' as const,
    amount,
    category,
    description,
    date: date || new Date()
  };
  const transaction = transactionAdapter.addTransaction(transactionData);
  res.status(201).json({ success: true, message: 'Income transaction added successfully', data: transaction });
});

// POST /api/transactions/expense
router.post('/expense', authMiddleware, (req: Request, res: Response) => {
  const { amount, category, description, date } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Amount must be greater than 0' });
  }
  if (!category) {
    return res.status(400).json({ success: false, error: 'Category is required' });
  }
  const transactionData = {
    userId: req.userId as string,
    type: 'expense' as const,
    amount,
    category,
    description,
    date: date || new Date()
  };
  const transaction = transactionAdapter.addTransaction(transactionData);
  res.status(201).json({ success: true, message: 'Expense transaction added successfully', data: transaction });
});

// GET /api/transactions/income/summary
router.get('/income/summary', authMiddleware, (req: Request, res: Response) => {
  const incomeData = transactionAdapter.getUserIncome(req.userId as string);
  res.status(200).json({ success: true, data: incomeData });
});

// GET /api/transactions/expense/summary
router.get('/expense/summary', authMiddleware, (req: Request, res: Response) => {
  const expenseData = transactionAdapter.getUserExpenses(req.userId as string);
  res.status(200).json({ success: true, data: expenseData });
});

// GET /api/transactions/expense (with category filter)
router.get('/expense', authMiddleware, (req: Request, res: Response) => {
  const { category } = req.query;
  const expenseData = transactionAdapter.getUserExpenses(req.userId as string, category as string | null);
  res.status(200).json({ success: true, data: { transactions: expenseData.transactions } });
});

export default router;