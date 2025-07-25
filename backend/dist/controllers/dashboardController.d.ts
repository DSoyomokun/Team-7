import { Request, Response } from 'express';
export declare class DashboardController {
    /**
     * GET /api/dashboard
     * Get complete dashboard summary
     */
    static getDashboardSummary(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/dashboard/accounts
     * Get account balance summaries
     */
    static getAccountSummaries(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/dashboard/transactions
     * Get recent transactions with full details
     */
    static getRecentTransactions(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/dashboard/goals
     * Get goal progress summaries
     */
    static getGoalProgress(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/dashboard/analytics
     * Get spending analytics and trends
     */
    static getSpendingAnalytics(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/dashboard/export
     * Export dashboard data in various formats
     */
    static exportData(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/dashboard/summary
     * Get quick dashboard summary (lighter version for mobile/quick access)
     */
    static getQuickSummary(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/dashboard/stats
     * Get basic statistics for dashboard widgets
     */
    static getDashboardStats(req: Request, res: Response): Promise<void>;
}
