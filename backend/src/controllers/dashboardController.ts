import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard_service';
import { DashboardQuery, ExportOptions } from '../types/dashboard';

export class DashboardController {
  /**
   * GET /api/dashboard
   * Get complete dashboard summary
   */
  static async getDashboardSummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const dashboardData = await DashboardService.getDashboardSummary(userId);
      res.json(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      res.status(500).json({ 
        error: 'Failed to fetch dashboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/dashboard/accounts
   * Get account balance summaries
   */
  static async getAccountSummaries(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const accounts = await DashboardService.getAccountSummaries(userId);
      res.json(accounts);
    } catch (error) {
      console.error('Error fetching account summaries:', error);
      res.status(500).json({ 
        error: 'Failed to fetch account summaries',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/dashboard/transactions
   * Get recent transactions with full details
   */
  static async getRecentTransactions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 10;
      
      if (limit < 1 || limit > 100) {
        res.status(400).json({ error: 'Limit must be between 1 and 100' });
        return;
      }

      const transactions = await DashboardService.getRecentTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      res.status(500).json({ 
        error: 'Failed to fetch recent transactions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/dashboard/goals
   * Get goal progress summaries
   */
  static async getGoalProgress(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const goals = await DashboardService.getGoalProgress(userId);
      res.json(goals);
    } catch (error) {
      console.error('Error fetching goal progress:', error);
      res.status(500).json({ 
        error: 'Failed to fetch goal progress',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/dashboard/analytics
   * Get spending analytics and trends
   */
  static async getSpendingAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const period = req.query.period as 'week' | 'month' | 'year' || 'month';
      
      if (!['week', 'month', 'year'].includes(period)) {
        res.status(400).json({ error: 'Period must be week, month, or year' });
        return;
      }

      const analytics = await DashboardService.getSpendingAnalytics(userId, period);
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching spending analytics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch spending analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/dashboard/export
   * Export dashboard data in various formats
   */
  static async exportData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const type = req.query.type as 'spending' | 'goals' | 'accounts';
      const period = req.query.period as 'week' | 'month' | 'year' || 'month';
      const format = req.query.format as 'csv' | 'json' || 'csv';

      // Validate parameters
      if (!['spending', 'goals', 'accounts'].includes(type)) {
        res.status(400).json({ error: 'Type must be spending, goals, or accounts' });
        return;
      }

      if (!['week', 'month', 'year'].includes(period)) {
        res.status(400).json({ error: 'Period must be week, month, or year' });
        return;
      }

      if (!['csv', 'json'].includes(format)) {
        res.status(400).json({ error: 'Format must be csv or json' });
        return;
      }

      const exportData = await DashboardService.exportData(userId, type, period, format);

      // Set appropriate headers for download
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${type}-${period}-${timestamp}.${format}`;

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      }

      res.send(exportData);
    } catch (error) {
      console.error('Error exporting dashboard data:', error);
      res.status(500).json({ 
        error: 'Failed to export dashboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/dashboard/summary
   * Get quick dashboard summary (lighter version for mobile/quick access)
   */
  static async getQuickSummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Get only essential data for quick loading
      const [accounts, recentTransactions] = await Promise.all([
        DashboardService.getAccountSummaries(userId),
        DashboardService.getRecentTransactions(userId, 5)
      ]);

      const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

      const quickSummary = {
        totalBalance,
        accountCount: accounts.length,
        recentTransactionCount: recentTransactions.length,
        lastTransactionDate: recentTransactions.length > 0 
          ? recentTransactions[0].date 
          : null
      };

      res.json(quickSummary);
    } catch (error) {
      console.error('Error fetching quick summary:', error);
      res.status(500).json({ 
        error: 'Failed to fetch quick summary',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/dashboard/stats
   * Get basic statistics for dashboard widgets
   */
  static async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const period = req.query.period as 'week' | 'month' | 'year' || 'month';

      const [accounts, analytics, goals] = await Promise.all([
        DashboardService.getAccountSummaries(userId),
        DashboardService.getSpendingAnalytics(userId, period),
        DashboardService.getGoalProgress(userId)
      ]);

      const stats = {
        totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
        totalIncome: analytics.incomeVsExpense.total_income,
        totalExpenses: analytics.incomeVsExpense.total_expenses,
        netAmount: analytics.incomeVsExpense.net_amount,
        activeGoals: goals.filter(goal => !goal.progress_percentage || goal.progress_percentage < 100).length,
        completedGoals: goals.filter(goal => goal.progress_percentage >= 100).length,
        topSpendingCategory: analytics.monthlyBreakdown.length > 0 
          ? analytics.monthlyBreakdown[0].category_name
          : null,
        budgetWarnings: analytics.budgetWarnings.length
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ 
        error: 'Failed to fetch dashboard stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}