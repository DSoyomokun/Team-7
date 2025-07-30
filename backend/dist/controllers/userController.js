"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = require("../repositories/user.repository");
const response_1 = require("../utils/response");
class UserController {
    /**
     * Get user profile
     */
    static async getProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            const profile = await user_repository_1.UserRepository.findById(userId);
            (0, response_1.successResponse)(res, { profile }, 'Profile retrieved successfully');
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to retrieve profile', 500);
        }
    }
    /**
     * Update user profile
     */
    static async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            const updates = req.body;
            const updatedProfile = await user_repository_1.UserRepository.update(userId, updates);
            (0, response_1.successResponse)(res, { profile: updatedProfile }, response_1.RESPONSE_MESSAGES.UPDATED);
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to update profile', 400);
        }
    }
    /**
     * Delete user account
     */
    static async deleteAccount(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            await user_repository_1.UserRepository.delete(userId);
            (0, response_1.successResponse)(res, null, response_1.RESPONSE_MESSAGES.DELETED);
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to delete account', 500);
        }
    }
    /**
     * Get user preferences
     */
    static async getPreferences(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            const profile = await user_repository_1.UserRepository.findById(userId);
            const preferences = {
                currency_preference: profile.currency_preference || 'USD',
                language: 'en', // Default value
                notifications: true, // Default value
                theme: 'light' // Default value
            };
            (0, response_1.successResponse)(res, { preferences }, 'Preferences retrieved successfully');
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to retrieve preferences', 500);
        }
    }
    /**
     * Update user preferences
     */
    static async updatePreferences(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            const { currency_preference } = req.body;
            const updates = {};
            if (currency_preference)
                updates.currency_preference = currency_preference;
            const updatedProfile = await user_repository_1.UserRepository.update(userId, updates);
            const preferences = {
                currency_preference: updatedProfile.currency_preference || 'USD',
                language: 'en', // Default value
                notifications: true, // Default value
                theme: 'light' // Default value
            };
            (0, response_1.successResponse)(res, { preferences }, response_1.RESPONSE_MESSAGES.UPDATED);
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to update preferences', 400);
        }
    }
    /**
     * Get user statistics
     */
    static async getUserStats(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            // TODO: Implement actual statistics calculation
            const stats = {
                totalTransactions: 0,
                totalIncome: 0,
                totalExpenses: 0,
                averageMonthlySpending: 0,
                savingsRate: 0,
                accountAge: 0
            };
            (0, response_1.successResponse)(res, { stats }, 'User statistics retrieved successfully');
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to retrieve user statistics', 500);
        }
    }
    /**
     * Change password
     */
    static async changePassword(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return (0, response_1.errorResponse)(res, 'Current password and new password are required', 400);
            }
            if (newPassword.length < 6) {
                return (0, response_1.errorResponse)(res, 'New password must be at least 6 characters long', 400);
            }
            // TODO: Implement password change logic with Supabase
            // For now, return success
            (0, response_1.successResponse)(res, null, 'Password changed successfully');
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to change password', 400);
        }
    }
    /**
     * Search users (public endpoint)
     */
    static async searchUsers(req, res) {
        try {
            const { q } = req.query;
            if (!q || typeof q !== 'string') {
                return (0, response_1.errorResponse)(res, 'Search query is required', 400);
            }
            // TODO: Implement user search logic
            const users = [];
            (0, response_1.successResponse)(res, { users }, 'User search completed');
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to search users', 500);
        }
    }
    /**
     * Get all users (admin only)
     */
    static async getAllUsers(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
            }
            // TODO: Add admin role check and implement getAll method
            const users = [];
            (0, response_1.successResponse)(res, { users }, 'All users retrieved successfully');
        }
        catch (error) {
            (0, response_1.errorResponse)(res, error.message || 'Failed to retrieve users', 500);
        }
    }
}
exports.default = UserController;
//# sourceMappingURL=userController.js.map