import { Account, AccountProps } from '../models/Account';
export declare class AccountService {
    /**
     * Ensures a user has at least one default account
     * Creates a default checking account if none exist
     */
    static ensureDefaultAccount(userId: string): Promise<Account>;
    /**
     * Updates account balance when a transaction is created
     */
    static updateBalanceForTransaction(accountId: string, amount: number, isExpense: boolean): Promise<void>;
    /**
     * Recalculates account balance based on all transactions
     */
    static recalculateBalance(accountId: string): Promise<number>;
    /**
     * Gets account by ID with user validation
     */
    static getAccountById(accountId: string, userId: string): Promise<Account>;
    /**
     * Gets all accounts for a user
     */
    static getUserAccounts(userId: string): Promise<Account[]>;
    /**
     * Creates a new account
     */
    static createAccount(accountProps: AccountProps): Promise<Account>;
    /**
     * Updates an existing account
     */
    static updateAccount(accountId: string, userId: string, updates: Partial<AccountProps>): Promise<Account>;
    /**
     * Deletes an account (only if no transactions exist)
     */
    static deleteAccount(accountId: string, userId: string): Promise<void>;
}
