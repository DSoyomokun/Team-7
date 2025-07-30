import UserService from '../services/user_service';
import { User, PublicUser } from '../types';
import { UserProfile, UserPreferences } from '../models/User';

const userAdapter = {
  // Get user profile by ID
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    return await UserService.getUserProfile(userId);
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
    return await UserService.updateUserProfile(userId, updates);
  },

  // Delete user account
  deleteUser: async (userId: string): Promise<boolean> => {
    return await UserService.deleteUser(userId);
  },

  // Get user preferences
  getUserPreferences: async (userId: string): Promise<UserPreferences> => {
    return await UserService.getUserPreferences(userId);
  },

  // Update user preferences
  updateUserPreferences: async (userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    return await UserService.updateUserPreferences(userId, preferences);
  },

  // Get user statistics
  getUserStats: async (userId: string): Promise<any> => {
    return await UserService.getUserStats(userId);
  },

  // Change user password
  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    return await UserService.changePassword(userId, currentPassword, newPassword);
  },

  // Get all users (admin only)
  getAllUsers: async (): Promise<PublicUser[]> => {
    return await UserService.getAllUsers();
  },

  // Search users
  searchUsers: async (query: string): Promise<PublicUser[]> => {
    return await UserService.searchUsers(query);
  }
};

export default userAdapter;