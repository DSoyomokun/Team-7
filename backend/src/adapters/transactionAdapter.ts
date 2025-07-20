import TransactionService from '../services/transaction_service';
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

const transactionAdapter = {
  // New unified create method
  createTransaction: async (userId: string, transactionData: any): Promise<Transaction> => {
    return await TransactionService.createTransaction(userId, transactionData);
  },

  // Legacy method for backward compatibility
  addTransaction: async (transaction: CreateTransactionRequest & { userId: string }): Promise<Transaction> => {
    const { userId, ...transactionData } = transaction;
    return await TransactionService.createTransaction(userId, transactionData);
  },

  // New unified get method with filters
  getTransactions: async (userId: string, filters?: any): Promise<Transaction[]> => {
    return await TransactionService.getTransactions(userId, filters);
  },

  // Legacy method for backward compatibility
  getUserTransactions: async (userId: string, type: 'income' | 'expense' | null = null): Promise<Transaction[]> => {
    const filters = type ? { type } : {};
    return await TransactionService.getTransactions(userId, filters);
  },

  getUserIncome: async (userId: string): Promise<IncomeData> => {
    const transactions = await TransactionService.getTransactions(userId, { type: 'income' });
    const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome,
      incomeCount: transactions.length,
      transactions
    };
  },

  getUserExpenses: async (userId: string, category: string | null = null): Promise<ExpenseData> => {
    const filters: any = { type: 'expense' };
    if (category) filters.category = category;
    
    const transactions = await TransactionService.getTransactions(userId, filters);
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      totalExpenses,
      expenseCount: transactions.length,
      transactions
    };
  },

  // New methods from TransactionService
  analyzeSpending: async (userId: string, category: string): Promise<number> => {
    return await TransactionService.analyzeSpending(userId, category);
  },

  detectRecurringPayments: async (userId: string): Promise<any[]> => {
    return await TransactionService.detectRecurringPayments(userId);
  },

  getTransactionById: async (id: string): Promise<Transaction | undefined> => {
    // Note: This would need to be implemented in TransactionService
    throw new Error('getTransactionById not yet implemented with database');
  },

  updateTransaction: async (id: string, updates: Partial<Transaction>): Promise<Transaction | null> => {
    // Note: This would need to be implemented in TransactionService
    throw new Error('updateTransaction not yet implemented with database');
  },

  deleteTransaction: async (id: string): Promise<Transaction | null> => {
    // Note: This would need to be implemented in TransactionService
    throw new Error('deleteTransaction not yet implemented with database');
  }
};

export default transactionAdapter;