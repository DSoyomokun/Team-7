"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth_service"));
const authAdapter = {
    signUp: async (email, password, name) => {
        return await auth_service_1.default.signUp(email, password, name);
    },
    login: async (email, password) => {
        return await auth_service_1.default.login(email, password);
    },
    logout: async () => {
        return await auth_service_1.default.logout();
    },
    getSession: async () => {
        return await auth_service_1.default.getSession();
    },
    // Additional methods that might be useful for future auth operations
    resetPassword: async (email) => {
        // Could be implemented when needed
        throw new Error('resetPassword not yet implemented');
    },
    updatePassword: async (newPassword) => {
        // Could be implemented when needed
        throw new Error('updatePassword not yet implemented');
    },
    verifyToken: async (token) => {
        // Could be implemented when needed
        throw new Error('verifyToken not yet implemented');
    }
};
exports.default = authAdapter;
//# sourceMappingURL=authAdapter.js.map