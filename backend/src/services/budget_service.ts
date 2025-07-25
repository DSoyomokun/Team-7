import supabase from '../lib/supabase';
import { BudgetLimit } from '../models/BudgetLimit';
import { 
  BudgetAnalysis, 
  CategoryBudget, 
  BudgetTrend, 
  CategoryTrend, 
  BudgetWarning, 
  BudgetRecommendation,
  BudgetReport,
  BudgetSummary,
  BudgetDetail
} from '../types';

export class BudgetService {
  
  // Get comprehensive budget analysis for a user
  async getBudgetAnalysis(userId: string, period: string = 'month', year?: number): Promise<BudgetAnalysis> {
    const { startDate, endDate } = this.getPeriodDates(period, year);
    
    // Get transactions for the period
    const { data: transactions, error: transactionError } = await supabase
      .from('transactions')
      .select(`
        *,
        categories (id, name, color)
      `)
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (transactionError) {
      throw new Error(`Failed to fetch transactions: ${transactionError.message}`);
    }

    // Get budget limits for the user
    const { data: budgetLimits, error: limitsError } = await supabase
      .from('budget_limits')
      .select('*')
      .eq('user_id', userId)
      .eq('period', period === 'week' ? 'weekly' : period === 'year' ? 'yearly' : 'monthly');

    if (limitsError) {
      throw new Error(`Failed to fetch budget limits: ${limitsError.message}`);
    }

    // Calculate totals
    const totalIncome = transactions
      ?.filter(t => !t.is_expense)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
    
    const totalExpenses = transactions
      ?.filter(t => t.is_expense)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

    const netAmount = totalIncome - totalExpenses;

    // Calculate category breakdown
    const categoryBreakdown = await this.calculateCategoryBreakdown(
      transactions || [], 
      budgetLimits || [], 
      totalExpenses
    );

    // Get trends
    const trends = await this.getBudgetTrends(userId, period, 6);

    // Generate warnings
    const warnings = this.generateBudgetWarnings(categoryBreakdown, endDate);

    // Generate recommendations
    const recommendations = this.generateBudgetRecommendations(
      categoryBreakdown, 
      trends, 
      totalIncome, 
      totalExpenses
    );

    return {
      period: `${period}-${year || new Date().getFullYear()}`,
      totalIncome,
      totalExpenses,
      netAmount,
      categoryBreakdown,
      trends,
      warnings,
      recommendations
    };
  }

  // Get budget trends over time
  async getBudgetTrends(userId: string, period: string = 'month', months: number = 6): Promise<BudgetTrend[]> {
    const trends: BudgetTrend[] = [];
    const currentDate = new Date();

    for (let i = 0; i < months; i++) {
      const periodDate = new Date(currentDate);
      
      if (period === 'month') {
        periodDate.setMonth(periodDate.getMonth() - i);
      } else if (period === 'week') {
        periodDate.setDate(periodDate.getDate() - (i * 7));
      } else if (period === 'year') {
        periodDate.setFullYear(periodDate.getFullYear() - i);
      }

      const { startDate, endDate } = this.getPeriodDates(period, periodDate.getFullYear(), periodDate);

      // Get transactions for this period
      const { data: transactions } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (id, name)
        `)
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0]);

      const income = transactions
        ?.filter(t => !t.is_expense)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
      
      const expenses = transactions
        ?.filter(t => t.is_expense)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

      const net_amount = income - expenses;

      // Calculate change percentage from previous period
      let change_percentage = 0;
      if (i > 0 && trends[i - 1]) {
        const previousNet = trends[i - 1].net_amount;
        change_percentage = previousNet !== 0 ? ((net_amount - previousNet) / Math.abs(previousNet)) * 100 : 0;
      }

      // Calculate category changes
      const category_changes = await this.calculateCategoryTrends(transactions || [], i > 0 ? trends[i - 1] : null);

      trends.push({
        period: this.formatPeriod(periodDate, period),
        income,
        expenses,
        net_amount,
        change_percentage,
        category_changes
      });
    }

    return trends.reverse(); // Return in chronological order
  }

  // Get category spending breakdown
  async getCategoryBreakdown(userId: string, period: string = 'month'): Promise<CategoryBudget[]> {
    const { startDate, endDate } = this.getPeriodDates(period);
    
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories (id, name, color)
      `)
      .eq('user_id', userId)
      .eq('is_expense', true)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0]);

    if (error) {
      throw new Error(`Failed to fetch category breakdown: ${error.message}`);
    }

    const totalExpenses = transactions?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;

    // Get budget limits
    const { data: budgetLimits } = await supabase
      .from('budget_limits')
      .select('*')
      .eq('user_id', userId)
      .eq('period', period === 'week' ? 'weekly' : period === 'year' ? 'yearly' : 'monthly');

    return this.calculateCategoryBreakdown(transactions || [], budgetLimits || [], totalExpenses);
  }

  // Budget limit management methods
  async createBudgetLimit(userId: string, categoryId: string, limitAmount: number, period: 'weekly' | 'monthly' | 'yearly'): Promise<BudgetLimit> {
    const { start_date, end_date } = BudgetLimit.generatePeriodDates(period);
    
    const budgetLimit = new BudgetLimit({
      user_id: userId,
      category_id: categoryId,
      limit_amount: limitAmount,
      period,
      start_date,
      end_date
    });

    const { data, error } = await supabase
      .from('budget_limits')
      .insert([budgetLimit.toJSON()])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create budget limit: ${error.message}`);
    }

    return new BudgetLimit(data);
  }

  async getBudgetLimits(userId: string): Promise<BudgetLimit[]> {
    const { data, error } = await supabase
      .from('budget_limits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch budget limits: ${error.message}`);
    }

    return data?.map(limit => new BudgetLimit(limit)) || [];
  }

  async updateBudgetLimit(limitId: string, limitAmount: number, period?: 'weekly' | 'monthly' | 'yearly'): Promise<BudgetLimit> {
    const updateData: any = { limit_amount: limitAmount, updated_at: new Date().toISOString() };
    
    if (period) {
      const { start_date, end_date } = BudgetLimit.generatePeriodDates(period);
      updateData.period = period;
      updateData.start_date = start_date.toISOString().split('T')[0];
      updateData.end_date = end_date.toISOString().split('T')[0];
    }

    const { data, error } = await supabase
      .from('budget_limits')
      .update(updateData)
      .eq('id', limitId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update budget limit: ${error.message}`);
    }

    return new BudgetLimit(data);
  }

  async deleteBudgetLimit(limitId: string): Promise<void> {
    const { error } = await supabase
      .from('budget_limits')
      .delete()
      .eq('id', limitId);

    if (error) {
      throw new Error(`Failed to delete budget limit: ${error.message}`);
    }
  }

  // Get budget warnings
  async getBudgetWarnings(userId: string): Promise<BudgetWarning[]> {
    const categoryBreakdown = await this.getCategoryBreakdown(userId);
    return this.generateBudgetWarnings(categoryBreakdown, new Date());
  }

  // Export budget report
  async exportBudgetReport(userId: string, type: string, period: string, format: 'csv' | 'json' | 'pdf'): Promise<any> {
    let reportData: any;

    switch (type) {
      case 'spending':
        reportData = await this.getBudgetAnalysis(userId, period);
        break;
      case 'limits':
        reportData = await this.getBudgetLimits(userId);
        break;
      case 'trends':
        reportData = await this.getBudgetTrends(userId, period, 12);
        break;
      default:
        throw new Error('Invalid report type');
    }

    // Format data based on export format
    switch (format) {
      case 'json':
        return {
          format: 'json',
          filename: `budget-${type}-${period}-${Date.now()}.json`,
          data: reportData
        };
      case 'csv':
        return {
          format: 'csv',
          filename: `budget-${type}-${period}-${Date.now()}.csv`,
          data: this.convertToCSV(reportData, type)
        };
      case 'pdf':
        return {
          format: 'pdf',
          filename: `budget-${type}-${period}-${Date.now()}.pdf`,
          data: this.generatePDFData(reportData, type)
        };
      default:
        throw new Error('Invalid export format');
    }
  }

  // Private helper methods
  private async calculateCategoryBreakdown(transactions: any[], budgetLimits: any[], totalExpenses: number): Promise<CategoryBudget[]> {
    const categoryMap = new Map<string, {
      spent_amount: number;
      category_name: string;
      color: string;
      limit_amount: number | null;
    }>();

    // Process transactions
    transactions.forEach(transaction => {
      if (transaction.is_expense && transaction.categories) {
        const categoryId = transaction.categories.id;
        const existing = categoryMap.get(categoryId) || {
          spent_amount: 0,
          category_name: transaction.categories.name,
          color: transaction.categories.color || '#747D8C',
          limit_amount: null
        };
        
        existing.spent_amount += parseFloat(transaction.amount);
        categoryMap.set(categoryId, existing);
      }
    });

    // Add budget limits
    budgetLimits.forEach(limit => {
      const existing = categoryMap.get(limit.category_id);
      if (existing) {
        existing.limit_amount = parseFloat(limit.limit_amount);
      }
    });

    // Convert to CategoryBudget array
    const categoryBreakdown: CategoryBudget[] = Array.from(categoryMap.entries()).map(([categoryId, data]) => {
      const percentage_of_total = totalExpenses > 0 ? (data.spent_amount / totalExpenses) * 100 : 0;
      const percentage_of_limit = data.limit_amount ? (data.spent_amount / data.limit_amount) * 100 : null;
      
      let status: CategoryBudget['status'] = 'no_limit';
      if (data.limit_amount) {
        if (percentage_of_limit! >= 100) status = 'over_limit';
        else if (percentage_of_limit! >= 75) status = 'approaching_limit';
        else status = 'under_limit';
      }

      return {
        category_id: categoryId,
        category_name: data.category_name,
        spent_amount: data.spent_amount,
        limit_amount: data.limit_amount,
        percentage_of_total,
        percentage_of_limit,
        status,
        color: data.color
      };
    });

    return categoryBreakdown.sort((a, b) => b.spent_amount - a.spent_amount);
  }

  private async calculateCategoryTrends(transactions: any[], previousTrend: BudgetTrend | null): Promise<CategoryTrend[]> {
    const categoryMap = new Map<string, { amount: number; name: string }>();

    transactions.forEach(transaction => {
      if (transaction.is_expense && transaction.categories) {
        const categoryId = transaction.categories.id;
        const existing = categoryMap.get(categoryId) || { amount: 0, name: transaction.categories.name };
        existing.amount += parseFloat(transaction.amount);
        categoryMap.set(categoryId, existing);
      }
    });

    return Array.from(categoryMap.entries()).map(([categoryId, data]) => {
      const previous = previousTrend?.category_changes.find(c => c.category_id === categoryId);
      const previous_amount = previous?.current_amount || 0;
      const change_percentage = previous_amount !== 0 ? ((data.amount - previous_amount) / Math.abs(previous_amount)) * 100 : 0;
      
      let trend_direction: CategoryTrend['trend_direction'] = 'stable';
      if (Math.abs(change_percentage) > 5) {
        trend_direction = change_percentage > 0 ? 'increasing' : 'decreasing';
      }

      return {
        category_id: categoryId,
        category_name: data.name,
        current_amount: data.amount,
        previous_amount,
        change_percentage,
        trend_direction
      };
    });
  }

  private generateBudgetWarnings(categoryBreakdown: CategoryBudget[], currentDate: Date): BudgetWarning[] {
    const warnings: BudgetWarning[] = [];

    categoryBreakdown.forEach(category => {
      if (category.limit_amount && category.percentage_of_limit !== null) {
        const warningLevel = category.percentage_of_limit >= 100 ? 'critical' :
                           category.percentage_of_limit >= 90 ? 'high' :
                           category.percentage_of_limit >= 75 ? 'medium' : 'low';

        if (warningLevel !== 'low') {
          let message = '';
          if (warningLevel === 'critical') {
            message = `You've exceeded your budget limit for ${category.category_name} by ${(category.percentage_of_limit - 100).toFixed(1)}%`;
          } else if (warningLevel === 'high') {
            message = `You're approaching your budget limit for ${category.category_name} (${category.percentage_of_limit.toFixed(1)}% used)`;
          } else {
            message = `You've used ${category.percentage_of_limit.toFixed(1)}% of your ${category.category_name} budget`;
          }

          warnings.push({
            category_id: category.category_id,
            category_name: category.category_name,
            spent_amount: category.spent_amount,
            limit_amount: category.limit_amount,
            warning_level: warningLevel,
            message
          });
        }
      }
    });

    return warnings.sort((a, b) => {
      const levelOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return levelOrder[b.warning_level] - levelOrder[a.warning_level];
    });
  }

  private generateBudgetRecommendations(
    categoryBreakdown: CategoryBudget[], 
    trends: BudgetTrend[], 
    totalIncome: number, 
    totalExpenses: number
  ): BudgetRecommendation[] {
    const recommendations: BudgetRecommendation[] = [];

    // High spending categories without limits
    const highSpendingNoLimit = categoryBreakdown
      .filter(c => !c.limit_amount && c.percentage_of_total > 15)
      .slice(0, 3);

    highSpendingNoLimit.forEach(category => {
      recommendations.push({
        type: 'limit_adjustment',
        category_id: category.category_id,
        category_name: category.category_name,
        message: `Consider setting a budget limit for ${category.category_name} as it represents ${category.percentage_of_total.toFixed(1)}% of your spending`,
        priority: 'medium'
      });
    });

    // Savings opportunities
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    if (savingsRate < 20) {
      const topCategory = categoryBreakdown[0];
      if (topCategory) {
        recommendations.push({
          type: 'spending_reduction',
          category_id: topCategory.category_id,
          category_name: topCategory.category_name,
          message: `Reducing ${topCategory.category_name} spending by 10% could increase your savings rate`,
          potential_savings: topCategory.spent_amount * 0.1,
          priority: 'high'
        });
      }
    }

    // Increasing trend warnings
    if (trends.length >= 2) {
      const latestTrend = trends[trends.length - 1];
      latestTrend.category_changes
        .filter(c => c.trend_direction === 'increasing' && c.change_percentage > 25)
        .slice(0, 2)
        .forEach(category => {
          recommendations.push({
            type: 'spending_reduction',
            category_id: category.category_id,
            category_name: category.category_name,
            message: `${category.category_name} spending increased by ${category.change_percentage.toFixed(1)}% - consider reviewing recent purchases`,
            priority: 'medium'
          });
        });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private getPeriodDates(period: string, year?: number, baseDate?: Date): { startDate: Date; endDate: Date } {
    const currentDate = baseDate || new Date();
    const targetYear = year || currentDate.getFullYear();
    
    let startDate = new Date(targetYear, 0, 1); // Default to start of year
    let endDate = new Date(targetYear, 11, 31, 23, 59, 59); // Default to end of year

    switch (period) {
      case 'week':
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startDate = new Date(targetYear, currentDate.getMonth(), 1);
        endDate = new Date(targetYear, currentDate.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'year':
        startDate = new Date(targetYear, 0, 1);
        endDate = new Date(targetYear, 11, 31, 23, 59, 59);
        break;
    }

    return { startDate, endDate };
  }

  private formatPeriod(date: Date, period: string): string {
    switch (period) {
      case 'week':
        return `Week of ${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      case 'month':
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      case 'year':
        return date.getFullYear().toString();
      default:
        return date.toISOString().split('T')[0];
    }
  }

  private convertToCSV(data: any, type: string): string {
    // Simple CSV conversion - in production, use a proper CSV library
    switch (type) {
      case 'spending':
        const categories = data.categoryBreakdown;
        let csv = 'Category,Amount,Percentage,Status\n';
        categories.forEach((cat: CategoryBudget) => {
          csv += `${cat.category_name},${cat.spent_amount},${cat.percentage_of_total.toFixed(2)}%,${cat.status}\n`;
        });
        return csv;
      default:
        return JSON.stringify(data);
    }
  }

  private generatePDFData(data: any, type: string): any {
    // Placeholder for PDF generation - in production, use a PDF library like puppeteer or jsPDF
    return {
      title: `Budget ${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      generatedAt: new Date().toISOString(),
      data: data
    };
  }
}

export const budgetService = new BudgetService();