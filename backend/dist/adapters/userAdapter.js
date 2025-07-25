"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user_service"));
const userAdapter = {
    // Get user profile by ID
    getUserProfile: async (userId) => {
        return await user_service_1.default.getUserProfile(userId);
    },
    // Update user profile
    updateUserProfile: async (userId, updates) => {
        return await user_service_1.default.updateUserProfile(userId, updates);
    },
    // Delete user account
    deleteUser: async (userId) => {
        return await user_service_1.default.deleteUser(userId);
    },
    // Get user preferences
    getUserPreferences: async (userId) => {
        return await user_service_1.default.getUserPreferences(userId);
    },
    // Update user preferences
    updateUserPreferences: async (userId, preferences) => {
        return await user_service_1.default.updateUserPreferences(userId, preferences);
    },
    // Get user statistics
    getUserStats: async (userId) => {
        return await user_service_1.default.getUserStats(userId);
    },
    // Change user password
    changePassword: async (userId, currentPassword, newPassword) => {
        return await user_service_1.default.changePassword(userId, currentPassword, newPassword);
    },
    // Get all users (admin only)
    getAllUsers: async () => {
        return await user_service_1.default.getAllUsers();
    },
    // Search users
    searchUsers: async (query) => {
        return await user_service_1.default.searchUsers(query);
    }
};
exports.default = userAdapter;
//# sourceMappingURL=userAdapter.js.map