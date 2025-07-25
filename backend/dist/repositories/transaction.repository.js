"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const database_1 = require("../config/database");
const Transaction_1 = require("../models/Transaction");
class TransactionRepository {
    static async create(transactionData) {
        const { data, error } = await database_1.supabase
            .from('transactions')
            .insert(new Transaction_1.Transaction(transactionData).toJSON())
            .select();
        if (error)
            throw new Error(`Transaction creation failed: ${error.message}`);
        if (!data || !data[0])
            throw new Error('Transaction creation failed: No data returned');
        return new Transaction_1.Transaction(data[0]);
    }
    static async findByUserId(userId, filters = {}) {
        let query = database_1.supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId);
        // Apply filters
        if (filters.startDate)
            query = query.gte('date', filters.startDate);
        if (filters.endDate)
            query = query.lte('date', filters.endDate);
        if (filters.category)
            query = query.eq('category', filters.category);
        const { data, error } = await query;
        if (error)
            throw new Error(`Transaction query failed: ${error.message}`);
        if (!data)
            return [];
        return data.map(t => new Transaction_1.Transaction(t));
    }
    static async getMonthlySummary(userId, month, year) {
        const { data, error } = await database_1.supabase.rpc('get_monthly_summary', {
            user_id: userId,
            month,
            year
        });
        if (error)
            throw new Error(`Summary query failed: ${error.message}`);
        return data;
    }
}
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction.repository.js.map