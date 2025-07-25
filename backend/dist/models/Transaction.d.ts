export interface TransactionProps {
    id?: string;
    user_id: string;
    account_id: string;
    category_id?: string;
    amount: number;
    description?: string;
    date: Date | string;
    is_expense: boolean;
    created_at?: Date | string;
}
export declare class Transaction {
    id?: string;
    user_id: string;
    account_id: string;
    category_id?: string;
    amount: number;
    description?: string;
    date: Date;
    is_expense: boolean;
    created_at?: Date;
    constructor({ id, user_id, account_id, category_id, amount, description, date, is_expense, created_at }: TransactionProps);
    toJSON(): {
        [key: string]: any;
    };
    isOverBudget(budgetLimit: number): boolean;
    isRecurring(): boolean;
    static validate(props: TransactionProps): {
        isValid: boolean;
        errors: string[];
    };
}
