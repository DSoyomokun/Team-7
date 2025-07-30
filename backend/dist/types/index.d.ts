export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
}
export interface PublicUser {
    id: string;
    name: string;
    email: string;
}
export interface Transaction {
    id: string;
    userId: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
    date: Date;
    createdAt: Date;
}
export interface Budget {
    id: string;
    userId: string;
    category: string;
    limit: number;
    period: 'weekly' | 'monthly' | 'yearly';
    createdAt: Date;
}
export interface CreateUserRequest {
    email: string;
    name: string;
    password: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface CreateTransactionRequest {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
    date: string;
}
export interface CreateBudgetRequest {
    category: string;
    limit: number;
    period: 'weekly' | 'monthly' | 'yearly';
}
export interface BudgetAnalysis {
    period: string;
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
    categoryBreakdown: CategoryBudget[];
    trends: BudgetTrend[];
    warnings: BudgetWarning[];
    recommendations: BudgetRecommendation[];
}
export interface CategoryBudget {
    category_id: string;
    category_name: string;
    spent_amount: number;
    limit_amount: number | null;
    percentage_of_total: number;
    percentage_of_limit: number | null;
    status: 'under_limit' | 'approaching_limit' | 'over_limit' | 'no_limit';
    color: string;
}
export interface BudgetTrend {
    period: string;
    income: number;
    expenses: number;
    net_amount: number;
    change_percentage: number;
    category_changes: CategoryTrend[];
}
export interface CategoryTrend {
    category_id: string;
    category_name: string;
    current_amount: number;
    previous_amount: number;
    change_percentage: number;
    trend_direction: 'increasing' | 'decreasing' | 'stable';
}
export interface BudgetWarning {
    category_id: string;
    category_name: string;
    spent_amount: number;
    limit_amount: number;
    warning_level: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    days_remaining?: number;
}
export interface BudgetRecommendation {
    type: 'spending_reduction' | 'limit_adjustment' | 'savings_opportunity';
    category_id?: string;
    category_name?: string;
    message: string;
    potential_savings?: number;
    priority: 'low' | 'medium' | 'high';
}
export interface BudgetReport {
    period: string;
    summary: BudgetSummary;
    details: BudgetDetail[];
    trends: BudgetTrend[];
    recommendations: BudgetRecommendation[];
    export_data: ExportData;
}
export interface BudgetSummary {
    total_income: number;
    total_expenses: number;
    net_amount: number;
    savings_rate: number;
    top_spending_categories: CategoryBudget[];
    budget_compliance_rate: number;
}
export interface BudgetDetail {
    category_id: string;
    category_name: string;
    budgeted_amount: number;
    actual_amount: number;
    variance: number;
    variance_percentage: number;
    status: 'under_budget' | 'on_budget' | 'over_budget';
}
export interface ExportData {
    format: 'csv' | 'json' | 'pdf';
    filename: string;
    data: any;
}
