import express, { Request, Response } from 'express';
import { authenticateUser } from '../middleware/auth';
import ReportController from '../controllers/reportController';
import { successResponse, errorResponse, RESPONSE_MESSAGES } from '../utils/response';

const router = express.Router();

// Get spending report
router.get('/spending', authenticateUser, ReportController.getSpendingReport);

// Get income report
router.get('/income', authenticateUser, ReportController.getIncomeReport);

// Get budget vs actual report
router.get('/budget-vs-actual', authenticateUser, ReportController.getBudgetVsActualReport);

// Get savings report
router.get('/savings', authenticateUser, ReportController.getSavingsReport);

// Get comprehensive financial report
router.get('/comprehensive', authenticateUser, ReportController.getComprehensiveReport);

export default router;
