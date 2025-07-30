"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transactionAdapter_1 = __importDefault(require("../adapters/transactionAdapter"));
const transaction_service_1 = __importDefault(require("../services/transaction_service"));
const transactionController = {
    addIncome: async (req, res) => {
        try {
            const { amount, category, description, date } = req.body;
            if (!amount || amount <= 0) {
                return res.status(400).json({ success: false, error: 'Amount must be positive' });
            }
            const transactionData = {
                userId: req.userId,
                type: 'income',
                amount,
                category,
                description,
                date: date || new Date()
            };
            const transaction = await transactionAdapter_1.default.addTransaction(transactionData);
            res.status(201).json({ success: true, message: 'Income transaction added successfully', data: transaction });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message || 'Failed to add income' });
        }
    },
    addExpense: async (req, res) => {
        try {
            const { amount, category, description, date } = req.body;
            if (!amount || amount <= 0) {
                return res.status(400).json({ success: false, error: 'Amount must be greater than 0' });
            }
            if (!category) {
                return res.status(400).json({ success: false, error: 'Category is required' });
            }
            const transactionData = {
                userId: req.userId,
                type: 'expense',
                amount,
                category,
                description,
                date: date || new Date()
            };
            const transaction = await transactionAdapter_1.default.addTransaction(transactionData);
            res.status(201).json({ success: true, message: 'Expense transaction added successfully', data: transaction });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message || 'Failed to add expense' });
        }
    },
    incomeSummary: async (req, res) => {
        try {
            const incomeData = await transactionAdapter_1.default.getUserIncome(req.userId);
            res.status(200).json({ success: true, data: incomeData });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message || 'Failed to get income summary' });
        }
    },
    expenseSummary: async (req, res) => {
        try {
            const expenseData = await transactionAdapter_1.default.getUserExpenses(req.userId);
            res.status(200).json({ success: true, data: expenseData });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message || 'Failed to get expense summary' });
        }
    },
    getExpenses: async (req, res) => {
        try {
            const { category } = req.query;
            const expenseData = await transactionAdapter_1.default.getUserExpenses(req.userId, category);
            res.status(200).json({ success: true, data: { transactions: expenseData.transactions } });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message || 'Failed to get expenses' });
        }
    },
    // New methods that integrate with accounts
    createTransaction: async (req, res) => {
        try {
            const { account_id, amount, description, date, is_expense, category_id } = req.body;
            const user_id = req.user?.id;
            if (!user_id) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
            }
            // Validate required fields
            if (!amount || typeof amount !== 'number' || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Valid amount is required'
                });
            }
            if (is_expense === undefined || is_expense === null) {
                return res.status(400).json({
                    success: false,
                    error: 'Transaction type (is_expense) is required'
                });
            }
            const transactionData = {
                account_id,
                amount,
                description,
                date: date || new Date(),
                is_expense: Boolean(is_expense),
                category_id
            };
            const transaction = await transaction_service_1.default.createTransaction(user_id, transactionData);
            res.status(201).json({
                success: true,
                message: 'Transaction created successfully',
                data: transaction.toJSON()
            });
        }
        catch (error) {
            console.error('Transaction creation error:', error);
            res.status(400).json({
                success: false,
                error: error.message || 'Failed to create transaction'
            });
        }
    },
    getTransactions: async (req, res) => {
        try {
            const user_id = req.user?.id;
            const { account_id, category, start_date, end_date } = req.query;
            if (!user_id) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
            }
            const filters = {};
            if (account_id)
                filters.account_id = account_id;
            if (category)
                filters.category = category;
            if (start_date)
                filters.startDate = start_date;
            if (end_date)
                filters.endDate = end_date;
            const transactions = await transaction_service_1.default.getTransactions(user_id, filters);
            res.status(200).json({
                success: true,
                data: transactions.map(t => t.toJSON())
            });
        }
        catch (error) {
            console.error('Get transactions error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch transactions'
            });
        }
    },
    getTransactionById: async (req, res) => {
        try {
            const user_id = req.user?.id;
            const { id } = req.params;
            if (!user_id) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
            }
            const transaction = await transactionAdapter_1.default.getTransactionById(id, user_id);
            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    error: 'Transaction not found'
                });
            }
            res.status(200).json({
                success: true,
                data: transaction
            });
        }
        catch (error) {
            console.error('Get transaction error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch transaction'
            });
        }
    },
    updateTransaction: async (req, res) => {
        try {
            const user_id = req.user?.id;
            const { id } = req.params;
            const updates = req.body;
            if (!user_id) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
            }
            const transaction = await transactionAdapter_1.default.updateTransaction(id, user_id, updates);
            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    error: 'Transaction not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Transaction updated successfully',
                data: transaction
            });
        }
        catch (error) {
            console.error('Update transaction error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to update transaction'
            });
        }
    },
    deleteTransaction: async (req, res) => {
        try {
            const user_id = req.user?.id;
            const { id } = req.params;
            if (!user_id) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
            }
            const deleted = await transactionAdapter_1.default.deleteTransaction(id, user_id);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: 'Transaction not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Transaction deleted successfully'
            });
        }
        catch (error) {
            console.error('Delete transaction error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to delete transaction'
            });
        }
    }
};
exports.default = transactionController;
//# sourceMappingURL=transactionController.js.map