import { MoneyFormatter } from '../money.formatter';
import { Money } from '../../implementations/money/money.value-object';

describe('MoneyFormatter', () => {
  let formatter: MoneyFormatter;

  beforeEach(() => {
    formatter = new MoneyFormatter();
  });

  describe('format', () => {
    it('should format USD with currency symbol', () => {
      const money = Money.create(1234.56, 'USD');
      const result = formatter.format(money);

      expect(result).toBe('$1,234.56');
    });

    it('should format EUR with currency symbol', () => {
      const money = Money.create(1234.56, 'EUR');
      const result = formatter.format(money, 'en-US');

      expect(result).toBe('€1,234.56');
    });

    it('should respect locale formatting', () => {
      const money = Money.create(1234.56, 'USD');
      const result = formatter.format(money, 'de-DE');

      expect(result).toContain('1');
      expect(result).toContain('234');
      expect(result).toContain('56');
    });

    it('should handle zero amount', () => {
      const money = Money.zero('USD');
      const result = formatter.format(money);

      expect(result).toBe('$0.00');
    });

    it('should handle large amounts', () => {
      const money = Money.create(1000000, 'USD');
      const result = formatter.format(money);

      expect(result).toBe('$1,000,000.00');
    });
  });

  describe('formatWithoutSymbol', () => {
    it('should format without currency symbol', () => {
      const money = Money.create(1234.56, 'USD');
      const result = formatter.formatWithoutSymbol(money);

      expect(result).toBe('1,234.56');
    });

    it('should maintain precision to 2 decimals', () => {
      const money = Money.create(100, 'USD');
      const result = formatter.formatWithoutSymbol(money);

      expect(result).toBe('100.00');
    });

    it('should handle negative amounts', () => {
      const money = Money.create(-500.25, 'USD');
      const result = formatter.formatWithoutSymbol(money);

      expect(result).toContain('500.25');
    });
  });

  describe('formatWithCode', () => {
    it('should format with currency code', () => {
      const money = Money.create(1234.56, 'USD');
      const result = formatter.formatWithCode(money);

      expect(result).toBe('1,234.56 USD');
    });

    it('should work with different currencies', () => {
      const money = Money.create(999.99, 'EUR');
      const result = formatter.formatWithCode(money);

      expect(result).toBe('999.99 EUR');
    });
  });

  describe('formatAccounting', () => {
    it('should format positive amounts normally', () => {
      const money = Money.create(100, 'USD');
      const result = formatter.formatAccounting(money);

      expect(result).toBe('$100.00');
    });

    it('should format negative amounts in parentheses', () => {
      const money = Money.create(-100, 'USD');
      const result = formatter.formatAccounting(money);

      expect(result).toBe('($100.00)');
    });

    it('should handle zero correctly', () => {
      const money = Money.zero('USD');
      const result = formatter.formatAccounting(money);

      expect(result).toBe('$0.00');
    });

    it('should work with different currencies', () => {
      const money = Money.create(-500, 'EUR');
      const result = formatter.formatAccounting(money);

      expect(result).toContain('500');
      expect(result).toContain('(');
      expect(result).toContain(')');
    });
  });

  describe('formatCompact', () => {
    it('should format thousands with K', () => {
      const money = Money.create(1500, 'USD');
      const result = formatter.formatCompact(money);

      expect(result).toContain('1');
      expect(result).toContain('K');
    });

    it('should format millions with M', () => {
      const money = Money.create(1500000, 'USD');
      const result = formatter.formatCompact(money);

      expect(result).toContain('1');
      expect(result).toContain('M');
    });

    it('should not compact small amounts', () => {
      const money = Money.create(500, 'USD');
      const result = formatter.formatCompact(money);

      expect(result).toBe('$500'); // Compact format removes trailing zeros
    });
  });

  describe('formatAsWords', () => {
    it('should format zero as words', () => {
      const money = Money.zero('USD');
      const result = formatter.formatAsWords(money);

      expect(result).toBe('zero dollars');
    });

    it('should format whole dollars', () => {
      const money = Money.create(100, 'USD');
      const result = formatter.formatAsWords(money);

      expect(result).toBe('one hundred dollars');
    });

    it('should format dollars and cents', () => {
      const money = Money.create(123.45, 'USD');
      const result = formatter.formatAsWords(money);

      expect(result).toBe('one hundred and twenty-three dollars and forty-five cents');
    });

    it('should handle single digit amounts', () => {
      const money = Money.create(5, 'USD');
      const result = formatter.formatAsWords(money);

      expect(result).toBe('five dollars');
    });

    it('should handle teens correctly', () => {
      const money = Money.create(15, 'USD');
      const result = formatter.formatAsWords(money);

      expect(result).toBe('fifteen dollars');
    });

    it('should handle thousands', () => {
      const money = Money.create(1234, 'USD');
      const result = formatter.formatAsWords(money);

      expect(result).toBe('one thousand two hundred and thirty-four dollars');
    });

    it('should format cents correctly', () => {
      const money = Money.create(0.5, 'USD');
      const result = formatter.formatAsWords(money);

      expect(result).toBe('zero dollars and fifty cents');
    });
  });

  describe('edge cases', () => {
    it('should handle very small amounts', () => {
      const money = Money.create(0.01, 'USD');
      const formatted = formatter.format(money);

      expect(formatted).toBe('$0.01');
    });

    it('should handle maximum safe integer', () => {
      const money = Money.create(999999999999.99, 'USD');
      const formatted = formatter.format(money);

      expect(formatted).toContain('999,999,999,999.99');
    });

    it('should work with non-standard locales', () => {
      const money = Money.create(1234, 'JPY'); // JPY doesn't use decimals
      const formatted = formatter.format(money, 'ja-JP');

      expect(formatted).toContain('1,234'); // May include currency symbol ¥
    });
  });
});
