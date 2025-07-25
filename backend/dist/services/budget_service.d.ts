import { BudgetLimit } from '../models/BudgetLimit';
import { BudgetAnalysis, CategoryBudget, BudgetTrend, BudgetWarning } from '../types';
export declare class BudgetService {
    getBudgetAnalysis(userId: string, period?: string, year?: number): Promise<BudgetAnalysis>;
    getBudgetTrends(userId: string, period?: string, months?: number): Promise<BudgetTrend[]>;
    getCategoryBreakdown(userId: string, period?: string): Promise<CategoryBudget[]>;
    createBudgetLimit(userId: string, categoryId: string, limitAmount: number, period: 'weekly' | 'monthly' | 'yearly'): Promise<BudgetLimit>;
    getBudgetLimits(userId: string): Promise<BudgetLimit[]>;
    updateBudgetLimit(limitId: string, limitAmount: number, period?: 'weekly' | 'monthly' | 'yearly'): Promise<BudgetLimit>;
    deleteBudgetLimit(limitId: string): Promise<void>;
    getBudgetWarnings(userId: string): Promise<BudgetWarning[]>;
    exportBudgetReport(userId: string, type: string, period: string, format: 'csv' | 'json' | 'pdf'): Promise<any>;
    private calculateCategoryBreakdown;
    private calculateCategoryTrends;
    private generateBudgetWarnings;
    private generateBudgetRecommendations;
    private getPeriodDates;
    private formatPeriod;
    private convertToCSV;
    private generatePDFData;
}
export declare const budgetService: BudgetService;
