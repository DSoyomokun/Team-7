"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const goal_service_1 = require("../services/goal_service");
const goal_repository_1 = require("../repositories/goal.repository");
const Goal_1 = require("../models/Goal");
// Mock the repository
jest.mock('../repositories/goal.repository');
jest.mock('../repositories/transaction.repository');
const mockGoalRepository = goal_repository_1.GoalRepository;
describe('GoalService Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createGoal', () => {
        test('should create a valid goal', async () => {
            const goalData = {
                name: 'Emergency Fund',
                type: 'savings',
                target_amount: 5000,
                target_date: '2024-12-31'
            };
            const mockGoal = new Goal_1.Goal({
                id: 'goal-123',
                user_id: 'user-123',
                ...goalData,
                current_amount: 0,
                completed: false
            });
            mockGoalRepository.create.mockResolvedValue(mockGoal);
            const result = await goal_service_1.GoalService.createGoal('user-123', goalData);
            expect(mockGoalRepository.create).toHaveBeenCalledWith({
                ...goalData,
                user_id: 'user-123',
                current_amount: 0,
                completed: false
            });
            expect(result).toEqual(mockGoal);
        });
        test('should throw error for invalid goal data', async () => {
            const invalidGoalData = {
                name: '',
                type: 'savings',
                target_amount: -100,
                target_date: '2024-12-31'
            };
            await expect(goal_service_1.GoalService.createGoal('user-123', invalidGoalData)).rejects.toThrow('Goal validation failed');
            expect(mockGoalRepository.create).not.toHaveBeenCalled();
        });
    });
    describe('getGoals', () => {
        test('should retrieve goals with filters', async () => {
            const mockGoals = [
                new Goal_1.Goal({
                    id: 'goal-1',
                    user_id: 'user-123',
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    current_amount: 1000,
                    target_date: '2024-12-31',
                    completed: false
                }),
                new Goal_1.Goal({
                    id: 'goal-2',
                    user_id: 'user-123',
                    name: 'Credit Card Debt',
                    type: 'debt',
                    target_amount: 3000,
                    current_amount: 500,
                    target_date: '2024-06-30',
                    completed: false
                })
            ];
            mockGoalRepository.findByUserId.mockResolvedValue(mockGoals);
            const filters = { type: 'savings' };
            const result = await goal_service_1.GoalService.getGoals('user-123', filters);
            expect(mockGoalRepository.findByUserId).toHaveBeenCalledWith('user-123', filters);
            expect(result).toEqual(mockGoals);
        });
    });
    describe('getGoalById', () => {
        test('should retrieve single goal by ID', async () => {
            const mockGoal = new Goal_1.Goal({
                id: 'goal-123',
                user_id: 'user-123',
                name: 'Emergency Fund',
                type: 'savings',
                target_amount: 5000,
                current_amount: 1000,
                target_date: '2024-12-31',
                completed: false
            });
            mockGoalRepository.findById.mockResolvedValue(mockGoal);
            const result = await goal_service_1.GoalService.getGoalById('goal-123', 'user-123');
            expect(mockGoalRepository.findById).toHaveBeenCalledWith('goal-123', 'user-123');
            expect(result).toEqual(mockGoal);
        });
        test('should throw error when goal not found', async () => {
            mockGoalRepository.findById.mockResolvedValue(null);
            await expect(goal_service_1.GoalService.getGoalById('nonexistent-goal', 'user-123')).rejects.toThrow('Goal not found');
        });
    });
    describe('updateGoal', () => {
        test('should update goal with valid data', async () => {
            const existingGoal = new Goal_1.Goal({
                id: 'goal-123',
                user_id: 'user-123',
                name: 'Emergency Fund',
                type: 'savings',
                target_amount: 5000,
                current_amount: 1000,
                target_date: '2024-12-31',
                completed: false
            });
            const updatedGoal = new Goal_1.Goal({
                ...existingGoal,
                target_amount: 6000
            });
            mockGoalRepository.findById.mockResolvedValue(existingGoal);
            mockGoalRepository.update.mockResolvedValue(updatedGoal);
            const updates = { target_amount: 6000 };
            const result = await goal_service_1.GoalService.updateGoal('goal-123', 'user-123', updates);
            expect(mockGoalRepository.update).toHaveBeenCalledWith('goal-123', 'user-123', updates);
            expect(result).toEqual(updatedGoal);
        });
        test('should throw error for invalid updates', async () => {
            const existingGoal = new Goal_1.Goal({
                id: 'goal-123',
                user_id: 'user-123',
                name: 'Emergency Fund',
                type: 'savings',
                target_amount: 5000,
                current_amount: 1000,
                target_date: '2024-12-31',
                completed: false
            });
            mockGoalRepository.findById.mockResolvedValue(existingGoal);
            const invalidUpdates = { target_amount: -100 };
            await expect(goal_service_1.GoalService.updateGoal('goal-123', 'user-123', invalidUpdates)).rejects.toThrow('Goal validation failed');
            expect(mockGoalRepository.update).not.toHaveBeenCalled();
        });
    });
    describe('updateGoalProgress', () => {
        test('should update goal progress correctly', async () => {
            const existingGoal = new Goal_1.Goal({
                id: 'goal-123',
                user_id: 'user-123',
                name: 'Emergency Fund',
                type: 'savings',
                target_amount: 5000,
                current_amount: 1000,
                target_date: '2024-12-31',
                completed: false
            });
            const updatedGoal = new Goal_1.Goal({
                ...existingGoal,
                current_amount: 2500
            });
            mockGoalRepository.findById.mockResolvedValue(existingGoal);
            mockGoalRepository.updateProgress.mockResolvedValue(updatedGoal);
            const result = await goal_service_1.GoalService.updateGoalProgress('goal-123', 'user-123', 2500);
            expect(mockGoalRepository.updateProgress).toHaveBeenCalledWith('goal-123', 'user-123', {
                current_amount: 2500,
                completed: false
            });
            expect(result).toEqual(updatedGoal);
        });
        test('should mark goal as completed when target is reached', async () => {
            const existingGoal = new Goal_1.Goal({
                id: 'goal-123',
                user_id: 'user-123',
                name: 'Emergency Fund',
                type: 'savings',
                target_amount: 5000,
                current_amount: 1000,
                target_date: '2024-12-31',
                completed: false
            });
            const completedGoal = new Goal_1.Goal({
                ...existingGoal,
                current_amount: 5000,
                completed: true
            });
            mockGoalRepository.findById.mockResolvedValue(existingGoal);
            mockGoalRepository.updateProgress.mockResolvedValue(completedGoal);
            const result = await goal_service_1.GoalService.updateGoalProgress('goal-123', 'user-123', 5000);
            expect(mockGoalRepository.updateProgress).toHaveBeenCalledWith('goal-123', 'user-123', {
                current_amount: 5000,
                completed: true
            });
            expect(result.completed).toBe(true);
        });
        test('should throw error for negative progress', async () => {
            const existingGoal = new Goal_1.Goal({
                id: 'goal-123',
                user_id: 'user-123',
                name: 'Emergency Fund',
                type: 'savings',
                target_amount: 5000,
                current_amount: 1000,
                target_date: '2024-12-31',
                completed: false
            });
            mockGoalRepository.findById.mockResolvedValue(existingGoal);
            await expect(goal_service_1.GoalService.updateGoalProgress('goal-123', 'user-123', -100)).rejects.toThrow('Progress amount cannot be negative');
            expect(mockGoalRepository.updateProgress).not.toHaveBeenCalled();
        });
    });
    describe('markGoalCompleted', () => {
        test('should mark goal as completed', async () => {
            const existingGoal = new Goal_1.Goal({
                id: 'goal-123',
                user_id: 'user-123',
                name: 'Emergency Fund',
                type: 'savings',
                target_amount: 5000,
                current_amount: 3000,
                target_date: '2024-12-31',
                completed: false
            });
            const completedGoal = new Goal_1.Goal({
                ...existingGoal,
                current_amount: 5000,
                completed: true
            });
            mockGoalRepository.findById.mockResolvedValue(existingGoal);
            mockGoalRepository.update.mockResolvedValue(completedGoal);
            const result = await goal_service_1.GoalService.markGoalCompleted('goal-123', 'user-123');
            expect(mockGoalRepository.update).toHaveBeenCalledWith('goal-123', 'user-123', {
                completed: true,
                current_amount: 5000
            });
            expect(result.completed).toBe(true);
        });
    });
    describe('deleteGoal', () => {
        test('should delete goal successfully', async () => {
            const existingGoal = new Goal_1.Goal({
                id: 'goal-123',
                user_id: 'user-123',
                name: 'Emergency Fund',
                type: 'savings',
                target_amount: 5000,
                current_amount: 1000,
                target_date: '2024-12-31',
                completed: false
            });
            mockGoalRepository.findById.mockResolvedValue(existingGoal);
            mockGoalRepository.delete.mockResolvedValue(true);
            const result = await goal_service_1.GoalService.deleteGoal('goal-123', 'user-123');
            expect(mockGoalRepository.delete).toHaveBeenCalledWith('goal-123', 'user-123');
            expect(result).toBe(true);
        });
    });
    describe('getGoalAnalytics', () => {
        test('should calculate goal analytics correctly', async () => {
            const mockGoals = [
                new Goal_1.Goal({
                    id: 'goal-1',
                    user_id: 'user-123',
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    current_amount: 2000,
                    target_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Future date
                    completed: false
                }),
                new Goal_1.Goal({
                    id: 'goal-2',
                    user_id: 'user-123',
                    name: 'Vacation Fund',
                    type: 'savings',
                    target_amount: 2000,
                    current_amount: 2000,
                    target_date: '2024-06-30',
                    completed: true
                }),
                new Goal_1.Goal({
                    id: 'goal-3',
                    user_id: 'user-123',
                    name: 'Credit Card Debt',
                    type: 'debt',
                    target_amount: 3000,
                    current_amount: 1000,
                    target_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday (overdue)
                    completed: false
                })
            ];
            const mockSummary = {
                savings: { total_target: 5000, total_current: 2000, active_count: 1 },
                debt: { total_target: 3000, total_current: 1000, active_count: 1 }
            };
            mockGoalRepository.findByUserId.mockResolvedValue(mockGoals);
            mockGoalRepository.getUserGoalSummary.mockResolvedValue(mockSummary);
            const result = await goal_service_1.GoalService.getGoalAnalytics('user-123');
            expect(result.total_goals).toBe(3);
            expect(result.active_goals).toBe(2);
            expect(result.completed_goals).toBe(1);
            expect(result.overdue_goals).toBe(1);
            expect(result.total_target_amount).toBe(10000);
            expect(result.total_current_amount).toBe(5000);
            expect(result.overall_progress_percentage).toBe(50);
            expect(result.savings_summary).toEqual(mockSummary.savings);
            expect(result.debt_summary).toEqual(mockSummary.debt);
        });
    });
    describe('calculateDailySavingsNeeded', () => {
        test('should calculate daily savings needed correctly', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 100);
            const goal = new Goal_1.Goal({
                id: 'goal-123',
                user_id: 'user-123',
                name: 'Emergency Fund',
                type: 'savings',
                target_amount: 5000,
                current_amount: 1000,
                target_date: futureDate.toISOString(),
                completed: false
            });
            const dailySavings = goal_service_1.GoalService.calculateDailySavingsNeeded(goal);
            expect(dailySavings).toBeCloseTo(40, 0); // (5000-1000)/100 = 40
        });
        test('should return 0 for completed goals', () => {
            const goal = new Goal_1.Goal({
                id: 'goal-123',
                user_id: 'user-123',
                name: 'Emergency Fund',
                type: 'savings',
                target_amount: 5000,
                current_amount: 5000,
                target_date: '2024-12-31',
                completed: true
            });
            const dailySavings = goal_service_1.GoalService.calculateDailySavingsNeeded(goal);
            expect(dailySavings).toBe(0);
        });
    });
    describe('type-specific goal retrieval', () => {
        test('should get savings goals', async () => {
            const mockSavingsGoals = [
                new Goal_1.Goal({
                    id: 'goal-1',
                    user_id: 'user-123',
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    current_amount: 1000,
                    target_date: '2024-12-31',
                    completed: false
                })
            ];
            mockGoalRepository.getGoalsByType.mockResolvedValue(mockSavingsGoals);
            const result = await goal_service_1.GoalService.getSavingsGoals('user-123');
            expect(mockGoalRepository.getGoalsByType).toHaveBeenCalledWith('user-123', 'savings');
            expect(result).toEqual(mockSavingsGoals);
        });
        test('should get debt goals', async () => {
            const mockDebtGoals = [
                new Goal_1.Goal({
                    id: 'goal-1',
                    user_id: 'user-123',
                    name: 'Credit Card Debt',
                    type: 'debt',
                    target_amount: 3000,
                    current_amount: 500,
                    target_date: '2024-06-30',
                    completed: false
                })
            ];
            mockGoalRepository.getGoalsByType.mockResolvedValue(mockDebtGoals);
            const result = await goal_service_1.GoalService.getDebtGoals('user-123');
            expect(mockGoalRepository.getGoalsByType).toHaveBeenCalledWith('user-123', 'debt');
            expect(result).toEqual(mockDebtGoals);
        });
        test('should get active goals', async () => {
            const mockActiveGoals = [
                new Goal_1.Goal({
                    id: 'goal-1',
                    user_id: 'user-123',
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    current_amount: 1000,
                    target_date: '2024-12-31',
                    completed: false
                })
            ];
            mockGoalRepository.getActiveGoals.mockResolvedValue(mockActiveGoals);
            const result = await goal_service_1.GoalService.getActiveGoals('user-123');
            expect(mockGoalRepository.getActiveGoals).toHaveBeenCalledWith('user-123');
            expect(result).toEqual(mockActiveGoals);
        });
    });
});
//# sourceMappingURL=goalService.test.js.map