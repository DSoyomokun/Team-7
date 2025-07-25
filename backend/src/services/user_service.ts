import { supabase } from '../config/database';
import { UserRepository } from '../repositories/user.repository';
import { UserProfile, UserPreferences, SUPPORTED_CURRENCIES } from '../models/User';
import { User } from '../types';

class UserService {
  static async getUserProfile(userId: string): Promise<UserProfile> {
    const profile = await UserRepository.findById(userId);
    
    // Get user email from auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
    if (authError) throw new Error(`Failed to get auth user: ${authError.message}`);
    
    return {
      user_id: profile.user_id,
      full_name: profile.full_name || null,
      currency_preference: profile.currency_preference || 'USD',
      email: authUser.user?.email
    } as UserProfile;
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    // Validate currency preference if provided
    if (updates.currency_preference && !SUPPORTED_CURRENCIES.includes(updates.currency_preference as any)) {
      throw new Error(`Unsupported currency: ${updates.currency_preference}. Supported currencies: ${SUPPORTED_CURRENCIES.join(', ')}`);
    }

    // Remove fields that shouldn't be updated directly
    const { user_id, created_at, updated_at, email, ...profileUpdates } = updates;
    
    const updatedProfile = await UserRepository.update(userId, profileUpdates);
    
    // Return complete profile with auth data
    return await this.getUserProfile(userId);
  }

  static async getUserPreferences(userId: string): Promise<UserPreferences> {
    const profile = await UserRepository.findById(userId);
    return {
      currency_preference: profile.currency_preference || 'USD'
    };
  }

  static async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    // Validate currency preference
    if (preferences.currency_preference && !SUPPORTED_CURRENCIES.includes(preferences.currency_preference as any)) {
      throw new Error(`Unsupported currency: ${preferences.currency_preference}. Supported currencies: ${SUPPORTED_CURRENCIES.join(', ')}`);
    }

    await UserRepository.update(userId, preferences);
    return await this.getUserPreferences(userId);
  }

  static async deleteUser(userId: string): Promise<boolean> {
    try {
      await UserRepository.delete(userId);
      
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw new Error(error.message);
      
      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      return false;
    }
  }

  static async getUserStats(userId: string): Promise<any> {
    // Get user transaction counts and other stats
    const { data: transactionStats, error: transactionError } = await supabase
      .from('transactions')
      .select('id, amount, is_expense')
      .eq('user_id', userId);

    if (transactionError) throw new Error(`Failed to get transaction stats: ${transactionError.message}`);

    const totalTransactions = transactionStats?.length || 0;
    const totalExpenses = transactionStats?.filter(t => t.is_expense).length || 0;
    const totalIncome = transactionStats?.filter(t => !t.is_expense).length || 0;
    const totalExpenseAmount = transactionStats?.filter(t => t.is_expense).reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0;
    const totalIncomeAmount = transactionStats?.filter(t => !t.is_expense).reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0;

    return {
      totalTransactions,
      totalExpenses,
      totalIncome,
      totalExpenseAmount,
      totalIncomeAmount,
      netAmount: totalIncomeAmount - totalExpenseAmount
    };
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Update password using Supabase auth
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword
      });

      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error('Failed to change password:', error);
      return false;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    // This should be admin-only functionality
    const { data: profiles, error } = await supabase
      .from('profile')
      .select('*');

    if (error) throw new Error(`Failed to get users: ${error.message}`);
    
    return profiles.map(profile => ({
      id: profile.user_id,
      name: profile.full_name || 'Unknown',
      email: 'email-hidden' // For security, don't expose emails in bulk queries
    }));
  }

  static async searchUsers(query: string): Promise<User[]> {
    const { data: profiles, error } = await supabase
      .from('profile')
      .select('*')
      .ilike('full_name', `%${query}%`);

    if (error) throw new Error(`Failed to search users: ${error.message}`);
    
    return profiles.map(profile => ({
      id: profile.user_id,
      name: profile.full_name || 'Unknown',
      email: 'email-hidden' // For security, don't expose emails in search
    }));
  }

  // Legacy methods for backward compatibility
  static async getProfile(userId: string): Promise<UserProfile> {
    return await this.getUserProfile(userId);
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    return await this.updateUserProfile(userId, updates);
  }

  static async deleteAccount(userId: string): Promise<void> {
    const success = await this.deleteUser(userId);
    if (!success) {
      throw new Error('Failed to delete account');
    }
  }
}

export default UserService;
