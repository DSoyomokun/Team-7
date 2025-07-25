"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../middleware/validation");
describe('Validation Middleware Tests', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        nextFunction = jest.fn();
        jest.clearAllMocks();
    });
    describe('validateProfileUpdate', () => {
        it('should pass validation with valid profile data', () => {
            mockRequest.body = {
                full_name: 'John Doe',
                currency_preference: 'USD'
            };
            (0, validation_1.validateProfileUpdate)(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
        it('should pass validation with null full_name', () => {
            mockRequest.body = {
                full_name: null,
                currency_preference: 'EUR'
            };
            (0, validation_1.validateProfileUpdate)(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
        it('should reject non-string full_name', () => {
            mockRequest.body = {
                full_name: 123
            };
            (0, validation_1.validateProfileUpdate)(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Full name must be a string or null'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
        it('should reject empty full_name after trim', () => {
            mockRequest.body = {
                full_name: '   '
            };
            (0, validation_1.validateProfileUpdate)(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Full name cannot be empty'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
        it('should reject full_name exceeding 100 characters', () => {
            mockRequest.body = {
                full_name: 'x'.repeat(101)
            };
            (0, validation_1.validateProfileUpdate)(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Full name cannot exceed 100 characters'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
        it('should reject non-string currency_preference', () => {
            mockRequest.body = {
                currency_preference: 123
            };
            (0, validation_1.validateProfileUpdate)(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Currency preference must be a string'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
        it('should reject unsupported currency_preference', () => {
            mockRequest.body = {
                currency_preference: 'INVALID'
            };
            (0, validation_1.validateProfileUpdate)(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Unsupported currency: INVALID. Supported currencies: USD, EUR, GBP, CAD, AUD, JPY, CHF'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
        it('should pass with valid supported currencies', () => {
            const supportedCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF'];
            supportedCurrencies.forEach(currency => {
                jest.clearAllMocks();
                mockRequest.body = { currency_preference: currency };
                (0, validation_1.validateProfileUpdate)(mockRequest, mockResponse, nextFunction);
                expect(nextFunction).toHaveBeenCalled();
                expect(mockResponse.status).not.toHaveBeenCalled();
            });
        });
        it('should pass validation with empty body', () => {
            mockRequest.body = {};
            (0, validation_1.validateProfileUpdate)(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
    });
    describe('validatePreferencesUpdate', () => {
        it('should pass validation with valid currency_preference', () => {
            mockRequest.body = {
                currency_preference: 'USD'
            };
            (0, validation_1.validatePreferencesUpdate)(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
        it('should reject non-string currency_preference', () => {
            mockRequest.body = {
                currency_preference: 123
            };
            (0, validation_1.validatePreferencesUpdate)(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Currency preference must be a string'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
        it('should reject unsupported currency_preference', () => {
            mockRequest.body = {
                currency_preference: 'FAKE'
            };
            (0, validation_1.validatePreferencesUpdate)(mockRequest, mockResponse, nextFunction);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Unsupported currency: FAKE. Supported currencies: USD, EUR, GBP, CAD, AUD, JPY, CHF'
            });
            expect(nextFunction).not.toHaveBeenCalled();
        });
        it('should pass validation with empty body', () => {
            mockRequest.body = {};
            (0, validation_1.validatePreferencesUpdate)(mockRequest, mockResponse, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });
        it('should pass with all supported currencies', () => {
            const supportedCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF'];
            supportedCurrencies.forEach(currency => {
                jest.clearAllMocks();
                mockRequest.body = { currency_preference: currency };
                (0, validation_1.validatePreferencesUpdate)(mockRequest, mockResponse, nextFunction);
                expect(nextFunction).toHaveBeenCalled();
                expect(mockResponse.status).not.toHaveBeenCalled();
            });
        });
    });
});
//# sourceMappingURL=validation.test.js.map