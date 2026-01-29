import { Money } from '../money.value-object';

describe('Money', () => {
  describe('create', () => {
    it('should create valid money with USD default', () => {
      const money = Money.create(100);

      expect(money.amount).toBe(100);
      expect(money.currency).toBe('USD');
    });

    it('should create money with specific currency', () => {
      const money = Money.create(50.5, 'EUR');

      expect(money.amount).toBe(50.5);
      expect(money.currency).toBe('EUR');
    });

    it('should normalize currency to uppercase', () => {
      const money = Money.create(100, 'eur');

      expect(money.currency).toBe('EUR');
    });

    it('should create zero money', () => {
      const money = Money.zero('USD');

      expect(money.amount).toBe(0);
      expect(money.currency).toBe('USD');
      expect(money.isZero()).toBe(true);
    });

    it('should create negative money', () => {
      const money = Money.create(-50, 'USD');

      expect(money.amount).toBe(-50);
      expect(money.isNegative()).toBe(true);
    });

    it('should round to 2 decimal places', () => {
      const money = Money.create(10.12345, 'USD');

      expect(money.amount).toBe(10.12);
    });

    it('should load money without validation', () => {
      const money = Money.load(100, 'USD');

      expect(money.amount).toBe(100);
      expect(money.currency).toBe('USD');
    });
  });

  describe('arithmetic operations', () => {
    it('should add money with same currency', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(50, 'USD');

      const result = money1.add(money2);

      expect(result.amount).toBe(150);
      expect(result.currency).toBe('USD');
    });

    it('should throw error when adding different currencies', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(50, 'EUR');

      expect(() => money1.add(money2)).toThrow('Cannot add different currencies');
    });

    it('should subtract money with same currency', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(30, 'USD');

      const result = money1.subtract(money2);

      expect(result.amount).toBe(70);
      expect(result.currency).toBe('USD');
    });

    it('should throw error when subtracting different currencies', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(50, 'EUR');

      expect(() => money1.subtract(money2)).toThrow('Cannot subtract different currencies');
    });

    it('should multiply money by factor', () => {
      const money = Money.create(50, 'USD');

      const result = money.multiply(3);

      expect(result.amount).toBe(150);
      expect(result.currency).toBe('USD');
    });

    it('should multiply money by decimal factor', () => {
      const money = Money.create(100, 'USD');

      const result = money.multiply(0.5);

      expect(result.amount).toBe(50);
      expect(result.currency).toBe('USD');
    });

    it('should divide money by divisor', () => {
      const money = Money.create(100, 'USD');

      const result = money.divide(2);

      expect(result.amount).toBe(50);
      expect(result.currency).toBe('USD');
    });

    it('should throw error when dividing by zero', () => {
      const money = Money.create(100, 'USD');

      expect(() => money.divide(0)).toThrow('Cannot divide by zero');
    });

    it('should handle division with rounding', () => {
      const money = Money.create(100, 'USD');

      const result = money.divide(3);

      expect(result.amount).toBe(33.33);
    });
  });

  describe('comparison methods', () => {
    it('should detect zero amount', () => {
      const money = Money.create(0, 'USD');

      expect(money.isZero()).toBe(true);
      expect(money.isPositive()).toBe(false);
      expect(money.isNegative()).toBe(false);
    });

    it('should detect positive amount', () => {
      const money = Money.create(100, 'USD');

      expect(money.isPositive()).toBe(true);
      expect(money.isZero()).toBe(false);
      expect(money.isNegative()).toBe(false);
    });

    it('should detect negative amount', () => {
      const money = Money.create(-50, 'USD');

      expect(money.isNegative()).toBe(true);
      expect(money.isZero()).toBe(false);
      expect(money.isPositive()).toBe(false);
    });
  });

  describe('equality', () => {
    it('should be equal for same amount and currency', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(100, 'USD');

      expect(money1.equals(money2)).toBe(true);
    });

    it('should not be equal for different amounts', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(50, 'USD');

      expect(money1.equals(money2)).toBe(false);
    });

    it('should not be equal for different currencies', () => {
      const money1 = Money.create(100, 'USD');
      const money2 = Money.create(100, 'EUR');

      expect(money1.equals(money2)).toBe(false);
    });
  });

  describe('serialization', () => {
    it('should serialize to string', () => {
      const money = Money.create(100, 'USD');

      expect(money.toString()).toBe('100 USD');
    });

    it('should serialize to JSON', () => {
      const money = Money.create(50.5, 'EUR');

      const json = money.toJSON();

      expect(json).toEqual({ amount: 50.5, currency: 'EUR' });
    });
  });
});
