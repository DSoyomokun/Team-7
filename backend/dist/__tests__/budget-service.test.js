"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const budget_service_1 = require("../services/budget_service");
const BudgetLimit_1 = require("../models/BudgetLimit");
// Mock supabase
jest.mock('../lib/supabase', () => ({
    default: {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn()
    }
}));
const supabase_1 = __importDefault(require("../lib/supabase"));
describe('BudgetService', () => {
    let budgetService;
    const mockUserId = 'test-user-123';
    beforeEach(() => {
        budgetService = new budget_service_1.BudgetService();
        jest.clearAllMocks();
    });
    describe('getBudgetAnalysis', () => {
        const mockTransactions = [
            {
                id: '1',
                user_id: mockUserId,
                amount: '100.00',
                is_expense: true,
                date: '2024-01-15',
                categories: { id: 'cat-1', name: 'Food', color: '#FF6B6B' }
            },
            {
                id: '2',
                user_id: mockUserId,
                amount: '2000.00',
                is_expense: false,
                date: '2024-01-01',
                categories: { id: 'cat-2', name: 'Salary', color: '#4ECDC4' }
            }
        ];
        const mockBudgetLimits = [
            {
                id: 'limit-1',
                user_id: mockUserId,
                category_id: 'cat-1',
                limit_amount: '200.00',
                period: 'monthly'
            }
        ];
        beforeEach(() => {
            supabase_1.default.from.mockImplementation((table) => {
                const mockChain = {
                    select: jest.fn().mockReturnThis(),
                    eq: jest.fn().mockReturnThis(),
                    gte: jest.fn().mockReturnThis(),
                    lte: jest.fn().mockReturnThis()
                };
                if (table === 'transactions') {
                    mockChain.lte = jest.fn().mockResolvedValue({
                        data: mockTransactions,
                        error: null
                    });
                }
                else if (table === 'budget_limits') {
                    mockChain.eq = jest.fn().mockResolvedValue({
                        data: mockBudgetLimits,
                        error: null
                    });
                }
                return mockChain;
            });
        });
        it('should return comprehensive budget analysis', async () => {
            const analysis = await budgetService.getBudgetAnalysis(mockUserId, 'month', 2024);
            expect(analysis).toHaveProperty('period');
            expect(analysis).toHaveProperty('totalIncome');
            expect(analysis).toHaveProperty('totalExpenses');
            expect(analysis).toHaveProperty('netAmount');
            expect(analysis).toHaveProperty('categoryBreakdown');
            expect(analysis).toHaveProperty('trends');
            expect(analysis).toHaveProperty('warnings');
            expect(analysis).toHaveProperty('recommendations');
            expect(analysis.totalIncome).toBe(2000);
            expect(analysis.totalExpenses).toBe(100);
            expect(analysis.netAmount).toBe(1900);
        });
        it('should handle database errors gracefully', async () => {
            supabase_1.default.from.mockImplementation(() => ({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                gte: jest.fn().mockReturnThis(),
                lte: jest.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Database error' }
                })
            }));
            await expect(budgetService.getBudgetAnalysis(mockUserId))
                .rejects.toThrow('Failed to fetch transactions: Database error');
        });
    });
    describe('createBudgetLimit', () => {
        const mockCategoryId = 'cat-123';
        const mockLimitAmount = 500.00;
        const mockPeriod = 'monthly';
        it('should create a new budget limit', async () => {
            const mockCreatedLimit = {
                id: 'limit-new',
                user_id: mockUserId,
                category_id: mockCategoryId,
                limit_amount: mockLimitAmount.toString(),
                period: mockPeriod,
                start_date: '2024-01-01',
                end_date: '2024-01-31'
            };
            supabase_1.default.from.mockImplementation(() => ({
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: mockCreatedLimit,
                    error: null
                })
            }));
            const result = await budgetService.createBudgetLimit(mockUserId, mockCategoryId, mockLimitAmount, mockPeriod);
            expect(result).toBeInstanceOf(BudgetLimit_1.BudgetLimit);
            expect(result.user_id).toBe(mockUserId);
            expect(result.category_id).toBe(mockCategoryId);
            expect(result.limit_amount).toBe(mockLimitAmount);
        });
        it('should handle creation errors', async () => {
            supabase_1.default.from.mockImplementation(() => ({
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Creation failed' }
                })
            }));
            await expect(budgetService.createBudgetLimit(mockUserId, mockCategoryId, mockLimitAmount, mockPeriod)).rejects.toThrow('Failed to create budget limit: Creation failed');
        });
    });
    describe('getBudgetLimits', () => {
        const mockLimits = [
            {
                id: 'limit-1',
                user_id: mockUserId,
                category_id: 'cat-1',
                limit_amount: '200.00',
                period: 'monthly',
                start_date: '2024-01-01',
                end_date: '2024-01-31'
            },
            {
                id: 'limit-2',
                user_id: mockUserId,
                category_id: 'cat-2',
                limit_amount: '1000.00',
                period: 'monthly',
                start_date: '2024-01-01',
                end_date: '2024-01-31'
            }
        ];
        it('should return all budget limits for user', async () => {
            supabase_1.default.from.mockImplementation(() => ({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: mockLimits,
                    error: null
                })
            }));
            const result = await budgetService.getBudgetLimits(mockUserId);
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(BudgetLimit_1.BudgetLimit);
            expect(result[1]).toBeInstanceOf(BudgetLimit_1.BudgetLimit);
        });
        it('should return empty array when no limits exist', async () => {
            supabase_1.default.from.mockImplementation(() => ({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: null,
                    error: null
                })
            }));
            const result = await budgetService.getBudgetLimits(mockUserId);
            expect(result).toEqual([]);
        });
        it('should handle database errors', async () => {
            supabase_1.default.from.mockImplementation(() => ({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Database error' }
                })
            }));
            await expect(budgetService.getBudgetLimits(mockUserId))
                .rejects.toThrow('Failed to fetch budget limits: Database error');
        });
    });
    describe('updateBudgetLimit', () => {
        const mockLimitId = 'limit-123';
        const mockNewAmount = 750.00;
        it('should update budget limit successfully', async () => {
            const mockUpdatedLimit = {
                id: mockLimitId,
                user_id: mockUserId,
                category_id: 'cat-1',
                limit_amount: mockNewAmount.toString(),
                period: 'monthly',
                start_date: '2024-01-01',
                end_date: '2024-01-31',
                updated_at: new Date().toISOString()
            };
            supabase_1.default.from.mockImplementation(() => ({
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: mockUpdatedLimit,
                    error: null
                })
            }));
            const result = await budgetService.updateBudgetLimit(mockLimitId, mockNewAmount);
            expect(result).toBeInstanceOf(BudgetLimit_1.BudgetLimit);
            expect(result.limit_amount).toBe(mockNewAmount);
        });
        it('should handle update errors', async () => {
            supabase_1.default.from.mockImplementation(() => ({
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Update failed' }
                })
            }));
            await expect(budgetService.updateBudgetLimit(mockLimitId, mockNewAmount))
                .rejects.toThrow('Failed to update budget limit: Update failed');
        });
    });
    describe('deleteBudgetLimit', () => {
        const mockLimitId = 'limit-123';
        it('should delete budget limit successfully', async () => {
            supabase_1.default.from.mockImplementation(() => ({
                delete: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({
                    error: null
                })
            }));
            await expect(budgetService.deleteBudgetLimit(mockLimitId)).resolves.not.toThrow();
        });
        it('should handle deletion errors', async () => {
            supabase_1.default.from.mockImplementation(() => ({
                delete: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({
                    error: { message: 'Deletion failed' }
                })
            }));
            await expect(budgetService.deleteBudgetLimit(mockLimitId))
                .rejects.toThrow('Failed to delete budget limit: Deletion failed');
        });
    });
    describe('getCategoryBreakdown', () => {
        const mockTransactions = [
            {
                id: '1',
                user_id: mockUserId,
                amount: '150.00',
                is_expense: true,
                categories: { id: 'cat-1', name: 'Food', color: '#FF6B6B' }
            },
            {
                id: '2',
                user_id: mockUserId,
                amount: '300.00',
                is_expense: true,
                categories: { id: 'cat-2', name: 'Transportation', color: '#4ECDC4' }
            }
        ];
        it('should return category breakdown with percentages', async () => {
            supabase_1.default.from.mockImplementation((table) => {
                const mockChain = {
                    select: jest.fn().mockReturnThis(),
                    eq: jest.fn().mockReturnThis(),
                    gte: jest.fn().mockReturnThis(),
                    lte: jest.fn().mockReturnThis()
                };
                if (table === 'transactions') {
                    mockChain.lte = jest.fn().mockResolvedValue({
                        data: mockTransactions,
                        error: null
                    });
                }
                else if (table === 'budget_limits') {
                    mockChain.eq = jest.fn().mockResolvedValue({
                        data: [],
                        error: null
                    });
                }
                return mockChain;
            });
            const result = await budgetService.getCategoryBreakdown(mockUserId, 'month');
            expect(result).toHaveLength(2);
            expect(result[0].spent_amount).toBe(300); // Transportation (higher amount first)
            expect(result[1].spent_amount).toBe(150); // Food
            expect(result[0].percentage_of_total).toBeCloseTo(66.67, 1);
            expect(result[1].percentage_of_total).toBeCloseTo(33.33, 1);
        });
    });
    describe('exportBudgetReport', () => {
        it('should export spending report in JSON format', async () => {
            // Mock the getBudgetAnalysis method
            const mockAnalysis = {
                period: 'month-2024',
                totalIncome: 2000,
                totalExpenses: 1000,
                netAmount: 1000,
                categoryBreakdown: [],
                trends: [],
                warnings: [],
                recommendations: []
            };
            jest.spyOn(budgetService, 'getBudgetAnalysis').mockResolvedValue(mockAnalysis);
            const result = await budgetService.exportBudgetReport(mockUserId, 'spending', 'month', 'json');
            expect(result.format).toBe('json');
            expect(result.filename).toMatch(/budget-spending-month-\d+\.json/);
            expect(result.data).toEqual(mockAnalysis);
        });
        it('should export spending report in CSV format', async () => {
            const mockAnalysis = {
                categoryBreakdown: [
                    {
                        category_name: 'Food',
                        spent_amount: 150,
                        percentage_of_total: 30,
                        status: 'under_limit'
                    }
                ]
            };
            jest.spyOn(budgetService, 'getBudgetAnalysis').mockResolvedValue(mockAnalysis);
            const result = await budgetService.exportBudgetReport(mockUserId, 'spending', 'month', 'csv');
            expect(result.format).toBe('csv');
            expect(result.filename).toMatch(/budget-spending-month-\d+\.csv/);
            expect(result.data).toContain('Category,Amount,Percentage,Status');
            expect(result.data).toContain('Food,150,30.00%,under_limit');
        });
        it('should throw error for invalid report type', async () => {
            await expect(budgetService.exportBudgetReport(mockUserId, 'invalid', 'month', 'json')).rejects.toThrow('Invalid report type');
        });
        it('should throw error for invalid format', async () => {
            await expect(budgetService.exportBudgetReport(mockUserId, 'spending', 'month', 'invalid')).rejects.toThrow('Invalid export format');
        });
    });
    describe('getBudgetWarnings', () => {
        it('should generate warnings for categories approaching limits', async () => {
            const mockCategoryBreakdown = [
                {
                    category_id: 'cat-1',
                    category_name: 'Food',
                    spent_amount: 180,
                    limit_amount: 200,
                    percentage_of_total: 60,
                    percentage_of_limit: 90,
                    status: 'approaching_limit',
                    color: '#FF6B6B'
                }
            ];
            jest.spyOn(budgetService, 'getCategoryBreakdown').mockResolvedValue(mockCategoryBreakdown);
            const warnings = await budgetService.getBudgetWarnings(mockUserId);
            expect(warnings).toHaveLength(1);
            expect(warnings[0].warning_level).toBe('high');
            expect(warnings[0].category_name).toBe('Food');
            expect(warnings[0].message).toContain('approaching your budget limit');
        });
        it('should not generate warnings for categories under limit', async () => {
            const mockCategoryBreakdown = [
                {
                    category_id: 'cat-1',
                    category_name: 'Food',
                    spent_amount: 100,
                    limit_amount: 200,
                    percentage_of_total: 40,
                    percentage_of_limit: 50,
                    status: 'under_limit',
                    color: '#FF6B6B'
                }
            ];
            jest.spyOn(budgetService, 'getCategoryBreakdown').mockResolvedValue(mockCategoryBreakdown);
            const warnings = await budgetService.getBudgetWarnings(mockUserId);
            expect(warnings).toHaveLength(0);
        });
    });
});
//# sourceMappingURL=budget-service.test.js.map