import express from 'express';
import goalController from '../controllers/goalController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// POST /api/goals - Create new goal
router.post('/', goalController.createGoal);

// GET /api/goals - List all goals for user (with optional filters)
router.get('/', goalController.getGoals);

// GET /api/goals/analytics - Get goal analytics and summary
router.get('/analytics', goalController.getAnalytics);

// GET /api/goals/recommendations - Get goal recommendations
router.get('/recommendations', goalController.getRecommendations);

// POST /api/goals/sync - Sync goal progress from transactions
router.post('/sync', goalController.syncProgressFromTransactions);

// GET /api/goals/:id - Get single goal by ID
router.get('/:id', goalController.getGoalById);

// PUT /api/goals/:id - Update goal
router.put('/:id', goalController.updateGoal);

// DELETE /api/goals/:id - Delete goal
router.delete('/:id', goalController.deleteGoal);

// PUT /api/goals/:id/progress - Update goal progress
router.put('/:id/progress', goalController.updateProgress);

// POST /api/goals/:id/complete - Mark goal as completed
router.post('/:id/complete', goalController.markCompleted);

export default router;