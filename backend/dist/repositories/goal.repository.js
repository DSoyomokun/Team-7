"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalRepository = void 0;
const database_1 = require("../config/database");
const Goal_1 = require("../models/Goal");
class GoalRepository {
    static async create(goalData) {
        const goal = new Goal_1.Goal(goalData);
        const { data, error } = await database_1.supabase
            .from('goals')
            .insert(goal.toJSON())
            .select();
        if (error)
            throw new Error(`Goal creation failed: ${error.message}`);
        if (!data || !data[0])
            throw new Error('Goal creation failed: No data returned');
        return new Goal_1.Goal(data[0]);
    }
    static async findByUserId(userId, filters = {}) {
        let query = database_1.supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        // Apply filters
        if (filters.type)
            query = query.eq('type', filters.type);
        if (filters.completed !== undefined)
            query = query.eq('completed', filters.completed);
        const { data, error } = await query;
        if (error)
            throw new Error(`Goal query failed: ${error.message}`);
        if (!data)
            return [];
        let goals = data.map(g => new Goal_1.Goal(g));
        // Apply overdue filter if specified (needs to be done client-side)
        if (filters.overdue !== undefined) {
            goals = goals.filter(goal => goal.isOverdue() === filters.overdue);
        }
        return goals;
    }
    static async findById(id, userId) {
        const { data, error } = await database_1.supabase
            .from('goals')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error) {
            if (error.code === 'PGRST116')
                return null; // Not found
            throw new Error(`Goal query failed: ${error.message}`);
        }
        return new Goal_1.Goal(data);
    }
    static async update(id, userId, updates) {
        // Ensure updated_at is set
        const updateData = {
            ...updates,
            updated_at: new Date().toISOString()
        };
        const { data, error } = await database_1.supabase
            .from('goals')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', userId)
            .select();
        if (error)
            throw new Error(`Goal update failed: ${error.message}`);
        if (!data || !data[0])
            throw new Error('Goal not found or no data returned');
        return new Goal_1.Goal(data[0]);
    }
    static async updateProgress(id, userId, progressUpdate) {
        const updateData = {
            current_amount: progressUpdate.current_amount,
            completed: progressUpdate.completed ?? false,
            updated_at: new Date().toISOString()
        };
        const { data, error } = await database_1.supabase
            .from('goals')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', userId)
            .select();
        if (error)
            throw new Error(`Goal progress update failed: ${error.message}`);
        if (!data || !data[0])
            throw new Error('Goal not found or no data returned');
        return new Goal_1.Goal(data[0]);
    }
    static async delete(id, userId) {
        const { error } = await database_1.supabase
            .from('goals')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error)
            throw new Error(`Goal deletion failed: ${error.message}`);
        return true;
    }
    static async getGoalsByType(userId, type) {
        return this.findByUserId(userId, { type });
    }
    static async getActiveGoals(userId) {
        return this.findByUserId(userId, { completed: false });
    }
    static async getCompletedGoals(userId) {
        return this.findByUserId(userId, { completed: true });
    }
    static async getOverdueGoals(userId) {
        return this.findByUserId(userId, { overdue: true, completed: false });
    }
    // Calculate total progress for savings and debt goals separately
    static async getUserGoalSummary(userId) {
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
exports.GoalRepository = GoalRepository;
//# sourceMappingURL=goal.repository.js.map