import { Money } from '../money.value-object';

describe('MoneyValidator', () => {
  describe('amount validation', () => {
    it('should pass for valid positive amount', () => {
      const money = Money.create(100.5, 'USD');

      expect(money.amount).toBe(100.5);
    });

    it('should pass for zero amount', () => {
      const money = Money.create(0, 'USD');

      expect(money.amount).toBe(0);
    });

    it('should pass for negative amount', () => {
      const money = Money.create(-50, 'USD');

      expect(money.amount).toBe(-50);
    });

    it('should pass for valid decimal places (2)', () => {
      const money = Money.create(99.99, 'USD');

      expect(money.amount).toBe(99.99);
    });

    it('should round to 2 decimal places', () => {
      const money = Money.create(99.999, 'USD');

      expect(money.amount).toBe(100);
    });
  });

  describe('currency validation', () => {
    it('should pass for valid USD currency', () => {
      const money = Money.create(100, 'USD');

      expect(money.currency).toBe('USD');
    });

    it('should pass for valid EUR currency', () => {
      const money = Money.create(100, 'EUR');

      expect(money.currency).toBe('EUR');
    });

    it('should pass for valid GBP currency', () => {
      const money = Money.create(100, 'GBP');

      expect(money.currency).toBe('GBP');
    });

    it('should normalize currency to uppercase', () => {
      const money = Money.create(100, 'usd');

      expect(money.currency).toBe('USD');
    });

    it('should fail for invalid currency code length', () => {
      expect(() => Money.create(100, 'US')).toThrow('Currency code must be exactly 3 characters');
    });

    it('should fail for currency with numbers', () => {
      expect(() => Money.create(100, 'U5D')).toThrow('Currency code must be 3 uppercase letters');
    });

    it('should warn for unrecognized currency code', () => {
      expect(() => Money.create(100, 'XXX')).toThrow('not a commonly recognized ISO 4217 code');
    });
  });

  describe('JPY special handling', () => {
    it('should pass for JPY with no decimals', () => {
      const money = Money.create(1000, 'JPY');

      expect(money.amount).toBe(1000);
      expect(money.currency).toBe('JPY');
    });

    it('should fail for JPY with decimals', () => {
      expect(() => Money.create(1000.5, 'JPY')).toThrow(
        'Amount cannot have more than 0 decimal places for JPY',
      );
    });
  });

  describe('edge cases', () => {
    it('should pass for very large amounts', () => {
      const money = Money.create(1000000.99, 'USD');

      expect(money.amount).toBe(1000000.99);
    });

    it('should pass for very small amounts', () => {
      const money = Money.create(0.01, 'USD');

      expect(money.amount).toBe(0.01);
    });

    it('should fail for NaN amount', () => {
      expect(() => Money.create(NaN, 'USD')).toThrow('Amount must be a valid number');
    });

    it('should fail for Infinity', () => {
      expect(() => Money.create(Infinity, 'USD')).toThrow('Amount must be finite');
    });
  });
});
