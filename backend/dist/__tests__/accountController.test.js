"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const accounts_1 = __importDefault(require("../routes/accounts"));
// Mock the authentication middleware
jest.mock('../middleware/auth', () => ({
    authenticateUser: (req, res, next) => {
        req.user = { id: 'test-user-123' };
        next();
    }
}));
// Mock Supabase
const mockSupabaseSelect = jest.fn();
const mockSupabaseInsert = jest.fn();
const mockSupabaseUpdate = jest.fn();
const mockSupabaseDelete = jest.fn();
const mockSupabaseEq = jest.fn();
const mockSupabaseOrder = jest.fn();
const mockSupabaseLimit = jest.fn();
const mockSupabaseSingle = jest.fn();
jest.mock('../lib/supabase', () => ({
    __esModule: true,
    default: {
        from: jest.fn()
    }
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/accounts', accounts_1.default);
describe('Account Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const supabase = require('../lib/supabase').default;
        // Setup default mock chain
        supabase.from.mockReturnValue({
            select: mockSupabaseSelect,
            insert: mockSupabaseInsert,
            update: mockSupabaseUpdate,
            delete: mockSupabaseDelete
        });
        mockSupabaseSelect.mockReturnValue({
            eq: mockSupabaseEq,
            order: mockSupabaseOrder,
            limit: mockSupabaseLimit,
            single: mockSupabaseSingle
        });
        mockSupabaseInsert.mockReturnValue({
            select: mockSupabaseSelect
        });
        mockSupabaseUpdate.mockReturnValue({
            eq: mockSupabaseEq,
            select: mockSupabaseSelect
        });
        mockSupabaseDelete.mockReturnValue({
            eq: mockSupabaseEq
        });
        mockSupabaseEq.mockReturnValue({
            eq: mockSupabaseEq,
            order: mockSupabaseOrder,
            single: mockSupabaseSingle,
            select: mockSupabaseSelect
        });
        mockSupabaseOrder.mockReturnValue({
            eq: mockSupabaseEq,
            single: mockSupabaseSingle
        });
        mockSupabaseLimit.mockReturnValue({
            eq: mockSupabaseEq
        });
    });
    describe('POST /api/accounts', () => {
        it('should create account successfully', async () => {
            const mockAccount = {
                id: 'acc-123',
                user_id: 'test-user-123',
                name: 'Test Checking',
                type: 'checking',
                balance: 1000,
                created_at: '2024-01-15T10:30:00Z'
            };
            mockSupabaseSingle.mockResolvedValue({
                data: mockAccount,
                error: null
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/accounts')
                .send({
                name: 'Test Checking',
                type: 'checking',
                balance: 1000
            });
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockAccount);
            const supabase = require('../lib/supabase').default;
            expect(supabase.from).toHaveBeenCalledWith('accounts');
        });
        it('should return validation error for invalid data', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/accounts')
                .send({
                name: '', // Invalid: empty name
                type: 'checking'
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Validation failed');
            expect(response.body.details).toContain('name is required and cannot be empty');
        });
        it('should handle database error', async () => {
            mockSupabaseSingle.mockResolvedValue({
                data: null,
                error: { message: 'Database error' }
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/accounts')
                .send({
                name: 'Test Account',
                type: 'checking'
            });
            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Failed to create account');
        });
    });
    describe('GET /api/accounts', () => {
        it('should get all user accounts', async () => {
            const mockAccounts = [
                {
                    id: 'acc-1',
                    user_id: 'test-user-123',
                    name: 'Checking',
                    type: 'checking',
                    balance: 1000
                },
                {
                    id: 'acc-2',
                    user_id: 'test-user-123',
                    name: 'Savings',
                    type: 'savings',
                    balance: 5000
                }
            ];
            mockSupabaseOrder.mockResolvedValue({
                data: mockAccounts,
                error: null
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/accounts');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockAccounts);
            expect(mockSupabaseEq).toHaveBeenCalledWith('user_id', 'test-user-123');
            expect(mockSupabaseOrder).toHaveBeenCalledWith('created_at', { ascending: false });
        });
        it('should handle database error', async () => {
            mockSupabaseOrder.mockResolvedValue({
                data: null,
                error: { message: 'Database error' }
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/accounts');
            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Failed to fetch accounts');
        });
    });
    describe('GET /api/accounts/:id', () => {
        it('should get account by id', async () => {
            const mockAccount = {
                id: 'acc-123',
                user_id: 'test-user-123',
                name: 'Test Account',
                type: 'checking',
                balance: 1000
            };
            mockSupabaseSingle.mockResolvedValue({
                data: mockAccount,
                error: null
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/accounts/acc-123');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockAccount);
            expect(mockSupabaseEq).toHaveBeenCalledWith('id', 'acc-123');
            expect(mockSupabaseEq).toHaveBeenCalledWith('user_id', 'test-user-123');
        });
        it('should return 404 for non-existent account', async () => {
            mockSupabaseSingle.mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' }
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/accounts/non-existent');
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Account not found');
        });
    });
    describe('PUT /api/accounts/:id', () => {
        it('should update account successfully', async () => {
            const existingAccount = {
                id: 'acc-123',
                user_id: 'test-user-123',
                name: 'Old Name',
                type: 'checking',
                balance: 1000
            };
            const updatedAccount = {
                ...existingAccount,
                name: 'New Name',
                balance: 1500
            };
            // Mock the fetch existing account
            mockSupabaseSingle.mockResolvedValueOnce({
                data: existingAccount,
                error: null
            });
            // Mock the update
            mockSupabaseSingle.mockResolvedValueOnce({
                data: updatedAccount,
                error: null
            });
            const response = await (0, supertest_1.default)(app)
                .put('/api/accounts/acc-123')
                .send({
                name: 'New Name',
                balance: 1500
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(updatedAccount);
        });
        it('should return 404 for non-existent account', async () => {
            mockSupabaseSingle.mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' }
            });
            const response = await (0, supertest_1.default)(app)
                .put('/api/accounts/non-existent')
                .send({ name: 'New Name' });
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Account not found');
        });
    });
    describe('DELETE /api/accounts/:id', () => {
        it('should delete account successfully', async () => {
            const existingAccount = {
                id: 'acc-123',
                user_id: 'test-user-123',
                name: 'Test Account',
                type: 'checking',
                balance: 1000
            };
            // Mock fetch existing account
            mockSupabaseSingle.mockResolvedValueOnce({
                data: existingAccount,
                error: null
            });
            // Mock check for transactions (none found)
            mockSupabaseLimit.mockResolvedValueOnce({
                data: [],
                error: null
            });
            // Mock delete
            mockSupabaseEq.mockResolvedValueOnce({
                error: null
            });
            const response = await (0, supertest_1.default)(app)
                .delete('/api/accounts/acc-123');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Account deleted successfully');
        });
        it('should prevent deletion of account with transactions', async () => {
            const existingAccount = {
                id: 'acc-123',
                user_id: 'test-user-123',
                name: 'Test Account',
                type: 'checking',
                balance: 1000
            };
            // Mock fetch existing account
            mockSupabaseSingle.mockResolvedValueOnce({
                data: existingAccount,
                error: null
            });
            // Mock check for transactions (found)
            mockSupabaseLimit.mockResolvedValueOnce({
                data: [{ id: 'trans-123' }],
                error: null
            });
            const response = await (0, supertest_1.default)(app)
                .delete('/api/accounts/acc-123');
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('Cannot delete account with existing transactions');
        });
    });
    describe('GET /api/accounts/summary', () => {
        it('should get balance summary', async () => {
            const mockAccounts = [
                { id: 'acc-1', name: 'Checking', type: 'checking', balance: 1000 },
                { id: 'acc-2', name: 'Savings', type: 'savings', balance: 5000 }
            ];
            mockSupabaseEq.mockResolvedValue({
                data: mockAccounts,
                error: null
            });
            const response = await (0, supertest_1.default)(app)
                .get('/api/accounts/summary');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.accounts).toEqual(mockAccounts);
            expect(response.body.data.totalBalance).toBe(6000);
            expect(response.body.data.accountCount).toBe(2);
        });
    });
});
//# sourceMappingURL=accountController.test.js.map