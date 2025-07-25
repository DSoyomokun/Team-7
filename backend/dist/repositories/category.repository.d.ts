import { Category, CategoryProps } from '../models/Category';
export declare class CategoryRepository {
    /**
     * Get all categories for a user
     */
    static findByUserId(userId: string): Promise<Category[]>;
    /**
     * Get category by ID
     */
    static findById(categoryId: string): Promise<Category | null>;
    /**
     * Get categories with spending amounts for analytics
     */
    static findCategoriesWithSpending(userId: string, startDate: Date, endDate: Date): Promise<Array<{
        category_id: string;
        category_name: string;
        color: string;
        total_spent: number;
    }>>;
    /**
     * Create a new category
     */
    static create(categoryProps: CategoryProps): Promise<Category>;
    /**
     * Update a category
     */
    static update(categoryId: string, updates: Partial<CategoryProps>): Promise<Category>;
    /**
     * Delete a category
     */
    static delete(categoryId: string): Promise<void>;
    /**
     * Get default categories (fallback for uncategorized transactions)
     */
    static getDefaultCategories(): Promise<Category[]>;
    /**
     * Ensure user has default categories (used during user creation)
     */
    static ensureDefaultCategories(userId: string): Promise<Category[]>;
}
