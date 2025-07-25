import express, { Request, Response } from 'express';
import authRoutes from './auth';
import transactionRoutes from './transactions';
import budgetRoutes from './budget';
import accountRoutes from './accounts';
import userRoutes from './users';
import goalRoutes from './goals';
import dashboardRoutes from './dashboard';
import reportRoutes from './reports';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budget', budgetRoutes);
router.use('/goals', goalRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

export default router;