"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAdapter_1 = __importDefault(require("../adapters/userAdapter"));
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
// Get user profile
router.get('/profile', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await userAdapter_1.default.getUserProfile(userId);
        res.json({ profile });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
// Update user profile
router.put('/profile', auth_1.authenticateUser, validation_1.validateProfileUpdate, async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        const updatedProfile = await userAdapter_1.default.updateUserProfile(userId, updates);
        res.json({ message: 'Profile updated successfully', profile: updatedProfile });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Delete user account
router.delete('/account', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const deleted = await userAdapter_1.default.deleteUser(userId);
        if (deleted) {
            res.json({ message: 'Account deleted successfully' });
        }
        else {
            res.status(400).json({ error: 'Failed to delete account' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get user preferences
router.get('/preferences', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const preferences = await userAdapter_1.default.getUserPreferences(userId);
        res.json({ preferences });
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
// Update user preferences
router.put('/preferences', auth_1.authenticateUser, validation_1.validatePreferencesUpdate, async (req, res) => {
    try {
        const userId = req.user.id;
        const preferences = req.body;
        const updatedPreferences = await userAdapter_1.default.updateUserPreferences(userId, preferences);
        res.json({ message: 'Preferences updated successfully', preferences: updatedPreferences });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Get user statistics
router.get('/stats', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await userAdapter_1.default.getUserStats(userId);
        res.json({ stats });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Change password
router.put('/password', auth_1.authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }
        const success = await userAdapter_1.default.changePassword(userId, currentPassword, newPassword);
        if (success) {
            res.json({ message: 'Password changed successfully' });
        }
        else {
            res.status(400).json({ error: 'Failed to change password' });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Search users (public endpoint with rate limiting recommended)
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const users = await userAdapter_1.default.searchUsers(q);
        res.json({ users });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get all users (admin only - add admin middleware when implemented)
router.get('/all', auth_1.authenticateUser, async (req, res) => {
    try {
        // TODO: Add admin role check middleware
        const users = await userAdapter_1.default.getAllUsers();
        res.json({ users });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map