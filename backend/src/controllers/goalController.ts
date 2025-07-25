import { Request, Response } from 'express';
import { GoalService } from '../services/goal_service';

const goalController = {
  // Create a new goal
  createGoal: async (req: Request, res: Response) => {
    try {
      const { name, type, target_amount, target_date, current_amount } = req.body;
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      // Validate required fields
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Goal name is required'
        });
      }

      if (!type || !['savings', 'debt'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Goal type must be either "savings" or "debt"'
        });
      }

      if (!target_amount || typeof target_amount !== 'number' || target_amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid target amount is required'
        });
      }

      if (!target_date) {
        return res.status(400).json({
          success: false,
          error: 'Target date is required'
        });
      }

      const goalData = {
        name: name.trim(),
        type,
        target_amount,
        target_date,
        current_amount: current_amount || 0
      };

      const goal = await GoalService.createGoal(user_id, goalData);

      res.status(201).json({
        success: true,
        message: 'Goal created successfully',
        data: goal.toJSON()
      });
    } catch (error: any) {
      console.error('Goal creation error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create goal'
      });
    }
  },

  // Get all goals for user
  getGoals: async (req: Request, res: Response) => {
    try {
      const user_id = req.user?.id;
      const { type, completed, overdue } = req.query;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const filters: any = {};
      if (type && ['savings', 'debt'].includes(type as string)) {
        filters.type = type as 'savings' | 'debt';
      }
      if (completed !== undefined) {
        filters.completed = completed === 'true';
      }
      if (overdue !== undefined) {
        filters.overdue = overdue === 'true';
      }

      const goals = await GoalService.getGoals(user_id, filters);

      res.status(200).json({
        success: true,
        data: goals.map(g => g.toJSON())
      });
    } catch (error: any) {
      console.error('Get goals error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch goals'
      });
    }
  },

  // Get single goal by ID
  getGoalById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const goal = await GoalService.getGoalById(id, user_id);

      res.status(200).json({
        success: true,
        data: goal.toJSON()
      });
    } catch (error: any) {
      console.error('Get goal error:', error);
      if (error.message === 'Goal not found') {
        res.status(404).json({
          success: false,
          error: 'Goal not found'
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to fetch goal'
        });
      }
    }
  },

  // Update goal
  updateGoal: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;
      const updates = req.body;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      // Validate updates
      if (updates.type && !['savings', 'debt'].includes(updates.type)) {
        return res.status(400).json({
          success: false,
          error: 'Goal type must be either "savings" or "debt"'
        });
      }

      if (updates.target_amount !== undefined && 
          (typeof updates.target_amount !== 'number' || updates.target_amount <= 0)) {
        return res.status(400).json({
          success: false,
          error: 'Target amount must be a positive number'
        });
      }

      if (updates.current_amount !== undefined && 
          (typeof updates.current_amount !== 'number' || updates.current_amount < 0)) {
        return res.status(400).json({
          success: false,
          error: 'Current amount must be a non-negative number'
        });
      }

      const goal = await GoalService.updateGoal(id, user_id, updates);

      res.status(200).json({
        success: true,
        message: 'Goal updated successfully',
        data: goal.toJSON()
      });
    } catch (error: any) {
      console.error('Update goal error:', error);
      if (error.message === 'Goal not found') {
        res.status(404).json({
          success: false,
          error: 'Goal not found'
        });
      } else {
        res.status(400).json({
          success: false,
          error: error.message || 'Failed to update goal'
        });
      }
    }
  },

  // Update goal progress
  updateProgress: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { current_amount } = req.body;
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      if (current_amount === undefined || typeof current_amount !== 'number' || current_amount < 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid current amount is required'
        });
      }

      const goal = await GoalService.updateGoalProgress(id, user_id, current_amount);

      res.status(200).json({
        success: true,
        message: 'Goal progress updated successfully',
        data: goal.toJSON()
      });
    } catch (error: any) {
      console.error('Update progress error:', error);
      if (error.message === 'Goal not found') {
        res.status(404).json({
          success: false,
          error: 'Goal not found'
        });
      } else {
        res.status(400).json({
          success: false,
          error: error.message || 'Failed to update goal progress'
        });
      }
    }
  },

  // Mark goal as completed
  markCompleted: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const goal = await GoalService.markGoalCompleted(id, user_id);

      res.status(200).json({
        success: true,
        message: 'Goal marked as completed',
        data: goal.toJSON()
      });
    } catch (error: any) {
      console.error('Mark completed error:', error);
      if (error.message === 'Goal not found') {
        res.status(404).json({
          success: false,
          error: 'Goal not found'
        });
      } else {
        res.status(400).json({
          success: false,
          error: error.message || 'Failed to mark goal as completed'
        });
      }
    }
  },

  // Delete goal
  deleteGoal: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      await GoalService.deleteGoal(id, user_id);

      res.status(200).json({
        success: true,
        message: 'Goal deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete goal error:', error);
      if (error.message === 'Goal not found') {
        res.status(404).json({
          success: false,
          error: 'Goal not found'
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to delete goal'
        });
      }
    }
  },

  // Get goal analytics
  getAnalytics: async (req: Request, res: Response) => {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const analytics = await GoalService.getGoalAnalytics(user_id);

      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error: any) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch goal analytics'
      });
    }
  },

  // Get goal recommendations
  getRecommendations: async (req: Request, res: Response) => {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const recommendations = await GoalService.getGoalRecommendations(user_id);

      res.status(200).json({
        success: true,
        data: recommendations
      });
    } catch (error: any) {
      console.error('Get recommendations error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch goal recommendations'
      });
    }
  },

  // Auto-update progress from transactions
  syncProgressFromTransactions: async (req: Request, res: Response) => {
    try {
      const user_id = req.user?.id;
      const { goal_id } = req.query;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const updatedGoals = await GoalService.updateGoalProgressFromTransactions(
        user_id, 
        goal_id as string | undefined
      );

      res.status(200).json({
        success: true,
        message: 'Goal progress synced from transactions',
        data: updatedGoals.map(g => g.toJSON())
      });
    } catch (error: any) {
      console.error('Sync progress error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to sync goal progress'
      });
    }
  }
};

export default goalController;