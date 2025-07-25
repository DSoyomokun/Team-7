import { Transaction, CreateTransactionRequest } from '../types';
interface IncomeData {
    totalIncome: number;
    incomeCount: number;
    transactions: Transaction[];
}
interface ExpenseData {
    totalExpenses: number;
    expenseCount: number;
    transactions: Transaction[];
}
declare const transactionAdapter: {
    createTransaction: (userId: string, transactionData: any) => Promise<Transaction>;
    addTransaction: (transaction: CreateTransactionRequest & {
        userId: string;
    }) => Promise<Transaction>;
    getTransactions: (userId: string, filters?: any) => Promise<Transaction[]>;
    getUserTransactions: (userId: string, type?: "income" | "expense" | null) => Promise<Transaction[]>;
    getUserIncome: (userId: string) => Promise<IncomeData>;
    getUserExpenses: (userId: string, category?: string | null) => Promise<ExpenseData>;
    analyzeSpending: (userId: string, category: string) => Promise<number>;
    detectRecurringPayments: (userId: string) => Promise<any[]>;
    getTransactionById: (id: string) => Promise<Transaction | undefined>;
    updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<Transaction | null>;
    deleteTransaction: (id: string) => Promise<Transaction | null>;
};
export default transactionAdapter;
