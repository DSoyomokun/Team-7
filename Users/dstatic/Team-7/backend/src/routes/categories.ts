/**
 * Category Routes
 * Express route definitions for category endpoints
 */

import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Category validation schemas
const createCategorySchema = {
  name: {
    isString: true,
    isLength: { options: { min: 1, max: 50 } },
    trim: true,
    errorMessage: 'Name must be a string between 1 and 50 characters'
  },
  color: {
    isString: true,
    matches: { options: /^#[0-9A-F]{6}$/i },
    errorMessage: 'Color must be a valid hex color code (e.g., #FF5733)'
  },
  icon: {
    isString: true,
    isLength: { options: { min: 1, max: 20 } },
    trim: true,
    errorMessage: 'Icon must be a string between 1 and 20 characters'
  }
};

const updateCategorySchema = {
  name: {
    optional: true,
    isString: true,
    isLength: { options: { min: 1, max: 50 } },
    trim: true,
    errorMessage: 'Name must be a string between 1 and 50 characters'
  },
  color: {
    optional: true,
    isString: true,
    matches: { options: /^#[0-9A-F]{6}$/i },
    errorMessage: 'Color must be a valid hex color code (e.g., #FF5733)'
  },
  icon: {
    optional: true,
    isString: true,
    isLength: { options: { min: 1, max: 20 } },
    trim: true,
    errorMessage: 'Icon must be a string between 1 and 20 characters'
  }
};

// Routes
router.post('/', ...validateRequest(createCategorySchema), CategoryController.createCategory);
router.get('/', CategoryController.getCategories);
router.put('/:id', ...validateRequest(updateCategorySchema), CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

export default router;