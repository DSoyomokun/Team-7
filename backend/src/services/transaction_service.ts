import { TransactionRepository } from '../repositories/transaction.repository';
import { AccountService } from './account_service';
import { Transaction, TransactionProps } from '../models/Transaction';

class TransactionService {
  static async createTransaction(userId: string, transactionData: Partial<TransactionProps>): Promise<Transaction> {
    // Ensure user has a default account if no account_id provided
    if (!transactionData.account_id) {
      const defaultAccount = await AccountService.ensureDefaultAccount(userId);
      transactionData.account_id = defaultAccount.id;
    }

    // Validate account belongs to user
    if (transactionData.account_id) {
      await AccountService.getAccountById(transactionData.account_id, userId);
    }

    // Create transaction
    const transaction = await TransactionRepository.create({
      ...transactionData,
      user_id: userId
    } as TransactionProps);

    // Update account balance
    if (transaction.account_id && transaction.amount && transaction.is_expense !== undefined) {
      try {
        await AccountService.updateBalanceForTransaction(
          transaction.account_id,
          transaction.amount,
          transaction.is_expense
        );
      } catch (error) {
        // Log error but don't fail transaction creation
        console.error('Failed to update account balance:', error);
      }
    }

    return transaction;
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
