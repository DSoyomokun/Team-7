"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controllers/dashboardController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Apply authentication middleware to all dashboard routes
router.use(auth_1.authenticateUser);
/**
 * GET /api/dashboard
 * Get complete dashboard summary
 */
router.get('/', dashboardController_1.DashboardController.getDashboardSummary);
/**
 * GET /api/dashboard/accounts
 * Get account balance summaries
 */
router.get('/accounts', dashboardController_1.DashboardController.getAccountSummaries);
/**
 * GET /api/dashboard/transactions
 * Get recent transactions with full details
 * Query parameters:
 *   - limit: number (optional, default 10, max 100)
 */
router.get('/transactions', dashboardController_1.DashboardController.getRecentTransactions);
/**
 * GET /api/dashboard/goals
 * Get goal progress summaries
 */
router.get('/goals', dashboardController_1.DashboardController.getGoalProgress);
/**
 * GET /api/dashboard/analytics
 * Get spending analytics and trends
 * Query parameters:
 *   - period: 'week' | 'month' | 'year' (optional, default 'month')
 */
router.get('/analytics', dashboardController_1.DashboardController.getSpendingAnalytics);
/**
 * GET /api/dashboard/export
 * Export dashboard data in various formats
 * Query parameters:
 *   - type: 'spending' | 'goals' | 'accounts' (required)
 *   - period: 'week' | 'month' | 'year' (optional, default 'month')
 *   - format: 'csv' | 'json' (optional, default 'csv')
 */
router.get('/export', dashboardController_1.DashboardController.exportData);
/**
 * GET /api/dashboard/summary
 * Get quick dashboard summary (lighter version)
 */
router.get('/summary', dashboardController_1.DashboardController.getQuickSummary);
/**
 * GET /api/dashboard/stats
 * Get basic statistics for dashboard widgets
 * Query parameters:
 *   - period: 'week' | 'month' | 'year' (optional, default 'month')
 */
router.get('/stats', dashboardController_1.DashboardController.getDashboardStats);
exports.default = router;
//# sourceMappingURL=dashboard.js.map