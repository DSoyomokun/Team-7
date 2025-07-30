/**
 * Category Model Tests
 * Unit tests for category model validation and business logic
 */

import { CategoryModel, CreateCategoryInput, UpdateCategoryInput } from '../models/Category';

describe('CategoryModel', () => {
  describe('validateCategoryInput', () => {
    it('should validate valid category input', () => {
      const input: CreateCategoryInput = {
        name: 'Groceries',
        color: '#4CAF50',
        icon: '🛒'
      };

      const result = CategoryModel.validateCategoryInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty name', () => {
      const input: CreateCategoryInput = {
        name: '',
        color: '#4CAF50',
        icon: '🛒'
      };

      const result = CategoryModel.validateCategoryInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Category name is required');
    });

    it('should reject name longer than 50 characters', () => {
      const input: CreateCategoryInput = {
        name: 'This is a very long category name that exceeds fifty characters',
        color: '#4CAF50',
        icon: '🛒'
      };

      const result = CategoryModel.validateCategoryInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Category name must be 50 characters or less');
    });

    it('should reject invalid color format', () => {
      const input: CreateCategoryInput = {
        name: 'Groceries',
        color: 'invalid-color',
        icon: '🛒'
      };

      const result = CategoryModel.validateCategoryInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Color must be a valid hex color code (e.g., #FF5733)');
    });

    it('should accept valid hex colors', () => {
      const validColors = ['#FFFFFF', '#000000', '#FF5733', '#4caf50'];
      
      validColors.forEach(color => {
        const input: CreateCategoryInput = {
          name: 'Test',
          color,
          icon: '🛒'
        };

        const result = CategoryModel.validateCategoryInput(input);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject empty icon', () => {
      const input: CreateCategoryInput = {
        name: 'Groceries',
        color: '#4CAF50',
        icon: ''
      };

      const result = CategoryModel.validateCategoryInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Category icon is required');
    });

    it('should reject icon longer than 20 characters', () => {
      const input: CreateCategoryInput = {
        name: 'Groceries',
        color: '#4CAF50',
        icon: 'This icon is way too long'
      };

      const result = CategoryModel.validateCategoryInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Icon must be 20 characters or less');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const input: CreateCategoryInput = {
        name: '',
        color: 'invalid',
        icon: ''
      };

      const result = CategoryModel.validateCategoryInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('validateUpdateInput', () => {
    it('should validate valid update input', () => {
      const input: UpdateCategoryInput = {
        name: 'Updated Name',
        color: '#FF5733'
      };

      const result = CategoryModel.validateUpdateInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should allow partial updates', () => {
      const input: UpdateCategoryInput = {
        name: 'Updated Name'
      };

      const result = CategoryModel.validateUpdateInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty name when provided', () => {
      const input: UpdateCategoryInput = {
        name: ''
      };

      const result = CategoryModel.validateUpdateInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Category name cannot be empty');
    });

    it('should reject invalid color when provided', () => {
      const input: UpdateCategoryInput = {
        color: 'invalid-color'
      };

      const result = CategoryModel.validateUpdateInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Color must be a valid hex color code (e.g., #FF5733)');
    });

    it('should validate empty input object', () => {
      const input: UpdateCategoryInput = {};

      const result = CategoryModel.validateUpdateInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('getDefaultCategories', () => {
    it('should return 8 default categories', () => {
      const defaults = CategoryModel.getDefaultCategories();
      expect(defaults).toHaveLength(8);
    });

    it('should return categories with required fields', () => {
      const defaults = CategoryModel.getDefaultCategories();
      
      defaults.forEach(category => {
        expect(category).toHaveProperty('name');
        expect(category).toHaveProperty('color');
        expect(category).toHaveProperty('icon');
        expect(category.name).toBeTruthy();
        expect(category.color).toMatch(/^#[0-9A-F]{6}$/i);
        expect(category.icon).toBeTruthy();
      });
    });

    it('should include expected default categories', () => {
      const defaults = CategoryModel.getDefaultCategories();
      const categoryNames = defaults.map(c => c.name);
      
      expect(categoryNames).toContain('Groceries');
      expect(categoryNames).toContain('Transportation');
      expect(categoryNames).toContain('Entertainment');
      expect(categoryNames).toContain('Other');
    });
  });

  describe('formatCategory', () => {
    it('should format category with trimmed values and uppercase color', () => {
      const category = {
        id: '123',
        user_id: '456',
        name: '  Groceries  ',
        color: '#4caf50',
        icon: '  🛒  ',
        created_at: new Date(),
        updated_at: new Date()
      };

      const formatted = CategoryModel.formatCategory(category);
      
      expect(formatted.name).toBe('Groceries');
      expect(formatted.color).toBe('#4CAF50');
      expect(formatted.icon).toBe('🛒');
      expect(formatted.id).toBe('123');
      expect(formatted.user_id).toBe('456');
    });
  });
});