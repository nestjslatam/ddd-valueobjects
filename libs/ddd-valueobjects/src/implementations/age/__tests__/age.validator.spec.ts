import { Age } from '../age.value-object';
import { AGE_VALIDATION } from '../../../constants';

describe('AgeValidator', () => {
  describe('basic validation', () => {
    it('should pass for valid age', () => {
      const age = Age.create(25);

      expect(age.getValue()).toBe(25);
    });

    it('should fail for NaN', () => {
      expect(() => Age.create(NaN)).toThrow('Age must be a valid number');
    });
  });

  describe('integer validation', () => {
    it('should fail for decimal age', () => {
      expect(() => Age.create(25.5)).toThrow('Age must be a whole number');
    });

    it('should pass for integer age', () => {
      const age = Age.create(25);

      expect(age.getValue()).toBe(25);
    });
  });

  describe('negative validation', () => {
    it('should fail for negative age', () => {
      expect(() => Age.create(-5)).toThrow('Age cannot be negative');
    });
  });

  describe('range validation', () => {
    it('should pass for age at min boundary', () => {
      const age = Age.create(AGE_VALIDATION.MIN_VALID_AGE);

      expect(age.getValue()).toBe(AGE_VALIDATION.MIN_VALID_AGE);
    });

    it('should pass for age at max boundary', () => {
      const age = Age.create(AGE_VALIDATION.MAX_VALID_AGE);

      expect(age.getValue()).toBe(AGE_VALIDATION.MAX_VALID_AGE);
    });

    it('should pass for valid age in range', () => {
      const age = Age.create(50);

      expect(age.getValue()).toBe(50);
    });
  });

  describe('custom options', () => {
    it('should pass within custom range', () => {
      const age = Age.create(7, { minAge: 5, maxAge: 10 });

      expect(age.getValue()).toBe(7);
    });

    it('should pass at custom min boundary', () => {
      const age = Age.create(5, { minAge: 5, maxAge: 10 });

      expect(age.getValue()).toBe(5);
    });

    it('should pass at custom max boundary', () => {
      const age = Age.create(10, { minAge: 5, maxAge: 10 });

      expect(age.getValue()).toBe(10);
    });
  });
});
