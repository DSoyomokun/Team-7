import { Category, CategoryProps } from '../models/Category';
import supabase from '../lib/supabase';

export class CategoryRepository {
  /**
   * Get all categories for a user
   */
  static async findByUserId(userId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data ? data.map(cat => new Category(cat)) : [];
  }

  /**
   * Get category by ID
   */
  static async findById(categoryId: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to fetch category: ${error.message}`);
    }

    return data ? new Category(data) : null;
  }

  /**
   * Get categories with spending amounts for analytics
   */
  static async findCategoriesWithSpending(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<Array<{
    category_id: string;
    category_name: string;
    color: string;
    total_spent: number;
  }>> {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        color,
        transactions!inner(
          amount,
          is_expense,
          date
        )
      `)
      .eq('user_id', userId)
      .eq('transactions.is_expense', true)
      .gte('transactions.date', startDate.toISOString())
      .lte('transactions.date', endDate.toISOString());

    if (error) {
      throw new Error(`Failed to fetch categories with spending: ${error.message}`);
    }

    // Process the data to calculate totals
    const results = data?.map(category => {
      const totalSpent = category.transactions.reduce((sum: number, transaction: any) => {
        return sum + transaction.amount;
      }, 0);

      return {
        category_id: category.id,
        category_name: category.name,
        color: category.color || '#747D8C',
        total_spent: totalSpent
      };
    }) || [];

    // Filter out categories with no spending
    return results.filter(cat => cat.total_spent > 0);
  }

  /**
   * Create a new category
   */
  static async create(categoryProps: CategoryProps): Promise<Category> {
    const category = new Category(categoryProps);
    
    const { data, error } = await supabase
      .from('categories')
      .insert(category.toJSON())
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return new Category(data);
  }

  /**
   * Update a category
   */
  static async update(categoryId: string, updates: Partial<CategoryProps>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }

    return new Category(data);
  }

  /**
   * Delete a category
   */
  static async delete(categoryId: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }

  /**
   * Get default categories (fallback for uncategorized transactions)
   */
  static async getDefaultCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_default', true)
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch default categories: ${error.message}`);
    }

    return data ? data.map(cat => new Category(cat)) : [];
  }

  /**
   * Ensure user has default categories (used during user creation)
   */
  static async ensureDefaultCategories(userId: string): Promise<Category[]> {
    // Check if user already has categories
    const existing = await this.findByUserId(userId);
    if (existing.length > 0) {
      return existing;
    }

    // Create default categories for the user
    const defaultCategories = Category.createDefaultCategories(userId);
    const createdCategories: Category[] = [];

    for (const category of defaultCategories) {
      try {
        const created = await this.create(category);
        createdCategories.push(created);
      } catch (error) {
        console.error(`Failed to create default category ${category.name}:`, error);
      }
    }

    return createdCategories;
  }
}