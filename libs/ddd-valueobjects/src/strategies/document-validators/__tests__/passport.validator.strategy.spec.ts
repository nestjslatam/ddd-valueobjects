import { PassportValidatorStrategy } from '../passport.validator.strategy';

describe('PassportValidatorStrategy', () => {
  let strategy: PassportValidatorStrategy;

  beforeEach(() => {
    strategy = new PassportValidatorStrategy();
  });

  it('should have type PASSPORT', () => {
    expect(strategy.type).toBe('PASSPORT');
  });

  describe('clean', () => {
    it('should remove special characters and convert to uppercase', () => {
      expect(strategy.clean('ab 123-456')).toBe('AB123456');
      expect(strategy.clean('ab-123456')).toBe('AB123456');
    });

    it('should preserve alphanumeric characters', () => {
      expect(strategy.clean('AB1234567')).toBe('AB1234567');
    });

    it('should convert lowercase to uppercase', () => {
      expect(strategy.clean('ab1234567')).toBe('AB1234567');
    });
  });

  describe('validate', () => {
    it('should validate correct passport number', () => {
      const result = strategy.validate('AB1234567');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate passport with lowercase letters', () => {
      const result = strategy.validate('ab1234567');

      expect(result.isValid).toBe(true);
    });

    it('should validate passport with spaces and dashes', () => {
      const result = strategy.validate('AB 123 4567');

      expect(result.isValid).toBe(true);
    });

    it('should reject passport shorter than minimum', () => {
      const result = strategy.validate('AB123'); // 5 chars

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('between'))).toBe(true);
    });

    it('should reject passport longer than maximum', () => {
      const result = strategy.validate('AB12345678901234'); // 15 chars

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('between'))).toBe(true);
    });

    it('should reject passport not starting with letter', () => {
      const result = strategy.validate('1234567890');

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('starts with a letter'))).toBe(true);
    });

    it('should clean and validate passport with special characters', () => {
      const result = strategy.validate('AB@123456'); // @ is removed by clean()

      expect(result.isValid).toBe(true); // Becomes 'AB123456' which is valid
    });

    it('should validate various passport formats', () => {
      const validPassports = ['AB1234567', 'C1234567', 'XY9876543', 'P12345678'];

      validPassports.forEach((passport) => {
        const result = strategy.validate(passport);
        expect(result.isValid).toBe(true);
      });
    });
  });
});
