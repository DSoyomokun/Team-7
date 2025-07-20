const express = require('express');
const router = express.Router();
const UserService = require('../services/user');
const { authenticateUser } = require('../middleware/auth');

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await UserService.getProfile(userId);
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    const updatedProfile = await UserService.updateProfile(userId, updates);
    res.json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user account
router.delete('/account', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    await UserService.deleteAccount(userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 