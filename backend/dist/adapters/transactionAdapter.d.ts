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
    addTransaction: (transaction: CreateTransactionRequest & {
        userId: string;
    }) => Transaction;
    getUserTransactions: (userId: string, type?: "income" | "expense" | null) => Transaction[];
    getUserIncome: (userId: string) => IncomeData;
    getUserExpenses: (userId: string, category?: string | null) => ExpenseData;
    getTransactionById: (id: string) => Transaction | undefined;
    updateTransaction: (id: string, updates: Partial<Transaction>) => Transaction | null;
    deleteTransaction: (id: string) => Transaction | null;
};
export default transactionAdapter;
