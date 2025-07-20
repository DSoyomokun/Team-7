import { TransactionRepository } from '../repositories/transaction.repository';

// Type for a transaction object, adjust as needed based on your actual model
interface Transaction {
  amount: number;
  category?: string;
  isRecurring: () => boolean;
  [key: string]: any; // Allow extra fields for flexibility
}

class TransactionService {
  static async createTransaction(userId: string, transactionData: Partial<Transaction>): Promise<Transaction> {
    return await TransactionRepository.create({
      ...transactionData,
      user_id: userId
    });
  }

  static async getTransactions(userId: string, filters: Record<string, any> = {}): Promise<Transaction[]> {
    return await TransactionRepository.findByUserId(userId, filters);
  }

  static async analyzeSpending(userId: string, category: string): Promise<number> {
    const transactions: Transaction[] = await TransactionRepository.findByUserId(userId, { category });
    return transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  }

  static async detectRecurringPayments(userId: string): Promise<Transaction[]> {
    const transactions: Transaction[] = await TransactionRepository.findByUserId(userId);
    return transactions.filter(t => typeof t.isRecurring === 'function' && t.isRecurring());
  }
}

export default TransactionService;
