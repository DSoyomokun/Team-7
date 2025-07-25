import supabase from '../lib/supabase';
import { CategoryRepository } from '../repositories/category.repository';
import {
  DashboardSummary,
  AccountSummary,
  TransactionWithDetails,
  GoalProgress,
  SpendingAnalytics,
  CategorySpending,
  IncomeExpenseRatio,
  SpendingTrend,
  BudgetWarning,
  CategoryInfo,
  AccountInfo
} from '../types/dashboard';

export class DashboardService {
  /**
   * Get complete dashboard summary
   */
  static async getDashboardSummary(userId: string): Promise<DashboardSummary> {
    const [accounts, recentTransactions, goals, analytics] = await Promise.all([
      this.getAccountSummaries(userId),
      this.getRecentTransactions(userId, 10),
      this.getGoalProgress(userId),
      this.getSpendingAnalytics(userId, 'month')
    ]);

    return {
      accounts,
      recentTransactions,
      goals,
      analytics
    };
  }

  /**
   * Get account balance summaries
   */
  static async getAccountSummaries(userId: string): Promise<AccountSummary[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select('id, name, type, balance')
      .eq('user_id', userId)
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch account summaries: ${error.message}`);
    }

    return data?.map(account => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance || 0,
      currency: 'USD' // Default currency - could be user preference
    })) || [];
  }

  /**
   * Get recent transactions with full details
   */
  static async getRecentTransactions(userId: string, limit: number = 10): Promise<TransactionWithDetails[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        description,
        date,
        is_expense,
        account_id,
        category_id,
        accounts!inner(
          id,
          name,
          type
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch recent transactions: ${error.message}`);
    }

    if (!data) return [];

    // Get categories for all transactions
    const categoryIds = data
      .map(t => t.category_id)
      .filter((id): id is string => id !== null);

    const categories = await CategoryRepository.findByUserId(userId);
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));

    return data.map(transaction => {
      const category = transaction.category_id 
        ? categoryMap.get(transaction.category_id)
        : null;

      const categoryInfo: CategoryInfo = category ? {
        id: category.id!,
        name: category.name,
        color: category.color || '#747D8C',
        icon: category.icon
      } : {
        id: 'uncategorized',
        name: 'Uncategorized',
        color: '#747D8C'
      };

      const accountInfo: AccountInfo = {
        id: (transaction.accounts as any).id,
        name: (transaction.accounts as any).name,
        type: (transaction.accounts as any).type
      };

      return {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.is_expense ? 'expense' as const : 'income' as const,
        description: transaction.description || '',
        category: categoryInfo,
        account: accountInfo,
        date: new Date(transaction.date)
      };
    });
  }

  /**
   * Get goal progress summaries
   */
  static async getGoalProgress(userId: string): Promise<GoalProgress[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch goal progress: ${error.message}`);
    }

    return data?.map(goal => {
      const progressPercentage = goal.target_amount > 0 
        ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
        : 0;

      const targetDate = new Date(goal.target_date);
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        id: goal.id,
        name: goal.name,
        type: goal.type,
        target_amount: goal.target_amount,
        current_amount: goal.current_amount || 0,
        progress_percentage: progressPercentage,
        days_remaining: Math.max(daysRemaining, 0)
      };
    }) || [];
  }

  /**
   * Get comprehensive spending analytics
   */
  static async getSpendingAnalytics(userId: string, period: 'week' | 'month' | 'year' = 'month'): Promise<SpendingAnalytics> {
    const { startDate, endDate } = this.getDateRange(period);

    const [monthlyBreakdown, incomeVsExpense, trends, budgetWarnings] = await Promise.all([
      this.getMonthlyBreakdown(userId, startDate, endDate),
      this.getIncomeVsExpense(userId, startDate, endDate),
      this.getSpendingTrends(userId, period),
      this.getBudgetWarnings(userId, startDate, endDate)
    ]);

    return {
      monthlyBreakdown,
      incomeVsExpense,
      trends,
      budgetWarnings
    };
  }

  /**
   * Get monthly spending breakdown by category
   */
  private static async getMonthlyBreakdown(userId: string, startDate: Date, endDate: Date): Promise<CategorySpending[]> {
    const categoriesWithSpending = await CategoryRepository.findCategoriesWithSpending(
      userId, 
      startDate, 
      endDate
    );

    const totalSpent = categoriesWithSpending.reduce((sum, cat) => sum + cat.total_spent, 0);

    return categoriesWithSpending.map(cat => ({
      category_id: cat.category_id,
      category_name: cat.category_name,
      amount: cat.total_spent,
      percentage: totalSpent > 0 ? (cat.total_spent / totalSpent) * 100 : 0,
      color: cat.color
    })).sort((a, b) => b.amount - a.amount); // Sort by amount descending
  }

  /**
   * Get income vs expense analysis
   */
  private static async getIncomeVsExpense(userId: string, startDate: Date, endDate: Date): Promise<IncomeExpenseRatio> {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, is_expense')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString());

    if (error) {
      throw new Error(`Failed to fetch income vs expense data: ${error.message}`);
    }

    const totals = data?.reduce((acc, transaction) => {
      if (transaction.is_expense) {
        acc.total_expenses += transaction.amount;
      } else {
        acc.total_income += transaction.amount;
      }
      return acc;
    }, { total_income: 0, total_expenses: 0 }) || { total_income: 0, total_expenses: 0 };

    const netAmount = totals.total_income - totals.total_expenses;
    const ratio = totals.total_expenses > 0 ? totals.total_income / totals.total_expenses : 0;

    return {
      total_income: totals.total_income,
      total_expenses: totals.total_expenses,
      net_amount: netAmount,
      ratio: ratio
    };
  }

  /**
   * Get spending trends over time
   */
  private static async getSpendingTrends(userId: string, period: 'week' | 'month' | 'year'): Promise<SpendingTrend[]> {
    const periodsToCompare = period === 'week' ? 4 : period === 'month' ? 6 : 12;
    const trends: SpendingTrend[] = [];

    for (let i = 0; i < periodsToCompare; i++) {
      const { startDate, endDate } = this.getDateRange(period, i);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('is_expense', true)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString());

      if (error) {
        console.error(`Failed to fetch spending trend for period ${i}:`, error);
        continue;
      }

      const totalAmount = data?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const periodLabel = this.getPeriodLabel(startDate, period);

      trends.push({
        period: periodLabel,
        amount: totalAmount,
        change_percentage: 0 // Calculate after all periods are fetched
      });
    }

    // Calculate change percentages
    for (let i = 1; i < trends.length; i++) {
      const current = trends[i].amount;
      const previous = trends[i - 1].amount;
      
      if (previous > 0) {
        trends[i].change_percentage = ((current - previous) / previous) * 100;
      }
    }

    return trends.reverse(); // Return in chronological order
  }

  /**
   * Get budget warnings (placeholder implementation)
   */
  private static async getBudgetWarnings(userId: string, startDate: Date, endDate: Date): Promise<BudgetWarning[]> {
    // This is a basic implementation - in a real app, you'd have budget limits stored
    const categorySpending = await this.getMonthlyBreakdown(userId, startDate, endDate);
    
    // Example warning thresholds (could be user-configurable)
    const warnings: BudgetWarning[] = [];
    
    categorySpending.forEach(spending => {
      // Simple threshold-based warnings
      let warningLevel: 'low' | 'medium' | 'high' | null = null;
      let limitAmount = 0;

      // Basic category-based limits (these would normally come from user settings)
      const categoryLimits: Record<string, number> = {
        'Food & Dining': 500,
        'Transportation': 300,
        'Shopping': 400,
        'Entertainment': 200
      };

      limitAmount = categoryLimits[spending.category_name] || 1000;

      if (spending.amount > limitAmount * 0.9) {
        warningLevel = 'high';
      } else if (spending.amount > limitAmount * 0.75) {
        warningLevel = 'medium';
      } else if (spending.amount > limitAmount * 0.6) {
        warningLevel = 'low';
      }

      if (warningLevel) {
        warnings.push({
          category_id: spending.category_id,
          category_name: spending.category_name,
          spent_amount: spending.amount,
          limit_amount: limitAmount,
          warning_level: warningLevel
        });
      }
    });

    return warnings;
  }

  /**
   * Export dashboard data in various formats
   */
  static async exportData(
    userId: string, 
    type: 'spending' | 'goals' | 'accounts',
    period: 'week' | 'month' | 'year' = 'month',
    format: 'csv' | 'json' = 'csv'
  ): Promise<string> {
    let data: any;

    switch (type) {
      case 'spending':
        const analytics = await this.getSpendingAnalytics(userId, period);
        data = analytics.monthlyBreakdown;
        break;
      case 'goals':
        data = await this.getGoalProgress(userId);
        break;
      case 'accounts':
        data = await this.getAccountSummaries(userId);
        break;
      default:
        throw new Error('Invalid export type');
    }

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }

    // Convert to CSV
    return this.convertToCSV(data);
  }

  /**
   * Helper method to convert data to CSV format
   */
  private static convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Helper method to get date ranges for different periods
   */
  private static getDateRange(period: 'week' | 'month' | 'year', periodsAgo: number = 0): { startDate: Date; endDate: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - (7 * (periodsAgo + 1)) + 1);
        startDate.setHours(0, 0, 0, 0);
        
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - periodsAgo, 1);
        endDate = new Date(now.getFullYear(), now.getMonth() - periodsAgo + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'year':
        startDate = new Date(now.getFullYear() - periodsAgo, 0, 1);
        endDate = new Date(now.getFullYear() - periodsAgo, 11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
    }

    return { startDate, endDate };
  }

  /**
   * Helper method to generate period labels
   */
  private static getPeriodLabel(date: Date, period: 'week' | 'month' | 'year'): string {
    switch (period) {
      case 'week':
        return `Week of ${date.toLocaleDateString()}`;
      case 'month':
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      case 'year':
        return date.getFullYear().toString();
      default:
        return date.toLocaleDateString();
    }
  }
}