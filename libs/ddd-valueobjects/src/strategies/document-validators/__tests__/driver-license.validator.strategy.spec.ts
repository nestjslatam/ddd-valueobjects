import { DriverLicenseValidatorStrategy } from '../driver-license.validator.strategy';

describe('DriverLicenseValidatorStrategy', () => {
  let strategy: DriverLicenseValidatorStrategy;

  beforeEach(() => {
    strategy = new DriverLicenseValidatorStrategy();
  });

  it('should have type DRIVER_LICENSE', () => {
    expect(strategy.type).toBe('DRIVER_LICENSE');
  });

  describe('clean', () => {
    it('should remove spaces and dashes, convert to uppercase', () => {
      expect(strategy.clean('a 123-4567')).toBe('A1234567');
      expect(strategy.clean('ab-123456')).toBe('AB123456');
    });

    it('should preserve alphanumeric characters', () => {
      expect(strategy.clean('A1234567')).toBe('A1234567');
    });

    it('should convert lowercase to uppercase', () => {
      expect(strategy.clean('a1234567')).toBe('A1234567');
    });
  });

  describe('validate', () => {
    it('should validate correct driver license', () => {
      const result = strategy.validate('A1234567');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate driver license with spaces and dashes', () => {
      const result = strategy.validate('A 123-4567');

      expect(result.isValid).toBe(true);
    });

    it('should validate numeric-only driver license', () => {
      const result = strategy.validate('123456789');

      expect(result.isValid).toBe(true);
    });

    it('should validate alphanumeric driver license', () => {
      const result = strategy.validate('AB123456');

      expect(result.isValid).toBe(true);
    });

    it('should reject driver license shorter than minimum', () => {
      const result = strategy.validate('A123'); // 4 chars

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('between'))).toBe(true);
    });

    it('should reject driver license longer than maximum', () => {
      const result = strategy.validate('A123456789012345678901'); // 22 chars

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('between'))).toBe(true);
    });

    it('should clean and validate driver license with special characters', () => {
      const result = strategy.validate('A@123456'); // @ is removed by clean()

      expect(result.isValid).toBe(true); // Becomes 'A123456' which is valid
    });

    it('should validate various driver license formats', () => {
      const validLicenses = ['A1234567', 'AB123456', '123456789', 'X12345678901234'];

      validLicenses.forEach((license) => {
        const result = strategy.validate(license);
        expect(result.isValid).toBe(true);
      });
    });
  });
});
