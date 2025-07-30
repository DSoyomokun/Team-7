import TransactionService from '../services/transaction_service';
import { TransactionRepository } from '../repositories/transaction.repository';
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

const transactionAdapter = {
  // New unified create method
  createTransaction: async (userId: string, transactionData: any): Promise<TransactionModel> => {
    return await TransactionService.createTransaction(userId, transactionData);
  },

  // Legacy method for backward compatibility
  addTransaction: async (transaction: CreateTransactionRequest & { userId: string }): Promise<TransactionModel> => {
    const { userId, ...transactionData } = transaction;
    return await TransactionService.createTransaction(userId, transactionData);
  },

  // New unified get method with filters
  getTransactions: async (userId: string, filters?: any): Promise<TransactionModel[]> => {
    return await TransactionService.getTransactions(userId, filters);
  },

  // Legacy method for backward compatibility
  getUserTransactions: async (userId: string, type: 'income' | 'expense' | null = null): Promise<TransactionModel[]> => {
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

  getTransactionById: async (id: string, userId: string): Promise<TransactionModel | null> => {
    return await TransactionRepository.findById(id, userId);
  },

  updateTransaction: async (id: string, userId: string, updates: any): Promise<TransactionModel | null> => {
    return await TransactionRepository.update(id, userId, updates);
  },

  deleteTransaction: async (id: string, userId: string): Promise<boolean> => {
    return await TransactionRepository.delete(id, userId);
  }
};

export default transactionAdapter;