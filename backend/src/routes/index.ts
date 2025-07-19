import express, { Request, Response } from 'express';
import authRoutes from './auth';
import transactionRoutes from './transactions';
import budgetRoutes from './budget';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budget', budgetRoutes);

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

export default router;