export interface BudgetLimitProps {
    id?: string;
    user_id: string;
    category_id: string;
    limit_amount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    start_date: Date | string;
    end_date: Date | string;
    created_at?: Date | string;
    updated_at?: Date | string;
}
export declare class BudgetLimit {
    id?: string;
    user_id: string;
    category_id: string;
    limit_amount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    start_date: Date;
    end_date: Date;
    created_at?: Date;
    updated_at?: Date;
    constructor({ id, user_id, category_id, limit_amount, period, start_date, end_date, created_at, updated_at }: BudgetLimitProps);
    toJSON(): {
        [key: string]: any;
    };
    isActive(date?: Date): boolean;
    calculateSpendingPercentage(spentAmount: number): number;
    getWarningLevel(spentAmount: number): 'low' | 'medium' | 'high' | 'critical';
    static generatePeriodDates(period: 'weekly' | 'monthly' | 'yearly', baseDate?: Date): {
        start_date: Date;
        end_date: Date;
    };
    static validate(props: BudgetLimitProps): {
        isValid: boolean;
        errors: string[];
    };
}
