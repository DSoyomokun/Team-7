const { supabase } = require('../../config/database');
const Transaction = require('../Transaction');

class TransactionRepository {
  static async create(transactionData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(new Transaction(transactionData).toJSON())
      .select();

    if (error) throw new Error(`Transaction creation failed: ${error.message}`);
    if (!data || !data[0]) throw new Error('Transaction creation failed: No data returned');
    return new Transaction(data[0]);
  }

  static async findByUserId(userId, filters = {}) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    // Apply filters
    if (filters.startDate) query = query.gte('date', filters.startDate);
    if (filters.endDate) query = query.lte('date', filters.endDate);
    if (filters.category) query = query.eq('category', filters.category);

    const { data, error } = await query;
    if (error) throw new Error(`Transaction query failed: ${error.message}`);
    if (!data) return [];
    
    return data.map(t => new Transaction(t));
  }

  static async getMonthlySummary(userId, month, year) {
    const { data, error } = await supabase.rpc('get_monthly_summary', {
      user_id: userId,
      month,
      year
    });

    if (error) throw new Error(`Summary query failed: ${error.message}`);
    return data;
  }
}

module.exports = TransactionRepository; 