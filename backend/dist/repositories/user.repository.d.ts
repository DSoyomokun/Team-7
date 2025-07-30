interface UserData {
    user_id: string;
    email?: string;
    full_name?: string | null;
    currency_preference?: string;
    created_at?: string;
    updated_at?: string;
}
export declare class UserRepository {
    static findById(userId: string): Promise<UserData>;
    static create(userData: Partial<UserData>): Promise<UserData>;
    static update(userId: string, updates: Partial<UserData>): Promise<UserData>;
    static delete(userId: string): Promise<void>;
}
export {};
