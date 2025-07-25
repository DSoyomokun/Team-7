"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const user_repository_1 = require("../repositories/user.repository");
// You can create more precise types for Supabase responses if you wish.
// For now, we use basic types for simplicity.
class AuthService {
    /**
     * Sign up a new user.
     */
    static async signUp(email, password, name) {
        const { data, error } = await database_1.supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name || '',
                    created_at: new Date().toISOString()
                }
            }
        });
        if (error)
            throw new Error(error.message);
        // Create profile record if user was successfully created
        if (data.user) {
            try {
                await user_repository_1.UserRepository.create({
                    user_id: data.user.id,
                    full_name: name || undefined,
                    currency_preference: 'USD'
                });
            }
            catch (profileError) {
                console.error('Failed to create user profile:', profileError);
                // Don't throw here as the auth user was created successfully
                // The profile can be created later if needed
            }
        }
        return data;
    }
    /**
     * Login a user.
     */
    static async login(email, password) {
        const { data, error } = await database_1.supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error)
            throw new Error(error.message);
        return data;
    }
    /**
     * Logout current user/session
     */
    static async logout() {
        const { error } = await database_1.supabase.auth.signOut();
        if (error)
            throw new Error(error.message);
    }
    /**
     * Get current session
     */
    static async getSession() {
        const { data, error } = await database_1.supabase.auth.getSession();
        if (error)
            throw new Error(error.message);
        return data.session;
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth_service.js.map