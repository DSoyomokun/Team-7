export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
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
