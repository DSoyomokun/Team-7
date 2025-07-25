"use strict";
// Test file for income transaction scenarios
// Scenario 2: User Adds Income Transaction
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const data_1 = require("../shared/data");
describe('Income Transaction Tests', () => {
    let authToken;
    let userId;
    const testUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
    };
    // Clear transactions before each test
    beforeEach(() => {
        data_1.users.length = 0;
        data_1.transactions.length = 0;
    });
    // Setup: Register and login before running income tests
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
    // Test 1: Add Income Transaction
    test('should add income transaction successfully', async () => {
        const incomeData = {
            amount: 2500.00,
            category: 'Salary',
            description: 'Monthly salary payment',
            date: new Date().toISOString()
        };
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/api/transactions/income')
            .set('Authorization', `Bearer ${authToken}`)
            .send(incomeData)
            .expect(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Income transaction added successfully');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('userId', userId);
        expect(response.body.data).toHaveProperty('type', 'income');
        expect(response.body.data).toHaveProperty('amount', 2500.00);
        expect(response.body.data).toHaveProperty('category', 'Salary');
        expect(response.body.data).toHaveProperty('description', 'Monthly salary payment');
    });
    // Test 2: Reject Invalid Amount
    test('should reject income transaction with invalid amount', async () => {
        const invalidIncomeData = {
            amount: -100.00,
            category: 'Freelance',
            description: 'Invalid negative amount'
        };
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/api/transactions/income')
            .set('Authorization', `Bearer ${authToken}`)
            .send(invalidIncomeData)
            .expect(400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error', 'Amount must be positive');
    });
    // Test 3: Require Authentication
    test('should reject income transaction without authentication', async () => {
        const incomeData = {
            amount: 500.00,
            category: 'Freelance',
            description: 'Web development work'
        };
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/api/transactions/income')
            .send(incomeData)
            .expect(401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error', 'Authentication required');
    });
    // Test 4: Get Income Summary
    test('should get user income summary after adding transaction', async () => {
        // First add a test income
        await (0, supertest_1.default)(index_1.default)
            .post('/api/transactions/income')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            amount: 1000.00,
            category: 'Freelance',
            description: 'Web development work'
        });
        const response = await (0, supertest_1.default)(index_1.default)
            .get('/api/transactions/income/summary')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('totalIncome', 1000.00);
        expect(response.body.data).toHaveProperty('incomeCount', 1);
        expect(response.body.data).toHaveProperty('transactions');
        expect(response.body.data.transactions).toHaveLength(1);
    });
});
//# sourceMappingURL=income.test.js.map