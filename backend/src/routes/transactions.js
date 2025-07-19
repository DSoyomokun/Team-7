const express = require('express');
const router = express.Router();
const transactionAdapter = require('../adapters/transactionAdapter');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  req.userId = token.split('_')[2];
  next();
};

// POST /api/transactions/income
router.post('/income', authMiddleware, (req, res) => {
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
  const transaction = transactionAdapter.addTransaction(transactionData);
  res.status(201).json({ success: true, message: 'Income transaction added successfully', data: transaction });
});

// POST /api/transactions/expense
router.post('/expense', authMiddleware, (req, res) => {
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
  const transaction = transactionAdapter.addTransaction(transactionData);
  res.status(201).json({ success: true, message: 'Expense transaction added successfully', data: transaction });
});

// GET /api/transactions/income/summary
router.get('/income/summary', authMiddleware, (req, res) => {
  const incomeData = transactionAdapter.getUserIncome(req.userId);
  res.status(200).json({ success: true, data: incomeData });
});

// GET /api/transactions/expense/summary
router.get('/expense/summary', authMiddleware, (req, res) => {
  const expenseData = transactionAdapter.getUserExpenses(req.userId);
  res.status(200).json({ success: true, data: expenseData });
});

// GET /api/transactions/expense (with category filter)
router.get('/expense', authMiddleware, (req, res) => {
  const { category } = req.query;
  const expenseData = transactionAdapter.getUserExpenses(req.userId, category);
  res.status(200).json({ success: true, data: { transactions: expenseData.transactions } });
});

module.exports = router;