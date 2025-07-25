import { Transaction, User } from '../types';
export declare const users: User[];
export declare const transactions: Transaction[];
declare class DataStore {
    private users;
    private transactions;
    private nextId;
    constructor();
    createUser(userData: Omit<User, 'id'>): Promise<User>;
    getUser(userId: string): Promise<User | undefined>;
    getAllUsers(): Promise<User[]>;
    createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction>;
    getTransactionsByUser(userId: string): Promise<Transaction[]>;
    getAllTransactions(): Promise<Transaction[]>;
    migrateToSupabase(supabase: any): Promise<void>;
}
declare const store: DataStore;
export default store;
