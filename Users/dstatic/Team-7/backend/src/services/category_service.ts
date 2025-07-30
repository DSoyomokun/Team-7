/**
 * Category Service
 * Business logic for category management
 */

import { supabase } from '../config/database';
import { Category, CreateCategoryInput, UpdateCategoryInput, CategoryModel } from '../models/Category';

export class CategoryService {
  /**
   * Creates a new category for a user
   */
  static async createCategory(userId: string, input: CreateCategoryInput): Promise<{ success: boolean; data?: Category; error?: string }> {
    try {
      // Validate input
      const validation = CategoryModel.validateCategoryInput(input);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Check if category name already exists for this user
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', userId)
        .eq('name', input.name.trim())
        .single();

      if (existingCategory) {
        return { success: false, error: 'Category with this name already exists' };
      }

      // Create category
      const { data, error } = await supabase
        .from('categories')
        .insert({
          user_id: userId,
          name: input.name.trim(),
          color: input.color.toUpperCase(),
          icon: input.icon.trim()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Failed to create category' };
      }

      return { success: true, data: CategoryModel.formatCategory(data) };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Gets all categories for a user
   */
  static async getUserCategories(userId: string): Promise<{ success: boolean; data?: Category[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) {
        return { success: false, error: 'Failed to fetch categories' };
      }

      const formattedCategories = data.map(CategoryModel.formatCategory);
      return { success: true, data: formattedCategories };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Updates a category
   */
  static async updateCategory(userId: string, categoryId: string, input: UpdateCategoryInput): Promise<{ success: boolean; data?: Category; error?: string }> {
    try {
      // Validate input
      const validation = CategoryModel.validateUpdateInput(input);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Check if category exists and belongs to user
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id, name')
        .eq('id', categoryId)
        .eq('user_id', userId)
        .single();

      if (!existingCategory) {
        return { success: false, error: 'Category not found' };
      }

      // Check for name uniqueness if name is being updated
      if (input.name && input.name.trim() !== existingCategory.name) {
        const { data: duplicateCategory } = await supabase
          .from('categories')
          .select('id')
          .eq('user_id', userId)
          .eq('name', input.name.trim())
          .single();

        if (duplicateCategory) {
          return { success: false, error: 'Category with this name already exists' };
        }
      }

      // Prepare update data
      const updateData: any = {};
      if (input.name !== undefined) updateData.name = input.name.trim();
      if (input.color !== undefined) updateData.color = input.color.toUpperCase();
      if (input.icon !== undefined) updateData.icon = input.icon.trim();

      // Update category
      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', categoryId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Failed to update category' };
      }

      return { success: true, data: CategoryModel.formatCategory(data) };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Deletes a category if not in use
   */
  static async deleteCategory(userId: string, categoryId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if category exists and belongs to user
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('id', categoryId)
        .eq('user_id', userId)
        .single();

      if (!existingCategory) {
        return { success: false, error: 'Category not found' };
      }

      // Check if category is in use by any transactions
      const { data: transactionsUsingCategory, error: transactionError } = await supabase
        .from('transactions')
        .select('id')
        .eq('category_id', categoryId)
        .limit(1);

      if (transactionError) {
        return { success: false, error: 'Failed to check category usage' };
      }

      if (transactionsUsingCategory && transactionsUsingCategory.length > 0) {
        return { success: false, error: 'Cannot delete category that is in use by transactions' };
      }

      // Delete category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: 'Failed to delete category' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Creates default categories for a new user
   */
  static async createDefaultCategories(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const defaultCategories = CategoryModel.getDefaultCategories();
      const categoriesToInsert = defaultCategories.map(category => ({
        user_id: userId,
        name: category.name,
        color: category.color,
        icon: category.icon
      }));

      const { error } = await supabase
        .from('categories')
        .insert(categoriesToInsert);

      if (error) {
        return { success: false, error: 'Failed to create default categories' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Internal server error' };
    }
  }
}