import { TaxIdValidatorStrategy } from '../tax-id.validator.strategy';

describe('TaxIdValidatorStrategy', () => {
  let strategy: TaxIdValidatorStrategy;

  beforeEach(() => {
    strategy = new TaxIdValidatorStrategy();
  });

  it('should have type TAX_ID', () => {
    expect(strategy.type).toBe('TAX_ID');
  });

  describe('clean', () => {
    it('should remove dashes and convert to uppercase', () => {
      expect(strategy.clean('12-3456789')).toBe('123456789');
      expect(strategy.clean('ab-123456')).toBe('AB123456');
    });

    it('should preserve alphanumeric characters', () => {
      expect(strategy.clean('123456789')).toBe('123456789');
    });
  });

  describe('validate - USA EIN', () => {
    it('should validate correct USA EIN (9 digits)', () => {
      const result = strategy.validate('12-3456789', 'USA');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate USA EIN without dash', () => {
      const result = strategy.validate('123456789', 'USA');

      expect(result.isValid).toBe(true);
    });

    it('should reject USA EIN with wrong length', () => {
      const result = strategy.validate('12345678', 'USA'); // 8 digits

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('exactly 9'))).toBe(true);
    });
  });

  describe('validate - UK VAT', () => {
    it('should validate UK VAT with 9 digits', () => {
      const result = strategy.validate('123456789', 'UK');

      expect(result.isValid).toBe(true);
    });

    it('should validate UK VAT with 12 digits', () => {
      const result = strategy.validate('123456789012', 'GBR');

      expect(result.isValid).toBe(true);
    });

    it('should reject UK VAT with wrong length', () => {
      const result = strategy.validate('12345678', 'UK'); // 8 digits

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('9 or 12'))).toBe(true);
    });
  });

  describe('validate - generic (no country)', () => {
    it('should validate Tax ID within min/max length', () => {
      const result = strategy.validate('123456789'); // 9 chars

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject Tax ID shorter than minimum', () => {
      const result = strategy.validate('123'); // 3 chars

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('between'))).toBe(true);
    });

    it('should reject Tax ID longer than maximum', () => {
      const result = strategy.validate('12345678901234567890'); // 20 chars

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('between'))).toBe(true);
    });

    it('should handle alphanumeric Tax IDs', () => {
      const result = strategy.validate('AB1234567');

      expect(result.isValid).toBe(true);
    });
  });
});
