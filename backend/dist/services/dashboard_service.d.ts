import { DashboardSummary, AccountSummary, TransactionWithDetails, GoalProgress, SpendingAnalytics } from '../types/dashboard';
export declare class DashboardService {
    /**
     * Get complete dashboard summary
     */
    static getDashboardSummary(userId: string): Promise<DashboardSummary>;
    /**
     * Get account balance summaries
     */
    static getAccountSummaries(userId: string): Promise<AccountSummary[]>;
    /**
     * Get recent transactions with full details
     */
    static getRecentTransactions(userId: string, limit?: number): Promise<TransactionWithDetails[]>;
    /**
     * Get goal progress summaries
     */
    static getGoalProgress(userId: string): Promise<GoalProgress[]>;
    /**
     * Get comprehensive spending analytics
     */
    static getSpendingAnalytics(userId: string, period?: 'week' | 'month' | 'year'): Promise<SpendingAnalytics>;
    /**
     * Get monthly spending breakdown by category
     */
    private static getMonthlyBreakdown;
    /**
     * Get income vs expense analysis
     */
    private static getIncomeVsExpense;
    /**
     * Get spending trends over time
     */
    private static getSpendingTrends;
    /**
     * Get budget warnings (placeholder implementation)
     */
    private static getBudgetWarnings;
    /**
     * Export dashboard data in various formats
     */
    static exportData(userId: string, type: 'spending' | 'goals' | 'accounts', period?: 'week' | 'month' | 'year', format?: 'csv' | 'json'): Promise<string>;
    /**
     * Helper method to convert data to CSV format
     */
    private static convertToCSV;
    /**
     * Helper method to get date ranges for different periods
     */
    private static getDateRange;
    /**
     * Helper method to generate period labels
     */
    private static getPeriodLabel;
}
