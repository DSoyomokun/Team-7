import express, { Request, Response, NextFunction } from 'express';
import transactionAdapter from '../adapters/transactionAdapter';
import { budgetController } from '../controllers/budgetController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Legacy endpoints (keeping for backward compatibility)
// GET /api/budget/summary
router.get('/summary', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }
    
    const userTransactions = await transactionAdapter.getUserTransactions(userId);
    const incomeData = await transactionAdapter.getUserIncome(userId);
    const expenseData = await transactionAdapter.getUserExpenses(userId);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/budget/monthly-progress
router.get('/monthly-progress', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }
    
    const incomeData = await transactionAdapter.getUserIncome(userId);
    const expenseData = await transactionAdapter.getUserExpenses(userId);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// New enhanced budget analysis endpoints
// GET /api/budget/analysis?period=month&year=2024
router.get('/analysis', authenticateUser, budgetController.getBudgetAnalysis.bind(budgetController));

// GET /api/budget/trends?period=month&months=6
router.get('/trends', authenticateUser, budgetController.getBudgetTrends.bind(budgetController));

// GET /api/budget/categories?period=month (enhanced version)
router.get('/categories', authenticateUser, budgetController.getCategoryBreakdown.bind(budgetController));

// Budget limit management endpoints
// POST /api/budget/limits
router.post('/limits', authenticateUser, budgetController.createBudgetLimit.bind(budgetController));

// GET /api/budget/limits
router.get('/limits', authenticateUser, budgetController.getBudgetLimits.bind(budgetController));

// PUT /api/budget/limits/:id
router.put('/limits/:id', authenticateUser, budgetController.updateBudgetLimit.bind(budgetController));

// DELETE /api/budget/limits/:id
router.delete('/limits/:id', authenticateUser, budgetController.deleteBudgetLimit.bind(budgetController));

// GET /api/budget/warnings
router.get('/warnings', authenticateUser, budgetController.getBudgetWarnings.bind(budgetController));

// GET /api/budget/export?type=spending&period=month&format=csv
router.get('/export', authenticateUser, budgetController.exportBudgetReport.bind(budgetController));

export default router;