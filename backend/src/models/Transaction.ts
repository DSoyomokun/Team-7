export interface TransactionProps {
  id: number | string;
  user_id: number | string;
  amount: number;
  description: string;
  date: Date | string; // Accepts string for parsing in constructor, but stores as Date
  category: string;
  is_expense: boolean;
}

export class Transaction {
  id: number | string;
  user_id: number | string;
  amount: number;
  description: string;
  date: Date;
  category: string;
  is_expense: boolean;

  constructor({ id, user_id, amount, description, date, category, is_expense }: TransactionProps) {
    this.id = id;
    this.user_id = user_id;
    this.amount = amount;
    this.description = description;
    this.date = date instanceof Date ? date : new Date(date); // Always store Date type
    this.category = category;
    this.is_expense = is_expense;
  }

  toJSON(): Omit<TransactionProps, 'id'> & { date: string } {
    return {
      user_id: this.user_id,
      amount: this.amount,
      description: this.description,
      date: this.date.toISOString(), // Serialize as ISO string
      category: this.category,
      is_expense: this.is_expense,
    };
  }

  isOverBudget(budgetLimit: number): boolean {
    return this.is_expense && this.amount > budgetLimit;
  }

  isRecurring(): boolean {
    const keywords = ['subscription', 'membership', 'monthly'];
    return keywords.some(keyword =>
      this.description.toLowerCase().includes(keyword)
    );
  }
}
