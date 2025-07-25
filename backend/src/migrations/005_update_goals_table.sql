-- Migration: Update goals table to for tracking savings/debt goals
-- Add type column for savings/debt tracking and updated_at timestamp

ALTER TABLE goals 
ADD COLUMN type TEXT NOT NULL DEFAULT 'savings' CHECK (type IN ('savings', 'debt'));

ALTER TABLE goals 
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing goals to have proper type (default to savings)
UPDATE goals SET type = 'savings' WHERE type IS NULL;

-- Make target_date required (it was optional before)
ALTER TABLE goals 
ALTER COLUMN target_date SET NOT NULL;

-- Rename is_completed to completed to match model
ALTER TABLE goals 
RENAME COLUMN is_completed TO completed;

-- Add a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_goals_updated_at 
    BEFORE UPDATE ON goals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON COLUMN goals.type IS 'Type of goal: savings for accumulating money, debt for paying down debt';
COMMENT ON COLUMN goals.updated_at IS 'Timestamp of last update, automatically managed by trigger';