import { AbstractRuleValidator } from '@nestjslatam/ddd-lib';
import { Percentage } from './percentage.value-object';
import { MONETARY_CONSTANTS } from '../../constants';

interface PercentageOptions {
  min: number;
  max: number;
  allowNegative: boolean;
}

/**
 * Validator for Percentage Value Object
 */
export class PercentageValidator extends AbstractRuleValidator<Percentage> {
  constructor(
    subject: Percentage,
    private readonly options: PercentageOptions,
  ) {
    super(subject);
  }

  addRules(): void {
    const value = this.subject.getValue();

    // Get options safely
    const options = this.options || this.subject.getOptions();

    // Null/undefined validation
    if (value === null || value === undefined) {
      this.addBrokenRule('value', 'Percentage cannot be null or undefined');
      return;
    }

    // Number validation
    if (typeof value !== 'number' || isNaN(value)) {
      this.addBrokenRule('value', 'Percentage must be a valid number');
      return;
    }

    // Infinity validation
    if (!isFinite(value)) {
      this.addBrokenRule('value', 'Percentage must be finite');
      return;
    }

    // Negative validation
    if (!options.allowNegative && value < 0) {
      this.addBrokenRule('value', 'Percentage cannot be negative');
    }

    // Min validation
    if (value < options.min) {
      this.addBrokenRule('value', `Percentage must be at least ${options.min}% (got ${value}%)`);
    }

    // Max validation
    if (value > options.max) {
      this.addBrokenRule('value', `Percentage cannot exceed ${options.max}% (got ${value}%)`);
    }

    // Decimal precision validation (max 2 decimal places)
    const decimalPlaces = (value.toString().split('.')[1] || '').length;
    if (decimalPlaces > MONETARY_CONSTANTS.STANDARD_DECIMAL_PLACES) {
      this.addBrokenRule(
        'value',
        `Percentage cannot have more than ${MONETARY_CONSTANTS.STANDARD_DECIMAL_PLACES} decimal places`,
      );
    }
  }
}
