import express, { Request, Response, NextFunction } from 'express';
import transactionAdapter from '../adapters/transactionAdapter';

const router = express.Router();

// Mock authentication middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  req.userId = token.split('_')[2];
  next();
};

// GET /api/budget/summary
router.get('/summary', authMiddleware, (req: Request, res: Response) => {
  const userTransactions = transactionAdapter.getUserTransactions(req.userId as string);
  const incomeData = transactionAdapter.getUserIncome(req.userId as string);
  const expenseData = transactionAdapter.getUserExpenses(req.userId as string);

  const balance = incomeData.totalIncome - expenseData.totalExpenses;

  res.status(200).json({
    success: true,
    data: {
      totalIncome: incomeData.totalIncome,
      totalExpenses: expenseData.totalExpenses,
      balance,
      incomeCount: incomeData.incomeCount,
      expenseCount: expenseData.expenseCount,
      recentTransactions: userTransactions.slice(-5)
    }
  });
});

// GET /api/budget/categories
router.get('/categories', authMiddleware, (req: Request, res: Response) => {
  const userTransactions = transactionAdapter.getUserTransactions(req.userId as string);
  const expenseCategories: { [key: string]: number } = {};
  const incomeCategories: { [key: string]: number } = {};

  userTransactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      expenseCategories[transaction.category] =
        (expenseCategories[transaction.category] || 0) + transaction.amount;
    } else if (transaction.type === 'income') {
      incomeCategories[transaction.category] =
        (incomeCategories[transaction.category] || 0) + transaction.amount;
    }
  });

  res.status(200).json({
    success: true,
    data: {
      expenseCategories,
      incomeCategories
    }
  });
});

// GET /api/budget/monthly-progress
router.get('/monthly-progress', authMiddleware, (req: Request, res: Response) => {
  const incomeData = transactionAdapter.getUserIncome(req.userId as string);
  const expenseData = transactionAdapter.getUserExpenses(req.userId as string);

  const monthlyIncome = incomeData.totalIncome;
  const monthlyExpenses = expenseData.totalExpenses;
  const remainingBudget = monthlyIncome - monthlyExpenses;
  const spendingPercentage = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0;

  res.status(200).json({
    success: true,
    data: {
      monthlyIncome,
      monthlyExpenses,
      remainingBudget,
      spendingPercentage
    }
  });
});

export default router;