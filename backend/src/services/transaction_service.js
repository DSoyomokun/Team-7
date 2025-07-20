// backend/services/transaction.service.js
const TransactionRepository = require('../models/repository/transaction.repository');

class TransactionService {
  static async createTransaction(userId, transactionData) {
    return await TransactionRepository.create({ 
      ...transactionData, 
      user_id: userId 
    });
  }

  static async getTransactions(userId, filters = {}) {
    return await TransactionRepository.findByUserId(userId, filters);
  }

  static async analyzeSpending(userId, category) {
    const transactions = await TransactionRepository.findByUserId(userId, { category });
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  static async detectRecurringPayments(userId) {
    const transactions = await TransactionRepository.findByUserId(userId);
    return transactions.filter(t => t.isRecurring());
  }
}

module.exports = TransactionService;

