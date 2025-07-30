-- Migration: Seed default categories for existing users
-- Story: 1.3 Transaction Categorization System
-- Date: 2024-07-25

-- Function to create default categories for a user
CREATE OR REPLACE FUNCTION create_default_categories_for_user(user_uuid UUID)
RETURNS void AS $$
BEGIN
  -- Insert default categories only if user doesn't have any categories yet
  IF NOT EXISTS (SELECT 1 FROM categories WHERE user_id = user_uuid) THEN
    INSERT INTO categories (user_id, name, color, icon) VALUES
      (user_uuid, 'Groceries', '#4CAF50', '🛒'),
      (user_uuid, 'Transportation', '#2196F3', '🚗'),
      (user_uuid, 'Entertainment', '#E91E63', '🎬'),
      (user_uuid, 'Utilities', '#FF9800', '⚡'),
      (user_uuid, 'Rent/Mortgage', '#795548', '🏠'),
      (user_uuid, 'Healthcare', '#F44336', '🏥'),
      (user_uuid, 'Shopping', '#9C27B0', '🛍️'),
      (user_uuid, 'Other', '#607D8B', '📦');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create default categories for all existing users who don't have any categories
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT DISTINCT u.id 
    FROM auth.users u 
    LEFT JOIN categories c ON u.id = c.user_id 
    WHERE c.user_id IS NULL
  LOOP
    PERFORM create_default_categories_for_user(user_record.id);
  END LOOP;
END;
$$;

-- Create trigger to automatically create default categories for new users
CREATE OR REPLACE FUNCTION trigger_create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default categories for the new user
  PERFORM create_default_categories_for_user(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on auth.users table for new user registration
DROP TRIGGER IF EXISTS create_default_categories_trigger ON auth.users;
CREATE TRIGGER create_default_categories_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_default_categories();