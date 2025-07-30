import { Transaction as TransactionModel } from '../models/Transaction';
import { CreateTransactionRequest } from '../types';
interface IncomeData {
    totalIncome: number;
    incomeCount: number;
    transactions: TransactionModel[];
}
interface ExpenseData {
    totalExpenses: number;
    expenseCount: number;
    transactions: TransactionModel[];
}
declare const transactionAdapter: {
    createTransaction: (userId: string, transactionData: any) => Promise<TransactionModel>;
    addTransaction: (transaction: CreateTransactionRequest & {
        userId: string;
    }) => Promise<TransactionModel>;
    getTransactions: (userId: string, filters?: any) => Promise<TransactionModel[]>;
    getUserTransactions: (userId: string, type?: "income" | "expense" | null) => Promise<TransactionModel[]>;
    getUserIncome: (userId: string) => Promise<IncomeData>;
    getUserExpenses: (userId: string, category?: string | null) => Promise<ExpenseData>;
    analyzeSpending: (userId: string, category: string) => Promise<number>;
    detectRecurringPayments: (userId: string) => Promise<any[]>;
    getTransactionById: (id: string, userId: string) => Promise<TransactionModel | null>;
    updateTransaction: (id: string, userId: string, updates: any) => Promise<TransactionModel | null>;
    deleteTransaction: (id: string, userId: string) => Promise<boolean>;
};
export default transactionAdapter;
