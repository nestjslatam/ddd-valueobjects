import { DniValidatorStrategy } from '../dni.validator.strategy';

describe('DniValidatorStrategy', () => {
  let strategy: DniValidatorStrategy;

  beforeEach(() => {
    strategy = new DniValidatorStrategy();
  });

  it('should have type DNI', () => {
    expect(strategy.type).toBe('DNI');
  });

  describe('clean', () => {
    it('should remove non-numeric characters', () => {
      expect(strategy.clean('12.345.678')).toBe('12345678');
      expect(strategy.clean('12-345-678')).toBe('12345678');
      expect(strategy.clean('12 345 678')).toBe('12345678');
    });

    it('should preserve numeric characters', () => {
      expect(strategy.clean('12345678')).toBe('12345678');
    });
  });

  describe('validate - Argentina DNI', () => {
    it('should validate correct Argentina DNI (8 digits)', () => {
      const result = strategy.validate('12345678', 'ARG');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate Argentina DNI with dots', () => {
      const result = strategy.validate('12.345.678', 'ARGENTINA');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject Argentina DNI with wrong length', () => {
      const result = strategy.validate('1234567', 'ARG'); // 7 digits

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('exactly 8 digits'))).toBe(true);
    });
  });

  describe('validate - Brazil DNI/CPF', () => {
    it('should validate Brazil DNI with 9 digits', () => {
      const result = strategy.validate('123456789', 'BRA');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject Brazil CPF with 11 digits (exceeds max length)', () => {
      const result = strategy.validate('12345678901', 'BRAZIL');

      expect(result.isValid).toBe(false);
      // 11 digits exceeds DNI MAX_LENGTH of 10
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject Brazil DNI with wrong length', () => {
      const result = strategy.validate('12345678', 'BRA'); // 8 digits

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('9 or 11 digits'))).toBe(true);
    });
  });

  describe('validate - Chile DNI', () => {
    it('should validate Chile DNI with 8 digits', () => {
      const result = strategy.validate('12345678', 'CHL');

      expect(result.isValid).toBe(true);
    });

    it('should validate Chile DNI with 9 digits', () => {
      const result = strategy.validate('123456789', 'CHILE');

      expect(result.isValid).toBe(true);
    });
  });

  describe('validate - generic (no country)', () => {
    it('should validate DNI within min/max length', () => {
      const result = strategy.validate('12345678'); // 8 digits

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject DNI shorter than minimum', () => {
      const result = strategy.validate('12345'); // 5 digits

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('between'))).toBe(true);
    });

    it('should reject DNI longer than maximum', () => {
      const result = strategy.validate('123456789012345'); // 15 digits

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('between'))).toBe(true);
    });

    it('should clean and validate DNI with letters (extracts digits)', () => {
      const result = strategy.validate('ABC12345678'); // Becomes '12345678' after cleaning

      expect(result.isValid).toBe(true); // 8 digits is valid
    });
  });
});
