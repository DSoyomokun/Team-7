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
export declare class GoalRepository {
    static create(goalData: Partial<GoalProps>): Promise<Goal>;
    static findByUserId(userId: string, filters?: GoalFilters): Promise<Goal[]>;
    static findById(id: string, userId: string): Promise<Goal | null>;
    static update(id: string, userId: string, updates: Partial<GoalProps>): Promise<Goal>;
    static updateProgress(id: string, userId: string, progressUpdate: GoalProgressUpdate): Promise<Goal>;
    static delete(id: string, userId: string): Promise<boolean>;
    static getGoalsByType(userId: string, type: 'savings' | 'debt'): Promise<Goal[]>;
    static getActiveGoals(userId: string): Promise<Goal[]>;
    static getCompletedGoals(userId: string): Promise<Goal[]>;
    static getOverdueGoals(userId: string): Promise<Goal[]>;
    static getUserGoalSummary(userId: string): Promise<{
        savings: {
            total_target: number;
            total_current: number;
            active_count: number;
        };
        debt: {
            total_target: number;
            total_current: number;
            active_count: number;
        };
    }>;
}
