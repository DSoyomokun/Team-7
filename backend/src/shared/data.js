
class DataStore {
  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.nextId = 1;
  }

  // User operations
  async createUser(userData) {
    const id = `user_${this.nextId++}`;
    this.users.set(id, { ...userData, id });
    return this.users.get(id);
  }

  async getUser(userId) {
    return this.users.get(userId);
  }

  // Transaction operations
  async createTransaction(transactionData) {
    const id = `txn_${this.nextId++}`;
    this.transactions.set(id, { ...transactionData, id });
    return this.transactions.get(id);
  }

  async getTransactionsByUser(userId) {
    return Array.from(this.transactions.values())
      .filter(tx => tx.user_id === userId);
  }

  // Migration helper
  async migrateToSupabase(supabase) {
    for (const [_, user] of this.users) {
      await supabase.from('users').insert(user);
    }
    for (const [_, txn] of this.transactions) {
      await supabase.from('transactions').insert(txn);
    }
    console.log(`✅ Migrated ${this.users.size} users and ${this.transactions.size} transactions`);
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

module.exports = store;


