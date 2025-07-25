import express, { Request, Response, NextFunction } from 'express';
import transactionAdapter from '../adapters/transactionAdapter';
import { budgetController } from '../controllers/budgetController';

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

// Legacy endpoints (keeping for backward compatibility)
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

// New enhanced budget analysis endpoints
// GET /api/budget/analysis?period=month&year=2024
router.get('/analysis', authMiddleware, budgetController.getBudgetAnalysis.bind(budgetController));

// GET /api/budget/trends?period=month&months=6
router.get('/trends', authMiddleware, budgetController.getBudgetTrends.bind(budgetController));

// GET /api/budget/categories?period=month (enhanced version)
router.get('/categories', authMiddleware, budgetController.getCategoryBreakdown.bind(budgetController));

// Budget limit management endpoints
// POST /api/budget/limits
router.post('/limits', authMiddleware, budgetController.createBudgetLimit.bind(budgetController));

// GET /api/budget/limits
router.get('/limits', authMiddleware, budgetController.getBudgetLimits.bind(budgetController));

// PUT /api/budget/limits/:id
router.put('/limits/:id', authMiddleware, budgetController.updateBudgetLimit.bind(budgetController));

// DELETE /api/budget/limits/:id
router.delete('/limits/:id', authMiddleware, budgetController.deleteBudgetLimit.bind(budgetController));

// GET /api/budget/warnings
router.get('/warnings', authMiddleware, budgetController.getBudgetWarnings.bind(budgetController));

// GET /api/budget/export?type=spending&period=month&format=csv
router.get('/export', authMiddleware, budgetController.exportBudgetReport.bind(budgetController));

export default router;