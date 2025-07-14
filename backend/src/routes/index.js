const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const transactionRoutes = require('./transactions');
const budgetRoutes = require('./budget');

// Mount routes
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budget', budgetRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

module.exports = router;