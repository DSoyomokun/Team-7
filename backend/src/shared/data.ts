import { Transaction, User } from '../types';

class DataStore {
  private users: Map<string, User>;
  private transactions: Map<string, Transaction>;
  private nextId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.nextId = 1;
  }

  // User operations
  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const id = `user_${this.nextId++}`;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }

  async getUser(userId: string): Promise<User | undefined> {
    return this.users.get(userId);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Transaction operations
  async createTransaction(
    transactionData: Omit<Transaction, 'id' | 'createdAt'>
  ): Promise<Transaction> {
    const id = `txn_${this.nextId++}`;
    const txn: Transaction = { 
      ...transactionData, 
      id,
      createdAt: new Date()
    };
    this.transactions.set(id, txn);
    return txn;
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (tx) => tx.userId === userId
    );
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  // Migration helper
  async migrateToSupabase(supabase: any): Promise<void> {
    for (const user of this.users.values()) {
      await supabase.from('users').insert(user);
    }
    for (const txn of this.transactions.values()) {
      await supabase.from('transactions').insert(txn);
    }
    console.log(
      `Migrated ${this.users.size} users and ${this.transactions.size} transactions`
    );
  }
}

const store = new DataStore();

export default store;
