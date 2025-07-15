const express = require('express');
const router = express.Router();
const { transactions } = require('../shared/data');
const transactionController = require('../controllers/transactionController');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  req.userId = token.split('_')[2];
  next();
};

// POST /api/transactions/income
router.post('/income', authMiddleware, transactionController.addIncome);

// POST /api/transactions/expense
router.post('/expense', authMiddleware, transactionController.addExpense);

// GET /api/transactions/income/summary
router.get('/income/summary', authMiddleware, transactionController.getIncomeSummary);

// GET /api/transactions/expense/summary
router.get('/expense/summary', authMiddleware, transactionController.getExpenseSummary);

// GET /api/transactions/expense (with category filter)
router.get('/expense', authMiddleware, transactionController.getExpenses);

module.exports = router;