import express from 'express';
import accountController from '../controllers/accountController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// All account routes require authentication
router.use(authenticateUser);

// POST /api/accounts - Create new account
router.post('/', accountController.create);

// GET /api/accounts - Get all user accounts
router.get('/', accountController.getAll);

// GET /api/accounts/summary - Get account balance summary
router.get('/summary', accountController.getBalanceSummary);

// GET /api/accounts/:id - Get specific account
router.get('/:id', accountController.getById);

// PUT /api/accounts/:id - Update account
router.put('/:id', accountController.update);

// DELETE /api/accounts/:id - Delete account
router.delete('/:id', accountController.delete);

export default router;