import request from 'supertest';
import express from 'express';
import budgetRoutes from '../routes/budget';
import { budgetService } from '../services/budget_service';

// Mock the budget service
jest.mock('../services/budget_service');

const app = express();
app.use(express.json());
app.use('/api/budget', budgetRoutes);

describe('Budget Controller Integration Tests', () => {
  const mockUserId = 'test-user-123';
  const mockAuthToken = `Bearer token_user_${mockUserId}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/budget/analysis', () => {
    const mockAnalysis = {
      period: 'month-2024',
      totalIncome: 3000,
      totalExpenses: 1500,
      netAmount: 1500,
      categoryBreakdown: [
        {
          category_id: 'cat-1',
          category_name: 'Food',
          spent_amount: 500,
          limit_amount: 600,
          percentage_of_total: 33.33,
          percentage_of_limit: 83.33,
          status: 'approaching_limit',
          color: '#FF6B6B'
        }
      ],
      trends: [],
      warnings: [],
      recommendations: []
    };

    it('should return budget analysis successfully', async () => {
      (budgetService.getBudgetAnalysis as jest.Mock).mockResolvedValue(mockAnalysis);

      const response = await request(app)
        .get('/api/budget/analysis')
        .set('Authorization', mockAuthToken)
        .query({ period: 'month', year: '2024' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockAnalysis);
      expect(budgetService.getBudgetAnalysis).toHaveBeenCalledWith(mockUserId, 'month', 2024);
    });

    it('should use default parameters when not provided', async () => {
      (budgetService.getBudgetAnalysis as jest.Mock).mockResolvedValue(mockAnalysis);

      const response = await request(app)
        .get('/api/budget/analysis')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(200);
      expect(budgetService.getBudgetAnalysis).toHaveBeenCalledWith(mockUserId, 'month', undefined);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/budget/analysis');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should handle service errors', async () => {
      (budgetService.getBudgetAnalysis as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app)
        .get('/api/budget/analysis')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Database connection failed');
    });
  });

  describe('GET /api/budget/trends', () => {
    const mockTrends = [
      {
        period: '2024-01',
        income: 3000,
        expenses: 1500,
        net_amount: 1500,
        change_percentage: 5.5,
        category_changes: []
      }
    ];

    it('should return budget trends successfully', async () => {
      (budgetService.getBudgetTrends as jest.Mock).mockResolvedValue(mockTrends);

      const response = await request(app)
        .get('/api/budget/trends')
        .set('Authorization', mockAuthToken)
        .query({ period: 'month', months: '12' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTrends);
      expect(budgetService.getBudgetTrends).toHaveBeenCalledWith(mockUserId, 'month', 12);
    });

    it('should use default parameters', async () => {
      (budgetService.getBudgetTrends as jest.Mock).mockResolvedValue(mockTrends);

      const response = await request(app)
        .get('/api/budget/trends')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(200);
      expect(budgetService.getBudgetTrends).toHaveBeenCalledWith(mockUserId, 'month', 6);
    });
  });

  describe('GET /api/budget/categories', () => {
    const mockCategories = [
      {
        category_id: 'cat-1',
        category_name: 'Food',
        spent_amount: 500,
        limit_amount: 600,
        percentage_of_total: 50,
        percentage_of_limit: 83.33,
        status: 'approaching_limit',
        color: '#FF6B6B'
      }
    ];

    it('should return category breakdown successfully', async () => {
      (budgetService.getCategoryBreakdown as jest.Mock).mockResolvedValue(mockCategories);

      const response = await request(app)
        .get('/api/budget/categories')
        .set('Authorization', mockAuthToken)
        .query({ period: 'week' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockCategories);
      expect(budgetService.getCategoryBreakdown).toHaveBeenCalledWith(mockUserId, 'week');
    });
  });

  describe('POST /api/budget/limits', () => {
    const mockBudgetLimit = {
      id: 'limit-123',
      user_id: mockUserId,
      category_id: 'cat-1',
      limit_amount: 500,
      period: 'monthly',
      start_date: '2024-01-01',
      end_date: '2024-01-31'
    };

    it('should create budget limit successfully', async () => {
      const mockLimit = { toJSON: () => mockBudgetLimit };
      (budgetService.createBudgetLimit as jest.Mock).mockResolvedValue(mockLimit);

      const requestBody = {
        category_id: 'cat-1',
        limit_amount: 500,
        period: 'monthly'
      };

      const response = await request(app)
        .post('/api/budget/limits')
        .set('Authorization', mockAuthToken)
        .send(requestBody);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockBudgetLimit);
      expect(budgetService.createBudgetLimit).toHaveBeenCalledWith(
        mockUserId,
        'cat-1',
        500,
        'monthly'
      );
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/budget/limits')
        .set('Authorization', mockAuthToken)
        .send({ category_id: 'cat-1' }); // Missing limit_amount and period

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('category_id, limit_amount, and period are required');
    });

    it('should validate period values', async () => {
      const response = await request(app)
        .post('/api/budget/limits')
        .set('Authorization', mockAuthToken)
        .send({
          category_id: 'cat-1',
          limit_amount: 500,
          period: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('period must be one of: weekly, monthly, yearly');
    });
  });

  describe('GET /api/budget/limits', () => {
    const mockLimits = [
      {
        toJSON: () => ({
          id: 'limit-1',
          user_id: mockUserId,
          category_id: 'cat-1',
          limit_amount: 500,
          period: 'monthly'
        })
      },
      {
        toJSON: () => ({
          id: 'limit-2',
          user_id: mockUserId,
          category_id: 'cat-2',
          limit_amount: 1000,
          period: 'monthly'
        })
      }
    ];

    it('should return all budget limits for user', async () => {
      (budgetService.getBudgetLimits as jest.Mock).mockResolvedValue(mockLimits);

      const response = await request(app)
        .get('/api/budget/limits')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(budgetService.getBudgetLimits).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('PUT /api/budget/limits/:id', () => {
    const limitId = 'limit-123';
    const mockUpdatedLimit = {
      toJSON: () => ({
        id: limitId,
        user_id: mockUserId,
        category_id: 'cat-1',
        limit_amount: 750,
        period: 'monthly'
      })
    };

    it('should update budget limit successfully', async () => {
      (budgetService.updateBudgetLimit as jest.Mock).mockResolvedValue(mockUpdatedLimit);

      const response = await request(app)
        .put(`/api/budget/limits/${limitId}`)
        .set('Authorization', mockAuthToken)
        .send({ limit_amount: 750 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.limit_amount).toBe(750);
      expect(budgetService.updateBudgetLimit).toHaveBeenCalledWith(limitId, 750, undefined);
    });

    it('should validate required limit_amount', async () => {
      const response = await request(app)
        .put(`/api/budget/limits/${limitId}`)
        .set('Authorization', mockAuthToken)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('limit_amount is required');
    });

    it('should validate period if provided', async () => {
      const response = await request(app)
        .put(`/api/budget/limits/${limitId}`)
        .set('Authorization', mockAuthToken)
        .send({ limit_amount: 750, period: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('period must be one of: weekly, monthly, yearly');
    });
  });

  describe('DELETE /api/budget/limits/:id', () => {
    const limitId = 'limit-123';

    it('should delete budget limit successfully', async () => {
      (budgetService.deleteBudgetLimit as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .delete(`/api/budget/limits/${limitId}`)
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Budget limit deleted successfully');
      expect(budgetService.deleteBudgetLimit).toHaveBeenCalledWith(limitId);
    });

    it('should validate limit ID is provided', async () => {
      const response = await request(app)
        .delete('/api/budget/limits/')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(404); // Express returns 404 for missing route parameters
    });
  });

  describe('GET /api/budget/warnings', () => {
    const mockWarnings = [
      {
        category_id: 'cat-1',
        category_name: 'Food',
        spent_amount: 450,
        limit_amount: 500,
        warning_level: 'high',
        message: 'You are approaching your budget limit for Food (90% used)'
      }
    ];

    it('should return budget warnings successfully', async () => {
      (budgetService.getBudgetWarnings as jest.Mock).mockResolvedValue(mockWarnings);

      const response = await request(app)
        .get('/api/budget/warnings')
        .set('Authorization', mockAuthToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockWarnings);
      expect(budgetService.getBudgetWarnings).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('GET /api/budget/export', () => {
    const mockExportData = {
      format: 'json',
      filename: 'budget-spending-month-123456789.json',
      data: { totalIncome: 3000, totalExpenses: 1500 }
    };

    it('should export budget report in JSON format', async () => {
      (budgetService.exportBudgetReport as jest.Mock).mockResolvedValue(mockExportData);

      const response = await request(app)
        .get('/api/budget/export')
        .set('Authorization', mockAuthToken)
        .query({ type: 'spending', period: 'month', format: 'json' });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.headers['content-disposition']).toContain('attachment');
      expect(budgetService.exportBudgetReport).toHaveBeenCalledWith(
        mockUserId,
        'spending',
        'month',
        'json'
      );
    });

    it('should export budget report in CSV format', async () => {
      const csvExportData = {
        ...mockExportData,
        format: 'csv',
        filename: 'budget-spending-month-123456789.csv',
        data: 'Category,Amount\nFood,500\nTransport,300'
      };

      (budgetService.exportBudgetReport as jest.Mock).mockResolvedValue(csvExportData);

      const response = await request(app)
        .get('/api/budget/export')
        .set('Authorization', mockAuthToken)
        .query({ type: 'spending', period: 'month', format: 'csv' });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toBe(csvExportData.data);
    });

    it('should validate required type parameter', async () => {
      const response = await request(app)
        .get('/api/budget/export')
        .set('Authorization', mockAuthToken)
        .query({ period: 'month', format: 'json' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Export type is required (spending, limits, trends)');
    });

    it('should validate export type values', async () => {
      const response = await request(app)
        .get('/api/budget/export')
        .set('Authorization', mockAuthToken)
        .query({ type: 'invalid', period: 'month', format: 'json' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid export type. Must be one of: spending, limits, trends');
    });

    it('should validate format values', async () => {
      const response = await request(app)
        .get('/api/budget/export')
        .set('Authorization', mockAuthToken)
        .query({ type: 'spending', period: 'month', format: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid format. Must be one of: csv, json, pdf');
    });

    it('should use default parameters', async () => {
      (budgetService.exportBudgetReport as jest.Mock).mockResolvedValue(mockExportData);

      const response = await request(app)
        .get('/api/budget/export')
        .set('Authorization', mockAuthToken)
        .query({ type: 'spending' });

      expect(response.status).toBe(200);
      expect(budgetService.exportBudgetReport).toHaveBeenCalledWith(
        mockUserId,
        'spending',
        'month',
        'json'
      );
    });
  });

  describe('Authentication', () => {
    it('should handle missing authorization header', async () => {
      const response = await request(app)
        .get('/api/budget/analysis');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should handle malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/budget/analysis')
        .set('Authorization', 'InvalidToken');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authentication required');
    });
  });
});