"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_repository_1 = require("../repositories/transaction.repository");
const account_service_1 = require("./account_service");
class TransactionService {
    static async createTransaction(userId, transactionData) {
        // Ensure user has a default account if no account_id provided
        if (!transactionData.account_id) {
            const defaultAccount = await account_service_1.AccountService.ensureDefaultAccount(userId);
            transactionData.account_id = defaultAccount.id;
        }
        // Validate account belongs to user
        if (transactionData.account_id) {
            await account_service_1.AccountService.getAccountById(transactionData.account_id, userId);
        }
        // Create transaction
        const transaction = await transaction_repository_1.TransactionRepository.create({
            ...transactionData,
            user_id: userId
        });
        // Update account balance
        if (transaction.account_id && transaction.amount && transaction.is_expense !== undefined) {
            try {
                await account_service_1.AccountService.updateBalanceForTransaction(transaction.account_id, transaction.amount, transaction.is_expense);
            }
            catch (error) {
                // Log error but don't fail transaction creation
                console.error('Failed to update account balance:', error);
            }
        }
        return transaction;
    }
    static async getTransactions(userId, filters = {}) {
        return await transaction_repository_1.TransactionRepository.findByUserId(userId, filters);
    }
    static async analyzeSpending(userId, category) {
        const transactions = await transaction_repository_1.TransactionRepository.findByUserId(userId, { category });
        return transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    }
    static async detectRecurringPayments(userId) {
        const transactions = await transaction_repository_1.TransactionRepository.findByUserId(userId);
        return transactions.filter(t => typeof t.isRecurring === 'function' && t.isRecurring());
    }
}
exports.default = TransactionService;
//# sourceMappingURL=transaction_service.js.map