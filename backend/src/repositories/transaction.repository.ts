import { supabase } from '../config/database';
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

export class TransactionRepository {
  static async create(transactionData: Partial<TransactionProps>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(new Transaction(transactionData as TransactionProps).toJSON())
      .select();

    if (error) throw new Error(`Transaction creation failed: ${error.message}`);
    if (!data || !data[0]) throw new Error('Transaction creation failed: No data returned');
    return new Transaction(data[0]);
  }

  static async findByUserId(userId: string | number, filters: TransactionFilters = {}): Promise<Transaction[]> {
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

  static async findById(id: string, userId?: string): Promise<Transaction | null> {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Transaction query failed: ${error.message}`);
    }
    
    return data ? new Transaction(data) : null;
  }

  static async update(id: string, userId: string, updates: Partial<TransactionProps>): Promise<Transaction | null> {
    // First verify the transaction exists and belongs to the user
    const existing = await this.findById(id, userId);
    if (!existing) return null;

    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Transaction update failed: ${error.message}`);
    return data ? new Transaction(data) : null;
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    // First verify the transaction exists and belongs to the user
    const existing = await this.findById(id, userId);
    if (!existing) return false;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new Error(`Transaction deletion failed: ${error.message}`);
    return true;
  }

  static async getMonthlySummary(userId: string | number, month: number, year: number): Promise<MonthlySummary> {
    const { data, error } = await supabase.rpc('get_monthly_summary', {
      user_id: userId,
      month,
      year
    });

    if (error) throw new Error(`Summary query failed: ${error.message}`);
    return data;
  }
}