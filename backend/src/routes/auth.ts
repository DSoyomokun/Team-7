import express, { Request, Response } from 'express';
import authAdapter from '../adapters/authAdapter';

const router = express.Router();

// Sign up
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const result = await authAdapter.signUp(email, password, name);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create user'
    });
  }
});

// Register (legacy support)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const result = await authAdapter.signUp(email, password, name);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to register user'
    });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const result = await authAdapter.login(email, password);
    res.json(result);
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Login failed'
    });
  }
});

// Logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    await authAdapter.logout();
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Logout failed'
    });
  }
});

// Get session
router.get('/session', async (req: Request, res: Response) => {
  try {
    const session = await authAdapter.getSession();
    res.json({
      success: true,
      data: { session }
    });
  } catch (error: any) {
    console.error('Get session error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Failed to get session'
    });
  }
});

// Verify token
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }

    const decoded = await authAdapter.verifyToken(token);
    res.json({
      success: true,
      data: { user: decoded }
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Invalid token'
    });
  }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    const result = await authAdapter.refreshToken(refresh_token);
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      error: error.message || 'Failed to refresh token'
    });
  }
});

export default router;
