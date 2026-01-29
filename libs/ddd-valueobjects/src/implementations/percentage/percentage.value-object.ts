import { DddValueObject } from '@nestjslatam/ddd-lib';
import { PercentageValidator } from './percentage.validator';
import { PERCENTAGE_CONSTANTS, MONETARY_CONSTANTS } from '../../constants';

interface PercentageOptions {
  min: number;
  max: number;
  allowNegative: boolean;
}

/**
 * Percentage Value Object
 * Represents a percentage value (0-100 by default)
 */
export class Percentage extends DddValueObject<number> {
  private constructor(
    value: number,
    private readonly options: PercentageOptions = {
      min: PERCENTAGE_CONSTANTS.MIN_VALUE,
      max: PERCENTAGE_CONSTANTS.MAX_VALUE,
      allowNegative: false,
    },
  ) {
    super(value);
  }

  /**
   * Creates a new Percentage with validation
   */
  static create(value: number, options?: Partial<PercentageOptions>): Percentage {
    const percentage = new Percentage(
      Math.round(value * MONETARY_CONSTANTS.CENTS_MULTIPLIER) / MONETARY_CONSTANTS.CENTS_MULTIPLIER,
      {
        min: options?.min ?? PERCENTAGE_CONSTANTS.MIN_VALUE,
        max: options?.max ?? PERCENTAGE_CONSTANTS.MAX_VALUE,
        allowNegative: options?.allowNegative ?? false,
      },
    );
    percentage.addValidators();

    if (!percentage.isValid) {
      throw new Error(`Invalid Percentage: ${percentage.brokenRules.getBrokenRulesAsString()}`);
    }

    return percentage;
  }

  /**
   * Creates a percentage from a ratio (0.5 -> 50%)
   */
  static fromRatio(ratio: number, options?: Partial<PercentageOptions>): Percentage {
    return Percentage.create(ratio * PERCENTAGE_CONSTANTS.DECIMAL_MULTIPLIER, options);
  }

  /**
   * Creates a percentage from a fraction (1/4 -> 25%)
   */
  static fromFraction(
    numerator: number,
    denominator: number,
    options?: Partial<PercentageOptions>,
  ): Percentage {
    if (denominator === 0) {
      throw new Error('Denominator cannot be zero');
    }
    return Percentage.create((numerator / denominator) * 100, options);
  }

  /**
   * Loads a Percentage from persisted data
   */
  static load(value: number, options?: Partial<PercentageOptions>): Percentage {
    return new Percentage(value, {
      min: options?.min ?? PERCENTAGE_CONSTANTS.MIN_VALUE,
      max: options?.max ?? PERCENTAGE_CONSTANTS.MAX_VALUE,
      allowNegative: options?.allowNegative ?? false,
    });
  }

  /**
   * Creates zero percentage
   */
  static zero(options?: Partial<PercentageOptions>): Percentage {
    return Percentage.create(0, options);
  }

  /**
   * Creates 100% percentage
   */
  static oneHundred(options?: Partial<PercentageOptions>): Percentage {
    return Percentage.create(100, options);
  }

  getOptions(): PercentageOptions {
    return { ...this.options };
  }

  /**
   * Returns the percentage as a decimal (50% -> 0.5)
   */
  toDecimal(): number {
    return this.getValue() / 100;
  }

  /**
   * Returns the percentage as a ratio (50% -> 0.5)
   */
  toRatio(): number {
    return this.toDecimal();
  }

  /**
   * Applies this percentage to a number
   */
  applyTo(value: number): number {
    return value * this.toDecimal();
  }

  /**
   * Increases a number by this percentage (e.g., 100 + 20% = 120)
   */
  increase(value: number): number {
    return value * (1 + this.toDecimal());
  }

  /**
   * Decreases a number by this percentage (e.g., 100 - 20% = 80)
   */
  decrease(value: number): number {
    return value * (1 - this.toDecimal());
  }

  /**
   * Adds two percentages
   */
  add(other: Percentage): Percentage {
    return Percentage.create(this.getValue() + other.getValue(), this.options);
  }

  /**
   * Subtracts two percentages
   */
  subtract(other: Percentage): Percentage {
    return Percentage.create(this.getValue() - other.getValue(), this.options);
  }

  /**
   * Checks if percentage is zero
   */
  isZero(): boolean {
    return this.getValue() === 0;
  }

  /**
   * Checks if percentage is 100%
   */
  isOneHundred(): boolean {
    return this.getValue() === 100;
  }

  /**
   * Formats as string with symbol
   */
  format(decimalPlaces: number = 2): string {
    return `${this.getValue().toFixed(decimalPlaces)}%`;
  }

  addValidators(): void {
    this.validatorRules.add(new PercentageValidator(this, this.options));
  }

  protected getEqualityComponents(): Iterable<any> {
    return [this.getValue()];
  }

  toString(): string {
    return this.format();
  }

  toJSON(): number {
    return this.getValue();
  }
}
