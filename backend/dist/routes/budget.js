"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionAdapter_1 = __importDefault(require("../adapters/transactionAdapter"));
const budgetController_1 = require("../controllers/budgetController");
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
// Legacy endpoints (keeping for backward compatibility)
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
// New enhanced budget analysis endpoints
// GET /api/budget/analysis?period=month&year=2024
router.get('/analysis', authMiddleware, budgetController_1.budgetController.getBudgetAnalysis.bind(budgetController_1.budgetController));
// GET /api/budget/trends?period=month&months=6
router.get('/trends', authMiddleware, budgetController_1.budgetController.getBudgetTrends.bind(budgetController_1.budgetController));
// GET /api/budget/categories?period=month (enhanced version)
router.get('/categories', authMiddleware, budgetController_1.budgetController.getCategoryBreakdown.bind(budgetController_1.budgetController));
// Budget limit management endpoints
// POST /api/budget/limits
router.post('/limits', authMiddleware, budgetController_1.budgetController.createBudgetLimit.bind(budgetController_1.budgetController));
// GET /api/budget/limits
router.get('/limits', authMiddleware, budgetController_1.budgetController.getBudgetLimits.bind(budgetController_1.budgetController));
// PUT /api/budget/limits/:id
router.put('/limits/:id', authMiddleware, budgetController_1.budgetController.updateBudgetLimit.bind(budgetController_1.budgetController));
// DELETE /api/budget/limits/:id
router.delete('/limits/:id', authMiddleware, budgetController_1.budgetController.deleteBudgetLimit.bind(budgetController_1.budgetController));
// GET /api/budget/warnings
router.get('/warnings', authMiddleware, budgetController_1.budgetController.getBudgetWarnings.bind(budgetController_1.budgetController));
// GET /api/budget/export?type=spending&period=month&format=csv
router.get('/export', authMiddleware, budgetController_1.budgetController.exportBudgetReport.bind(budgetController_1.budgetController));
exports.default = router;
//# sourceMappingURL=budget.js.map