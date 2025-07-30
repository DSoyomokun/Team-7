"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../utils/response");
const transactionAdapter_1 = __importDefault(require("../adapters/transactionAdapter"));
class ReportController {
    /**
     * Get spending report
     */
    static async getSpendingReport(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            const { startDate, endDate, category } = req.query;
            // Get expense transactions
            const filters = { type: 'expense' };
            if (category)
                filters.category = category;
            if (startDate)
                filters.startDate = startDate;
            if (endDate)
                filters.endDate = endDate;
            const transactions = await transactionAdapter_1.default.getTransactions(userId, filters);
            const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
            const categoryBreakdown = transactions.reduce((acc, t) => {
                const categoryKey = t.category_id || 'uncategorized';
                acc[categoryKey] = (acc[categoryKey] || 0) + t.amount;
                return acc;
            }, {});
            const topCategories = Object.entries(categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([category, amount]) => ({ category, amount }));
            const report = {
                totalSpent,
                categoryBreakdown,
                monthlyTrend: [], // TODO: Implement monthly trend calculation
                topCategories,
                transactionCount: transactions.length
            };
            (0, response_1.successResponse)(res, report, 'Spending report generated successfully');
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to generate spending report', 500);
        }
    }
    /**
     * Get income report
     */
    static async getIncomeReport(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            const { startDate, endDate, source } = req.query;
            // Get income transactions
            const filters = { type: 'income' };
            if (source)
                filters.category = source;
            if (startDate)
                filters.startDate = startDate;
            if (endDate)
                filters.endDate = endDate;
            const transactions = await transactionAdapter_1.default.getTransactions(userId, filters);
            const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0);
            const sourceBreakdown = transactions.reduce((acc, t) => {
                const categoryKey = t.category_id || 'uncategorized';
                acc[categoryKey] = (acc[categoryKey] || 0) + t.amount;
                return acc;
            }, {});
            const topSources = Object.entries(sourceBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([source, amount]) => ({ source, amount }));
            const report = {
                totalIncome,
                sourceBreakdown,
                monthlyTrend: [], // TODO: Implement monthly trend calculation
                topSources,
                transactionCount: transactions.length
            };
            (0, response_1.successResponse)(res, report, 'Income report generated successfully');
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to generate income report', 500);
        }
    }
    /**
     * Get budget vs actual report
     */
    static async getBudgetVsActualReport(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            const { month, year } = req.query;
            // TODO: Implement budget vs actual comparison
            const report = {
                budgeted: 0,
                actual: 0,
                variance: 0,
                categoryComparison: []
            };
            (0, response_1.successResponse)(res, report, 'Budget vs actual report generated successfully');
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to generate budget report', 500);
        }
    }
    /**
     * Get savings report
     */
    static async getSavingsReport(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            const { startDate, endDate } = req.query;
            // Get income and expense data
            const incomeData = await transactionAdapter_1.default.getUserIncome(userId);
            const expenseData = await transactionAdapter_1.default.getUserExpenses(userId);
            const totalSaved = incomeData.totalIncome - expenseData.totalExpenses;
            const savingsRate = incomeData.totalIncome > 0 ? (totalSaved / incomeData.totalIncome) * 100 : 0;
            const report = {
                totalSaved,
                monthlySavings: [], // TODO: Implement monthly savings calculation
                savingsRate,
                goals: [] // TODO: Implement goals integration
            };
            (0, response_1.successResponse)(res, report, 'Savings report generated successfully');
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to generate savings report', 500);
        }
    }
    /**
     * Get comprehensive financial report
     */
    static async getComprehensiveReport(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            const { startDate, endDate } = req.query;
            // Get all financial data
            const incomeData = await transactionAdapter_1.default.getUserIncome(userId);
            const expenseData = await transactionAdapter_1.default.getUserExpenses(userId);
            const netSavings = incomeData.totalIncome - expenseData.totalExpenses;
            const savingsRate = incomeData.totalIncome > 0 ? (netSavings / incomeData.totalIncome) * 100 : 0;
            const report = {
                summary: {
                    totalIncome: incomeData.totalIncome,
                    totalExpenses: expenseData.totalExpenses,
                    netSavings,
                    savingsRate
                },
                breakdown: {
                    income: {
                        total: incomeData.totalIncome,
                        count: incomeData.incomeCount,
                        transactions: incomeData.transactions
                    },
                    expenses: {
                        total: expenseData.totalExpenses,
                        count: expenseData.expenseCount,
                        transactions: expenseData.transactions
                    },
                    savings: {
                        total: netSavings,
                        rate: savingsRate
                    }
                },
                trends: {
                    monthly: [], // TODO: Implement monthly trends
                    category: [] // TODO: Implement category trends
                },
                insights: [
                    // TODO: Generate insights based on data
                    'Your spending is within normal range',
                    'Consider increasing your savings rate',
                    'Top spending category: Food & Dining'
                ]
            };
            (0, response_1.successResponse)(res, report, 'Comprehensive report generated successfully');
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to generate comprehensive report', 500);
        }
    }
}
exports.default = ReportController;
//# sourceMappingURL=reportController.js.map