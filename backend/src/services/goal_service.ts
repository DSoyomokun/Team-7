import { GoalRepository, GoalFilters } from '../repositories/goal.repository';
import { TransactionRepository } from '../repositories/transaction.repository';
import { Goal, GoalProps } from '../models/Goal';

export class GoalService {
  static async createGoal(userId: string, goalData: Partial<GoalProps>): Promise<Goal> {
    // Validate the goal data
    const validation = Goal.validate({ ...goalData, user_id: userId } as GoalProps);
    if (!validation.isValid) {
      throw new Error(`Goal validation failed: ${validation.errors.join(', ')}`);
    }

    return await GoalRepository.create({
      ...goalData,
      user_id: userId,
      current_amount: goalData.current_amount || 0,
      completed: goalData.completed || false
    } as GoalProps);
  }

  static async getGoals(userId: string, filters: GoalFilters = {}): Promise<Goal[]> {
    return await GoalRepository.findByUserId(userId, filters);
  }

  static async getGoalById(goalId: string, userId: string): Promise<Goal> {
    const goal = await GoalRepository.findById(goalId, userId);
    if (!goal) {
      throw new Error('Goal not found');
    }
    return goal;
  }

  static async updateGoal(goalId: string, userId: string, updates: Partial<GoalProps>): Promise<Goal> {
    // Validate the updates
    const existingGoal = await this.getGoalById(goalId, userId);
    const updatedData = { ...existingGoal, ...updates };
    const validation = Goal.validate(updatedData as GoalProps);
    if (!validation.isValid) {
      throw new Error(`Goal validation failed: ${validation.errors.join(', ')}`);
    }

    return await GoalRepository.update(goalId, userId, updates);
  }

  static async deleteGoal(goalId: string, userId: string): Promise<boolean> {
    // Verify goal exists and belongs to user
    await this.getGoalById(goalId, userId);
    return await GoalRepository.delete(goalId, userId);
  }

  static async updateGoalProgress(goalId: string, userId: string, newAmount: number): Promise<Goal> {
    const goal = await this.getGoalById(goalId, userId);
    
    if (newAmount < 0) {
      throw new Error('Progress amount cannot be negative');
    }

    // Determine if goal should be marked as completed
    const completed = newAmount >= goal.target_amount;

    return await GoalRepository.updateProgress(goalId, userId, {
      current_amount: newAmount,
      completed
    });
  }

  static async markGoalCompleted(goalId: string, userId: string): Promise<Goal> {
    const goal = await this.getGoalById(goalId, userId);
    return await GoalRepository.update(goalId, userId, { 
      completed: true,
      current_amount: goal.target_amount // Set to target when manually completed
    });
  }

  static async markGoalIncomplete(goalId: string, userId: string): Promise<Goal> {
    return await GoalRepository.update(goalId, userId, { completed: false });
  }

  // Auto-update goal progress based on transaction data
  static async updateGoalProgressFromTransactions(userId: string, goalId?: string): Promise<Goal[]> {
    const goals = goalId 
      ? [await this.getGoalById(goalId, userId)]
      : await GoalRepository.getActiveGoals(userId);

    const updatedGoals: Goal[] = [];

    for (const goal of goals) {
      try {
        let newProgress = goal.current_amount;

        if (goal.type === 'savings') {
          // For savings goals, calculate progress from income transactions
          const incomeTransactions = await TransactionRepository.findByUserId(userId, {
            category: 'savings', // Assuming savings category exists
            startDate: goal.created_at?.toISOString().split('T')[0]
          });
          newProgress = incomeTransactions
            .filter(t => !t.is_expense)
            .reduce((sum, t) => sum + t.amount, 0);
        } else if (goal.type === 'debt') {
          // For debt goals, calculate progress from debt payment transactions
          const debtPayments = await TransactionRepository.findByUserId(userId, {
            category: 'debt-payment', // Assuming debt-payment category exists
            startDate: goal.created_at?.toISOString().split('T')[0]
          });
          newProgress = debtPayments
            .filter(t => t.is_expense) // Debt payments are expenses
            .reduce((sum, t) => sum + t.amount, 0);
        }

        // Update goal progress if it has changed
        if (newProgress !== goal.current_amount) {
          const updatedGoal = await this.updateGoalProgress(goal.id!, userId, newProgress);
          updatedGoals.push(updatedGoal);
        } else {
          updatedGoals.push(goal);
        }
      } catch (error) {
        console.error(`Failed to update progress for goal ${goal.id}:`, error);
        updatedGoals.push(goal); // Keep original goal if update fails
      }
    }

    return updatedGoals;
  }

  // Get goal analytics
  static async getGoalAnalytics(userId: string): Promise<{
    total_goals: number;
    active_goals: number;
    completed_goals: number;
    overdue_goals: number;
    total_target_amount: number;
    total_current_amount: number;
    overall_progress_percentage: number;
    savings_summary: any;
    debt_summary: any;
  }> {
    const allGoals = await this.getGoals(userId);
    const activeGoals = allGoals.filter(g => !g.completed);
    const completedGoals = allGoals.filter(g => g.completed);
    const overdueGoals = allGoals.filter(g => g.isOverdue());

    const totalTarget = allGoals.reduce((sum, g) => sum + g.target_amount, 0);
    const totalCurrent = allGoals.reduce((sum, g) => sum + g.current_amount, 0);
    const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

    const summary = await GoalRepository.getUserGoalSummary(userId);

    return {
      total_goals: allGoals.length,
      active_goals: activeGoals.length,
      completed_goals: completedGoals.length,
      overdue_goals: overdueGoals.length,
      total_target_amount: totalTarget,
      total_current_amount: totalCurrent,
      overall_progress_percentage: Math.min(overallProgress, 100),
      savings_summary: summary.savings,
      debt_summary: summary.debt
    };
  }

  // Get goals by type
  static async getSavingsGoals(userId: string): Promise<Goal[]> {
    return await GoalRepository.getGoalsByType(userId, 'savings');
  }

  static async getDebtGoals(userId: string): Promise<Goal[]> {
    return await GoalRepository.getGoalsByType(userId, 'debt');
  }

  static async getActiveGoals(userId: string): Promise<Goal[]> {
    return await GoalRepository.getActiveGoals(userId);
  }

  static async getCompletedGoals(userId: string): Promise<Goal[]> {
    return await GoalRepository.getCompletedGoals(userId);
  }

  static async getOverdueGoals(userId: string): Promise<Goal[]> {
    return await GoalRepository.getOverdueGoals(userId);
  }

  // Helper method to calculate daily savings needed for a goal
  static calculateDailySavingsNeeded(goal: Goal): number {
    if (goal.completed) return 0;
    
    const remainingAmount = goal.getRemainingAmount();
    const daysRemaining = goal.getDaysRemaining();
    
    if (!daysRemaining || daysRemaining <= 0) return remainingAmount;
    
    return remainingAmount / daysRemaining;
  }

  // Get goal recommendations based on user's transaction patterns
  static async getGoalRecommendations(userId: string): Promise<{
    recommended_emergency_fund: number;
    recommended_debt_payoff: Goal[];
    suggested_savings_goals: any[];
  }> {
    // Get user's recent transactions to analyze spending patterns
    const recentTransactions = await TransactionRepository.findByUserId(userId, {
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Last 90 days
    });

    const monthlyExpenses = recentTransactions
      .filter(t => t.is_expense)
      .reduce((sum, t) => sum + t.amount, 0) / 3; // Average over 3 months

    // Recommend 3-6 months of expenses for emergency fund
    const recommendedEmergencyFund = monthlyExpenses * 3;

    // Get existing debt goals to recommend payoff strategies
    const debtGoals = await this.getDebtGoals(userId);
    const recommendedDebtPayoff = debtGoals
      .filter(g => !g.completed)
      .sort((a, b) => b.target_amount - a.target_amount); // Highest debt first

    // Suggest common savings goals based on user profile
    const suggestedSavingsGoals = [
      { name: 'Emergency Fund', target_amount: recommendedEmergencyFund, priority: 'high' },
      { name: 'Vacation Fund', target_amount: 2000, priority: 'medium' },
      { name: 'Home Down Payment', target_amount: 20000, priority: 'low' }
    ];

    return {
      recommended_emergency_fund: recommendedEmergencyFund,
      recommended_debt_payoff: recommendedDebtPayoff,
      suggested_savings_goals: suggestedSavingsGoals
    };
  }
}