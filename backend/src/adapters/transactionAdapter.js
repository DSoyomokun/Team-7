const { transactions } = require('../shared/data');

const transactionAdapter = {
  addTransaction: (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      createdAt: new Date()
    };
    transactions.push(newTransaction);
    return newTransaction;
  },

  getUserTransactions: (userId, type = null) => {
    let userTransactions = transactions.filter(t => t.userId === userId);
    if (type) {
      userTransactions = userTransactions.filter(t => t.type === type);
    }
    return userTransactions;
  },

  getUserIncome: (userId) => {
    const userIncome = transactions.filter(t => t.userId === userId && t.type === 'income');
    const totalIncome = userIncome.reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome,
      incomeCount: userIncome.length,
      transactions: userIncome
    };
  },

  getUserExpenses: (userId, category = null) => {
    let userExpenses = transactions.filter(t => t.userId === userId && t.type === 'expense');
    if (category) {
      userExpenses = userExpenses.filter(t => t.category === category);
    }
    const totalExpenses = userExpenses.reduce((sum, t) => sum + t.amount, 0);
    return {
      totalExpenses,
      expenseCount: userExpenses.length,
      transactions: userExpenses
    };
  },

  getTransactionById: (id) => {
    return transactions.find(t => t.id === id);
  },

  updateTransaction: (id, updates) => {
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updates };
      return transactions[index];
    }
    return null;
  },

  deleteTransaction: (id) => {
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      return transactions.splice(index, 1)[0];
    }
    return null;
  }
};

module.exports = transactionAdapter;