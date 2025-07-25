import { Transaction, TransactionProps } from '../models/Transaction';
interface TransactionFilters {
    startDate?: string;
    endDate?: string;
    category?: string;
}
interface MonthlySummary {
    total_income: number;
    total_expenses: number;
    net_amount: number;
    transaction_count: number;
}
export declare class TransactionRepository {
    static create(transactionData: Partial<TransactionProps>): Promise<Transaction>;
    static findByUserId(userId: string | number, filters?: TransactionFilters): Promise<Transaction[]>;
    static getMonthlySummary(userId: string | number, month: number, year: number): Promise<MonthlySummary>;
}
export {};
