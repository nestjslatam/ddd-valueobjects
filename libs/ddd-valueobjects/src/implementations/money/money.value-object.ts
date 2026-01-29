import { DddValueObject } from '@nestjslatam/ddd-lib';
import { MoneyValidator } from './money.validator';
import { MONETARY_CONSTANTS } from '../../constants';

interface MoneyProps {
  amount: number;
  currency: string;
}

/**
 * Money Value Object
 * Represents a monetary amount with currency
 */
export class Money extends DddValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  /**
   * Creates a new Money with validation
   */
  static create(amount: number, currency: string = 'USD'): Money {
    const money = new Money({
      amount:
        Math.round(amount * MONETARY_CONSTANTS.CENTS_MULTIPLIER) /
        MONETARY_CONSTANTS.CENTS_MULTIPLIER,
      currency: currency.toUpperCase(),
    });
    money.addValidators();

    if (!money.isValid) {
      throw new Error(`Invalid Money: ${money.brokenRules.getBrokenRulesAsString()}`);
    }

    return money;
  }

  /**
   * Loads Money from persisted data
   */
  static load(amount: number, currency: string = 'USD'): Money {
    return new Money({ amount, currency });
  }

  /**
   * Creates zero money
   */
  static zero(currency: string = 'USD'): Money {
    return Money.create(0, currency);
  }

  get amount(): number {
    return this.getValue().amount;
  }

  get currency(): string {
    return this.getValue().currency;
  }

  /**
   * Adds two Money values (must be same currency)
   */
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot add different currencies: ${this.currency} and ${other.currency}`);
    }
    return Money.create(this.amount + other.amount, this.currency);
  }

  /**
   * Subtracts two Money values (must be same currency)
   */
  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(
        `Cannot subtract different currencies: ${this.currency} and ${other.currency}`,
      );
    }
    return Money.create(this.amount - other.amount, this.currency);
  }

  /**
   * Multiplies money by a factor
   */
  multiply(factor: number): Money {
    return Money.create(this.amount * factor, this.currency);
  }

  /**
   * Divides money by a divisor
   */
  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return Money.create(this.amount / divisor, this.currency);
  }

  /**
   * Checks if amount is zero
   */
  isZero(): boolean {
    return this.amount === 0;
  }

  /**
   * Checks if amount is positive
   */
  isPositive(): boolean {
    return this.amount > 0;
  }

  /**
   * Checks if amount is negative
   */
  isNegative(): boolean {
    return this.amount < 0;
  }

  addValidators(): void {
    this.validatorRules.add(new MoneyValidator(this));
  }

  protected getEqualityComponents(): Iterable<any> {
    const props = this.getValue();
    return [props.amount, props.currency];
  }

  toString(): string {
    return `${this.amount} ${this.currency}`;
  }

  toJSON(): MoneyProps {
    return this.getValue();
  }
}
