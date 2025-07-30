/**
 * Category Service Tests
 * Unit tests for category service business logic
 */

import { CategoryService } from '../services/category_service';
import { supabase } from '../config/database';

// Mock Supabase client
jest.mock('../config/database', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
            limit: jest.fn(() => ({ single: jest.fn() }))
          })),
          single: jest.fn(),
          order: jest.fn(() => ({ single: jest.fn() }))
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn()
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn()
              }))
            }))
          }))
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn()
          }))
        }))
      }))
    }))
  }
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      const mockCreatedCategory = {
        id: 'category-id',
        user_id: 'user-id',
        name: 'Groceries',
        color: '#4CAF50',
        icon: '🛒',
        created_at: new Date(),
        updated_at: new Date()
      };

      // Mock category name uniqueness check (no existing category)
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null })
            })
          })
        })
      } as any);

      // Mock category creation
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockCreatedCategory, error: null })
          })
        })
      } as any);

      const result = await CategoryService.createCategory('user-id', {
        name: 'Groceries',
        color: '#4CAF50',
        icon: '🛒'
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCreatedCategory);
    });

    it('should reject invalid input', async () => {
      const result = await CategoryService.createCategory('user-id', {
        name: '',
        color: 'invalid',
        icon: ''
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Category name is required');
    });

    it('should reject duplicate category names', async () => {
      // Mock existing category found
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { id: 'existing-id' } })
            })
          })
        })
      } as any);

      const result = await CategoryService.createCategory('user-id', {
        name: 'Groceries',
        color: '#4CAF50',
        icon: '🛒'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Category with this name already exists');
    });

    it('should handle database errors', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null })
            })
          })
        })
      } as any);

      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } })
          })
        })
      } as any);

      const result = await CategoryService.createCategory('user-id', {
        name: 'Groceries',
        color: '#4CAF50',
        icon: '🛒'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create category');
    });
  });

  describe('getUserCategories', () => {
    it('should return user categories', async () => {
      const mockCategories = [
        {
          id: 'category-1',
          user_id: 'user-id',
          name: 'Groceries',
          color: '#4CAF50',
          icon: '🛒',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockCategories, error: null })
          })
        })
      } as any);

      const result = await CategoryService.getUserCategories('user-id');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCategories);
    });

    it('should handle database errors', async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } })
          })
        })
      } as any);

      const result = await CategoryService.getUserCategories('user-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch categories');
    });
  });

  describe('deleteCategory', () => {
    it('should prevent deletion of category in use', async () => {
      // Mock category exists
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { id: 'category-id' } })
            })
          })
        })
      } as any);

      // Mock transactions using category
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({ 
              data: [{ id: 'transaction-id' }], 
              error: null 
            })
          })
        })
      } as any);

      const result = await CategoryService.deleteCategory('user-id', 'category-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cannot delete category that is in use by transactions');
    });

    it('should delete unused category successfully', async () => {
      // Mock category exists
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { id: 'category-id' } })
            })
          })
        })
      } as any);

      // Mock no transactions using category
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({ 
              data: [], 
              error: null 
            })
          })
        })
      } as any);

      // Mock successful deletion
      mockSupabase.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null })
          })
        })
      } as any);

      const result = await CategoryService.deleteCategory('user-id', 'category-id');

      expect(result.success).toBe(true);
    });
  });

  describe('createDefaultCategories', () => {
    it('should create default categories for user', async () => {
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: null })
      } as any);

      const result = await CategoryService.createDefaultCategories('user-id');

      expect(result.success).toBe(true);
    });

    it('should handle database errors', async () => {
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({ error: { message: 'Database error' } })
      } as any);

      const result = await CategoryService.createDefaultCategories('user-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create default categories');
    });
  });
});