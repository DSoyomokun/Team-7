import express, { Request, Response } from 'express';
import userAdapter from '../adapters/userAdapter';
import UserController from '../controllers/userController';
import { authenticateUser } from '../middleware/auth';
import { validateProfileUpdate, validatePreferencesUpdate } from '../middleware/validation';
import { successResponse, errorResponse, RESPONSE_MESSAGES } from '../utils/response';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateUser, UserController.getProfile);

// Update user profile
router.put('/profile', authenticateUser, validateProfileUpdate, UserController.updateProfile);

// Delete user account
router.delete('/account', authenticateUser, UserController.deleteAccount);

// Get user preferences
router.get('/preferences', authenticateUser, UserController.getPreferences);

// Update user preferences
router.put('/preferences', authenticateUser, validatePreferencesUpdate, UserController.updatePreferences);

// Get user statistics
router.get('/stats', authenticateUser, UserController.getUserStats);

// Change password
router.put('/password', authenticateUser, UserController.changePassword);

// Search users (public endpoint with rate limiting recommended)
router.get('/search', UserController.searchUsers);

// Get all users (admin only - add admin middleware when implemented)
router.get('/all', authenticateUser, UserController.getAllUsers);

export default router;
