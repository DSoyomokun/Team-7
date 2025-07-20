import express, { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { validateSignUp, validateLogin } from '../middleware/validation';

const router = express.Router();

// Sign up
router.post('/signup', validateSignUp, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.signUp(email, password);
    res.status(201).json({ message: 'User created successfully', data: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', validateLogin, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json({ message: 'Login successful', data: result });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// Logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    await AuthService.logout();
    res.json({ message: 'Logout successful' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get session
router.get('/session', async (req: Request, res: Response) => {
  try {
    const session = await AuthService.getSession();
    res.json({ session });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

export default router;
