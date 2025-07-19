import transactionAdapter from '../adapters/transactionAdapter';
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
  }
};

export default transactionController; 