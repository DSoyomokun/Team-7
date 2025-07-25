"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = require("../repositories/user.repository");
const database_1 = require("../config/database");
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
            database_1.supabase.from.mockReturnValue({
                select: mockSelect
            });
            const result = await user_repository_1.UserRepository.findById('test-user-id');
            expect(database_1.supabase.from).toHaveBeenCalledWith('profile');
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
            database_1.supabase.from.mockReturnValue({
                select: mockSelect
            });
            await expect(user_repository_1.UserRepository.findById('nonexistent-id'))
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
            database_1.supabase.from.mockReturnValue({
                insert: mockInsert
            });
            const result = await user_repository_1.UserRepository.create(userData);
            expect(database_1.supabase.from).toHaveBeenCalledWith('profile');
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
            database_1.supabase.from.mockReturnValue({
                insert: mockInsert
            });
            await expect(user_repository_1.UserRepository.create(userData))
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
            database_1.supabase.from.mockReturnValue({
                update: mockUpdate
            });
            const result = await user_repository_1.UserRepository.update('test-user-id', updates);
            expect(database_1.supabase.from).toHaveBeenCalledWith('profile');
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
            database_1.supabase.from.mockReturnValue({
                update: mockUpdate
            });
            await expect(user_repository_1.UserRepository.update('test-user-id', updates))
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
            database_1.supabase.from.mockReturnValue({
                delete: mockDelete
            });
            await user_repository_1.UserRepository.delete('test-user-id');
            expect(database_1.supabase.from).toHaveBeenCalledWith('profile');
            expect(mockDelete).toHaveBeenCalled();
        });
        it('should throw error on deletion failure', async () => {
            const mockDelete = jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                    error: { message: 'Deletion failed' }
                })
            });
            database_1.supabase.from.mockReturnValue({
                delete: mockDelete
            });
            await expect(user_repository_1.UserRepository.delete('test-user-id'))
                .rejects.toThrow('Failed to delete user: Deletion failed');
        });
    });
});
//# sourceMappingURL=user-repository.test.js.map