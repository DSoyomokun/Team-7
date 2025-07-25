"use strict";
// Test file for expense transaction scenarios
// Scenario 3: User Adds Expense Transaction
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const data_1 = require("../shared/data");
describe('Expense Transaction Tests', () => {
    let authToken;
    let userId;
    const testUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
    };
    // Clear transactions before each test
    beforeEach(() => {
        data_1.transactions.length = 0;
    });
    // Setup: Register and login before running expense tests
    beforeAll(async () => {
        // First register the test user
        await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send(testUser);
        // Then login to get the auth token
        const loginResponse = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/login')
            .send({
            email: testUser.email,
            password: testUser.password
        });
        authToken = loginResponse.body.data.token;
        userId = loginResponse.body.data.user.id;
    });
    // Test 1: Add Expense Transaction
    test('should add expense transaction successfully', async () => {
        const expenseData = {
            amount: 150.00,
            category: 'Food',
            description: 'Grocery shopping',
            date: new Date().toISOString()
        };
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/api/transactions/expense')
            .set('Authorization', `Bearer ${authToken}`)
            .send(expenseData)
            .expect(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Expense transaction added successfully');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('userId', userId);
        expect(response.body.data).toHaveProperty('type', 'expense');
        expect(response.body.data).toHaveProperty('amount', 150.00);
        expect(response.body.data).toHaveProperty('category', 'Food');
        expect(response.body.data).toHaveProperty('description', 'Grocery shopping');
    });
    // Test 2: Reject Invalid Amount
    test('should reject expense transaction with invalid amount', async () => {
        const invalidExpenseData = {
            amount: -50.00,
            category: 'Food',
            description: 'Invalid amount test'
        };
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/api/transactions/expense')
            .set('Authorization', `Bearer ${authToken}`)
            .send(invalidExpenseData)
            .expect(400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error', 'Amount must be greater than 0');
    });
    // Test 3: Reject Missing Category
    test('should reject expense transaction without category', async () => {
        const invalidExpenseData = {
            amount: 100.00,
            description: 'Missing category test'
        };
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/api/transactions/expense')
            .set('Authorization', `Bearer ${authToken}`)
            .send(invalidExpenseData)
            .expect(400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error', 'Category is required');
    });
    // Test 4: Get Expense Summary
    test('should get user expense summary after adding transaction', async () => {
        // First add a test expense
        await (0, supertest_1.default)(index_1.default)
            .post('/api/transactions/expense')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            amount: 100.00,
            category: 'Utilities',
            description: 'Electric bill'
        });
        const response = await (0, supertest_1.default)(index_1.default)
            .get('/api/transactions/expense/summary')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('totalExpenses', 100.00);
        expect(response.body.data).toHaveProperty('expenseCount', 1);
        expect(response.body.data).toHaveProperty('transactions');
        expect(response.body.data.transactions).toHaveLength(1);
    });
    // Test 5: Filter Expenses by Category
    test('should get expenses filtered by category', async () => {
        // Add test expenses
        await (0, supertest_1.default)(index_1.default)
            .post('/api/transactions/expense')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            amount: 100.00,
            category: 'Utilities',
            description: 'Electric bill'
        });
        await (0, supertest_1.default)(index_1.default)
            .post('/api/transactions/expense')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            amount: 50.00,
            category: 'Entertainment',
            description: 'Movie tickets'
        });
        const response = await (0, supertest_1.default)(index_1.default)
            .get('/api/transactions/expense?category=Utilities')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('transactions');
        expect(response.body.data.transactions).toHaveLength(1);
        expect(response.body.data.transactions[0]).toHaveProperty('category', 'Utilities');
    });
});
//# sourceMappingURL=expense.test.js.map