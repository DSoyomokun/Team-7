"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../shared/data");
const transactionAdapter = {
    addTransaction: (transaction) => {
        const newTransaction = {
            id: Date.now().toString(),
            ...transaction,
            date: new Date(transaction.date),
            createdAt: new Date()
        };
        data_1.transactions.push(newTransaction);
        return newTransaction;
    },
    getUserTransactions: (userId, type = null) => {
        let userTransactions = data_1.transactions.filter(t => t.userId === userId);
        if (type) {
            userTransactions = userTransactions.filter(t => t.type === type);
        }
        return userTransactions;
    },
    getUserIncome: (userId) => {
        const userIncome = data_1.transactions.filter(t => t.userId === userId && t.type === 'income');
        const totalIncome = userIncome.reduce((sum, t) => sum + t.amount, 0);
        return {
            totalIncome,
            incomeCount: userIncome.length,
            transactions: userIncome
        };
    },
    getUserExpenses: (userId, category = null) => {
        let userExpenses = data_1.transactions.filter(t => t.userId === userId && t.type === 'expense');
        if (category) {
            userExpenses = userExpenses.filter(t => t.category === category);
        }
        const totalExpenses = userExpenses.reduce((sum, t) => sum + t.amount, 0);
        return {
            totalExpenses,
            expenseCount: userExpenses.length,
            transactions: userExpenses
        };
    },
    getTransactionById: (id) => {
        return data_1.transactions.find(t => t.id === id);
    },
    updateTransaction: (id, updates) => {
        const index = data_1.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            data_1.transactions[index] = { ...data_1.transactions[index], ...updates };
            return data_1.transactions[index];
        }
        return null;
    },
    deleteTransaction: (id) => {
        const index = data_1.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            return data_1.transactions.splice(index, 1)[0];
        }
        return null;
    }
};
exports.default = transactionAdapter;
//# sourceMappingURL=transactionAdapter.js.map