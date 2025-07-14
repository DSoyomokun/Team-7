const express = require('express');
const router = express.Router();
const { transactions } = require('../shared/data');

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
  const userTransactions = transactions.filter(t => t.userId === req.userId);
  const income = userTransactions.filter(t => t.type === 'income');
  const expenses = userTransactions.filter(t => t.type === 'expense');

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  res.status(200).json({
    success: true,
    data: {
      totalIncome,
      totalExpenses,
      balance,
      incomeCount: income.length,
      expenseCount: expenses.length,
      recentTransactions: userTransactions.slice(-5)
    }
  });
});

// GET /api/budget/categories
router.get('/categories', authMiddleware, (req, res) => {
  const userTransactions = transactions.filter(t => t.userId === req.userId);
  const expenseCategories = {};
  const incomeCategories = {};

  userTransactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      expenseCategories[transaction.category] =
        (expenseCategories[transaction.category] || 0) + transaction.amount;
    } else if (transaction.type === 'income') {
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
  const userTransactions = transactions.filter(t => t.userId === req.userId);
  const income = userTransactions.filter(t => t.type === 'income');
  const expenses = userTransactions.filter(t => t.type === 'expense');

  const monthlyIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
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

module.exports = router;