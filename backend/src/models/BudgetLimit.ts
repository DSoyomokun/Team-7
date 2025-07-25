export interface BudgetLimitProps {
  id?: string;
  user_id: string;
  category_id: string;
  limit_amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: Date | string;
  end_date: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export class BudgetLimit {
  id?: string;
  user_id: string;
  category_id: string;
  limit_amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: Date;
  end_date: Date;
  created_at?: Date;
  updated_at?: Date;

  constructor({ id, user_id, category_id, limit_amount, period, start_date, end_date, created_at, updated_at }: BudgetLimitProps) {
    // Validation
    if (!user_id) throw new Error('user_id is required');
    if (!category_id) throw new Error('category_id is required');
    if (limit_amount === undefined || limit_amount === null) throw new Error('limit_amount is required');
    if (typeof limit_amount !== 'number' || isNaN(limit_amount) || limit_amount < 0) {
      throw new Error('limit_amount must be a non-negative number');
    }
    if (!period || !['weekly', 'monthly', 'yearly'].includes(period)) {
      throw new Error('period must be one of: weekly, monthly, yearly');
    }
    if (!start_date) throw new Error('start_date is required');
    if (!end_date) throw new Error('end_date is required');

    const startDateObj = start_date instanceof Date ? start_date : new Date(start_date);
    const endDateObj = end_date instanceof Date ? end_date : new Date(end_date);

    if (isNaN(startDateObj.getTime())) throw new Error('start_date must be a valid date');
    if (isNaN(endDateObj.getTime())) throw new Error('end_date must be a valid date');
    if (endDateObj <= startDateObj) throw new Error('end_date must be after start_date');

    this.id = id || undefined;
    this.user_id = user_id;
    this.category_id = category_id;
    this.limit_amount = limit_amount;
    this.period = period;
    this.start_date = startDateObj;
    this.end_date = endDateObj;
    this.created_at = created_at ? (created_at instanceof Date ? created_at : new Date(created_at)) : undefined;
    this.updated_at = updated_at ? (updated_at instanceof Date ? updated_at : new Date(updated_at)) : undefined;
  }

  toJSON(): { [key: string]: any } {
    return {
      id: this.id,
      user_id: this.user_id,
      category_id: this.category_id,
      limit_amount: this.limit_amount,
      period: this.period,
      start_date: this.start_date.toISOString().split('T')[0],
      end_date: this.end_date.toISOString().split('T')[0],
      created_at: this.created_at?.toISOString(),
      updated_at: this.updated_at?.toISOString(),
    };
  }

  // Check if the budget limit is currently active
  isActive(date: Date = new Date()): boolean {
    return date >= this.start_date && date <= this.end_date;
  }

  // Calculate spending percentage against limit
  calculateSpendingPercentage(spentAmount: number): number {
    if (this.limit_amount === 0) return spentAmount > 0 ? 100 : 0;
    return Math.min((spentAmount / this.limit_amount) * 100, 100);
  }

  // Get warning level based on spending percentage
  getWarningLevel(spentAmount: number): 'low' | 'medium' | 'high' | 'critical' {
    const percentage = this.calculateSpendingPercentage(spentAmount);
    if (percentage >= 100) return 'critical';
    if (percentage >= 90) return 'high';
    if (percentage >= 75) return 'medium';
    return 'low';
  }

  // Generate period dates for the given period type
  static generatePeriodDates(period: 'weekly' | 'monthly' | 'yearly', baseDate: Date = new Date()): { start_date: Date; end_date: Date } {
    const start = new Date(baseDate);
    const end = new Date(baseDate);

    switch (period) {
      case 'weekly':
        // Start of week (Sunday)
        start.setDate(start.getDate() - start.getDay());
        start.setHours(0, 0, 0, 0);
        // End of week (Saturday)
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        // Start of month
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        // End of month
        end.setMonth(end.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'yearly':
        // Start of year
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        // End of year
        end.setFullYear(end.getFullYear(), 11, 31);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start_date: start, end_date: end };
  }

  // Static validation method
  static validate(props: BudgetLimitProps): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      new BudgetLimit(props);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown validation error');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}