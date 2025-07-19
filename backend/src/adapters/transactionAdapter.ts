import { transactions } from '../shared/data';
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
  addTransaction: (transaction: CreateTransactionRequest & { userId: string }): Transaction => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transaction,
      date: new Date(transaction.date),
      createdAt: new Date()
    };
    transactions.push(newTransaction);
    return newTransaction;
  },

  getUserTransactions: (userId: string, type: 'income' | 'expense' | null = null): Transaction[] => {
    let userTransactions = transactions.filter(t => t.userId === userId);
    if (type) {
      userTransactions = userTransactions.filter(t => t.type === type);
    }
    return userTransactions;
  },

  getUserIncome: (userId: string): IncomeData => {
    const userIncome = transactions.filter(t => t.userId === userId && t.type === 'income');
    const totalIncome = userIncome.reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome,
      incomeCount: userIncome.length,
      transactions: userIncome
    };
  },

  getUserExpenses: (userId: string, category: string | null = null): ExpenseData => {
    let userExpenses = transactions.filter(t => t.userId === userId && t.type === 'expense');
    if (category) {
      userExpenses = userExpenses.filter(t => t.category === category);
    }
    const totalExpenses = userExpenses.reduce((sum, t) => sum + t.amount, 0);
    return {
      totalExpenses,
      expenseCount: userExpenses.length,
      transactions: userExpenses
    };
  },

  getTransactionById: (id: string): Transaction | undefined => {
    return transactions.find(t => t.id === id);
  },

  updateTransaction: (id: string, updates: Partial<Transaction>): Transaction | null => {
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      return transactions[index];
    }
    return null;
  },

  deleteTransaction: (id: string): Transaction | null => {
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      return transactions.splice(index, 1)[0];
    }
    return null;
  }
};

export default transactionAdapter;