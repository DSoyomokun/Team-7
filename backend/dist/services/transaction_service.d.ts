import { Transaction, TransactionProps } from '../models/Transaction';
declare class TransactionService {
    static createTransaction(userId: string, transactionData: Partial<TransactionProps>): Promise<Transaction>;
    static getTransactions(userId: string, filters?: Record<string, any>): Promise<Transaction[]>;
    static analyzeSpending(userId: string, category: string): Promise<number>;
    static detectRecurringPayments(userId: string): Promise<Transaction[]>;
}
export default TransactionService;
