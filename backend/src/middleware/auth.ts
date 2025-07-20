import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';

// Extend Express's Request type to add the "user" property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace `any` with your user type if you have one
    }
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = data.user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
};
