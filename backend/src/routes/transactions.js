const express = require('express');
const router = express.Router();
const { transactions } = require('../shared/data');

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
  const transaction = {
    id: Date.now().toString(),
    userId: req.userId,
    type: 'income',
    amount,
    category,
    description,
    date: date || new Date(),
    createdAt: new Date()
  };
  transactions.push(transaction);
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
  const transaction = {
    id: Date.now().toString(),
    userId: req.userId,
    type: 'expense',
    amount,
    category,
    description,
    date: date || new Date(),
    createdAt: new Date()
  };
  transactions.push(transaction);
  res.status(201).json({ success: true, message: 'Expense transaction added successfully', data: transaction });
});

// GET /api/transactions/income/summary
router.get('/income/summary', authMiddleware, (req, res) => {
  const userIncome = transactions.filter(t => t.userId === req.userId && t.type === 'income');
  const totalIncome = userIncome.reduce((sum, t) => sum + t.amount, 0);
  res.status(200).json({ success: true, data: { totalIncome, incomeCount: userIncome.length, transactions: userIncome } });
});

// GET /api/transactions/expense/summary
router.get('/expense/summary', authMiddleware, (req, res) => {
  const userExpenses = transactions.filter(t => t.userId === req.userId && t.type === 'expense');
  const totalExpenses = userExpenses.reduce((sum, t) => sum + t.amount, 0);
  res.status(200).json({ success: true, data: { totalExpenses, expenseCount: userExpenses.length, transactions: userExpenses } });
});

// GET /api/transactions/expense (with category filter)
router.get('/expense', authMiddleware, (req, res) => {
  const { category } = req.query;
  let userExpenses = transactions.filter(t => t.userId === req.userId && t.type === 'expense');
  if (category) {
    userExpenses = userExpenses.filter(t => t.category === category);
  }
  res.status(200).json({ success: true, data: { transactions: userExpenses } });
});

module.exports = router;