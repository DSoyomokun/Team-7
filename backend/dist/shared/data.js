"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions = exports.users = void 0;
// Simple arrays for testing - this matches what the tests expect
exports.users = [];
exports.transactions = [];
class DataStore {
    constructor() {
        this.users = new Map();
        this.transactions = new Map();
        this.nextId = 1;
    }
    // User operations
    async createUser(userData) {
        const id = `user_${this.nextId++}`;
        const user = { ...userData, id };
        this.users.set(id, user);
        exports.users.push(user); // Also add to test array
        return user;
    }
    async getUser(userId) {
        return this.users.get(userId);
    }
    async getAllUsers() {
        return Array.from(this.users.values());
    }
    // Transaction operations
    async createTransaction(transactionData) {
        const id = `txn_${this.nextId++}`;
        const txn = {
            ...transactionData,
            id,
            createdAt: new Date()
        };
        this.transactions.set(id, txn);
        exports.transactions.push(txn); // Also add to test array
        return txn;
    }
    async getTransactionsByUser(userId) {
        return Array.from(this.transactions.values()).filter((tx) => tx.userId === userId);
    }
    async getAllTransactions() {
        return Array.from(this.transactions.values());
    }
    // Migration helper
    async migrateToSupabase(supabase) {
        for (const user of this.users.values()) {
            await supabase.from('users').insert(user);
        }
        for (const txn of this.transactions.values()) {
            await supabase.from('transactions').insert(txn);
        }
        console.log(`Migrated ${this.users.size} users and ${this.transactions.size} transactions`);
    }
}
const store = new DataStore();
exports.default = store;
//# sourceMappingURL=data.js.map