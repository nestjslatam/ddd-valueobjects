import { SsnValidatorStrategy } from '../ssn.validator.strategy';

describe('SsnValidatorStrategy', () => {
  let strategy: SsnValidatorStrategy;

  beforeEach(() => {
    strategy = new SsnValidatorStrategy();
  });

  it('should have type SSN', () => {
    expect(strategy.type).toBe('SSN');
  });

  describe('clean', () => {
    it('should remove dashes and spaces', () => {
      expect(strategy.clean('219-09-9999')).toBe('219099999');
      expect(strategy.clean('219 09 9999')).toBe('219099999');
    });

    it('should preserve numeric characters', () => {
      expect(strategy.clean('219099999')).toBe('219099999');
    });
  });

  describe('validate', () => {
    it('should validate correct SSN', () => {
      const result = strategy.validate('219-09-9999');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate SSN without dashes', () => {
      const result = strategy.validate('219099999');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject SSN with wrong length', () => {
      const result = strategy.validate('12345678'); // 8 digits

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('exactly 9 digits'))).toBe(true);
    });

    it('should reject SSN with area number 000', () => {
      const result = strategy.validate('000-12-3456');

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('area number'))).toBe(true);
    });

    it('should reject SSN with area number 666', () => {
      const result = strategy.validate('666-12-3456');

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('area number'))).toBe(true);
    });

    it('should reject SSN with area number 900+', () => {
      const result = strategy.validate('900-12-3456');

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('area number'))).toBe(true);
    });

    it('should reject SSN with group number 00', () => {
      const result = strategy.validate('219-00-9999');

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('group number'))).toBe(true);
    });

    it('should reject SSN with serial number 0000', () => {
      const result = strategy.validate('219-09-0000');

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('serial number'))).toBe(true);
    });

    it('should reject invalid SSN patterns', () => {
      const invalidPatterns = ['000000000', '111111111', '123456789', '987654321'];

      invalidPatterns.forEach((pattern) => {
        const result = strategy.validate(pattern);
        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('Invalid SSN pattern'))).toBe(true);
      });
    });

    it('should validate various valid SSN formats', () => {
      const validSSNs = ['219-09-9999', '345-12-6789', '567-23-4567', '789-45-1234'];

      validSSNs.forEach((ssn) => {
        const result = strategy.validate(ssn);
        expect(result.isValid).toBe(true);
      });
    });
  });
});
