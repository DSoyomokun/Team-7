"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../config/database");
class UserRepository {
    static async findById(userId) {
        const { data, error } = await database_1.supabase
            .from('profile')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error)
            throw new Error(`User not found: ${error.message}`);
        return data;
    }
    static async create(userData) {
        const { data, error } = await database_1.supabase
            .from('profile')
            .insert(userData)
            .select()
            .single();
        if (error)
            throw new Error(`Failed to create user: ${error.message}`);
        return data;
    }
    static async update(userId, updates) {
        const { data, error } = await database_1.supabase
            .from('profile')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single();
        if (error)
            throw new Error(`Failed to update user: ${error.message}`);
        return data;
    }
    static async delete(userId) {
        const { error } = await database_1.supabase
            .from('profile')
            .delete()
            .eq('user_id', userId);
        if (error)
            throw new Error(`Failed to delete user: ${error.message}`);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map