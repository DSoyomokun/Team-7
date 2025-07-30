-- Migration: Add category_id to transactions table
-- Story: 1.3 Transaction Categorization System  
-- Date: 2024-07-25

-- Add category_id column to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Create index for faster lookups by category
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);

-- Create index for user + category combinations for analytics
CREATE INDEX IF NOT EXISTS idx_transactions_user_category ON transactions(user_id, category_id);