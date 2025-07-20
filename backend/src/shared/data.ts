// Define types for User and Transaction
export interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: any;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description?: string;
  [key: string]: any;
}

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

  // Transaction operations
  async createTransaction(
    transactionData: Omit<Transaction, 'id'>
  ): Promise<Transaction> {
    const id = `txn_${this.nextId++}`;
    const txn: Transaction = { ...transactionData, id };
    this.transactions.set(id, txn);
    return txn;
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (tx) => tx.user_id === userId
    );
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

// For testing
store.createUser({ email: 'test@example.com', name: 'Test User' });
store.createTransaction({
  user_id: 'user_1',
  amount: 100,
  description: 'Initial transaction'
});

export default store;
