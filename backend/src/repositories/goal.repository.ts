import { supabase } from '../config/database';
import { Goal, GoalProps } from '../models/Goal';

export interface GoalFilters {
  type?: 'savings' | 'debt';
  completed?: boolean;
  overdue?: boolean;
}

export interface GoalProgressUpdate {
  current_amount: number;
  completed?: boolean;
}

export class GoalRepository {
  static async create(goalData: Partial<GoalProps>): Promise<Goal> {
    const goal = new Goal(goalData as GoalProps);
    const { data, error } = await supabase
      .from('goals')
      .insert(goal.toJSON())
      .select();

    if (error) throw new Error(`Goal creation failed: ${error.message}`);
    if (!data || !data[0]) throw new Error('Goal creation failed: No data returned');
    return new Goal(data[0]);
  }

  static async findByUserId(userId: string, filters: GoalFilters = {}): Promise<Goal[]> {
    let query = supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.type) query = query.eq('type', filters.type);
    if (filters.completed !== undefined) query = query.eq('completed', filters.completed);

    const { data, error } = await query;
    if (error) throw new Error(`Goal query failed: ${error.message}`);
    if (!data) return [];
    
    let goals = data.map(g => new Goal(g));

    // Apply overdue filter if specified (needs to be done client-side)
    if (filters.overdue !== undefined) {
      goals = goals.filter(goal => goal.isOverdue() === filters.overdue);
    }

    return goals;
  }

  static async findById(id: string, userId: string): Promise<Goal | null> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Goal query failed: ${error.message}`);
    }
    
    return new Goal(data);
  }

  static async update(id: string, userId: string, updates: Partial<GoalProps>): Promise<Goal> {
    // Ensure updated_at is set
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) throw new Error(`Goal update failed: ${error.message}`);
    if (!data || !data[0]) throw new Error('Goal not found or no data returned');
    
    return new Goal(data[0]);
  }

  static async updateProgress(id: string, userId: string, progressUpdate: GoalProgressUpdate): Promise<Goal> {
    const updateData = {
      current_amount: progressUpdate.current_amount,
      completed: progressUpdate.completed ?? false,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) throw new Error(`Goal progress update failed: ${error.message}`);
    if (!data || !data[0]) throw new Error('Goal not found or no data returned');
    
    return new Goal(data[0]);
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new Error(`Goal deletion failed: ${error.message}`);
    return true;
  }

  static async getGoalsByType(userId: string, type: 'savings' | 'debt'): Promise<Goal[]> {
    return this.findByUserId(userId, { type });
  }

  static async getActiveGoals(userId: string): Promise<Goal[]> {
    return this.findByUserId(userId, { completed: false });
  }

  static async getCompletedGoals(userId: string): Promise<Goal[]> {
    return this.findByUserId(userId, { completed: true });
  }

  static async getOverdueGoals(userId: string): Promise<Goal[]> {
    return this.findByUserId(userId, { overdue: true, completed: false });
  }

  // Calculate total progress for savings and debt goals separately
  static async getUserGoalSummary(userId: string): Promise<{
    savings: { total_target: number; total_current: number; active_count: number };
    debt: { total_target: number; total_current: number; active_count: number };
  }> {
    const savingsGoals = await this.getGoalsByType(userId, 'savings');
    const debtGoals = await this.getGoalsByType(userId, 'debt');

    const activeSavings = savingsGoals.filter(g => !g.completed);
    const activeDebt = debtGoals.filter(g => !g.completed);

    return {
      savings: {
        total_target: activeSavings.reduce((sum, g) => sum + g.target_amount, 0),
        total_current: activeSavings.reduce((sum, g) => sum + g.current_amount, 0),
        active_count: activeSavings.length
      },
      debt: {
        total_target: activeDebt.reduce((sum, g) => sum + g.target_amount, 0),
        total_current: activeDebt.reduce((sum, g) => sum + g.current_amount, 0),
        active_count: activeDebt.length
      }
    };
  }
}