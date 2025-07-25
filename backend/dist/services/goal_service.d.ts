import { GoalFilters } from '../repositories/goal.repository';
import { Goal, GoalProps } from '../models/Goal';
export declare class GoalService {
    static createGoal(userId: string, goalData: Partial<GoalProps>): Promise<Goal>;
    static getGoals(userId: string, filters?: GoalFilters): Promise<Goal[]>;
    static getGoalById(goalId: string, userId: string): Promise<Goal>;
    static updateGoal(goalId: string, userId: string, updates: Partial<GoalProps>): Promise<Goal>;
    static deleteGoal(goalId: string, userId: string): Promise<boolean>;
    static updateGoalProgress(goalId: string, userId: string, newAmount: number): Promise<Goal>;
    static markGoalCompleted(goalId: string, userId: string): Promise<Goal>;
    static markGoalIncomplete(goalId: string, userId: string): Promise<Goal>;
    static updateGoalProgressFromTransactions(userId: string, goalId?: string): Promise<Goal[]>;
    static getGoalAnalytics(userId: string): Promise<{
        total_goals: number;
        active_goals: number;
        completed_goals: number;
        overdue_goals: number;
        total_target_amount: number;
        total_current_amount: number;
        overall_progress_percentage: number;
        savings_summary: any;
        debt_summary: any;
    }>;
    static getSavingsGoals(userId: string): Promise<Goal[]>;
    static getDebtGoals(userId: string): Promise<Goal[]>;
    static getActiveGoals(userId: string): Promise<Goal[]>;
    static getCompletedGoals(userId: string): Promise<Goal[]>;
    static getOverdueGoals(userId: string): Promise<Goal[]>;
    static calculateDailySavingsNeeded(goal: Goal): number;
    static getGoalRecommendations(userId: string): Promise<{
        recommended_emergency_fund: number;
        recommended_debt_payoff: Goal[];
        suggested_savings_goals: any[];
    }>;
}
