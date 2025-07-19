"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionAdapter_1 = __importDefault(require("../adapters/transactionAdapter"));
const router = express_1.default.Router();
// Mock authentication middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }
    req.userId = token.split('_')[2];
    next();
};
// GET /api/budget/summary
router.get('/summary', authMiddleware, (req, res) => {
    const userTransactions = transactionAdapter_1.default.getUserTransactions(req.userId);
    const incomeData = transactionAdapter_1.default.getUserIncome(req.userId);
    const expenseData = transactionAdapter_1.default.getUserExpenses(req.userId);
    const balance = incomeData.totalIncome - expenseData.totalExpenses;
    res.status(200).json({
        success: true,
        data: {
            totalIncome: incomeData.totalIncome,
            totalExpenses: expenseData.totalExpenses,
            balance,
            incomeCount: incomeData.incomeCount,
            expenseCount: expenseData.expenseCount,
            recentTransactions: userTransactions.slice(-5)
        }
    });
});
// GET /api/budget/categories
router.get('/categories', authMiddleware, (req, res) => {
    const userTransactions = transactionAdapter_1.default.getUserTransactions(req.userId);
    const expenseCategories = {};
    const incomeCategories = {};
    userTransactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            expenseCategories[transaction.category] =
                (expenseCategories[transaction.category] || 0) + transaction.amount;
        }
        else if (transaction.type === 'income') {
            incomeCategories[transaction.category] =
                (incomeCategories[transaction.category] || 0) + transaction.amount;
        }
    });
    res.status(200).json({
        success: true,
        data: {
            expenseCategories,
            incomeCategories
        }
    });
});
// GET /api/budget/monthly-progress
router.get('/monthly-progress', authMiddleware, (req, res) => {
    const incomeData = transactionAdapter_1.default.getUserIncome(req.userId);
    const expenseData = transactionAdapter_1.default.getUserExpenses(req.userId);
    const monthlyIncome = incomeData.totalIncome;
    const monthlyExpenses = expenseData.totalExpenses;
    const remainingBudget = monthlyIncome - monthlyExpenses;
    const spendingPercentage = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0;
    res.status(200).json({
        success: true,
        data: {
            monthlyIncome,
            monthlyExpenses,
            remainingBudget,
            spendingPercentage
        }
    });
});
exports.default = router;
//# sourceMappingURL=budget.js.map