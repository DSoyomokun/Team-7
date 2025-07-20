const express = require('express');
const router = express.Router();
const TransactionService = require('../services/transaction_service');
const { authenticateUser } = require('../middleware/auth');

// Create transaction
router.post('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionData = req.body;
    const transaction = await TransactionService.createTransaction(userId, transactionData);
    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user transactions
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = req.query;
    const transactions = await TransactionService.getTransactions(userId, filters);
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze spending by category
router.get('/analyze/:category', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.params;
    const totalSpending = await TransactionService.analyzeSpending(userId, category);
    res.json({ category, totalSpending });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recurring payments
router.get('/recurring', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const recurringPayments = await TransactionService.detectRecurringPayments(userId);
    res.json({ recurringPayments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 