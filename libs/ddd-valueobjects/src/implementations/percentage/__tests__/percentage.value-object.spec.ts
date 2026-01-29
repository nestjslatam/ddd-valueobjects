import { Percentage } from '../percentage.value-object';

describe('Percentage', () => {
  describe('create', () => {
    it('should create valid percentage', () => {
      const pct = Percentage.create(50);

      expect(pct.getValue()).toBe(50);
    });

    it('should create percentage with min boundary (0)', () => {
      const pct = Percentage.create(0);

      expect(pct.getValue()).toBe(0);
      expect(pct.isZero()).toBe(true);
    });

    it('should create percentage with max boundary (100)', () => {
      const pct = Percentage.create(100);

      expect(pct.getValue()).toBe(100);
    });

    it('should create percentage with decimals', () => {
      const pct = Percentage.create(25.5);

      expect(pct.getValue()).toBe(25.5);
    });

    it('should round to 2 decimal places', () => {
      const pct = Percentage.create(25.125);

      expect(pct.getValue()).toBe(25.13);
    });

    it('should create zero percentage', () => {
      const pct = Percentage.zero();

      expect(pct.getValue()).toBe(0);
      expect(pct.isZero()).toBe(true);
    });

    it('should create 100% percentage', () => {
      const pct = Percentage.oneHundred();

      expect(pct.getValue()).toBe(100);
    });

    it('should load percentage without validation', () => {
      const pct = Percentage.load(150);

      expect(pct.getValue()).toBe(150);
    });
  });

  describe('fromRatio', () => {
    it('should create percentage from ratio', () => {
      const pct = Percentage.fromRatio(0.5);

      expect(pct.getValue()).toBe(50);
    });

    it('should create percentage from ratio 0.25 (25%)', () => {
      const pct = Percentage.fromRatio(0.25);

      expect(pct.getValue()).toBe(25);
    });

    it('should create percentage from ratio 1 (100%)', () => {
      const pct = Percentage.fromRatio(1);

      expect(pct.getValue()).toBe(100);
    });
  });

  describe('fromFraction', () => {
    it('should create percentage from fraction', () => {
      const pct = Percentage.fromFraction(1, 4);

      expect(pct.getValue()).toBe(25);
    });

    it('should create percentage from fraction 3/4', () => {
      const pct = Percentage.fromFraction(3, 4);

      expect(pct.getValue()).toBe(75);
    });

    it('should throw error for zero denominator', () => {
      expect(() => Percentage.fromFraction(1, 0)).toThrow('Denominator cannot be zero');
    });
  });

  describe('conversion methods', () => {
    it('should convert to decimal', () => {
      const pct = Percentage.create(50);

      expect(pct.toDecimal()).toBe(0.5);
    });

    it('should convert to ratio (same as decimal)', () => {
      const pct = Percentage.create(25);

      expect(pct.toRatio()).toBe(0.25);
    });

    it('should apply to value', () => {
      const pct = Percentage.create(20);

      expect(pct.applyTo(100)).toBe(20);
    });

    it('should increase value by percentage', () => {
      const pct = Percentage.create(20);

      expect(pct.increase(100)).toBe(120);
    });

    it('should decrease value by percentage', () => {
      const pct = Percentage.create(20);

      expect(pct.decrease(100)).toBe(80);
    });
  });

  describe('arithmetic operations', () => {
    it('should add percentages', () => {
      const pct1 = Percentage.create(30);
      const pct2 = Percentage.create(20);

      const result = pct1.add(pct2);

      expect(result.getValue()).toBe(50);
    });

    it('should subtract percentages', () => {
      const pct1 = Percentage.create(50);
      const pct2 = Percentage.create(20);

      const result = pct1.subtract(pct2);

      expect(result.getValue()).toBe(30);
    });
  });

  describe('comparison methods', () => {
    it('should detect zero percentage', () => {
      const pct = Percentage.create(0);

      expect(pct.isZero()).toBe(true);
    });

    it('should detect non-zero percentage', () => {
      const pct = Percentage.create(50);

      expect(pct.isZero()).toBe(false);
    });
  });

  describe('equality', () => {
    it('should be equal for same percentage', () => {
      const pct1 = Percentage.create(50);
      const pct2 = Percentage.create(50);

      expect(pct1.equals(pct2)).toBe(true);
    });

    it('should not be equal for different percentages', () => {
      const pct1 = Percentage.create(50);
      const pct2 = Percentage.create(75);

      expect(pct1.equals(pct2)).toBe(false);
    });
  });

  describe('serialization', () => {
    it('should serialize to string', () => {
      const pct = Percentage.create(50);

      expect(pct.toString()).toBe('50.00%');
    });

    it('should serialize to JSON', () => {
      const pct = Percentage.create(75.5);

      expect(pct.toJSON()).toBe(75.5);
    });
  });
});
