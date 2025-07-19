const transactionAdapter = require('../adapters/transactionAdapter');

const transactionController = {
  addIncome: (req, res) => {
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
  },
  addExpense: (req, res) => {
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
  },
  incomeSummary: (req, res) => {
    const incomeData = transactionAdapter.getUserIncome(req.userId);
    res.status(200).json({ success: true, data: incomeData });
  },
  expenseSummary: (req, res) => {
    const expenseData = transactionAdapter.getUserExpenses(req.userId);
    res.status(200).json({ success: true, data: expenseData });
  },
  getExpenses: (req, res) => {
    const { category } = req.query;
    const expenseData = transactionAdapter.getUserExpenses(req.userId, category);
    res.status(200).json({ success: true, data: { transactions: expenseData.transactions } });
  }
};

module.exports = transactionController; 