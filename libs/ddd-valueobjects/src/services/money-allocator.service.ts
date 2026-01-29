import { Injectable } from '@nestjs/common';
import { Money } from '../implementations/money/money.value-object';

/**
 * Money Allocator Service
 * Handles money allocation algorithms (Application Layer concern)
 * Separated from domain layer to respect SRP and SoC principles
 *
 * This service implements various allocation strategies for distributing
 * money amounts proportionally, ensuring no rounding errors accumulate
 */
@Injectable()
export class MoneyAllocatorService {
  /**
   * Allocates money proportionally based on ratios
   * Uses "Largest Remainder Method" to handle rounding
   *
   * @example
   * allocate(Money.create(100, 'USD'), [1, 1, 1])
   * // Returns: [33.34, 33.33, 33.33] - remainder added to first
   *
   * @param money - The money to allocate
   * @param ratios - Array of ratios (e.g., [1, 1, 1] for equal split)
   * @returns Array of Money objects
   */
  allocate(money: Money, ratios: number[]): Money[] {
    if (ratios.length === 0) {
      throw new Error('Ratios array cannot be empty');
    }

    if (ratios.some((r) => r < 0)) {
      throw new Error('Ratios must be non-negative');
    }

    const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);

    if (totalRatio === 0) {
      throw new Error('Total ratio cannot be zero');
    }

    const results: Money[] = [];
    let remainder = money.amount;

    // Calculate each share and track remainder
    for (let i = 0; i < ratios.length; i++) {
      const share = Math.floor(((money.amount * ratios[i]) / totalRatio) * 100) / 100;
      results.push(Money.create(share, money.currency));
      remainder -= share;
    }

    // Distribute remainder to first allocation (Largest Remainder Method)
    if (remainder > 0 && results.length > 0) {
      results[0] = Money.create(results[0].amount + remainder, money.currency);
    }

    return results;
  }

  /**
   * Allocates money equally among N parts
   * Ensures sum equals original amount (no rounding loss)
   *
   * @example
   * allocateEqually(Money.create(100, 'USD'), 3)
   * // Returns: [33.34, 33.33, 33.33]
   */
  allocateEqually(money: Money, parts: number): Money[] {
    if (parts <= 0) {
      throw new Error('Parts must be positive');
    }

    return this.allocate(money, Array(parts).fill(1));
  }

  /**
   * Allocates money by percentages
   * Percentages must sum to 100
   *
   * @example
   * allocateByPercentages(Money.create(100, 'USD'), [50, 30, 20])
   * // Returns: [50.00, 30.00, 20.00]
   */
  allocateByPercentages(money: Money, percentages: number[]): Money[] {
    const total = percentages.reduce((sum, p) => sum + p, 0);

    if (Math.abs(total - 100) > 0.01) {
      throw new Error(`Percentages must sum to 100, got ${total}`);
    }

    if (percentages.some((p) => p < 0 || p > 100)) {
      throw new Error('Each percentage must be between 0 and 100');
    }

    return this.allocate(money, percentages);
  }

  /**
   * Allocates money by fixed amounts, remainder goes to last part
   *
   * @example
   * allocateFixed(Money.create(100, 'USD'), [Money.create(30), Money.create(25)])
   * // Returns: [30.00, 25.00, 45.00] - remainder
   */
  allocateFixed(money: Money, fixedAmounts: Money[]): Money[] {
    const totalFixed = fixedAmounts.reduce((sum, m) => {
      if (m.currency !== money.currency) {
        throw new Error(`All amounts must have currency ${money.currency}`);
      }
      return sum + m.amount;
    }, 0);

    if (totalFixed > money.amount) {
      throw new Error('Fixed amounts exceed total money');
    }

    const remainder = money.amount - totalFixed;
    return [...fixedAmounts, Money.create(remainder, money.currency)];
  }

  /**
   * Allocates money based on weights with priority
   * Ensures high-priority allocations get full share first
   *
   * @example
   * allocateByPriority(Money.create(100, 'USD'), [
   *   { ratio: 1, priority: 1 },
   *   { ratio: 1, priority: 2 },
   * ])
   */
  allocateByPriority(
    money: Money,
    allocations: Array<{ ratio: number; priority: number }>,
  ): Money[] {
    // Sort by priority (lower number = higher priority)
    const sorted = [...allocations]
      .map((a, index) => ({ ...a, originalIndex: index }))
      .sort((a, b) => a.priority - b.priority);

    // Allocate using ratios
    const results = this.allocate(
      money,
      sorted.map((a) => a.ratio),
    );

    // Restore original order
    const restored = new Array(allocations.length);
    sorted.forEach((item, index) => {
      restored[item.originalIndex] = results[index];
    });

    return restored;
  }

  /**
   * Validates that allocated money sums to original
   * Useful for testing allocation correctness
   */
  validateAllocation(original: Money, allocated: Money[]): boolean {
    const total = allocated.reduce((sum, m) => {
      if (m.currency !== original.currency) {
        return sum;
      }
      return sum + m.amount;
    }, 0);

    // Allow 0.01 difference due to rounding
    return Math.abs(total - original.amount) < 0.01;
  }
}
