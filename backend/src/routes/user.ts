import express, { Request, Response } from 'express';
import userAdapter from '../adapters/userAdapter';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

// Get user profile
router.get('/profile', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const profile = await userAdapter.getUserProfile(userId);
    res.json({ profile });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    const updatedProfile = await userAdapter.updateUserProfile(userId, updates);
    res.json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user account
router.delete('/account', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const deleted = await userAdapter.deleteUser(userId);
    if (deleted) {
      res.json({ message: 'Account deleted successfully' });
    } else {
      res.status(400).json({ error: 'Failed to delete account' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user preferences
router.get('/preferences', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const preferences = await userAdapter.getUserPreferences(userId);
    res.json({ preferences });
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Update user preferences
router.put('/preferences', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const preferences = req.body;
    const updatedPreferences = await userAdapter.updateUserPreferences(userId, preferences);
    res.json({ message: 'Preferences updated successfully', preferences: updatedPreferences });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get user statistics
router.get('/stats', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const stats = await userAdapter.getUserStats(userId);
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Change password
router.put('/password', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    const success = await userAdapter.changePassword(userId, currentPassword, newPassword);
    if (success) {
      res.json({ message: 'Password changed successfully' });
    } else {
      res.status(400).json({ error: 'Failed to change password' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Search users (public endpoint with rate limiting recommended)
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const users = await userAdapter.searchUsers(q);
    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (admin only - add admin middleware when implemented)
router.get('/all', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Add admin role check middleware
    const users = await userAdapter.getAllUsers();
    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
