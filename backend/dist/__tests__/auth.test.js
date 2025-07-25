"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Scenario 1: User Registration and Login
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const data_1 = require("../shared/data");
describe('Authentication Tests', () => {
    // Clear users array before each test
    beforeEach(() => {
        data_1.users.length = 0;
    });
    // Test 1: User Registration
    test('should register a new user successfully', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User'
        };
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send(userData)
            .expect(201);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('email', userData.email);
        expect(response.body.data).toHaveProperty('name', userData.name);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).not.toHaveProperty('password');
    });
    // Test 2: User Login
    test('should login user with valid credentials', async () => {
        // First register a user
        const userData = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User'
        };
        await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send(userData);
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/login')
            .send(loginData)
            .expect(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.body.data).toHaveProperty('token');
        expect(response.body.data).toHaveProperty('user');
        expect(response.body.data.user).toHaveProperty('email', loginData.email);
        expect(response.body.data.user).toHaveProperty('name');
    });
    // Test 3: Invalid Login
    test('should reject login with invalid credentials', async () => {
        const loginData = {
            email: 'nonexistent@example.com',
            password: 'wrongpassword'
        };
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/login')
            .send(loginData)
            .expect(401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });
    // Test 4: Duplicate Registration
    test('should reject registration with existing email', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User'
        };
        // First registration should succeed
        await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send(userData)
            .expect(201);
        // Second registration with same email should fail
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/api/auth/register')
            .send(userData)
            .expect(400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('error', 'User already exists');
    });
});
//# sourceMappingURL=auth.test.js.map