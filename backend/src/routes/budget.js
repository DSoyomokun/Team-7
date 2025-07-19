const express = require('express');
const router = express.Router();
const transactionAdapter = require('../adapters/transactionAdapter');

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
  const userTransactions = transactionAdapter.getUserTransactions(req.userId);
  const incomeData = transactionAdapter.getUserIncome(req.userId);
  const expenseData = transactionAdapter.getUserExpenses(req.userId);

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
  const userTransactions = transactionAdapter.getUserTransactions(req.userId);
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
  const incomeData = transactionAdapter.getUserIncome(req.userId);
  const expenseData = transactionAdapter.getUserExpenses(req.userId);

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

module.exports = router;