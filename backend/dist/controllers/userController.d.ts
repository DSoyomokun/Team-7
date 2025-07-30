import { Request, Response } from 'express';
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
    static getProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Update user profile
     */
    static updateProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Delete user account
     */
    static deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get user preferences
     */
    static getPreferences(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Update user preferences
     */
    static updatePreferences(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Get user statistics
     */
    static getUserStats(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Change password
     */
    static changePassword(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Search users (public endpoint)
     */
    static searchUsers(req: Request, res: Response): Promise<void>;
    /**
     * Get all users (admin only)
     */
    static getAllUsers(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export {};
