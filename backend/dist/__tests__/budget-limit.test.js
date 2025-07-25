"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BudgetLimit_1 = require("../models/BudgetLimit");
describe('BudgetLimit Model', () => {
    const validProps = {
        user_id: 'user-123',
        category_id: 'category-456',
        limit_amount: 500.00,
        period: 'monthly',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-01-31')
    };
    describe('Constructor', () => {
        it('should create a valid BudgetLimit instance', () => {
            const budgetLimit = new BudgetLimit_1.BudgetLimit(validProps);
            expect(budgetLimit.user_id).toBe(validProps.user_id);
            expect(budgetLimit.category_id).toBe(validProps.category_id);
            expect(budgetLimit.limit_amount).toBe(validProps.limit_amount);
            expect(budgetLimit.period).toBe(validProps.period);
            expect(budgetLimit.start_date).toEqual(validProps.start_date);
            expect(budgetLimit.end_date).toEqual(validProps.end_date);
        });
        it('should handle string dates in constructor', () => {
            const propsWithStringDates = {
                ...validProps,
                start_date: '2024-01-01',
                end_date: '2024-01-31'
            };
            const budgetLimit = new BudgetLimit_1.BudgetLimit(propsWithStringDates);
            expect(budgetLimit.start_date).toEqual(new Date('2024-01-01'));
            expect(budgetLimit.end_date).toEqual(new Date('2024-01-31'));
        });
        it('should throw error for missing user_id', () => {
            const invalidProps = { ...validProps, user_id: '' };
            expect(() => new BudgetLimit_1.BudgetLimit(invalidProps)).toThrow('user_id is required');
        });
        it('should throw error for missing category_id', () => {
            const invalidProps = { ...validProps, category_id: '' };
            expect(() => new BudgetLimit_1.BudgetLimit(invalidProps)).toThrow('category_id is required');
        });
        it('should throw error for negative limit_amount', () => {
            const invalidProps = { ...validProps, limit_amount: -100 };
            expect(() => new BudgetLimit_1.BudgetLimit(invalidProps)).toThrow('limit_amount must be a non-negative number');
        });
        it('should throw error for invalid period', () => {
            const invalidProps = { ...validProps, period: 'invalid' };
            expect(() => new BudgetLimit_1.BudgetLimit(invalidProps)).toThrow('period must be one of: weekly, monthly, yearly');
        });
        it('should throw error when end_date is before start_date', () => {
            const invalidProps = {
                ...validProps,
                start_date: new Date('2024-01-31'),
                end_date: new Date('2024-01-01')
            };
            expect(() => new BudgetLimit_1.BudgetLimit(invalidProps)).toThrow('end_date must be after start_date');
        });
        it('should throw error for invalid dates', () => {
            const invalidProps = {
                ...validProps,
                start_date: 'invalid-date'
            };
            expect(() => new BudgetLimit_1.BudgetLimit(invalidProps)).toThrow('start_date must be a valid date');
        });
    });
    describe('toJSON', () => {
        it('should return proper JSON representation', () => {
            const budgetLimit = new BudgetLimit_1.BudgetLimit(validProps);
            const json = budgetLimit.toJSON();
            expect(json).toEqual({
                id: undefined,
                user_id: validProps.user_id,
                category_id: validProps.category_id,
                limit_amount: validProps.limit_amount,
                period: validProps.period,
                start_date: '2024-01-01',
                end_date: '2024-01-31',
                created_at: undefined,
                updated_at: undefined
            });
        });
        it('should include id when provided', () => {
            const propsWithId = { ...validProps, id: 'budget-limit-789' };
            const budgetLimit = new BudgetLimit_1.BudgetLimit(propsWithId);
            const json = budgetLimit.toJSON();
            expect(json.id).toBe('budget-limit-789');
        });
    });
    describe('isActive', () => {
        it('should return true for active budget limit', () => {
            const budgetLimit = new BudgetLimit_1.BudgetLimit({
                ...validProps,
                start_date: new Date('2024-01-01'),
                end_date: new Date('2024-12-31')
            });
            const testDate = new Date('2024-06-15');
            expect(budgetLimit.isActive(testDate)).toBe(true);
        });
        it('should return false for inactive budget limit (before start)', () => {
            const budgetLimit = new BudgetLimit_1.BudgetLimit({
                ...validProps,
                start_date: new Date('2024-06-01'),
                end_date: new Date('2024-06-30')
            });
            const testDate = new Date('2024-05-15');
            expect(budgetLimit.isActive(testDate)).toBe(false);
        });
        it('should return false for inactive budget limit (after end)', () => {
            const budgetLimit = new BudgetLimit_1.BudgetLimit({
                ...validProps,
                start_date: new Date('2024-01-01'),
                end_date: new Date('2024-01-31')
            });
            const testDate = new Date('2024-02-15');
            expect(budgetLimit.isActive(testDate)).toBe(false);
        });
        it('should use current date when no date provided', () => {
            const now = new Date();
            const budgetLimit = new BudgetLimit_1.BudgetLimit({
                ...validProps,
                start_date: new Date(now.getFullYear(), now.getMonth(), 1),
                end_date: new Date(now.getFullYear(), now.getMonth() + 1, 0)
            });
            expect(budgetLimit.isActive()).toBe(true);
        });
    });
    describe('calculateSpendingPercentage', () => {
        it('should calculate correct percentage', () => {
            const budgetLimit = new BudgetLimit_1.BudgetLimit({ ...validProps, limit_amount: 1000 });
            expect(budgetLimit.calculateSpendingPercentage(250)).toBe(25);
            expect(budgetLimit.calculateSpendingPercentage(500)).toBe(50);
            expect(budgetLimit.calculateSpendingPercentage(1000)).toBe(100);
        });
        it('should handle spending over limit', () => {
            const budgetLimit = new BudgetLimit_1.BudgetLimit({ ...validProps, limit_amount: 1000 });
            expect(budgetLimit.calculateSpendingPercentage(1500)).toBe(100);
        });
        it('should handle zero limit', () => {
            const budgetLimit = new BudgetLimit_1.BudgetLimit({ ...validProps, limit_amount: 0 });
            expect(budgetLimit.calculateSpendingPercentage(0)).toBe(0);
            expect(budgetLimit.calculateSpendingPercentage(100)).toBe(100);
        });
    });
    describe('getWarningLevel', () => {
        const budgetLimit = new BudgetLimit_1.BudgetLimit({ ...validProps, limit_amount: 1000 });
        it('should return low for spending under 75%', () => {
            expect(budgetLimit.getWarningLevel(500)).toBe('low');
            expect(budgetLimit.getWarningLevel(740)).toBe('low');
        });
        it('should return medium for spending 75-89%', () => {
            expect(budgetLimit.getWarningLevel(750)).toBe('medium');
            expect(budgetLimit.getWarningLevel(890)).toBe('medium');
        });
        it('should return high for spending 90-99%', () => {
            expect(budgetLimit.getWarningLevel(900)).toBe('high');
            expect(budgetLimit.getWarningLevel(990)).toBe('high');
        });
        it('should return critical for spending 100% or more', () => {
            expect(budgetLimit.getWarningLevel(1000)).toBe('critical');
            expect(budgetLimit.getWarningLevel(1500)).toBe('critical');
        });
    });
    describe('generatePeriodDates', () => {
        const baseDate = new Date('2024-06-15T10:30:00Z');
        it('should generate weekly period dates', () => {
            const { start_date, end_date } = BudgetLimit_1.BudgetLimit.generatePeriodDates('weekly', baseDate);
            // Week should start on Sunday (June 9, 2024) and end on Saturday (June 15, 2024)
            expect(start_date.getDay()).toBe(0); // Sunday
            expect(end_date.getDay()).toBe(6); // Saturday
            expect(start_date.getHours()).toBe(0);
            expect(end_date.getHours()).toBe(23);
        });
        it('should generate monthly period dates', () => {
            const { start_date, end_date } = BudgetLimit_1.BudgetLimit.generatePeriodDates('monthly', baseDate);
            expect(start_date.getDate()).toBe(1);
            expect(start_date.getMonth()).toBe(5); // June (0-indexed)
            expect(end_date.getDate()).toBe(30); // Last day of June
            expect(end_date.getMonth()).toBe(5);
        });
        it('should generate yearly period dates', () => {
            const { start_date, end_date } = BudgetLimit_1.BudgetLimit.generatePeriodDates('yearly', baseDate);
            expect(start_date.getMonth()).toBe(0); // January
            expect(start_date.getDate()).toBe(1);
            expect(end_date.getMonth()).toBe(11); // December
            expect(end_date.getDate()).toBe(31);
            expect(start_date.getFullYear()).toBe(2024);
            expect(end_date.getFullYear()).toBe(2024);
        });
        it('should use current date when no base date provided', () => {
            const now = new Date();
            const { start_date, end_date } = BudgetLimit_1.BudgetLimit.generatePeriodDates('monthly');
            expect(start_date.getMonth()).toBe(now.getMonth());
            expect(start_date.getFullYear()).toBe(now.getFullYear());
        });
    });
    describe('validate static method', () => {
        it('should return valid for correct props', () => {
            const result = BudgetLimit_1.BudgetLimit.validate(validProps);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
        it('should return invalid for incorrect props', () => {
            const invalidProps = {
                ...validProps,
                user_id: '',
                limit_amount: -100,
                period: 'invalid'
            };
            const result = BudgetLimit_1.BudgetLimit.validate(invalidProps);
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=budget-limit.test.js.map