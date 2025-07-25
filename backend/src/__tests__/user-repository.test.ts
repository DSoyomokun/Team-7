import { UserRepository } from '../repositories/user.repository';
import { supabase } from '../config/database';

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
      })),
      delete: jest.fn(() => ({
        eq: jest.fn()
      }))
    }))
  }
}));

describe('UserRepository Tests', () => {
  const mockProfile = {
    user_id: 'test-user-id',
    full_name: 'John Doe',
    currency_preference: 'USD',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find user by ID successfully', async () => {
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockProfile,
            error: null
          })
        })
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect
      });

      const result = await UserRepository.findById('test-user-id');

      expect(supabase.from).toHaveBeenCalledWith('profile');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockProfile);
    });

    it('should throw error when user not found', async () => {
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'User not found' }
          })
        })
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect
      });

      await expect(UserRepository.findById('nonexistent-id'))
        .rejects.toThrow('User not found: User not found');
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const userData = {
        user_id: 'new-user-id',
        full_name: 'Jane Doe',
        currency_preference: 'EUR'
      };

      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { ...userData, created_at: '2024-01-01T00:00:00Z' },
            error: null
          })
        })
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert
      });

      const result = await UserRepository.create(userData);

      expect(supabase.from).toHaveBeenCalledWith('profile');
      expect(mockInsert).toHaveBeenCalledWith(userData);
      expect(result).toHaveProperty('user_id', 'new-user-id');
      expect(result).toHaveProperty('full_name', 'Jane Doe');
    });

    it('should throw error on creation failure', async () => {
      const userData = { user_id: 'new-user-id' };

      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Creation failed' }
          })
        })
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert
      });

      await expect(UserRepository.create(userData))
        .rejects.toThrow('Failed to create user: Creation failed');
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updates = { full_name: 'Updated Name' };
      const updatedProfile = { ...mockProfile, ...updates };

      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: updatedProfile,
              error: null
            })
          })
        })
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate
      });

      const result = await UserRepository.update('test-user-id', updates);

      expect(supabase.from).toHaveBeenCalledWith('profile');
      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(result).toEqual(updatedProfile);
    });

    it('should throw error on update failure', async () => {
      const updates = { full_name: 'Updated Name' };

      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Update failed' }
            })
          })
        })
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate
      });

      await expect(UserRepository.update('test-user-id', updates))
        .rejects.toThrow('Failed to update user: Update failed');
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          error: null
        })
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete
      });

      await UserRepository.delete('test-user-id');

      expect(supabase.from).toHaveBeenCalledWith('profile');
      expect(mockDelete).toHaveBeenCalled();
    });

    it('should throw error on deletion failure', async () => {
      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          error: { message: 'Deletion failed' }
        })
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete
      });

      await expect(UserRepository.delete('test-user-id'))
        .rejects.toThrow('Failed to delete user: Deletion failed');
    });
  });
});