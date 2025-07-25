import { Request, Response, NextFunction } from 'express';
import { SUPPORTED_CURRENCIES } from '../models/User';

export const validateSignUp = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }
  
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  
  next();
};

export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { full_name, currency_preference } = req.body;

  // Validate full_name if provided
  if (full_name !== undefined) {
    if (typeof full_name !== 'string' && full_name !== null) {
      res.status(400).json({ error: 'Full name must be a string or null' });
      return;
    }
    if (full_name && full_name.trim().length === 0) {
      res.status(400).json({ error: 'Full name cannot be empty' });
      return;
    }
    if (full_name && full_name.length > 100) {
      res.status(400).json({ error: 'Full name cannot exceed 100 characters' });
      return;
    }
  }

  // Validate currency_preference if provided
  if (currency_preference !== undefined) {
    if (typeof currency_preference !== 'string') {
      res.status(400).json({ error: 'Currency preference must be a string' });
      return;
    }
    if (!SUPPORTED_CURRENCIES.includes(currency_preference as any)) {
      res.status(400).json({ 
        error: `Unsupported currency: ${currency_preference}. Supported currencies: ${SUPPORTED_CURRENCIES.join(', ')}` 
      });
      return;
    }
  }

  next();
};

export const validatePreferencesUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { currency_preference } = req.body;

  // Validate currency_preference if provided
  if (currency_preference !== undefined) {
    if (typeof currency_preference !== 'string') {
      res.status(400).json({ error: 'Currency preference must be a string' });
      return;
    }
    if (!SUPPORTED_CURRENCIES.includes(currency_preference as any)) {
      res.status(400).json({ 
        error: `Unsupported currency: ${currency_preference}. Supported currencies: ${SUPPORTED_CURRENCIES.join(', ')}` 
      });
      return;
    }
  }

  next();
};
