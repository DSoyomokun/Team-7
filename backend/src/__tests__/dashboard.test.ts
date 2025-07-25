import { DashboardService } from '../services/dashboard_service';
import { CategoryRepository } from '../repositories/category.repository';
import supabase from '../lib/supabase';

// Mock Supabase
jest.mock('../lib/supabase', () => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => ({
          data: [],
          error: null
        })),
        limit: jest.fn(() => ({
          data: [],
          error: null
        })),
        gte: jest.fn(() => ({
          lte: jest.fn(() => ({
            data: [],
            error: null
          }))
        })),
        single: jest.fn(() => ({
          data: null,
          error: null
        }))
      }))
    }))
  }))
}));

// Mock CategoryRepository
jest.mock('../repositories/category.repository');

const mockSupabase = supabase as jest.Mocked<typeof supabase>;
const MockedCategoryRepository = CategoryRepository as jest.Mocked<typeof CategoryRepository>;

describe('DashboardService', () => {
  const mockUserId = 'test-user-id';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccountSummaries', () => {
    it('should return account summaries successfully', async () => {
      const mockAccounts = [
        {
          id: 'account-1',
          name: 'Checking Account',
          type: 'checking',
          balance: 1500.50
        },
        {
          id: 'account-2',
          name: 'Savings Account',
          type: 'savings',
          balance: 5000.00
        }
      ];

      const mockSupabaseChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockAccounts, error: null })
      };

      mockSupabase.from.mockReturnValue(mockSupabaseChain as any);

      const result = await DashboardService.getAccountSummaries(mockUserId);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'account-1',
        name: 'Checking Account',
        type: 'checking',
        balance: 1500.50,
        currency: 'USD'
      });
      expect(mockSupabase.from).toHaveBeenCalledWith('accounts');
    });

    it('should handle database errors', async () => {
      const mockSupabaseChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } })
      };

      mockSupabase.from.mockReturnValue(mockSupabaseChain as any);

      await expect(DashboardService.getAccountSummaries(mockUserId))
        .rejects.toThrow('Failed to fetch account summaries: Database error');
    });
  });

  describe('getRecentTransactions', () => {
    it('should return recent transactions with details', async () => {
      const mockTransactions = [
        {
          id: 'trans-1',
          amount: 25.50,
          description: 'Coffee shop',
          date: '2024-01-15T10:30:00Z',
          is_expense: true,
          account_id: 'account-1',
          category_id: 'category-1',
          accounts: {
            id: 'account-1',
            name: 'Checking Account',
            type: 'checking'
          }
        }
      ];

      const mockCategory = {
        id: 'category-1',
        name: 'Food & Dining',
        color: '#FF6B6B',
        icon: 'restaurant'
      };

      const mockSupabaseChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockTransactions, error: null })
      };

      mockSupabase.from.mockReturnValue(mockSupabaseChain as any);
      MockedCategoryRepository.findByUserId.mockResolvedValue([mockCategory as any]);

      const result = await DashboardService.getRecentTransactions(mockUserId, 10);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'trans-1',
        amount: 25.50,
        type: 'expense',
        description: 'Coffee shop',
        category: {
          id: 'category-1',
          name: 'Food & Dining',
          color: '#FF6B6B',
          icon: 'restaurant'
        },
        account: {
          id: 'account-1',
          name: 'Checking Account',
          type: 'checking'
        }
      });
    });

    it('should handle uncategorized transactions', async () => {
      const mockTransactions = [
        {
          id: 'trans-1',
          amount: 25.50,
          description: 'Some transaction',
          date: '2024-01-15T10:30:00Z',
          is_expense: true,
          account_id: 'account-1',
          category_id: null,
          accounts: {
            id: 'account-1',
            name: 'Checking Account',
            type: 'checking'
          }
        }
      ];

      const mockSupabaseChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: mockTransactions, error: null })
      };

      mockSupabase.from.mockReturnValue(mockSupabaseChain as any);
      MockedCategoryRepository.findByUserId.mockResolvedValue([]);

      const result = await DashboardService.getRecentTransactions(mockUserId, 10);

      expect(result[0].category).toEqual({
        id: 'uncategorized',
        name: 'Uncategorized',
        color: '#747D8C'
      });
    });
  });

  describe('getGoalProgress', () => {
    it('should return goal progress with calculated percentages', async () => {
      const mockGoals = [
        {
          id: 'goal-1',
          name: 'Emergency Fund',
          type: 'savings',
          target_amount: 1000,
          current_amount: 750,
          target_date: '2024-12-31T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      const mockSupabaseChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockGoals, error: null })
      };

      mockSupabase.from.mockReturnValue(mockSupabaseChain as any);

      const result = await DashboardService.getGoalProgress(mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'goal-1',
        name: 'Emergency Fund',
        type: 'savings',
        target_amount: 1000,
        current_amount: 750,
        progress_percentage: 75
      });
      expect(result[0].days_remaining).toBeGreaterThanOrEqual(0);
    });

    it('should handle completed goals', async () => {
      const mockGoals = [
        {
          id: 'goal-1',
          name: 'Vacation Fund',
          type: 'savings',
          target_amount: 2000,
          current_amount: 2500, // Over target
          target_date: '2024-12-31T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      const mockSupabaseChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockGoals, error: null })
      };

      mockSupabase.from.mockReturnValue(mockSupabaseChain as any);

      const result = await DashboardService.getGoalProgress(mockUserId);

      expect(result[0].progress_percentage).toBe(100); // Capped at 100%
    });
  });

  describe('getSpendingAnalytics', () => {
    it('should return comprehensive analytics', async () => {
      // Mock category spending data
      MockedCategoryRepository.findCategoriesWithSpending.mockResolvedValue([
        {
          category_id: 'cat-1',
          category_name: 'Food & Dining',
          color: '#FF6B6B',
          total_spent: 300
        },
        {
          category_id: 'cat-2',
          category_name: 'Transportation',
          color: '#4ECDC4',
          total_spent: 200
        }
      ]);

      // Mock income vs expense data
      const mockTransactions = [
        { amount: 100, is_expense: true },
        { amount: 200, is_expense: true },
        { amount: 1000, is_expense: false }
      ];

      const mockSupabaseChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockResolvedValue({ data: mockTransactions, error: null })
      };

      mockSupabase.from.mockReturnValue(mockSupabaseChain as any);

      const result = await DashboardService.getSpendingAnalytics(mockUserId, 'month');

      expect(result).toHaveProperty('monthlyBreakdown');
      expect(result).toHaveProperty('incomeVsExpense');
      expect(result).toHaveProperty('trends');
      expect(result).toHaveProperty('budgetWarnings');

      expect(result.monthlyBreakdown).toHaveLength(2);
      expect(result.monthlyBreakdown[0]).toMatchObject({
        category_name: 'Food & Dining',
        amount: 300,
        percentage: 60 // 300 out of 500 total
      });

      expect(result.incomeVsExpense).toMatchObject({
        total_income: 1000,
        total_expenses: 300,
        net_amount: 700,
        ratio: expect.any(Number)
      });
    });
  });

  describe('exportData', () => {
    it('should export spending data as CSV', async () => {
      MockedCategoryRepository.findCategoriesWithSpending.mockResolvedValue([
        {
          category_id: 'cat-1',
          category_name: 'Food & Dining',
          color: '#FF6B6B',
          total_spent: 300
        }
      ]);

      const mockSupabaseChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockResolvedValue({ data: [], error: null })
      };

      mockSupabase.from.mockReturnValue(mockSupabaseChain as any);

      const result = await DashboardService.exportData(mockUserId, 'spending', 'month', 'csv');

      expect(result).toContain('category_id,category_name,amount,percentage,color');
      expect(result).toContain('cat-1,Food & Dining,300,100,#FF6B6B');
    });

    it('should export data as JSON', async () => {
      const mockAccounts = [
        {
          id: 'account-1',
          name: 'Checking',
          type: 'checking',
          balance: 1000
        }
      ];

      const mockSupabaseChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockAccounts, error: null })
      };

      mockSupabase.from.mockReturnValue(mockSupabaseChain as any);

      const result = await DashboardService.exportData(mockUserId, 'accounts', 'month', 'json');

      const parsed = JSON.parse(result);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toMatchObject({
        id: 'account-1',
        name: 'Checking',
        type: 'checking',
        balance: 1000,
        currency: 'USD'
      });
    });

    it('should handle invalid export type', async () => {
      await expect(DashboardService.exportData(mockUserId, 'invalid' as any, 'month', 'csv'))
        .rejects.toThrow('Invalid export type');
    });
  });

  describe('getDashboardSummary', () => {
    it('should return complete dashboard summary', async () => {
      // Mock all the service methods
      const mockAccounts = [{ id: 'acc-1', name: 'Test Account', type: 'checking', balance: 1000, currency: 'USD' }];
      const mockTransactions = [{ id: 'trans-1', amount: 25, type: 'expense' as const, description: 'Test', category: { id: 'cat-1', name: 'Food', color: '#FF0000' }, account: { id: 'acc-1', name: 'Test Account', type: 'checking' }, date: new Date() }];
      const mockGoals = [{ id: 'goal-1', name: 'Test Goal', type: 'savings' as const, target_amount: 1000, current_amount: 500, progress_percentage: 50, days_remaining: 30 }];
      const mockAnalytics = { monthlyBreakdown: [], incomeVsExpense: { total_income: 1000, total_expenses: 500, net_amount: 500, ratio: 2 }, trends: [], budgetWarnings: [] };

      jest.spyOn(DashboardService, 'getAccountSummaries').mockResolvedValue(mockAccounts);
      jest.spyOn(DashboardService, 'getRecentTransactions').mockResolvedValue(mockTransactions);
      jest.spyOn(DashboardService, 'getGoalProgress').mockResolvedValue(mockGoals);
      jest.spyOn(DashboardService, 'getSpendingAnalytics').mockResolvedValue(mockAnalytics);

      const result = await DashboardService.getDashboardSummary(mockUserId);

      expect(result).toEqual({
        accounts: mockAccounts,
        recentTransactions: mockTransactions,
        goals: mockGoals,
        analytics: mockAnalytics
      });
    });
  });
});

describe('CategoryRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findCategoriesWithSpending', () => {
    it('should return categories with spending data', async () => {
      const mockData = [
        {
          id: 'cat-1',
          name: 'Food & Dining',
          color: '#FF6B6B',
          transactions: [
            { amount: 25.50, is_expense: true, date: '2024-01-15' },
            { amount: 15.75, is_expense: true, date: '2024-01-16' }
          ]
        }
      ];

      const mockSupabaseChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockResolvedValue({ data: mockData, error: null })
      };

      mockSupabase.from.mockReturnValue(mockSupabaseChain as any);

      // Reset the mock to use the real implementation
      (CategoryRepository.findCategoriesWithSpending as jest.Mock).mockRestore();

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      
      const result = await CategoryRepository.findCategoriesWithSpending('user-id', startDate, endDate);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        category_id: 'cat-1',
        category_name: 'Food & Dining',
        color: '#FF6B6B',
        total_spent: 41.25
      });
    });
  });
});