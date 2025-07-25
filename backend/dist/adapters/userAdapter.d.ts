import { User } from '../types';
import { UserProfile, UserPreferences } from '../models/User';
declare const userAdapter: {
    getUserProfile: (userId: string) => Promise<UserProfile>;
    updateUserProfile: (userId: string, updates: Partial<UserProfile>) => Promise<UserProfile>;
    deleteUser: (userId: string) => Promise<boolean>;
    getUserPreferences: (userId: string) => Promise<UserPreferences>;
    updateUserPreferences: (userId: string, preferences: Partial<UserPreferences>) => Promise<UserPreferences>;
    getUserStats: (userId: string) => Promise<any>;
    changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<boolean>;
    getAllUsers: () => Promise<User[]>;
    searchUsers: (query: string) => Promise<User[]>;
};
export default userAdapter;
