// Dashboard-specific TypeScript interfaces for Story 1.6
// Financial Dashboard and Analytics

export interface DashboardSummary {
  accounts: AccountSummary[];
  recentTransactions: TransactionWithDetails[];
  goals: GoalProgress[];
  analytics: SpendingAnalytics;
}

export interface AccountSummary {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

export interface TransactionWithDetails {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  category: CategoryInfo;
  account: AccountInfo;
  date: Date;
}

export interface CategoryInfo {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface AccountInfo {
  id: string;
  name: string;
  type: string;
}

export interface GoalProgress {
  id: string;
  name: string;
  type: 'savings' | 'debt';
  target_amount: number;
  current_amount: number;
  progress_percentage: number;
  days_remaining: number;
}

export interface SpendingAnalytics {
  monthlyBreakdown: CategorySpending[];
  incomeVsExpense: IncomeExpenseRatio;
  trends: SpendingTrend[];
  budgetWarnings: BudgetWarning[];
}

export interface CategorySpending {
  category_id: string;
  category_name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface IncomeExpenseRatio {
  total_income: number;
  total_expenses: number;
  net_amount: number;
  ratio: number;
}

export interface SpendingTrend {
  period: string;
  amount: number;
  change_percentage: number;
}

export interface BudgetWarning {
  category_id: string;
  category_name: string;
  spent_amount: number;
  limit_amount: number;
  warning_level: 'low' | 'medium' | 'high';
}

// Export options for dashboard reports
export interface ExportOptions {
  type: 'spending' | 'goals' | 'accounts';
  period?: 'week' | 'month' | 'year';
  format: 'csv' | 'json';
}

// Dashboard query parameters
export interface DashboardQuery {
  period?: 'week' | 'month' | 'year';
  limit?: number;
}