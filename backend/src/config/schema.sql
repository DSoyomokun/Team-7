CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE profile(
  user_id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  currency_preference TEXT DEFAULT 'USD'
);
CREATE TABLE accounts(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  balance NUMERIC(12,2) DEFAULT 0,
  plaid_item_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()

);


CREATE TABLE categories(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  is_default BOOLEAN DEFAULT FALSE
);

CREATE TABLE transactions(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  account_id UUID REFERENCES accounts NOT NULL,
  category_id UUID REFERENCES categories,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  is_expense BOOLEAN NOT NULL, 
  created_at TIMESTAMPTZ DEFAULT NOW()


);
CREATE TABLE goals(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL,
  current_amount NUMERIC(12, 2) DEFAULT 0,
  target_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE recurring_payment(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  category_id UUID REFERENCES categories,
  frequency TEXT NOT NULL,
  next_date DATE NOT NULL,
  account_id UUID REFERENCES accounts NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);
