"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const Account_1 = require("../models/Account");
const supabase_1 = __importDefault(require("../lib/supabase"));
class AccountService {
    /**
     * Ensures a user has at least one default account
     * Creates a default checking account if none exist
     */
    static async ensureDefaultAccount(userId) {
        // Check if user has any accounts
        const { data: existingAccounts, error: fetchError } = await supabase_1.default
            .from('accounts')
            .select('*')
            .eq('user_id', userId)
            .limit(1);
        if (fetchError) {
            throw new Error(`Failed to check existing accounts: ${fetchError.message}`);
        }
        // If user has accounts, return the first one
        if (existingAccounts && existingAccounts.length > 0) {
            return new Account_1.Account(existingAccounts[0]);
        }
        // Create default account
        const defaultAccountProps = {
            user_id: userId,
            name: 'Default Account',
            type: 'checking',
            balance: 0
        };
        const { data: newAccount, error: createError } = await supabase_1.default
            .from('accounts')
            .insert(new Account_1.Account(defaultAccountProps).toJSON())
            .select()
            .single();
        if (createError) {
            throw new Error(`Failed to create default account: ${createError.message}`);
        }
        return new Account_1.Account(newAccount);
    }
    /**
     * Updates account balance when a transaction is created
     */
    static async updateBalanceForTransaction(accountId, amount, isExpense) {
        // Get current account
        const { data: accountData, error: fetchError } = await supabase_1.default
            .from('accounts')
            .select('*')
            .eq('id', accountId)
            .single();
        if (fetchError) {
            throw new Error(`Failed to fetch account: ${fetchError.message}`);
        }
        const account = new Account_1.Account(accountData);
        // Update balance
        const newBalance = isExpense ? account.balance - amount : account.balance + amount;
        // Update in database
        const { error: updateError } = await supabase_1.default
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', accountId);
        if (updateError) {
            throw new Error(`Failed to update account balance: ${updateError.message}`);
        }
    }
    /**
     * Recalculates account balance based on all transactions
     */
    static async recalculateBalance(accountId) {
        // Get all transactions for this account
        const { data: transactions, error: transactionError } = await supabase_1.default
            .from('transactions')
            .select('amount, is_expense')
            .eq('account_id', accountId);
        if (transactionError) {
            throw new Error(`Failed to fetch transactions: ${transactionError.message}`);
        }
        // Calculate balance from transactions
        let balance = 0;
        if (transactions) {
            balance = transactions.reduce((sum, transaction) => {
                return transaction.is_expense
                    ? sum - transaction.amount
                    : sum + transaction.amount;
            }, 0);
        }
        // Update account balance
        const { error: updateError } = await supabase_1.default
            .from('accounts')
            .update({ balance })
            .eq('id', accountId);
        if (updateError) {
            throw new Error(`Failed to update account balance: ${updateError.message}`);
        }
        return balance;
    }
    /**
     * Gets account by ID with user validation
     */
    static async getAccountById(accountId, userId) {
        const { data, error } = await supabase_1.default
            .from('accounts')
            .select('*')
            .eq('id', accountId)
            .eq('user_id', userId)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error('Account not found');
            }
            throw new Error(`Failed to fetch account: ${error.message}`);
        }
        return new Account_1.Account(data);
    }
    /**
     * Gets all accounts for a user
     */
    static async getUserAccounts(userId) {
        const { data, error } = await supabase_1.default
            .from('accounts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(`Failed to fetch accounts: ${error.message}`);
        }
        return (data || []).map(account => new Account_1.Account(account));
    }
    /**
     * Creates a new account
     */
    static async createAccount(accountProps) {
        // Validate account data
        const validation = Account_1.Account.validate(accountProps);
        if (!validation.isValid) {
            throw new Error(`Invalid account data: ${validation.errors.join(', ')}`);
        }
        const account = new Account_1.Account(accountProps);
        const { data, error } = await supabase_1.default
            .from('accounts')
            .insert(account.toJSON())
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to create account: ${error.message}`);
        }
        return new Account_1.Account(data);
    }
    /**
     * Updates an existing account
     */
    static async updateAccount(accountId, userId, updates) {
        // Verify account ownership
        await this.getAccountById(accountId, userId);
        // Apply updates
        const { data, error } = await supabase_1.default
            .from('accounts')
            .update(updates)
            .eq('id', accountId)
            .eq('user_id', userId)
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to update account: ${error.message}`);
        }
        return new Account_1.Account(data);
    }
    /**
     * Deletes an account (only if no transactions exist)
     */
    static async deleteAccount(accountId, userId) {
        // Verify account ownership
        await this.getAccountById(accountId, userId);
        // Check for existing transactions
        const { data: transactions, error: transactionError } = await supabase_1.default
            .from('transactions')
            .select('id')
            .eq('account_id', accountId)
            .limit(1);
        if (transactionError) {
            throw new Error(`Failed to check transactions: ${transactionError.message}`);
        }
        if (transactions && transactions.length > 0) {
            throw new Error('Cannot delete account with existing transactions');
        }
        // Delete account
        const { error: deleteError } = await supabase_1.default
            .from('accounts')
            .delete()
            .eq('id', accountId)
            .eq('user_id', userId);
        if (deleteError) {
            throw new Error(`Failed to delete account: ${deleteError.message}`);
        }
    }
}
exports.AccountService = AccountService;
//# sourceMappingURL=account_service.js.map