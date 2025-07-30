/**
 * Category Controller
 * HTTP request handlers for category operations
 */

import { Response } from 'express';
import { CategoryService } from '../services/category_service';
import { CreateCategoryInput, UpdateCategoryInput } from '../models/Category';
import { AuthenticatedRequest } from '../middleware/auth';

export class CategoryController {
  /**
   * POST /api/categories
   * Creates a new category
   */
  static async createCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const input: CreateCategoryInput = req.body;
      const result = await CategoryService.createCategory(userId, input);

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
   * GET /api/categories
   * Gets all categories for the authenticated user
   */
  static async getCategories(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const result = await CategoryService.getUserCategories(userId);

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
   * PUT /api/categories/:id
   * Updates a category
   */
  static async updateCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const categoryId = req.params.id;
      const input: UpdateCategoryInput = req.body;

      const result = await CategoryService.updateCategory(userId, categoryId, input);

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
   * DELETE /api/categories/:id
   * Deletes a category if not in use
   */
  static async deleteCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const categoryId = req.params.id;
      const result = await CategoryService.deleteCategory(userId, categoryId);

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}