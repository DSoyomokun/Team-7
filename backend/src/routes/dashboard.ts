import express from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all dashboard routes
router.use(authenticateUser);

/**
 * GET /api/dashboard
 * Get complete dashboard summary
 */
router.get('/', DashboardController.getDashboardSummary);

/**
 * GET /api/dashboard/accounts
 * Get account balance summaries
 */
router.get('/accounts', DashboardController.getAccountSummaries);

/**
 * GET /api/dashboard/transactions
 * Get recent transactions with full details
 * Query parameters:
 *   - limit: number (optional, default 10, max 100)
 */
router.get('/transactions', DashboardController.getRecentTransactions);

/**
 * GET /api/dashboard/goals
 * Get goal progress summaries
 */
router.get('/goals', DashboardController.getGoalProgress);

/**
 * GET /api/dashboard/analytics
 * Get spending analytics and trends
 * Query parameters:
 *   - period: 'week' | 'month' | 'year' (optional, default 'month')
 */
router.get('/analytics', DashboardController.getSpendingAnalytics);

/**
 * GET /api/dashboard/export
 * Export dashboard data in various formats
 * Query parameters:
 *   - type: 'spending' | 'goals' | 'accounts' (required)
 *   - period: 'week' | 'month' | 'year' (optional, default 'month')
 *   - format: 'csv' | 'json' (optional, default 'csv')
 */
router.get('/export', DashboardController.exportData);

/**
 * GET /api/dashboard/summary
 * Get quick dashboard summary (lighter version)
 */
router.get('/summary', DashboardController.getQuickSummary);

/**
 * GET /api/dashboard/stats
 * Get basic statistics for dashboard widgets
 * Query parameters:
 *   - period: 'week' | 'month' | 'year' (optional, default 'month')
 */
router.get('/stats', DashboardController.getDashboardStats);

export default router;