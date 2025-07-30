"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionAdapter_1 = __importDefault(require("../adapters/transactionAdapter"));
const transactionController_1 = __importDefault(require("../controllers/transactionController"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const response_1 = require("../utils/response");
const router = express_1.default.Router();
// Create transaction (unified income/expense)
router.post('/', auth_1.authenticateUser, validation_1.validateTransaction, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
        }
        const { amount, type } = req.body;
        if (!amount || amount <= 0) {
            return (0, response_1.errorResponse)(res, 'Amount must be positive', 400);
        }
        if (type === 'expense' && !req.body.category) {
            return (0, response_1.errorResponse)(res, 'Category is required for expenses', 400);
        }
        const transaction = await transactionAdapter_1.default.createTransaction(userId, req.body);
        (0, response_1.successResponse)(res, transaction, response_1.RESPONSE_MESSAGES.CREATED, 201);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message || 'Failed to create transaction', 400);
    }
});
// POST /api/transactions/income (legacy support)
router.post('/income', auth_1.authenticateUser, validation_1.validateTransaction, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
        }
        const { amount, category, description, date } = req.body;
        if (!amount || amount <= 0) {
            return (0, response_1.errorResponse)(res, 'Amount must be positive', 400);
        }
        const transactionData = {
            type: 'income',
            amount,
            category,
            description,
            date: date || new Date()
        };
        const transaction = await transactionAdapter_1.default.createTransaction(userId, transactionData);
        (0, response_1.successResponse)(res, transaction, 'Income transaction added successfully', 201);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message || 'Failed to create income transaction', 400);
    }
});
// POST /api/transactions/expense (legacy support)
router.post('/expense', auth_1.authenticateUser, validation_1.validateTransaction, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
        }
        const { amount, category, description, date } = req.body;
        if (!amount || amount <= 0) {
            return (0, response_1.errorResponse)(res, 'Amount must be greater than 0', 400);
        }
        if (!category) {
            return (0, response_1.errorResponse)(res, 'Category is required', 400);
        }
        const transactionData = {
            type: 'expense',
            amount,
            category,
            description,
            date: date || new Date()
        };
        const transaction = await transactionAdapter_1.default.createTransaction(userId, transactionData);
        (0, response_1.successResponse)(res, transaction, 'Expense transaction added successfully', 201);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message || 'Failed to create expense transaction', 400);
    }
});
// Get user transactions
router.get('/', auth_1.authenticateUser, validation_1.validateDateRange, validation_1.validatePagination, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
        }
        const filters = req.query;
        const transactions = await transactionAdapter_1.default.getTransactions(userId, filters);
        (0, response_1.successResponse)(res, { transactions }, 'Transactions retrieved successfully');
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message || 'Failed to retrieve transactions', 500);
    }
});
// Get transaction summary
router.get('/summary', auth_1.authenticateUser, validation_1.validateDateRange, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return (0, response_1.errorResponse)(res, 'User not authenticated', 401);
        }
        const { startDate, endDate } = req.query;
        const incomeData = await transactionAdapter_1.default.getUserIncome(userId);
        const expenseData = await transactionAdapter_1.default.getUserExpenses(userId);
        const summary = {
            income: incomeData,
            expenses: expenseData,
            netAmount: incomeData.totalIncome - expenseData.totalExpenses
        };
        (0, response_1.successResponse)(res, summary, 'Transaction summary retrieved successfully');
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message || 'Failed to retrieve transaction summary', 500);
    }
});
// Get transaction by ID
router.get('/:id', auth_1.authenticateUser, transactionController_1.default.getTransactionById);
// Update transaction
router.put('/:id', auth_1.authenticateUser, validation_1.validateTransaction, transactionController_1.default.updateTransaction);
// Delete transaction
router.delete('/:id', auth_1.authenticateUser, transactionController_1.default.deleteTransaction);
exports.default = router;
//# sourceMappingURL=transactions.js.map