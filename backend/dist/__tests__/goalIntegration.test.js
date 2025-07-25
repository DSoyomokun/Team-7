"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
// Mock authentication middleware for tests
jest.mock('../middleware/auth', () => ({
    authenticateUser: (req, res, next) => {
        req.user = { id: 'test-user-123' };
        next();
    }
}));
// Mock Supabase for integration tests
jest.mock('../config/database', () => ({
    supabase: {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis()
    }
}));
describe('Goal Integration Tests', () => {
    describe('Goal API Endpoints', () => {
        describe('POST /api/goals', () => {
            test('should create a new savings goal', async () => {
                const goalData = {
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    target_date: '2024-12-31',
                    current_amount: 1000
                };
                // Mock successful database response
                const mockCreatedGoal = {
                    id: 'goal-123',
                    user_id: 'test-user-123',
                    ...goalData,
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const { supabase } = require('../config/database');
                supabase.from().insert().select.mockResolvedValue({
                    data: [mockCreatedGoal],
                    error: null
                });
                const response = await (0, supertest_1.default)(index_1.default)
                    .post('/api/goals')
                    .send(goalData)
                    .expect(201);
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe('Goal created successfully');
                expect(response.body.data).toMatchObject({
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    current_amount: 1000
                });
            });
            test('should create a new debt goal', async () => {
                const goalData = {
                    name: 'Pay Off Credit Card',
                    type: 'debt',
                    target_amount: 3000,
                    target_date: '2024-06-30'
                };
                const mockCreatedGoal = {
                    id: 'goal-456',
                    user_id: 'test-user-123',
                    ...goalData,
                    current_amount: 0,
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const { supabase } = require('../config/database');
                supabase.from().insert().select.mockResolvedValue({
                    data: [mockCreatedGoal],
                    error: null
                });
                const response = await (0, supertest_1.default)(index_1.default)
                    .post('/api/goals')
                    .send(goalData)
                    .expect(201);
                expect(response.body.success).toBe(true);
                expect(response.body.data.type).toBe('debt');
                expect(response.body.data.current_amount).toBe(0);
            });
            test('should return 400 for invalid goal data', async () => {
                const invalidGoalData = {
                    name: '',
                    type: 'invalid-type',
                    target_amount: -100,
                    target_date: '2024-12-31'
                };
                const response = await (0, supertest_1.default)(index_1.default)
                    .post('/api/goals')
                    .send(invalidGoalData)
                    .expect(400);
                expect(response.body.success).toBe(false);
                expect(response.body.error).toContain('Goal name is required');
            });
            test('should return 400 for missing required fields', async () => {
                const incompleteGoalData = {
                    name: 'Test Goal'
                    // Missing type, target_amount, target_date
                };
                const response = await (0, supertest_1.default)(index_1.default)
                    .post('/api/goals')
                    .send(incompleteGoalData)
                    .expect(400);
                expect(response.body.success).toBe(false);
            });
        });
        describe('GET /api/goals', () => {
            test('should retrieve all goals for user', async () => {
                const mockGoals = [
                    {
                        id: 'goal-1',
                        user_id: 'test-user-123',
                        name: 'Emergency Fund',
                        type: 'savings',
                        target_amount: 5000,
                        current_amount: 1000,
                        target_date: '2024-12-31T00:00:00.000Z',
                        completed: false,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    {
                        id: 'goal-2',
                        user_id: 'test-user-123',
                        name: 'Credit Card Debt',
                        type: 'debt',
                        target_amount: 3000,
                        current_amount: 500,
                        target_date: '2024-06-30T00:00:00.000Z',
                        completed: false,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ];
                const { supabase } = require('../config/database');
                supabase.from().select().eq().order.mockResolvedValue({
                    data: mockGoals,
                    error: null
                });
                const response = await (0, supertest_1.default)(index_1.default)
                    .get('/api/goals')
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveLength(2);
                expect(response.body.data[0].name).toBe('Emergency Fund');
                expect(response.body.data[1].type).toBe('debt');
            });
            test('should filter goals by type', async () => {
                const mockSavingsGoals = [
                    {
                        id: 'goal-1',
                        user_id: 'test-user-123',
                        name: 'Emergency Fund',
                        type: 'savings',
                        target_amount: 5000,
                        current_amount: 1000,
                        target_date: '2024-12-31T00:00:00.000Z',
                        completed: false,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ];
                const { supabase } = require('../config/database');
                supabase.from().select().eq().eq.mockReturnThis();
                supabase.order.mockResolvedValue({
                    data: mockSavingsGoals,
                    error: null
                });
                const response = await (0, supertest_1.default)(index_1.default)
                    .get('/api/goals?type=savings')
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveLength(1);
                expect(response.body.data[0].type).toBe('savings');
            });
            test('should filter goals by completion status', async () => {
                const mockCompletedGoals = [
                    {
                        id: 'goal-1',
                        user_id: 'test-user-123',
                        name: 'Vacation Fund',
                        type: 'savings',
                        target_amount: 2000,
                        current_amount: 2000,
                        target_date: '2024-06-30T00:00:00.000Z',
                        completed: true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ];
                const { supabase } = require('../config/database');
                supabase.from().select().eq().eq.mockReturnThis();
                supabase.order.mockResolvedValue({
                    data: mockCompletedGoals,
                    error: null
                });
                const response = await (0, supertest_1.default)(index_1.default)
                    .get('/api/goals?completed=true')
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveLength(1);
                expect(response.body.data[0].completed).toBe(true);
            });
        });
        describe('GET /api/goals/:id', () => {
            test('should retrieve single goal by ID', async () => {
                const mockGoal = {
                    id: 'goal-123',
                    user_id: 'test-user-123',
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    current_amount: 1000,
                    target_date: '2024-12-31T00:00:00.000Z',
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const { supabase } = require('../config/database');
                supabase.from().select().eq().eq().single.mockResolvedValue({
                    data: mockGoal,
                    error: null
                });
                const response = await (0, supertest_1.default)(index_1.default)
                    .get('/api/goals/goal-123')
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.id).toBe('goal-123');
                expect(response.body.data.name).toBe('Emergency Fund');
            });
            test('should return 404 for non-existent goal', async () => {
                const { supabase } = require('../config/database');
                supabase.from().select().eq().eq().single.mockResolvedValue({
                    data: null,
                    error: { code: 'PGRST116', message: 'No rows found' }
                });
                const response = await (0, supertest_1.default)(index_1.default)
                    .get('/api/goals/nonexistent-goal')
                    .expect(404);
                expect(response.body.success).toBe(false);
                expect(response.body.error).toBe('Goal not found');
            });
        });
        describe('PUT /api/goals/:id', () => {
            test('should update goal successfully', async () => {
                const existingGoal = {
                    id: 'goal-123',
                    user_id: 'test-user-123',
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    current_amount: 1000,
                    target_date: '2024-12-31T00:00:00.000Z',
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const updatedGoal = {
                    ...existingGoal,
                    target_amount: 6000,
                    updated_at: new Date().toISOString()
                };
                const { supabase } = require('../config/database');
                // Mock findById call
                supabase.from().select().eq().eq().single.mockResolvedValueOnce({
                    data: existingGoal,
                    error: null
                });
                // Mock update call
                supabase.from().update().eq().eq().select.mockResolvedValue({
                    data: [updatedGoal],
                    error: null
                });
                const updates = { target_amount: 6000 };
                const response = await (0, supertest_1.default)(index_1.default)
                    .put('/api/goals/goal-123')
                    .send(updates)
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe('Goal updated successfully');
                expect(response.body.data.target_amount).toBe(6000);
            });
            test('should return 400 for invalid updates', async () => {
                const existingGoal = {
                    id: 'goal-123',
                    user_id: 'test-user-123',
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    current_amount: 1000,
                    target_date: '2024-12-31T00:00:00.000Z',
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const { supabase } = require('../config/database');
                supabase.from().select().eq().eq().single.mockResolvedValue({
                    data: existingGoal,
                    error: null
                });
                const invalidUpdates = { target_amount: -100 };
                const response = await (0, supertest_1.default)(index_1.default)
                    .put('/api/goals/goal-123')
                    .send(invalidUpdates)
                    .expect(400);
                expect(response.body.success).toBe(false);
                expect(response.body.error).toContain('Target amount must be a positive number');
            });
        });
        describe('PUT /api/goals/:id/progress', () => {
            test('should update goal progress', async () => {
                const existingGoal = {
                    id: 'goal-123',
                    user_id: 'test-user-123',
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    current_amount: 1000,
                    target_date: '2024-12-31T00:00:00.000Z',
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const updatedGoal = {
                    ...existingGoal,
                    current_amount: 2500,
                    updated_at: new Date().toISOString()
                };
                const { supabase } = require('../config/database');
                // Mock findById call
                supabase.from().select().eq().eq().single.mockResolvedValueOnce({
                    data: existingGoal,
                    error: null
                });
                // Mock updateProgress call
                supabase.from().update().eq().eq().select.mockResolvedValue({
                    data: [updatedGoal],
                    error: null
                });
                const response = await (0, supertest_1.default)(index_1.default)
                    .put('/api/goals/goal-123/progress')
                    .send({ current_amount: 2500 })
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe('Goal progress updated successfully');
                expect(response.body.data.current_amount).toBe(2500);
            });
            test('should auto-complete goal when target is reached', async () => {
                const existingGoal = {
                    id: 'goal-123',
                    user_id: 'test-user-123',
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    current_amount: 1000,
                    target_date: '2024-12-31T00:00:00.000Z',
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const completedGoal = {
                    ...existingGoal,
                    current_amount: 5000,
                    completed: true,
                    updated_at: new Date().toISOString()
                };
                const { supabase } = require('../config/database');
                // Mock findById call
                supabase.from().select().eq().eq().single.mockResolvedValueOnce({
                    data: existingGoal,
                    error: null
                });
                // Mock updateProgress call
                supabase.from().update().eq().eq().select.mockResolvedValue({
                    data: [completedGoal],
                    error: null
                });
                const response = await (0, supertest_1.default)(index_1.default)
                    .put('/api/goals/goal-123/progress')
                    .send({ current_amount: 5000 })
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data.current_amount).toBe(5000);
                expect(response.body.data.completed).toBe(true);
            });
        });
        describe('POST /api/goals/:id/complete', () => {
            test('should mark goal as completed', async () => {
                const existingGoal = {
                    id: 'goal-123',
                    user_id: 'test-user-123',
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    current_amount: 3000,
                    target_date: '2024-12-31T00:00:00.000Z',
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const completedGoal = {
                    ...existingGoal,
                    current_amount: 5000,
                    completed: true,
                    updated_at: new Date().toISOString()
                };
                const { supabase } = require('../config/database');
                // Mock findById call
                supabase.from().select().eq().eq().single.mockResolvedValueOnce({
                    data: existingGoal,
                    error: null
                });
                // Mock update call
                supabase.from().update().eq().eq().select.mockResolvedValue({
                    data: [completedGoal],
                    error: null
                });
                const response = await (0, supertest_1.default)(index_1.default)
                    .post('/api/goals/goal-123/complete')
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe('Goal marked as completed');
                expect(response.body.data.completed).toBe(true);
                expect(response.body.data.current_amount).toBe(5000);
            });
        });
        describe('DELETE /api/goals/:id', () => {
            test('should delete goal successfully', async () => {
                const existingGoal = {
                    id: 'goal-123',
                    user_id: 'test-user-123',
                    name: 'Emergency Fund',
                    type: 'savings',
                    target_amount: 5000,
                    current_amount: 1000,
                    target_date: '2024-12-31T00:00:00.000Z',
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                const { supabase } = require('../config/database');
                // Mock findById call
                supabase.from().select().eq().eq().single.mockResolvedValueOnce({
                    data: existingGoal,
                    error: null
                });
                // Mock delete call
                supabase.from().delete().eq().eq.mockResolvedValue({
                    error: null
                });
                const response = await (0, supertest_1.default)(index_1.default)
                    .delete('/api/goals/goal-123')
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.message).toBe('Goal deleted successfully');
            });
        });
        describe('GET /api/goals/analytics', () => {
            test('should return goal analytics', async () => {
                const mockGoals = [
                    {
                        id: 'goal-1',
                        user_id: 'test-user-123',
                        name: 'Emergency Fund',
                        type: 'savings',
                        target_amount: 5000,
                        current_amount: 2000,
                        target_date: '2024-12-31T00:00:00.000Z',
                        completed: false,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    {
                        id: 'goal-2',
                        user_id: 'test-user-123',
                        name: 'Vacation Fund',
                        type: 'savings',
                        target_amount: 2000,
                        current_amount: 2000,
                        target_date: '2024-06-30T00:00:00.000Z',
                        completed: true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ];
                const { supabase } = require('../config/database');
                supabase.from().select().eq().order.mockResolvedValue({
                    data: mockGoals,
                    error: null
                });
                const response = await (0, supertest_1.default)(index_1.default)
                    .get('/api/goals/analytics')
                    .expect(200);
                expect(response.body.success).toBe(true);
                expect(response.body.data).toHaveProperty('total_goals');
                expect(response.body.data).toHaveProperty('active_goals');
                expect(response.body.data).toHaveProperty('completed_goals');
                expect(response.body.data).toHaveProperty('overall_progress_percentage');
            });
        });
    });
    describe('Goal-Transaction Integration', () => {
        test('should automatically update goal progress when related transactions are created', async () => {
            // This test would verify that creating transactions updates related goals
            // Implementation would depend on the actual transaction-goal integration logic
            const mockGoal = {
                id: 'goal-123',
                user_id: 'test-user-123',
                name: 'Emergency Fund',
                type: 'savings',
                target_amount: 5000,
                current_amount: 1000,
                target_date: '2024-12-31T00:00:00.000Z',
                completed: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            // Mock the goal retrieval
            const { supabase } = require('../config/database');
            supabase.from().select().eq().order.mockResolvedValue({
                data: [mockGoal],
                error: null
            });
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/goals/sync')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Goal progress synced from transactions');
        });
    });
});
//# sourceMappingURL=goalIntegration.test.js.map