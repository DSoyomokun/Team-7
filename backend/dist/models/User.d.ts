export declare class User {
    id: number | string;
    name: string;
    email: string;
    constructor(id: number | string, name: string, email: string);
}
export interface UserProfile {
    id?: string;
    user_id: string;
    full_name: string | null;
    currency_preference: string;
    created_at?: Date;
    updated_at?: Date;
}
export interface UserPreferences {
    currency_preference: string;
}
export declare const SUPPORTED_CURRENCIES: readonly ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CHF"];
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];
