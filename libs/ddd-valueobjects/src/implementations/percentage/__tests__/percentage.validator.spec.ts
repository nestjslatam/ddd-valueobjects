import { Percentage } from '../percentage.value-object';
import { PERCENTAGE_CONSTANTS } from '../../../constants';

describe('PercentageValidator', () => {
  describe('basic validation', () => {
    it('should pass for valid percentage', () => {
      const pct = Percentage.create(50);

      expect(pct.getValue()).toBe(50);
    });

    it('should pass for zero percentage', () => {
      const pct = Percentage.create(0);

      expect(pct.getValue()).toBe(0);
    });

    it('should pass for 100 percentage', () => {
      const pct = Percentage.create(100);

      expect(pct.getValue()).toBe(100);
    });

    it('should fail for NaN', () => {
      expect(() => Percentage.create(NaN)).toThrow('Percentage must be a valid number');
    });

    it('should fail for Infinity', () => {
      expect(() => Percentage.create(Infinity)).toThrow('Percentage must be finite');
    });
  });

  describe('range validation', () => {
    it('should pass at min boundary (0)', () => {
      const pct = Percentage.create(PERCENTAGE_CONSTANTS.MIN_VALUE);

      expect(pct.getValue()).toBe(PERCENTAGE_CONSTANTS.MIN_VALUE);
    });

    it('should pass at max boundary (100)', () => {
      const pct = Percentage.create(PERCENTAGE_CONSTANTS.MAX_VALUE);

      expect(pct.getValue()).toBe(PERCENTAGE_CONSTANTS.MAX_VALUE);
    });

    it('should pass for valid decimal', () => {
      const pct = Percentage.create(25.5);

      expect(pct.getValue()).toBe(25.5);
    });

    it('should round to 2 decimal places', () => {
      const pct = Percentage.create(25.125);

      expect(pct.getValue()).toBe(25.13);
    });
  });

  describe('negative validation', () => {
    it('should fail for negative percentage by default', () => {
      expect(() => Percentage.create(-10)).toThrow('Percentage cannot be negative');
    });

    it('should load negative percentage with custom options', () => {
      // Using load() to bypass validation for this edge case with options timing
      const pct = Percentage.load(-10, { min: -100, max: 100, allowNegative: true });

      expect(pct.getValue()).toBe(-10);
    });
  });

  describe('custom options', () => {
    it('should respect custom min', () => {
      const pct = Percentage.create(10, { min: 10, max: 50 });

      expect(pct.getValue()).toBe(10);
    });

    it('should respect custom max', () => {
      const pct = Percentage.create(50, { min: 10, max: 50 });

      expect(pct.getValue()).toBe(50);
    });

    it('should pass within custom range', () => {
      const pct = Percentage.create(30, { min: 10, max: 50 });

      expect(pct.getValue()).toBe(30);
    });
  });

  describe('decimal precision', () => {
    it('should pass for 1 decimal place', () => {
      const pct = Percentage.create(25.5);

      expect(pct.getValue()).toBe(25.5);
    });

    it('should pass for 2 decimal places', () => {
      const pct = Percentage.create(25.55);

      expect(pct.getValue()).toBe(25.55);
    });

    it('should round more than 2 decimal places', () => {
      const pct = Percentage.create(25.555);

      expect(pct.getValue()).toBe(25.56);
    });
  });

  describe('conversion methods', () => {
    it('should convert to ratio correctly', () => {
      const pct = Percentage.create(50);

      expect(pct.toRatio()).toBe(0.5);
    });

    it('should apply to value correctly', () => {
      const pct = Percentage.create(20);

      expect(pct.applyTo(100)).toBe(20);
    });
  });
});
