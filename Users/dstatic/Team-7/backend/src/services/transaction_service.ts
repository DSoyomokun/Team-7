/**
 * Transaction Service
 * Business logic for transaction management with category support
 */

import { supabase } from '../config/database';

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id?: string;
  amount: number;
  description: string;
  date: string;
  is_expense: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTransactionInput {
  account_id: string;
  category_id?: string;
  amount: number;
  description: string;
  date: string;
  is_expense: boolean;
}

export interface UpdateTransactionInput {
  account_id?: string;
  category_id?: string;
  amount?: number;
  description?: string;
  date?: string;
  is_expense?: boolean;
}

export class TransactionService {
  /**
   * Creates a new transaction with optional category assignment
   */
  static async createTransaction(userId: string, input: CreateTransactionInput): Promise<{ success: boolean; data?: Transaction; error?: string }> {
    try {
      // Validate category if provided
      if (input.category_id) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('id', input.category_id)
          .eq('user_id', userId)
          .single();

        if (!category) {
          return { success: false, error: 'Invalid category selected' };
        }
      }

      // Validate account belongs to user
      const { data: account } = await supabase
        .from('accounts')
        .select('id')
        .eq('id', input.account_id)
        .eq('user_id', userId)
        .single();

      if (!account) {
        return { success: false, error: 'Invalid account selected' };
      }

      // Create transaction
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          account_id: input.account_id,
          category_id: input.category_id || null,
          amount: input.amount,
          description: input.description,
          date: input.date,
          is_expense: input.is_expense
        })
        .select(`
          *,
          category:categories(id, name, color, icon),
          account:accounts(id, name, type)
        `)
        .single();

      if (error) {
        return { success: false, error: 'Failed to create transaction' };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Gets all transactions for a user with optional category filtering
   */
  static async getUserTransactions(userId: string, categoryId?: string): Promise<{ success: boolean; data?: Transaction[]; error?: string }> {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          category:categories(id, name, color, icon),
          account:accounts(id, name, type)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: 'Failed to fetch transactions' };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Updates a transaction with category support
   */
  static async updateTransaction(userId: string, transactionId: string, input: UpdateTransactionInput): Promise<{ success: boolean; data?: Transaction; error?: string }> {
    try {
      // Check if transaction exists and belongs to user
      const { data: existingTransaction } = await supabase
        .from('transactions')
        .select('id')
        .eq('id', transactionId)
        .eq('user_id', userId)
        .single();

      if (!existingTransaction) {
        return { success: false, error: 'Transaction not found' };
      }

      // Validate category if provided
      if (input.category_id) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('id', input.category_id)
          .eq('user_id', userId)
          .single();

        if (!category) {
          return { success: false, error: 'Invalid category selected' };
        }
      }

      // Validate account if provided
      if (input.account_id) {
        const { data: account } = await supabase
          .from('accounts')
          .select('id')
          .eq('id', input.account_id)
          .eq('user_id', userId)
          .single();

        if (!account) {
          return { success: false, error: 'Invalid account selected' };
        }
      }

      // Prepare update data
      const updateData: any = {};
      if (input.account_id !== undefined) updateData.account_id = input.account_id;
      if (input.category_id !== undefined) updateData.category_id = input.category_id;
      if (input.amount !== undefined) updateData.amount = input.amount;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.date !== undefined) updateData.date = input.date;
      if (input.is_expense !== undefined) updateData.is_expense = input.is_expense;

      // Update transaction
      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transactionId)
        .eq('user_id', userId)
        .select(`
          *,
          category:categories(id, name, color, icon),
          account:accounts(id, name, type)
        `)
        .single();

      if (error) {
        return { success: false, error: 'Failed to update transaction' };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Gets transactions grouped by category for analytics
   */
  static async getTransactionsByCategory(userId: string, startDate?: string, endDate?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          amount,
          is_expense,
          category:categories(id, name, color, icon)
        `)
        .eq('user_id', userId);

      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: 'Failed to fetch transaction analytics' };
      }

      // Group transactions by category
      const categoryStats = data.reduce((acc: any, transaction: any) => {
        const categoryName = transaction.category?.name || 'Uncategorized';
        const categoryId = transaction.category?.id || 'uncategorized';
        
        if (!acc[categoryId]) {
          acc[categoryId] = {
            category: transaction.category || { name: 'Uncategorized', color: '#607D8B', icon: '❓' },
            totalIncome: 0,
            totalExpenses: 0,
            transactionCount: 0
          };
        }

        if (transaction.is_expense) {
          acc[categoryId].totalExpenses += transaction.amount;
        } else {
          acc[categoryId].totalIncome += transaction.amount;
        }
        acc[categoryId].transactionCount += 1;

        return acc;
      }, {});

      return { success: true, data: Object.values(categoryStats) };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }
}