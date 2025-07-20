const express = require('express');
const router = express.Router();
const AuthService = require('../services/auth.service');
const { validateSignUp, validateLogin } = require('../middleware/validation');

// Sign up
router.post('/signup', validateSignUp, async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.signUp(email, password);
    res.status(201).json({ message: 'User created successfully', data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json({ message: 'Login successful', data: result });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    await AuthService.logout();
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get session
router.get('/session', async (req, res) => {
  try {
    const session = await AuthService.getSession();
    res.json({ session });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router; 