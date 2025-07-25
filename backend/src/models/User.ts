export class User {
  id: number | string;
  name: string;
  email: string;

  constructor(id: number | string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

export interface UserProfile {
  id?: string;
  user_id: string;
  full_name: string | null;
  currency_preference: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserPreferences {
  currency_preference: string;
}

export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF'
] as const;

export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];
