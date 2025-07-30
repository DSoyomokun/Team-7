/**
 * Express App Configuration
 * Main application setup with routes and middleware
 */

import express from 'express';
import cors from 'cors';
import categoryRoutes from './routes/categories';
import transactionRoutes from './routes/transactions';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Transaction Categorization System API' });
});

export { app };