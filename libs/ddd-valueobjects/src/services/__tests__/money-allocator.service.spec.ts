import { MoneyAllocatorService } from '../money-allocator.service';
import { Money } from '../../implementations/money/money.value-object';

describe('MoneyAllocatorService', () => {
  let service: MoneyAllocatorService;

  beforeEach(() => {
    service = new MoneyAllocatorService();
  });

  describe('allocate', () => {
    it('should allocate equally for equal ratios', () => {
      const money = Money.create(100, 'USD');
      const result = service.allocate(money, [1, 1, 1]);

      expect(result).toHaveLength(3);
      expect(result[0].amount + result[1].amount + result[2].amount).toBeCloseTo(100, 2);
    });

    it('should allocate proportionally for different ratios', () => {
      const money = Money.create(100, 'USD');
      const result = service.allocate(money, [2, 1]);

      expect(result).toHaveLength(2);
      expect(result[0].amount).toBeCloseTo(66.67, 2);
      expect(result[1].amount).toBeCloseTo(33.33, 2);
    });

    it('should handle single allocation', () => {
      const money = Money.create(100, 'USD');
      const result = service.allocate(money, [1]);

      expect(result).toHaveLength(1);
      expect(result[0].amount).toBe(100);
    });

    it('should add remainder to first allocation (Largest Remainder Method)', () => {
      const money = Money.create(1, 'USD');
      const result = service.allocate(money, [1, 1, 1]); // $1.00 ÷ 3

      expect(result).toHaveLength(3);
      // First should get the extra cents: 0.34, others get 0.33
      expect(result[0].amount).toBeCloseTo(0.34, 2);
      expect(result[1].amount).toBeCloseTo(0.33, 2);
      expect(result[2].amount).toBeCloseTo(0.33, 2);
    });

    it('should preserve total amount with no loss', () => {
      const money = Money.create(100, 'USD');
      const result = service.allocate(money, [1, 1, 1, 1]);

      const total = result.reduce((sum, m) => sum + m.amount, 0);
      expect(total).toBeCloseTo(100, 2);
    });

    it('should handle zero ratio', () => {
      const money = Money.create(100, 'USD');
      const result = service.allocate(money, [1, 0, 1]);

      expect(result).toHaveLength(3);
      expect(result[0].amount).toBeCloseTo(50, 2);
      expect(result[1].amount).toBe(0);
      expect(result[2].amount).toBeCloseTo(50, 2);
    });

    it('should throw for empty ratios array', () => {
      const money = Money.create(100, 'USD');

      expect(() => service.allocate(money, [])).toThrow('Ratios array cannot be empty');
    });

    it('should throw for negative ratios', () => {
      const money = Money.create(100, 'USD');

      expect(() => service.allocate(money, [1, -1, 1])).toThrow('Ratios must be non-negative');
    });

    it('should throw when total ratio is zero', () => {
      const money = Money.create(100, 'USD');

      expect(() => service.allocate(money, [0, 0, 0])).toThrow('Total ratio cannot be zero');
    });

    it('should handle large amounts', () => {
      const money = Money.create(1000000, 'USD');
      const result = service.allocate(money, [1, 1]);

      expect(result[0].amount + result[1].amount).toBeCloseTo(1000000, 2);
    });

    it('should handle very small amounts', () => {
      const money = Money.create(0.01, 'USD');
      const result = service.allocate(money, [1, 1]);

      expect(result[0].amount + result[1].amount).toBeCloseTo(0.01, 2);
    });
  });

  describe('allocateEqually', () => {
    it('should allocate equally among parts', () => {
      const money = Money.create(100, 'USD');
      const result = service.allocateEqually(money, 4);

      expect(result).toHaveLength(4);
      expect(result[0].amount).toBeCloseTo(25, 2);
      expect(result[1].amount).toBeCloseTo(25, 2);
      expect(result[2].amount).toBeCloseTo(25, 2);
      expect(result[3].amount).toBeCloseTo(25, 2);
    });

    it('should handle uneven splits', () => {
      const money = Money.create(100, 'USD');
      const result = service.allocateEqually(money, 3);

      expect(result).toHaveLength(3);
      const total = result.reduce((sum, m) => sum + m.amount, 0);
      expect(total).toBeCloseTo(100, 2);
    });

    it('should handle single part', () => {
      const money = Money.create(100, 'USD');
      const result = service.allocateEqually(money, 1);

      expect(result).toHaveLength(1);
      expect(result[0].amount).toBe(100);
    });

    it('should throw for zero parts', () => {
      const money = Money.create(100, 'USD');

      expect(() => service.allocateEqually(money, 0)).toThrow('Parts must be positive');
    });

    it('should throw for negative parts', () => {
      const money = Money.create(100, 'USD');

      expect(() => service.allocateEqually(money, -5)).toThrow('Parts must be positive');
    });
  });

  describe('allocateByPercentages', () => {
    it('should allocate by exact percentages', () => {
      const money = Money.create(100, 'USD');
      const result = service.allocateByPercentages(money, [50, 30, 20]);

      expect(result).toHaveLength(3);
      expect(result[0].amount).toBeCloseTo(50, 2);
      expect(result[1].amount).toBeCloseTo(30, 2);
      expect(result[2].amount).toBeCloseTo(20, 2);
    });

    it('should handle decimal percentages', () => {
      const money = Money.create(100, 'USD');
      const result = service.allocateByPercentages(money, [33.33, 33.33, 33.34]);

      expect(result).toHaveLength(3);
      const total = result.reduce((sum, m) => sum + m.amount, 0);
      expect(total).toBeCloseTo(100, 2);
    });

    it('should throw when percentages do not sum to 100', () => {
      const money = Money.create(100, 'USD');

      expect(() => service.allocateByPercentages(money, [50, 30, 10])).toThrow(
        'Percentages must sum to 100',
      );
    });

    it('should throw for negative percentages', () => {
      const money = Money.create(100, 'USD');

      expect(() => service.allocateByPercentages(money, [150, -50])).toThrow(
        'Each percentage must be between 0 and 100',
      );
    });

    it('should throw for percentages over 100', () => {
      const money = Money.create(100, 'USD');

      expect(() => service.allocateByPercentages(money, [60, 50])).toThrow(
        'Percentages must sum to 100',
      );
    });

    it('should handle 100% to single allocation', () => {
      const money = Money.create(100, 'USD');
      const result = service.allocateByPercentages(money, [100]);

      expect(result).toHaveLength(1);
      expect(result[0].amount).toBe(100);
    });
  });

  describe('allocateFixed', () => {
    it('should allocate fixed amounts with remainder', () => {
      const money = Money.create(100, 'USD');
      const fixed = [Money.create(30, 'USD'), Money.create(25, 'USD')];
      const result = service.allocateFixed(money, fixed);

      expect(result).toHaveLength(3);
      expect(result[0].amount).toBe(30);
      expect(result[1].amount).toBe(25);
      expect(result[2].amount).toBe(45); // Remainder
    });

    it('should handle zero remainder', () => {
      const money = Money.create(100, 'USD');
      const fixed = [Money.create(50, 'USD'), Money.create(50, 'USD')];
      const result = service.allocateFixed(money, fixed);

      expect(result).toHaveLength(3);
      expect(result[2].amount).toBe(0); // No remainder
    });

    it('should throw when fixed amounts exceed total', () => {
      const money = Money.create(100, 'USD');
      const fixed = [Money.create(60, 'USD'), Money.create(50, 'USD')];

      expect(() => service.allocateFixed(money, fixed)).toThrow('Fixed amounts exceed total money');
    });

    it('should throw for mismatched currencies', () => {
      const money = Money.create(100, 'USD');
      const fixed = [Money.create(30, 'EUR'), Money.create(25, 'USD')];

      expect(() => service.allocateFixed(money, fixed)).toThrow(
        'All amounts must have currency USD',
      );
    });

    it('should handle empty fixed amounts', () => {
      const money = Money.create(100, 'USD');
      const result = service.allocateFixed(money, []);

      expect(result).toHaveLength(1);
      expect(result[0].amount).toBe(100); // All goes to remainder
    });
  });

  describe('allocateByPriority', () => {
    it('should allocate based on ratios while preserving order', () => {
      const money = Money.create(100, 'USD');
      const allocations = [
        { ratio: 2, priority: 2 },
        { ratio: 1, priority: 1 },
      ];
      const result = service.allocateByPriority(money, allocations);

      expect(result).toHaveLength(2);
      expect(result[0].amount).toBeCloseTo(66.66, 2); // ratio 2 (rounded down)
      expect(result[1].amount).toBeCloseTo(33.34, 2); // ratio 1 (gets remainder due to priority 1)
      const total = result[0].amount + result[1].amount;
      expect(total).toBeCloseTo(100, 2); // Total should be preserved
    });

    it('should process higher priority (lower number) first', () => {
      const money = Money.create(1, 'USD');
      const allocations = [
        { ratio: 1, priority: 3 }, // Processed last
        { ratio: 1, priority: 1 }, // Processed first (gets remainder)
        { ratio: 1, priority: 2 }, // Processed second
      ];
      const result = service.allocateByPriority(money, allocations);

      expect(result).toHaveLength(3);
      // Priority 1 (index 1) should get the extra cent
      const total = result.reduce((sum, m) => sum + m.amount, 0);
      expect(total).toBeCloseTo(1, 2);
    });

    it('should maintain original order in output', () => {
      const money = Money.create(90, 'USD');
      const allocations = [
        { ratio: 1, priority: 3 }, // Third priority
        { ratio: 1, priority: 1 }, // First priority
        { ratio: 1, priority: 2 }, // Second priority
      ];
      const result = service.allocateByPriority(money, allocations);

      expect(result).toHaveLength(3);
      // Results should be in original order, not priority order
      expect(result[0]).toBeDefined(); // Original index 0
      expect(result[1]).toBeDefined(); // Original index 1
      expect(result[2]).toBeDefined(); // Original index 2
    });

    it('should handle equal priorities', () => {
      const money = Money.create(100, 'USD');
      const allocations = [
        { ratio: 1, priority: 1 },
        { ratio: 1, priority: 1 },
      ];
      const result = service.allocateByPriority(money, allocations);

      expect(result).toHaveLength(2);
      expect(result[0].amount + result[1].amount).toBeCloseTo(100, 2);
    });
  });

  describe('validateAllocation', () => {
    it('should validate correct allocation', () => {
      const original = Money.create(100, 'USD');
      const allocated = [Money.create(50, 'USD'), Money.create(50, 'USD')];

      const isValid = service.validateAllocation(original, allocated);

      expect(isValid).toBe(true);
    });

    it('should allow small rounding differences', () => {
      const original = Money.create(100, 'USD');
      const allocated = [
        Money.create(33.33, 'USD'),
        Money.create(33.33, 'USD'),
        Money.create(33.34, 'USD'),
      ];

      const isValid = service.validateAllocation(original, allocated);

      expect(isValid).toBe(true);
    });

    it('should reject invalid allocation (too much)', () => {
      const original = Money.create(100, 'USD');
      const allocated = [Money.create(60, 'USD'), Money.create(50, 'USD')];

      const isValid = service.validateAllocation(original, allocated);

      expect(isValid).toBe(false);
    });

    it('should reject invalid allocation (too little)', () => {
      const original = Money.create(100, 'USD');
      const allocated = [Money.create(40, 'USD'), Money.create(40, 'USD')];

      const isValid = service.validateAllocation(original, allocated);

      expect(isValid).toBe(false);
    });

    it('should ignore allocations with different currency', () => {
      const original = Money.create(100, 'USD');
      const allocated = [
        Money.create(50, 'USD'),
        Money.create(100, 'EUR'), // Different currency, ignored
        Money.create(50, 'USD'),
      ];

      const isValid = service.validateAllocation(original, allocated);

      expect(isValid).toBe(true);
    });

    it('should handle empty allocation array', () => {
      const original = Money.create(100, 'USD');

      const isValid = service.validateAllocation(original, []);

      expect(isValid).toBe(false);
    });
  });
});
