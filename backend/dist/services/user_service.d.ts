import { UserProfile, UserPreferences } from '../models/User';
import { User } from '../types';
declare class UserService {
    static getUserProfile(userId: string): Promise<UserProfile>;
    static updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;
    static getUserPreferences(userId: string): Promise<UserPreferences>;
    static updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences>;
    static deleteUser(userId: string): Promise<boolean>;
    static getUserStats(userId: string): Promise<any>;
    static changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
    static getAllUsers(): Promise<User[]>;
    static searchUsers(query: string): Promise<User[]>;
    static getProfile(userId: string): Promise<UserProfile>;
    static updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;
    static deleteAccount(userId: string): Promise<void>;
}
export default UserService;
