import request from 'supertest';
import app from '../index';
import { supabase } from '../config/database';
import { UserRepository } from '../repositories/user.repository';
import UserService from '../services/user_service';

// Mock the supabase client
jest.mock('../config/database', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      }))
    })),
    auth: {
      admin: {
        getUserById: jest.fn()
      }
    }
  }
}));

// Mock authentication middleware
jest.mock('../middleware/auth', () => ({
  authenticateUser: (req: any, res: any, next: any) => {
    req.user = { id: 'test-user-id' };
    next();
  }
}));

describe('User Profile API Tests', () => {
  const mockProfile = {
    user_id: 'test-user-id',
    full_name: 'John Doe',
    currency_preference: 'USD'
  };

  const mockAuthUser = {
    user: {
      id: 'test-user-id',
      email: 'john@example.com'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile successfully', async () => {
      // Mock UserRepository.findById
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(mockProfile);
      
      // Mock supabase auth call
      (supabase.auth.admin.getUserById as jest.Mock).mockResolvedValue({
        data: mockAuthUser,
        error: null
      });

      const response = await request(app)
        .get('/api/users/profile')
        .expect(200);

      expect(response.body).toHaveProperty('profile');
      expect(response.body.profile).toHaveProperty('user_id', 'test-user-id');
      expect(response.body.profile).toHaveProperty('full_name', 'John Doe');
      expect(response.body.profile).toHaveProperty('currency_preference', 'USD');
      expect(response.body.profile).toHaveProperty('email', 'john@example.com');
    });

    it('should handle profile not found', async () => {
      jest.spyOn(UserRepository, 'findById').mockRejectedValue(new Error('User not found'));

      const response = await request(app)
        .get('/api/users/profile')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        full_name: 'Jane Doe',
        currency_preference: 'EUR'
      };

      jest.spyOn(UserRepository, 'update').mockResolvedValue({
        ...mockProfile,
        ...updateData
      });
      
      jest.spyOn(UserRepository, 'findById').mockResolvedValue({
        ...mockProfile,
        ...updateData
      });

      (supabase.auth.admin.getUserById as jest.Mock).mockResolvedValue({
        data: mockAuthUser,
        error: null
      });

      const response = await request(app)
        .put('/api/users/profile')
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.profile).toHaveProperty('full_name', 'Jane Doe');
      expect(response.body.profile).toHaveProperty('currency_preference', 'EUR');
    });

    it('should validate currency preference', async () => {
      const invalidData = {
        currency_preference: 'INVALID'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Unsupported currency');
    });

    it('should validate full name length', async () => {
      const invalidData = {
        full_name: 'x'.repeat(101) // 101 characters
      };

      const response = await request(app)
        .put('/api/users/profile')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Full name cannot exceed 100 characters');
    });

    it('should reject empty full name', async () => {
      const invalidData = {
        full_name: '   ' // Empty after trim
      };

      const response = await request(app)
        .put('/api/users/profile')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Full name cannot be empty');
    });
  });

  describe('GET /api/users/preferences', () => {
    it('should get user preferences successfully', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(mockProfile);

      const response = await request(app)
        .get('/api/users/preferences')
        .expect(200);

      expect(response.body).toHaveProperty('preferences');
      expect(response.body.preferences).toHaveProperty('currency_preference', 'USD');
    });
  });

  describe('PUT /api/users/preferences', () => {
    it('should update user preferences successfully', async () => {
      const preferencesData = {
        currency_preference: 'GBP'
      };

      jest.spyOn(UserRepository, 'update').mockResolvedValue({
        ...mockProfile,
        currency_preference: 'GBP'
      });

      jest.spyOn(UserRepository, 'findById').mockResolvedValue({
        ...mockProfile,
        currency_preference: 'GBP'
      });

      const response = await request(app)
        .put('/api/users/preferences')
        .send(preferencesData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Preferences updated successfully');
      expect(response.body.preferences).toHaveProperty('currency_preference', 'GBP');
    });

    it('should validate currency preference in preferences', async () => {
      const invalidData = {
        currency_preference: 'FAKE'
      };

      const response = await request(app)
        .put('/api/users/preferences')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Unsupported currency');
    });
  });
});

describe('UserService Tests', () => {
  const mockProfile = {
    user_id: 'test-user-id',
    full_name: 'John Doe',
    currency_preference: 'USD'
  };

  const mockAuthUser = {
    user: {
      id: 'test-user-id',
      email: 'john@example.com'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should get user profile with auth data', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(mockProfile);
      (supabase.auth.admin.getUserById as jest.Mock).mockResolvedValue({
        data: mockAuthUser,
        error: null
      });

      const result = await UserService.getUserProfile('test-user-id');

      expect(result).toHaveProperty('user_id', 'test-user-id');
      expect(result).toHaveProperty('full_name', 'John Doe');
      expect(result).toHaveProperty('currency_preference', 'USD');
      expect(result).toHaveProperty('email', 'john@example.com');
    });
  });

  describe('updateUserProfile', () => {
    it('should update profile and return complete data', async () => {
      const updates = { full_name: 'Jane Doe' };
      
      jest.spyOn(UserRepository, 'update').mockResolvedValue({
        ...mockProfile,
        ...updates
      });
      
      jest.spyOn(UserRepository, 'findById').mockResolvedValue({
        ...mockProfile,
        ...updates
      });

      (supabase.auth.admin.getUserById as jest.Mock).mockResolvedValue({
        data: mockAuthUser,
        error: null
      });

      const result = await UserService.updateUserProfile('test-user-id', updates);

      expect(result).toHaveProperty('full_name', 'Jane Doe');
      expect(UserRepository.update).toHaveBeenCalledWith('test-user-id', updates);
    });

    it('should validate currency preference', async () => {
      const invalidUpdates = { currency_preference: 'INVALID' };

      await expect(
        UserService.updateUserProfile('test-user-id', invalidUpdates)
      ).rejects.toThrow('Unsupported currency: INVALID');
    });
  });

  describe('getUserPreferences', () => {
    it('should return user preferences', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(mockProfile);

      const result = await UserService.getUserPreferences('test-user-id');

      expect(result).toEqual({ currency_preference: 'USD' });
    });
  });

  describe('updateUserPreferences', () => {
    it('should update preferences', async () => {
      const preferences = { currency_preference: 'EUR' };
      
      jest.spyOn(UserRepository, 'update').mockResolvedValue({
        ...mockProfile,
        currency_preference: 'EUR'
      });
      
      jest.spyOn(UserRepository, 'findById').mockResolvedValue({
        ...mockProfile,
        currency_preference: 'EUR'
      });

      const result = await UserService.updateUserPreferences('test-user-id', preferences);

      expect(result).toEqual({ currency_preference: 'EUR' });
    });
  });

  describe('getUserStats', () => {
    it('should calculate user statistics', async () => {
      const mockTransactions = [
        { id: '1', amount: 100, is_expense: true },
        { id: '2', amount: 50, is_expense: false },
        { id: '3', amount: 75, is_expense: true }
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: mockTransactions,
            error: null
          })
        })
      });

      const result = await UserService.getUserStats('test-user-id');

      expect(result).toEqual({
        totalTransactions: 3,
        totalExpenses: 2,
        totalIncome: 1,
        totalExpenseAmount: 175,
        totalIncomeAmount: 50,
        netAmount: -125
      });
    });
  });
});