"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = require("../models/Account");
describe('Account Model', () => {
    const validAccountProps = {
        user_id: 'user123',
        name: 'Test Checking Account',
        type: 'checking',
        balance: 1000,
    };
    describe('Constructor', () => {
        it('should create account with valid props', () => {
            const account = new Account_1.Account(validAccountProps);
            expect(account.user_id).toBe('user123');
            expect(account.name).toBe('Test Checking Account');
            expect(account.type).toBe('checking');
            expect(account.balance).toBe(1000);
        });
        it('should set default balance to 0', () => {
            const props = { ...validAccountProps };
            delete props.balance;
            const account = new Account_1.Account(props);
            expect(account.balance).toBe(0);
        });
        it('should throw error for missing user_id', () => {
            const props = { ...validAccountProps, user_id: '' };
            expect(() => new Account_1.Account(props)).toThrow('user_id is required');
        });
        it('should throw error for empty name', () => {
            const props = { ...validAccountProps, name: '' };
            expect(() => new Account_1.Account(props)).toThrow('name is required and cannot be empty');
        });
        it('should throw error for empty type', () => {
            const props = { ...validAccountProps, type: '' };
            expect(() => new Account_1.Account(props)).toThrow('type is required and cannot be empty');
        });
        it('should throw error for invalid balance', () => {
            const props = { ...validAccountProps, balance: NaN };
            expect(() => new Account_1.Account(props)).toThrow('balance must be a valid number');
        });
        it('should trim name and lowercase type', () => {
            const props = { ...validAccountProps, name: '  Test Account  ', type: '  CHECKING  ' };
            const account = new Account_1.Account(props);
            expect(account.name).toBe('Test Account');
            expect(account.type).toBe('checking');
        });
    });
    describe('Balance Operations', () => {
        let account;
        beforeEach(() => {
            account = new Account_1.Account({ ...validAccountProps, balance: 1000 });
        });
        it('should update balance correctly for income', () => {
            const newBalance = account.updateBalance(500, false);
            expect(newBalance).toBe(1500);
            expect(account.balance).toBe(1500);
        });
        it('should update balance correctly for expense', () => {
            const newBalance = account.updateBalance(200, true);
            expect(newBalance).toBe(800);
            expect(account.balance).toBe(800);
        });
        it('should add transaction correctly', () => {
            const newBalance = account.addTransaction(300);
            expect(newBalance).toBe(1300);
            expect(account.balance).toBe(1300);
        });
        it('should subtract transaction correctly', () => {
            const newBalance = account.subtractTransaction(400);
            expect(newBalance).toBe(600);
            expect(account.balance).toBe(600);
        });
        it('should throw error for invalid amount', () => {
            expect(() => account.updateBalance(NaN, false)).toThrow('amount must be a valid number');
            expect(() => account.updateBalance(-100, false)).toThrow('amount must be positive');
        });
    });
    describe('Balance Utilities', () => {
        it('should format balance as currency', () => {
            const account = new Account_1.Account({ ...validAccountProps, balance: 1234.56 });
            expect(account.getFormattedBalance()).toBe('$1,234.56');
        });
        it('should handle invalid currency gracefully', () => {
            const account = new Account_1.Account({ ...validAccountProps, balance: 100 });
            expect(account.getFormattedBalance('INVALID')).toBe('$100.00');
        });
        it('should detect overdrawn account', () => {
            const account = new Account_1.Account({ ...validAccountProps, balance: -50 });
            expect(account.isOverdrawn()).toBe(true);
            account.balance = 100;
            expect(account.isOverdrawn()).toBe(false);
        });
        it('should check if account can afford amount', () => {
            const account = new Account_1.Account({ ...validAccountProps, balance: 500 });
            expect(account.canAfford(300)).toBe(true);
            expect(account.canAfford(600)).toBe(false);
            expect(() => account.canAfford(NaN)).toThrow('amount must be a valid number');
        });
    });
    describe('Validation', () => {
        it('should validate correct props', () => {
            const result = Account_1.Account.validate(validAccountProps);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should validate missing user_id', () => {
            const props = { ...validAccountProps, user_id: '' };
            const result = Account_1.Account.validate(props);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('user_id is required');
        });
        it('should validate empty name', () => {
            const props = { ...validAccountProps, name: '' };
            const result = Account_1.Account.validate(props);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('name is required and cannot be empty');
        });
        it('should validate invalid type', () => {
            const props = { ...validAccountProps, type: 'invalid' };
            const result = Account_1.Account.validate(props);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('type must be one of: checking, savings, credit, cash, investment');
        });
        it('should validate invalid balance', () => {
            const props = { ...validAccountProps, balance: NaN };
            const result = Account_1.Account.validate(props);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('balance must be a valid number');
        });
    });
    describe('JSON Serialization', () => {
        it('should serialize to JSON correctly', () => {
            const account = new Account_1.Account(validAccountProps);
            const json = account.toJSON();
            expect(json.user_id).toBe('user123');
            expect(json.name).toBe('Test Checking Account');
            expect(json.type).toBe('checking');
            expect(json.balance).toBe(1000);
        });
        it('should handle created_at serialization', () => {
            const date = new Date('2024-01-15T10:30:00Z');
            const props = { ...validAccountProps, created_at: date };
            const account = new Account_1.Account(props);
            const json = account.toJSON();
            expect(json.created_at).toBe(date.toISOString());
        });
    });
    describe('Static Methods', () => {
        it('should return valid account types', () => {
            const types = Account_1.Account.getValidTypes();
            expect(types).toEqual(['checking', 'savings', 'credit', 'cash', 'investment']);
        });
    });
});
//# sourceMappingURL=account.test.js.map