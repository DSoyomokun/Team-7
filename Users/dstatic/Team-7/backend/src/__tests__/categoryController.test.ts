/**
 * Category Controller Tests
 * Integration tests for category API endpoints
 */

import request from 'supertest';
import { app } from '../app';
import { CategoryService } from '../services/category_service';

// Mock the CategoryService
jest.mock('../services/category_service');
const mockCategoryService = CategoryService as jest.Mocked<typeof CategoryService>;

// Mock authentication middleware
jest.mock('../middleware/auth', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: 'test-user-id' };
    next();
  }
}));

describe('CategoryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/categories', () => {
    it('should create a new category successfully', async () => {
      const mockCategory = {
        id: 'category-id',
        user_id: 'test-user-id',
        name: 'Groceries',
        color: '#4CAF50',
        icon: '🛒',
        created_at: '2025-07-25T01:51:11.060Z',
        updated_at: '2025-07-25T01:51:11.060Z'
      };

      mockCategoryService.createCategory.mockResolvedValue({
        success: true,
        data: mockCategory as any
      });

      const response = await request(app)
        .post('/api/categories')
        .send({
          name: 'Groceries',
          color: '#4CAF50',
          icon: '🛒'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCategory);
      expect(mockCategoryService.createCategory).toHaveBeenCalledWith('test-user-id', {
        name: 'Groceries',
        color: '#4CAF50',
        icon: '🛒'
      });
    });

    it('should return 400 for invalid input', async () => {
      mockCategoryService.createCategory.mockResolvedValue({
        success: false,
        error: 'Category name is required'
      });

      const response = await request(app)
        .post('/api/categories')
        .send({
          name: '',
          color: '#4CAF50',
          icon: '🛒'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 400 for duplicate category name', async () => {
      mockCategoryService.createCategory.mockResolvedValue({
        success: false,
        error: 'Category with this name already exists'
      });

      const response = await request(app)
        .post('/api/categories')
        .send({
          name: 'Groceries',
          color: '#4CAF50',
          icon: '🛒'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Category with this name already exists');
    });
  });

  describe('GET /api/categories', () => {
    it('should return all user categories', async () => {
      const mockCategories = [
        {
          id: 'category-1',
          user_id: 'test-user-id',
          name: 'Groceries',
          color: '#4CAF50',
          icon: '🛒',
          created_at: '2025-07-25T01:51:11.084Z',
          updated_at: '2025-07-25T01:51:11.084Z'
        },
        {
          id: 'category-2',
          user_id: 'test-user-id',
          name: 'Transportation',
          color: '#2196F3',
          icon: '🚗',
          created_at: '2025-07-25T01:51:11.084Z',
          updated_at: '2025-07-25T01:51:11.084Z'
        }
      ];

      mockCategoryService.getUserCategories.mockResolvedValue({
        success: true,
        data: mockCategories as any
      });

      const response = await request(app)
        .get('/api/categories');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
      expect(mockCategoryService.getUserCategories).toHaveBeenCalledWith('test-user-id');
    });

    it('should return empty array when no categories exist', async () => {
      mockCategoryService.getUserCategories.mockResolvedValue({
        success: true,
        data: []
      });

      const response = await request(app)
        .get('/api/categories');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category successfully', async () => {
      const mockUpdatedCategory = {
        id: 'category-id',
        user_id: 'test-user-id',
        name: 'Updated Groceries',
        color: '#FF5733',
        icon: '🛍️',
        created_at: '2025-07-25T01:51:11.087Z',
        updated_at: '2025-07-25T01:51:11.087Z'
      };

      mockCategoryService.updateCategory.mockResolvedValue({
        success: true,
        data: mockUpdatedCategory as any
      });

      const response = await request(app)
        .put('/api/categories/category-id')
        .send({
          name: 'Updated Groceries',
          color: '#FF5733',
          icon: '🛍️'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedCategory);
      expect(mockCategoryService.updateCategory).toHaveBeenCalledWith('test-user-id', 'category-id', {
        name: 'Updated Groceries',
        color: '#FF5733',
        icon: '🛍️'
      });
    });

    it('should return 400 when category not found', async () => {
      mockCategoryService.updateCategory.mockResolvedValue({
        success: false,
        error: 'Category not found'
      });

      const response = await request(app)
        .put('/api/categories/nonexistent-id')
        .send({
          name: 'Updated Name'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Category not found');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category successfully', async () => {
      mockCategoryService.deleteCategory.mockResolvedValue({
        success: true
      });

      const response = await request(app)
        .delete('/api/categories/category-id');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Category deleted successfully');
      expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith('test-user-id', 'category-id');
    });

    it('should return 400 when category is in use', async () => {
      mockCategoryService.deleteCategory.mockResolvedValue({
        success: false,
        error: 'Cannot delete category that is in use by transactions'
      });

      const response = await request(app)
        .delete('/api/categories/category-id');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Cannot delete category that is in use by transactions');
    });

    it('should return 400 when category not found', async () => {
      mockCategoryService.deleteCategory.mockResolvedValue({
        success: false,
        error: 'Category not found'
      });

      const response = await request(app)
        .delete('/api/categories/nonexistent-id');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Category not found');
    });
  });
});