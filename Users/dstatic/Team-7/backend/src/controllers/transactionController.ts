/**
 * Transaction Controller
 * HTTP request handlers for transaction operations with category support
 */

import { Response } from 'express';
import { TransactionService, CreateTransactionInput, UpdateTransactionInput } from '../services/transaction_service';
import { AuthenticatedRequest } from '../middleware/auth';

export class TransactionController {
  /**
   * POST /api/transactions
   * Creates a new transaction with optional category
   */
  static async createTransaction(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const input: CreateTransactionInput = req.body;
      const result = await TransactionService.createTransaction(userId, input);

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(201).json(result.data);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * GET /api/transactions
   * Gets all transactions for the authenticated user with optional category filter
   */
  static async getTransactions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const categoryId = req.query.category_id as string;
      const result = await TransactionService.getUserTransactions(userId, categoryId);

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.json(result.data);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * PUT /api/transactions/:id
   * Updates a transaction with category support
   */
  static async updateTransaction(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const transactionId = req.params.id;
      const input: UpdateTransactionInput = req.body;

      const result = await TransactionService.updateTransaction(userId, transactionId, input);

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.json(result.data);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * GET /api/transactions/analytics/by-category
   * Gets transaction analytics grouped by category
   */
  static async getTransactionsByCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const startDate = req.query.start_date as string;
      const endDate = req.query.end_date as string;

      const result = await TransactionService.getTransactionsByCategory(userId, startDate, endDate);

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.json(result.data);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}