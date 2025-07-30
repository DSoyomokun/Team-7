"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth_service"));
const authAdapter = {
    signUp: async (email, password, name) => {
        try {
            return await auth_service_1.default.signUp(email, password, name);
        }
        catch (error) {
            console.error('AuthAdapter signUp error:', error);
            throw new Error(error.message || 'Failed to sign up');
        }
    },
    login: async (email, password) => {
        try {
            return await auth_service_1.default.login(email, password);
        }
        catch (error) {
            console.error('AuthAdapter login error:', error);
            throw new Error(error.message || 'Failed to login');
        }
    },
    logout: async () => {
        try {
            return await auth_service_1.default.logout();
        }
        catch (error) {
            console.error('AuthAdapter logout error:', error);
            throw new Error(error.message || 'Failed to logout');
        }
    },
    getSession: async () => {
        try {
            return await auth_service_1.default.getSession();
        }
        catch (error) {
            console.error('AuthAdapter getSession error:', error);
            throw new Error(error.message || 'Failed to get session');
        }
    },
    verifyToken: async (token) => {
        try {
            return await auth_service_1.default.verifyToken(token);
        }
        catch (error) {
            console.error('AuthAdapter verifyToken error:', error);
            throw new Error(error.message || 'Failed to verify token');
        }
    },
    refreshToken: async (refreshToken) => {
        try {
            return await auth_service_1.default.refreshToken(refreshToken);
        }
        catch (error) {
            console.error('AuthAdapter refreshToken error:', error);
            throw new Error(error.message || 'Failed to refresh token');
        }
    },
    // Additional methods that might be useful for future auth operations
    resetPassword: async (email) => {
        // Could be implemented when needed
        throw new Error('resetPassword not yet implemented');
    },
    updatePassword: async (newPassword) => {
        // Could be implemented when needed
        throw new Error('updatePassword not yet implemented');
    }
};
exports.default = authAdapter;
//# sourceMappingURL=authAdapter.js.map