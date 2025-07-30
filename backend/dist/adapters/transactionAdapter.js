"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_service_1 = __importDefault(require("../services/transaction_service"));
const transaction_repository_1 = require("../repositories/transaction.repository");
const transactionAdapter = {
    // New unified create method
    createTransaction: async (userId, transactionData) => {
        return await transaction_service_1.default.createTransaction(userId, transactionData);
    },
    // Legacy method for backward compatibility
    addTransaction: async (transaction) => {
        const { userId, ...transactionData } = transaction;
        return await transaction_service_1.default.createTransaction(userId, transactionData);
    },
    // New unified get method with filters
    getTransactions: async (userId, filters) => {
        return await transaction_service_1.default.getTransactions(userId, filters);
    },
    // Legacy method for backward compatibility
    getUserTransactions: async (userId, type = null) => {
        const filters = type ? { type } : {};
        return await transaction_service_1.default.getTransactions(userId, filters);
    },
    getUserIncome: async (userId) => {
        const transactions = await transaction_service_1.default.getTransactions(userId, { type: 'income' });
        const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0);
        return {
            totalIncome,
            incomeCount: transactions.length,
            transactions
        };
    },
    getUserExpenses: async (userId, category = null) => {
        const filters = { type: 'expense' };
        if (category)
            filters.category = category;
        const transactions = await transaction_service_1.default.getTransactions(userId, filters);
        const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
        return {
            totalExpenses,
            expenseCount: transactions.length,
            transactions
        };
    },
    // New methods from TransactionService
    analyzeSpending: async (userId, category) => {
        return await transaction_service_1.default.analyzeSpending(userId, category);
    },
    detectRecurringPayments: async (userId) => {
        return await transaction_service_1.default.detectRecurringPayments(userId);
    },
    getTransactionById: async (id, userId) => {
        return await transaction_repository_1.TransactionRepository.findById(id, userId);
    },
    updateTransaction: async (id, userId, updates) => {
        return await transaction_repository_1.TransactionRepository.update(id, userId, updates);
    },
    deleteTransaction: async (id, userId) => {
        return await transaction_repository_1.TransactionRepository.delete(id, userId);
    }
};
exports.default = transactionAdapter;
//# sourceMappingURL=transactionAdapter.js.map