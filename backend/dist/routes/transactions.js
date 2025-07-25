"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionAdapter_1 = __importDefault(require("../adapters/transactionAdapter"));
const transactionController_1 = __importDefault(require("../controllers/transactionController"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Create transaction (unified income/expense)
router.post('/', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, type } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be positive' });
        }
        if (type === 'expense' && !req.body.category) {
            return res.status(400).json({ error: 'Category is required for expenses' });
        }
        const transaction = await transactionAdapter_1.default.createTransaction(userId, req.body);
        res.status(201).json({ message: 'Transaction created successfully', transaction });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// POST /api/transactions/income (legacy support)
router.post('/income', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, category, description, date } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be positive' });
        }
        const transactionData = {
            type: 'income',
            amount,
            category,
            description,
            date: date || new Date()
        };
        const transaction = await transactionAdapter_1.default.createTransaction(userId, transactionData);
        res.status(201).json({ message: 'Income transaction added successfully', data: transaction });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// POST /api/transactions/expense (legacy support)
router.post('/expense', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount, category, description, date } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be greater than 0' });
        }
        if (!category) {
            return res.status(400).json({ error: 'Category is required' });
        }
        const transactionData = {
            type: 'expense',
            amount,
            category,
            description,
            date: date || new Date()
        };
        const transaction = await transactionAdapter_1.default.createTransaction(userId, transactionData);
        res.status(201).json({ message: 'Expense transaction added successfully', data: transaction });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Get user transactions
router.get('/', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const filters = req.query;
        const transactions = await transactionAdapter_1.default.getTransactions(userId, filters);
        res.json({ transactions });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/transactions/income/summary (legacy support)
router.get('/income/summary', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await transactionAdapter_1.default.getTransactions(userId, { type: 'income' });
        res.json({ success: true, data: transactions });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/transactions/expense/summary (legacy support)
router.get('/expense/summary', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await transactionAdapter_1.default.getTransactions(userId, { type: 'expense' });
        res.json({ success: true, data: transactions });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/transactions/expense (with category filter, legacy support)
router.get('/expense', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { category } = req.query;
        const filters = { type: 'expense' };
        if (category)
            filters.category = category;
        const transactions = await transactionAdapter_1.default.getTransactions(userId, filters);
        res.json({ success: true, data: { transactions } });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Analyze spending by category
router.get('/analyze/:category', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { category } = req.params;
        const totalSpending = await transactionAdapter_1.default.analyzeSpending(userId, category);
        res.json({ category, totalSpending });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get recurring payments
router.get('/recurring', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const recurringPayments = await transactionAdapter_1.default.detectRecurringPayments(userId);
        res.json({ recurringPayments });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// New account-integrated endpoints
// POST /api/transactions/with-account - Create transaction with account balance update
router.post('/with-account', auth_1.authenticateUser, transactionController_1.default.createTransaction);
// GET /api/transactions/with-account - Get transactions with account filtering
router.get('/with-account', auth_1.authenticateUser, transactionController_1.default.getTransactions);
exports.default = router;
//# sourceMappingURL=transactions.js.map