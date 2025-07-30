/**
 * Category Model
 * Handles transaction categorization with user-scoped categories
 */

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCategoryInput {
  name: string;
  color: string;
  icon: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
  icon?: string;
}

export class CategoryModel {
  /**
   * Validates category input data
   */
  static validateCategoryInput(input: CreateCategoryInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate name
    if (!input.name || input.name.trim().length === 0) {
      errors.push('Category name is required');
    } else if (input.name.length > 50) {
      errors.push('Category name must be 50 characters or less');
    }

    // Validate color (hex format)
    if (!input.color || !/^#[0-9A-F]{6}$/i.test(input.color)) {
      errors.push('Color must be a valid hex color code (e.g., #FF5733)');
    }

    // Validate icon
    if (!input.icon || input.icon.trim().length === 0) {
      errors.push('Category icon is required');
    } else if (input.icon.length > 20) {
      errors.push('Icon must be 20 characters or less');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates update input data
   */
  static validateUpdateInput(input: UpdateCategoryInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate name if provided
    if (input.name !== undefined) {
      if (input.name.trim().length === 0) {
        errors.push('Category name cannot be empty');
      } else if (input.name.length > 50) {
        errors.push('Category name must be 50 characters or less');
      }
    }

    // Validate color if provided
    if (input.color !== undefined && !/^#[0-9A-F]{6}$/i.test(input.color)) {
      errors.push('Color must be a valid hex color code (e.g., #FF5733)');
    }

    // Validate icon if provided
    if (input.icon !== undefined) {
      if (input.icon.trim().length === 0) {
        errors.push('Category icon cannot be empty');
      } else if (input.icon.length > 20) {
        errors.push('Icon must be 20 characters or less');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Default categories to be created for new users
   */
  static getDefaultCategories(): Omit<CreateCategoryInput, 'user_id'>[] {
    return [
      { name: 'Groceries', color: '#4CAF50', icon: '🛒' },
      { name: 'Transportation', color: '#2196F3', icon: '🚗' },
      { name: 'Entertainment', color: '#E91E63', icon: '🎬' },
      { name: 'Utilities', color: '#FF9800', icon: '⚡' },
      { name: 'Rent/Mortgage', color: '#795548', icon: '🏠' },
      { name: 'Healthcare', color: '#F44336', icon: '🏥' },
      { name: 'Shopping', color: '#9C27B0', icon: '🛍️' },
      { name: 'Other', color: '#607D8B', icon: '📦' }
    ];
  }

  /**
   * Creates a formatted category object for API responses
   */
  static formatCategory(category: Category): Category {
    return {
      id: category.id,
      user_id: category.user_id,
      name: category.name.trim(),
      color: category.color.toUpperCase(),
      icon: category.icon.trim(),
      created_at: category.created_at,
      updated_at: category.updated_at
    };
  }
}