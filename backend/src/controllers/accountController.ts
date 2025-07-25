import { Request, Response } from 'express';
import { Account, AccountProps } from '../models/Account';
import supabase from '../lib/supabase';

const accountController = {
  // Create new account
  create: async (req: Request, res: Response) => {
    try {
      const { name, type, balance, plaid_item_id } = req.body;
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      // Validate input
      const accountProps: AccountProps = {
        user_id,
        name,
        type,
        balance,
        plaid_item_id
      };

      const validation = Account.validate(accountProps);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
      }

      // Create account instance for additional validation
      const account = new Account(accountProps);

      // Insert into database
      const { data, error } = await supabase
        .from('accounts')
        .insert(account.toJSON())
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to create account'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: data
      });
    } catch (error: any) {
      console.error('Account creation error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Invalid account data'
      });
    }
  },

  // Get all accounts for user
  getAll: async (req: Request, res: Response) => {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch accounts'
        });
      }

      res.status(200).json({
        success: true,
        data: data || []
      });
    } catch (error: any) {
      console.error('Get accounts error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // Get single account by id
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Account ID is required'
        });
      }

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user_id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            error: 'Account not found'
          });
        }
        console.error('Database error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch account'
        });
      }

      res.status(200).json({
        success: true,
        data: data
      });
    } catch (error: any) {
      console.error('Get account error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // Update account
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, type, balance, plaid_item_id } = req.body;
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Account ID is required'
        });
      }

      // Check if account exists and belongs to user
      const { data: existingAccount, error: fetchError } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user_id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            error: 'Account not found'
          });
        }
        console.error('Database fetch error:', fetchError);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch account'
        });
      }

      // Prepare update data
      const updateData: Partial<AccountProps> = {};
      if (name !== undefined) updateData.name = name;
      if (type !== undefined) updateData.type = type;
      if (balance !== undefined) updateData.balance = balance;
      if (plaid_item_id !== undefined) updateData.plaid_item_id = plaid_item_id;

      // Validate the update
      const accountProps: AccountProps = {
        ...existingAccount,
        ...updateData
      };

      const validation = Account.validate(accountProps);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
      }

      // Update in database
      const { data, error } = await supabase
        .from('accounts')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user_id)
        .select()
        .single();

      if (error) {
        console.error('Database update error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to update account'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Account updated successfully',
        data: data
      });
    } catch (error: any) {
      console.error('Account update error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Invalid account data'
      });
    }
  },

  // Delete account
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Account ID is required'
        });
      }

      // Check if account exists and belongs to user
      const { data: existingAccount, error: fetchError } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user_id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            error: 'Account not found'
          });
        }
        console.error('Database fetch error:', fetchError);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch account'
        });
      }

      // Check if account has transactions
      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .select('id')
        .eq('account_id', id)
        .limit(1);

      if (transactionError) {
        console.error('Transaction check error:', transactionError);
        return res.status(500).json({
          success: false,
          error: 'Failed to check account transactions'
        });
      }

      if (transactions && transactions.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete account with existing transactions. Please delete or reassign transactions first.'
        });
      }

      // Delete account
      const { error: deleteError } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id);

      if (deleteError) {
        console.error('Database delete error:', deleteError);
        return res.status(500).json({
          success: false,
          error: 'Failed to delete account'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error: any) {
      console.error('Account delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  // Get account balance summary
  getBalanceSummary: async (req: Request, res: Response) => {
    try {
      const user_id = req.user?.id;

      if (!user_id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
      }

      const { data, error } = await supabase
        .from('accounts')
        .select('id, name, type, balance')
        .eq('user_id', user_id);

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch account balances'
        });
      }

      const accounts = data || [];
      const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);

      res.status(200).json({
        success: true,
        data: {
          accounts,
          totalBalance,
          accountCount: accounts.length
        }
      });
    } catch (error: any) {
      console.error('Balance summary error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
};

export default accountController;