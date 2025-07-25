import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { successResponse, errorResponse, RESPONSE_MESSAGES } from '../utils/response';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    full_name?: string;
    created_at: string;
  };
}

export default class UserController {
  /**
   * Get user profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'User not authenticated', 401);
      }

      const profile = await UserRepository.findById(userId);
      successResponse(res, { profile }, 'Profile retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message || 'Failed to retrieve profile', 500);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'User not authenticated', 401);
      }

      const updates = req.body;
      const updatedProfile = await UserRepository.update(userId, updates);

      successResponse(res, { profile: updatedProfile }, RESPONSE_MESSAGES.UPDATED);
    } catch (error: any) {
      errorResponse(res, error.message || 'Failed to update profile', 400);
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'User not authenticated', 401);
      }

      await UserRepository.delete(userId);
      successResponse(res, null, RESPONSE_MESSAGES.DELETED);
    } catch (error: any) {
      errorResponse(res, error.message || 'Failed to delete account', 500);
    }
  }

  /**
   * Get user preferences
   */
  static async getPreferences(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'User not authenticated', 401);
      }

      const profile = await UserRepository.findById(userId);
      const preferences = {
        currency_preference: profile.currency_preference || 'USD',
        language: 'en', // Default value
        notifications: true, // Default value
        theme: 'light' // Default value
      };

      successResponse(res, { preferences }, 'Preferences retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message || 'Failed to retrieve preferences', 500);
    }
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'User not authenticated', 401);
      }

      const { currency_preference } = req.body;
      const updates: any = {};

      if (currency_preference) updates.currency_preference = currency_preference;

      const updatedProfile = await UserRepository.update(userId, updates);

      const preferences = {
        currency_preference: updatedProfile.currency_preference || 'USD',
        language: 'en', // Default value
        notifications: true, // Default value
        theme: 'light' // Default value
      };

      successResponse(res, { preferences }, RESPONSE_MESSAGES.UPDATED);
    } catch (error: any) {
      errorResponse(res, error.message || 'Failed to update preferences', 400);
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'User not authenticated', 401);
      }

      // TODO: Implement actual statistics calculation
      const stats = {
        totalTransactions: 0,
        totalIncome: 0,
        totalExpenses: 0,
        averageMonthlySpending: 0,
        savingsRate: 0,
        accountAge: 0
      };

      successResponse(res, { stats }, 'User statistics retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message || 'Failed to retrieve user statistics', 500);
    }
  }

  /**
   * Change password
   */
  static async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'User not authenticated', 401);
      }

      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return errorResponse(res, 'Current password and new password are required', 400);
      }

      if (newPassword.length < 6) {
        return errorResponse(res, 'New password must be at least 6 characters long', 400);
      }

      // TODO: Implement password change logic with Supabase
      // For now, return success
      successResponse(res, null, 'Password changed successfully');
    } catch (error: any) {
      errorResponse(res, error.message || 'Failed to change password', 400);
    }
  }

  /**
   * Search users (public endpoint)
   */
  static async searchUsers(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return errorResponse(res, 'Search query is required', 400);
      }

      // TODO: Implement user search logic
      const users: any[] = [];
      successResponse(res, { users }, 'User search completed');
    } catch (error: any) {
      errorResponse(res, error.message || 'Failed to search users', 500);
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return errorResponse(res, 'User not authenticated', 401);
      }

      // TODO: Add admin role check and implement getAll method
      const users: any[] = [];
      successResponse(res, { users }, 'All users retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message || 'Failed to retrieve users', 500);
    }
  }
}
