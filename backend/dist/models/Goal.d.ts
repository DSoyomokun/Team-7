export interface GoalProps {
    id?: string;
    user_id: string;
    name: string;
    type: 'savings' | 'debt';
    target_amount: number;
    current_amount?: number;
    target_date: Date | string;
    completed?: boolean;
    created_at?: Date | string;
    updated_at?: Date | string;
}
export declare class Goal {
    id?: string;
    user_id: string;
    name: string;
    type: 'savings' | 'debt';
    target_amount: number;
    current_amount: number;
    target_date: Date;
    completed: boolean;
    created_at?: Date;
    updated_at?: Date;
    constructor({ id, user_id, name, type, target_amount, current_amount, target_date, completed, created_at, updated_at }: GoalProps);
    toJSON(): {
        [key: string]: any;
    };
    getProgressPercentage(): number;
    getRemainingAmount(): number;
    addProgress(amount: number): number;
    subtractProgress(amount: number): number;
    setProgress(amount: number): number;
    isOverdue(): boolean;
    getDaysRemaining(): number | null;
    getFormattedProgress(currency?: string): string;
    markComplete(): void;
    markIncomplete(): void;
    static validate(props: GoalProps): {
        isValid: boolean;
        errors: string[];
    };
    static createGoalTemplates(): {
        name: string;
        target_amount: number;
        description: string;
    }[];
    static calculateDailySavingsNeeded(targetAmount: number, targetDate: Date): number;
}
