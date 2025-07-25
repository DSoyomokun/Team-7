-- Migration: Create budget_limits table for category spending limits
CREATE TABLE budget_limits(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  category_id UUID REFERENCES categories NOT NULL,
  limit_amount NUMERIC(12, 2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id, period, start_date)
);

-- Index for efficient lookups
CREATE INDEX idx_budget_limits_user_category ON budget_limits(user_id, category_id);
CREATE INDEX idx_budget_limits_period ON budget_limits(period, start_date, end_date);