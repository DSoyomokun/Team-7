"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const user_repository_1 = require("../repositories/user.repository");
const User_1 = require("../models/User");
class UserService {
    static async getUserProfile(userId) {
        const profile = await user_repository_1.UserRepository.findById(userId);
        // Get user email from auth.users
        const { data: authUser, error: authError } = await database_1.supabase.auth.admin.getUserById(userId);
        if (authError)
            throw new Error(`Failed to get auth user: ${authError.message}`);
        return {
            user_id: profile.user_id,
            full_name: profile.full_name || null,
            currency_preference: profile.currency_preference || 'USD',
            email: authUser.user?.email
        };
    }
    static async updateUserProfile(userId, updates) {
        // Validate currency preference if provided
        if (updates.currency_preference && !User_1.SUPPORTED_CURRENCIES.includes(updates.currency_preference)) {
            throw new Error(`Unsupported currency: ${updates.currency_preference}. Supported currencies: ${User_1.SUPPORTED_CURRENCIES.join(', ')}`);
        }
        // Remove fields that shouldn't be updated directly
        const { user_id, created_at, updated_at, email, ...profileUpdates } = updates;
        const updatedProfile = await user_repository_1.UserRepository.update(userId, profileUpdates);
        // Return complete profile with auth data
        return await this.getUserProfile(userId);
    }
    static async getUserPreferences(userId) {
        const profile = await user_repository_1.UserRepository.findById(userId);
        return {
            currency_preference: profile.currency_preference || 'USD'
        };
    }
    static async updateUserPreferences(userId, preferences) {
        // Validate currency preference
        if (preferences.currency_preference && !User_1.SUPPORTED_CURRENCIES.includes(preferences.currency_preference)) {
            throw new Error(`Unsupported currency: ${preferences.currency_preference}. Supported currencies: ${User_1.SUPPORTED_CURRENCIES.join(', ')}`);
        }
        await user_repository_1.UserRepository.update(userId, preferences);
        return await this.getUserPreferences(userId);
    }
    static async deleteUser(userId) {
        try {
            await user_repository_1.UserRepository.delete(userId);
            const { error } = await database_1.supabase.auth.admin.deleteUser(userId);
            if (error)
                throw new Error(error.message);
            return true;
        }
        catch (error) {
            console.error('Failed to delete user:', error);
            return false;
        }
    }
    static async getUserStats(userId) {
        // Get user transaction counts and other stats
        const { data: transactionStats, error: transactionError } = await database_1.supabase
            .from('transactions')
            .select('id, amount, is_expense')
            .eq('user_id', userId);
        if (transactionError)
            throw new Error(`Failed to get transaction stats: ${transactionError.message}`);
        const totalTransactions = transactionStats?.length || 0;
        const totalExpenses = transactionStats?.filter(t => t.is_expense).length || 0;
        const totalIncome = transactionStats?.filter(t => !t.is_expense).length || 0;
        const totalExpenseAmount = transactionStats?.filter(t => t.is_expense).reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0;
        const totalIncomeAmount = transactionStats?.filter(t => !t.is_expense).reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0;
        return {
            totalTransactions,
            totalExpenses,
            totalIncome,
            totalExpenseAmount,
            totalIncomeAmount,
            netAmount: totalIncomeAmount - totalExpenseAmount
        };
    }
    static async changePassword(userId, currentPassword, newPassword) {
        try {
            // Update password using Supabase auth
            const { error } = await database_1.supabase.auth.admin.updateUserById(userId, {
                password: newPassword
            });
            if (error)
                throw new Error(error.message);
            return true;
        }
        catch (error) {
            console.error('Failed to change password:', error);
            return false;
        }
    }
    static async getAllUsers() {
        // This should be admin-only functionality
        const { data: profiles, error } = await database_1.supabase
            .from('profile')
            .select('*');
        if (error)
            throw new Error(`Failed to get users: ${error.message}`);
        return profiles.map(profile => ({
            id: profile.user_id,
            name: profile.full_name || 'Unknown',
            email: 'email-hidden' // For security, don't expose emails in bulk queries
        }));
    }
    static async searchUsers(query) {
        const { data: profiles, error } = await database_1.supabase
            .from('profile')
            .select('*')
            .ilike('full_name', `%${query}%`);
        if (error)
            throw new Error(`Failed to search users: ${error.message}`);
        return profiles.map(profile => ({
            id: profile.user_id,
            name: profile.full_name || 'Unknown',
            email: 'email-hidden' // For security, don't expose emails in search
        }));
    }
    // Legacy methods for backward compatibility
    static async getProfile(userId) {
        return await this.getUserProfile(userId);
    }
    static async updateProfile(userId, updates) {
        return await this.updateUserProfile(userId, updates);
    }
    static async deleteAccount(userId) {
        const success = await this.deleteUser(userId);
        if (!success) {
            throw new Error('Failed to delete account');
        }
    }
}
exports.default = UserService;
//# sourceMappingURL=user_service.js.map