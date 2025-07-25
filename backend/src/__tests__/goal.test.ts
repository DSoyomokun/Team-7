import { Goal, GoalProps } from '../models/Goal';

describe('Goal Model Tests', () => {
  
  describe('Goal Construction', () => {
    test('should create a valid savings goal', () => {
      const goalData: GoalProps = {
        user_id: 'user-123',
        name: 'Emergency Fund',
        type: 'savings',
        target_amount: 5000,
        current_amount: 1000,
        target_date: '2024-12-31',
        completed: false
      };

      const goal = new Goal(goalData);

      expect(goal.user_id).toBe('user-123');
      expect(goal.name).toBe('Emergency Fund');
      expect(goal.type).toBe('savings');
      expect(goal.target_amount).toBe(5000);
      expect(goal.current_amount).toBe(1000);
      expect(goal.target_date).toBeInstanceOf(Date);
      expect(goal.completed).toBe(false);
    });

    test('should create a valid debt goal', () => {
      const goalData: GoalProps = {
        user_id: 'user-123',
        name: 'Pay Off Credit Card',
        type: 'debt',
        target_amount: 3000,
        current_amount: 500,
        target_date: new Date('2024-06-30'),
        completed: false
      };

      const goal = new Goal(goalData);

      expect(goal.type).toBe('debt');
      expect(goal.name).toBe('Pay Off Credit Card');
      expect(goal.target_amount).toBe(3000);
      expect(goal.current_amount).toBe(500);
    });

    test('should set default current_amount to 0', () => {
      const goalData: GoalProps = {
        user_id: 'user-123',
        name: 'Vacation Fund',
        type: 'savings',
        target_amount: 2000,
        target_date: '2024-08-01'
      };

      const goal = new Goal(goalData);

      expect(goal.current_amount).toBe(0);
      expect(goal.completed).toBe(false);
    });

    test('should throw error for missing required fields', () => {
      expect(() => {
        new Goal({
          user_id: '',
          name: 'Test Goal',
          type: 'savings',
          target_amount: 1000,
          target_date: '2024-12-31'
        });
      }).toThrow('user_id is required');

      expect(() => {
        new Goal({
          user_id: 'user-123',
          name: '',
          type: 'savings',
          target_amount: 1000,
          target_date: '2024-12-31'
        });
      }).toThrow('name is required and cannot be empty');

      expect(() => {
        new Goal({
          user_id: 'user-123',
          name: 'Test Goal',
          type: 'invalid' as any,
          target_amount: 1000,
          target_date: '2024-12-31'
        });
      }).toThrow('type must be either "savings" or "debt"');
    });

    test('should throw error for invalid amounts', () => {
      expect(() => {
        new Goal({
          user_id: 'user-123',
          name: 'Test Goal',
          type: 'savings',
          target_amount: -100,
          target_date: '2024-12-31'
        });
      }).toThrow('target_amount must be greater than 0');

      expect(() => {
        new Goal({
          user_id: 'user-123',
          name: 'Test Goal',
          type: 'savings',
          target_amount: 1000,
          current_amount: -50,
          target_date: '2024-12-31'
        });
      }).toThrow('current_amount cannot be negative');
    });

    test('should throw error for missing target_date', () => {
      expect(() => {
        new Goal({
          user_id: 'user-123',
          name: 'Test Goal',
          type: 'savings',
          target_amount: 1000,
          target_date: '' as any
        });
      }).toThrow('target_date is required');
    });
  });

  describe('Goal Progress Methods', () => {
    let goal: Goal;

    beforeEach(() => {
      goal = new Goal({
        user_id: 'user-123',
        name: 'Test Goal',
        type: 'savings',
        target_amount: 5000,
        current_amount: 1000,
        target_date: '2024-12-31'
      });
    });

    test('should calculate progress percentage correctly', () => {
      expect(goal.getProgressPercentage()).toBe(20); // 1000/5000 * 100
      
      goal.current_amount = 2500;
      expect(goal.getProgressPercentage()).toBe(50);
      
      goal.current_amount = 5000;
      expect(goal.getProgressPercentage()).toBe(100);
      
      goal.current_amount = 6000;
      expect(goal.getProgressPercentage()).toBe(100); // Capped at 100%
    });

    test('should calculate remaining amount correctly', () => {
      expect(goal.getRemainingAmount()).toBe(4000); // 5000 - 1000
      
      goal.current_amount = 4500;
      expect(goal.getRemainingAmount()).toBe(500);
      
      goal.current_amount = 5000;
      expect(goal.getRemainingAmount()).toBe(0);
      
      goal.current_amount = 5500;
      expect(goal.getRemainingAmount()).toBe(0); // Cannot be negative
    });

    test('should add progress correctly', () => {
      const newAmount = goal.addProgress(500);
      expect(newAmount).toBe(1500);
      expect(goal.current_amount).toBe(1500);
      
      // Should auto-complete when target is reached
      goal.addProgress(3500);
      expect(goal.current_amount).toBe(5000);
      expect(goal.completed).toBe(true);
    });

    test('should subtract progress correctly', () => {
      goal.current_amount = 2000;
      goal.completed = false;
      
      const newAmount = goal.subtractProgress(500);
      expect(newAmount).toBe(1500);
      expect(goal.current_amount).toBe(1500);
      
      // Should not go below 0
      goal.subtractProgress(2000);
      expect(goal.current_amount).toBe(0);
    });

    test('should set progress correctly', () => {
      goal.setProgress(3000);
      expect(goal.current_amount).toBe(3000);
      expect(goal.completed).toBe(false);
      
      goal.setProgress(5000);
      expect(goal.current_amount).toBe(5000);
      expect(goal.completed).toBe(true);
      
      goal.setProgress(2000);
      expect(goal.current_amount).toBe(2000);
      expect(goal.completed).toBe(false);
    });

    test('should throw error for invalid progress amounts', () => {
      expect(() => goal.addProgress(-100)).toThrow('amount must be positive');
      expect(() => goal.subtractProgress(-100)).toThrow('amount must be positive');
      expect(() => goal.setProgress(-100)).toThrow('amount cannot be negative');
    });
  });

  describe('Goal Date Methods', () => {
    test('should detect overdue goals', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      
      const overdueGoal = new Goal({
        user_id: 'user-123',
        name: 'Overdue Goal',
        type: 'savings',
        target_amount: 1000,
        target_date: pastDate.toISOString()
      });
      
      expect(overdueGoal.isOverdue()).toBe(true);
      
      // Completed goals should not be overdue
      overdueGoal.completed = true;
      expect(overdueGoal.isOverdue()).toBe(false);
    });

    test('should calculate days remaining correctly', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      
      const goal = new Goal({
        user_id: 'user-123',
        name: 'Future Goal',
        type: 'savings',
        target_amount: 1000,
        target_date: futureDate.toISOString()
      });
      
      const daysRemaining = goal.getDaysRemaining();
      expect(daysRemaining).toBeGreaterThan(25);
      expect(daysRemaining).toBeLessThanOrEqual(30);
      
      // Completed goals should return null
      goal.completed = true;
      expect(goal.getDaysRemaining()).toBe(null);
    });
  });

  describe('Goal Completion Methods', () => {
    let goal: Goal;

    beforeEach(() => {
      goal = new Goal({
        user_id: 'user-123',
        name: 'Test Goal',
        type: 'savings',
        target_amount: 1000,
        current_amount: 500,
        target_date: '2024-12-31'
      });
    });

    test('should mark goal as complete', () => {
      goal.markComplete();
      expect(goal.completed).toBe(true);
    });

    test('should mark goal as incomplete', () => {
      goal.completed = true;
      goal.markIncomplete();
      expect(goal.completed).toBe(false);
    });
  });

  describe('Goal JSON Serialization', () => {
    test('should serialize to JSON correctly', () => {
      const goal = new Goal({
        user_id: 'user-123',
        name: 'Test Goal',
        type: 'savings',
        target_amount: 1000,
        current_amount: 250,
        target_date: '2024-12-31T00:00:00.000Z',
        completed: false
      });

      const json = goal.toJSON();

      expect(json).toHaveProperty('user_id', 'user-123');
      expect(json).toHaveProperty('name', 'Test Goal');
      expect(json).toHaveProperty('type', 'savings');
      expect(json).toHaveProperty('target_amount', 1000);
      expect(json).toHaveProperty('current_amount', 250);
      expect(json).toHaveProperty('completed', false);
      expect(json.target_date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('Goal Validation', () => {
    test('should validate valid goal data', () => {
      const validData: GoalProps = {
        user_id: 'user-123',
        name: 'Valid Goal',
        type: 'savings',
        target_amount: 1000,
        target_date: '2024-12-31'
      };

      const validation = Goal.validate(validData);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should catch validation errors', () => {
      const invalidData: GoalProps = {
        user_id: '',
        name: '',
        type: 'invalid' as any,
        target_amount: -100,
        current_amount: -50,
        target_date: 'invalid-date'
      };

      const validation = Goal.validate(invalidData);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('user_id is required');
      expect(validation.errors).toContain('name is required and cannot be empty');
      expect(validation.errors).toContain('type must be either "savings" or "debt"');
      expect(validation.errors).toContain('target_amount must be greater than 0');
      expect(validation.errors).toContain('current_amount cannot be negative');
      expect(validation.errors).toContain('target_date must be a valid date');
    });
  });

  describe('Goal Helper Methods', () => {
    test('should format progress with currency', () => {
      const goal = new Goal({
        user_id: 'user-123',
        name: 'Test Goal',
        type: 'savings',
        target_amount: 1000,
        current_amount: 250,
        target_date: '2024-12-31'
      });

      const formatted = goal.getFormattedProgress('USD');
      expect(formatted).toMatch(/\$250\.00.*\$1,000\.00/);
    });

    test('should create goal templates', () => {
      const templates = Goal.createGoalTemplates();
      expect(templates).toHaveLength(6);
      expect(templates[0]).toHaveProperty('name', 'Emergency Fund');
      expect(templates[0]).toHaveProperty('target_amount', 1000);
    });

    test('should calculate daily savings needed', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 100);
      
      const dailySavings = Goal.calculateDailySavingsNeeded(1000, futureDate);
      expect(dailySavings).toBe(10); // 1000 / 100 days
    });
  });
});