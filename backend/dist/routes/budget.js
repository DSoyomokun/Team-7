"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionAdapter_1 = __importDefault(require("../adapters/transactionAdapter"));
const budgetController_1 = require("../controllers/budgetController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Legacy endpoints (keeping for backward compatibility)
// GET /api/budget/summary
router.get('/summary', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        const userTransactions = await transactionAdapter_1.default.getUserTransactions(userId);
        const incomeData = await transactionAdapter_1.default.getUserIncome(userId);
        const expenseData = await transactionAdapter_1.default.getUserExpenses(userId);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// GET /api/budget/monthly-progress
router.get('/monthly-progress', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        const incomeData = await transactionAdapter_1.default.getUserIncome(userId);
        const expenseData = await transactionAdapter_1.default.getUserExpenses(userId);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// New enhanced budget analysis endpoints
// GET /api/budget/analysis?period=month&year=2024
router.get('/analysis', auth_1.authenticateUser, budgetController_1.budgetController.getBudgetAnalysis.bind(budgetController_1.budgetController));
// GET /api/budget/trends?period=month&months=6
router.get('/trends', auth_1.authenticateUser, budgetController_1.budgetController.getBudgetTrends.bind(budgetController_1.budgetController));
// GET /api/budget/categories?period=month (enhanced version)
router.get('/categories', auth_1.authenticateUser, budgetController_1.budgetController.getCategoryBreakdown.bind(budgetController_1.budgetController));
// Budget limit management endpoints
// POST /api/budget/limits
router.post('/limits', auth_1.authenticateUser, budgetController_1.budgetController.createBudgetLimit.bind(budgetController_1.budgetController));
// GET /api/budget/limits
router.get('/limits', auth_1.authenticateUser, budgetController_1.budgetController.getBudgetLimits.bind(budgetController_1.budgetController));
// PUT /api/budget/limits/:id
router.put('/limits/:id', auth_1.authenticateUser, budgetController_1.budgetController.updateBudgetLimit.bind(budgetController_1.budgetController));
// DELETE /api/budget/limits/:id
router.delete('/limits/:id', auth_1.authenticateUser, budgetController_1.budgetController.deleteBudgetLimit.bind(budgetController_1.budgetController));
// GET /api/budget/warnings
router.get('/warnings', auth_1.authenticateUser, budgetController_1.budgetController.getBudgetWarnings.bind(budgetController_1.budgetController));
// GET /api/budget/export?type=spending&period=month&format=csv
router.get('/export', auth_1.authenticateUser, budgetController_1.budgetController.exportBudgetReport.bind(budgetController_1.budgetController));
exports.default = router;
//# sourceMappingURL=budget.js.map