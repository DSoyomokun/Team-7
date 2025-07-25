export interface AccountProps {
    id?: string;
    user_id: string;
    name: string;
    type: string;
    balance?: number;
    plaid_item_id?: string;
    created_at?: Date | string;
}
export declare class Account {
    id?: string;
    user_id: string;
    name: string;
    type: string;
    balance: number;
    plaid_item_id?: string;
    created_at?: Date;
    constructor({ id, user_id, name, type, balance, plaid_item_id, created_at }: AccountProps);
    toJSON(): {
        [key: string]: any;
    };
    updateBalance(amount: number, isExpense: boolean): number;
    addTransaction(amount: number): number;
    subtractTransaction(amount: number): number;
    getFormattedBalance(currency?: string): string;
    isOverdrawn(): boolean;
    canAfford(amount: number): boolean;
    static validate(props: AccountProps): {
        isValid: boolean;
        errors: string[];
    };
    static getValidTypes(): string[];
}
