import transactionAdapter from '../adapters/transactionAdapter';
import TransactionService from '../services/transaction_service';
import { Request, Response } from 'express';

const transactionController = {
  addIncome: (req: Request, res: Response) => {
    const { amount, category, description, date } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Amount must be positive' });
    }
    const transactionData = {
      userId: req.userId as string,
      type: 'income' as const,
      amount,
      category,
      description,
      date: date || new Date()
    };
    const transaction = transactionAdapter.addTransaction(transactionData);
    res.status(201).json({ success: true, message: 'Income transaction added successfully', data: transaction });
  },
  addExpense: (req: Request, res: Response) => {
    const { amount, category, description, date } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Amount must be greater than 0' });
    }
    if (!category) {
      return res.status(400).json({ success: false, error: 'Category is required' });
    }
    const transactionData = {
      userId: req.userId as string,
      type: 'expense' as const,
      amount,
      category,
      description,
      date: date || new Date()
    };
    const transaction = transactionAdapter.addTransaction(transactionData);
    res.status(201).json({ success: true, message: 'Expense transaction added successfully', data: transaction });
  },
  incomeSummary: (req: Request, res: Response) => {
    const incomeData = transactionAdapter.getUserIncome(req.userId as string);
    res.status(200).json({ success: true, data: incomeData });
  },
  expenseSummary: (req: Request, res: Response) => {
    const expenseData = transactionAdapter.getUserExpenses(req.userId as string);
    res.status(200).json({ success: true, data: expenseData });
  },
  getExpenses: (req: Request, res: Response) => {
    const { category } = req.query;
    const expenseData = transactionAdapter.getUserExpenses(req.userId as string, category as string | null);
    res.status(200).json({ success: true, data: { transactions: expenseData.transactions } });
  },

  // New methods that integrate with accounts
  createTransaction: async (req: Request, res: Response) => {
    try {
      const { account_id, amount, description, date, is_expense, category_id } = req.body;
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      // Validate required fields
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid amount is required'
        });
      }

      if (is_expense === undefined || is_expense === null) {
        return res.status(400).json({
          success: false,
          error: 'Transaction type (is_expense) is required'
        });
      }

      const transactionData = {
        account_id,
        amount,
        description,
        date: date || new Date(),
        is_expense: Boolean(is_expense),
        category_id
      };

      const transaction = await TransactionService.createTransaction(user_id, transactionData);

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: transaction.toJSON()
      });
    } catch (error: any) {
      console.error('Transaction creation error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create transaction'
      });
    }
  },

  getTransactions: async (req: Request, res: Response) => {
    try {
      const user_id = req.user?.id;
      const { account_id, category, start_date, end_date } = req.query;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const filters: any = {};
      if (account_id) filters.account_id = account_id;
      if (category) filters.category = category;
      if (start_date) filters.startDate = start_date;
      if (end_date) filters.endDate = end_date;

      const transactions = await TransactionService.getTransactions(user_id, filters);

      res.status(200).json({
        success: true,
        data: transactions.map(t => t.toJSON())
      });
    } catch (error: any) {
      console.error('Get transactions error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch transactions'
      });
    }
  }
};

export default transactionController; 