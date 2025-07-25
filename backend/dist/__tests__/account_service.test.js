"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_service_1 = require("../services/account_service");
const Account_1 = require("../models/Account");
// Mock Supabase
const mockSupabaseSelect = jest.fn();
const mockSupabaseInsert = jest.fn();
const mockSupabaseUpdate = jest.fn();
const mockSupabaseEq = jest.fn();
const mockSupabaseLimit = jest.fn();
const mockSupabaseSingle = jest.fn();
const mockSupabaseOrder = jest.fn();
jest.mock('../lib/supabase', () => ({
    __esModule: true,
    default: {
        from: jest.fn().mockReturnValue({
            select: mockSupabaseSelect,
            insert: mockSupabaseInsert,
            update: mockSupabaseUpdate
        })
    }
}));
describe('AccountService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default mock chain
        mockSupabaseSelect.mockReturnValue({
            eq: mockSupabaseEq,
            limit: mockSupabaseLimit,
            single: mockSupabaseSingle,
            order: mockSupabaseOrder
        });
        mockSupabaseInsert.mockReturnValue({
            select: mockSupabaseSelect,
            single: mockSupabaseSingle
        });
        mockSupabaseUpdate.mockReturnValue({
            eq: mockSupabaseEq,
            select: mockSupabaseSelect,
            single: mockSupabaseSingle
        });
        mockSupabaseEq.mockReturnValue({
            eq: mockSupabaseEq,
            limit: mockSupabaseLimit,
            single: mockSupabaseSingle,
            select: mockSupabaseSelect,
            order: mockSupabaseOrder
        });
        mockSupabaseLimit.mockReturnValue({
            eq: mockSupabaseEq
        });
        mockSupabaseOrder.mockReturnValue({
            eq: mockSupabaseEq
        });
    });
    describe('ensureDefaultAccount', () => {
        it('should return existing account if user has accounts', async () => {
            const existingAccount = {
                id: 'acc-123',
                user_id: 'user-123',
                name: 'Existing Account',
                type: 'checking',
                balance: 1000
            };
            mockSupabaseLimit.mockResolvedValue({
                data: [existingAccount],
                error: null
            });
            const result = await account_service_1.AccountService.ensureDefaultAccount('user-123');
            expect(result).toBeInstanceOf(Account_1.Account);
            expect(result.id).toBe('acc-123');
            expect(result.name).toBe('Existing Account');
        });
        it('should create default account if user has no accounts', async () => {
            const newAccount = {
                id: 'acc-new',
                user_id: 'user-123',
                name: 'Default Account',
                type: 'checking',
                balance: 0
            };
            // No existing accounts
            mockSupabaseLimit.mockResolvedValueOnce({
                data: [],
                error: null
            });
            // Account creation
            mockSupabaseSingle.mockResolvedValueOnce({
                data: newAccount,
                error: null
            });
            const result = await account_service_1.AccountService.ensureDefaultAccount('user-123');
            expect(result).toBeInstanceOf(Account_1.Account);
            expect(result.name).toBe('Default Account');
            expect(result.type).toBe('checking');
            expect(result.balance).toBe(0);
        });
        it('should throw error if database query fails', async () => {
            mockSupabaseLimit.mockResolvedValue({
                data: null,
                error: { message: 'Database error' }
            });
            await expect(account_service_1.AccountService.ensureDefaultAccount('user-123'))
                .rejects.toThrow('Failed to check existing accounts');
        });
    });
    describe('updateBalanceForTransaction', () => {
        it('should update account balance for expense', async () => {
            const existingAccount = {
                id: 'acc-123',
                user_id: 'user-123',
                name: 'Test Account',
                type: 'checking',
                balance: 1000
            };
            mockSupabaseSingle.mockResolvedValueOnce({
                data: existingAccount,
                error: null
            });
            mockSupabaseEq.mockResolvedValueOnce({
                error: null
            });
            await account_service_1.AccountService.updateBalanceForTransaction('acc-123', 200, true);
            expect(mockSupabaseUpdate).toHaveBeenCalledWith({ balance: 800 });
        });
        it('should update account balance for income', async () => {
            const existingAccount = {
                id: 'acc-123',
                user_id: 'user-123',
                name: 'Test Account',
                type: 'checking',
                balance: 1000
            };
            mockSupabaseSingle.mockResolvedValueOnce({
                data: existingAccount,
                error: null
            });
            mockSupabaseEq.mockResolvedValueOnce({
                error: null
            });
            await account_service_1.AccountService.updateBalanceForTransaction('acc-123', 300, false);
            expect(mockSupabaseUpdate).toHaveBeenCalledWith({ balance: 1300 });
        });
        it('should throw error if account not found', async () => {
            mockSupabaseSingle.mockResolvedValue({
                data: null,
                error: { message: 'Account not found' }
            });
            await expect(account_service_1.AccountService.updateBalanceForTransaction('acc-123', 200, true))
                .rejects.toThrow('Failed to fetch account');
        });
    });
    describe('recalculateBalance', () => {
        it('should recalculate balance from all transactions', async () => {
            const transactions = [
                { amount: 1000, is_expense: false }, // +1000
                { amount: 200, is_expense: true }, // -200
                { amount: 500, is_expense: false }, // +500
                { amount: 100, is_expense: true } // -100
            ];
            mockSupabaseEq.mockResolvedValueOnce({
                data: transactions,
                error: null
            });
            mockSupabaseEq.mockResolvedValueOnce({
                error: null
            });
            const balance = await account_service_1.AccountService.recalculateBalance('acc-123');
            expect(balance).toBe(1200); // 1000 - 200 + 500 - 100
            expect(mockSupabaseUpdate).toHaveBeenCalledWith({ balance: 1200 });
        });
        it('should handle account with no transactions', async () => {
            mockSupabaseEq.mockResolvedValueOnce({
                data: [],
                error: null
            });
            mockSupabaseEq.mockResolvedValueOnce({
                error: null
            });
            const balance = await account_service_1.AccountService.recalculateBalance('acc-123');
            expect(balance).toBe(0);
            expect(mockSupabaseUpdate).toHaveBeenCalledWith({ balance: 0 });
        });
    });
    describe('getAccountById', () => {
        it('should return account if found and belongs to user', async () => {
            const account = {
                id: 'acc-123',
                user_id: 'user-123',
                name: 'Test Account',
                type: 'checking',
                balance: 1000
            };
            mockSupabaseSingle.mockResolvedValue({
                data: account,
                error: null
            });
            const result = await account_service_1.AccountService.getAccountById('acc-123', 'user-123');
            expect(result).toBeInstanceOf(Account_1.Account);
            expect(result.id).toBe('acc-123');
            expect(mockSupabaseEq).toHaveBeenCalledWith('id', 'acc-123');
            expect(mockSupabaseEq).toHaveBeenCalledWith('user_id', 'user-123');
        });
        it('should throw error if account not found', async () => {
            mockSupabaseSingle.mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' }
            });
            await expect(account_service_1.AccountService.getAccountById('acc-123', 'user-123'))
                .rejects.toThrow('Account not found');
        });
    });
    describe('createAccount', () => {
        it('should create new account with valid data', async () => {
            const accountData = {
                user_id: 'user-123',
                name: 'New Account',
                type: 'savings',
                balance: 500
            };
            const createdAccount = {
                id: 'acc-new',
                ...accountData,
                created_at: new Date()
            };
            mockSupabaseSingle.mockResolvedValue({
                data: createdAccount,
                error: null
            });
            const result = await account_service_1.AccountService.createAccount(accountData);
            expect(result).toBeInstanceOf(Account_1.Account);
            expect(result.name).toBe('New Account');
            expect(result.type).toBe('savings');
        });
        it('should throw error for invalid account data', async () => {
            const invalidData = {
                user_id: '',
                name: '',
                type: 'checking'
            };
            await expect(account_service_1.AccountService.createAccount(invalidData))
                .rejects.toThrow('Invalid account data');
        });
    });
});
//# sourceMappingURL=account_service.test.js.map