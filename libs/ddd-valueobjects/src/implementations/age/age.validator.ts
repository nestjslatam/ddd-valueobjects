import { AbstractRuleValidator } from '@nestjslatam/ddd-lib';
import { Age } from './age.value-object';

interface AgeOptions {
  minAge: number;
  maxAge: number;
}

/**
 * Validator for Age Value Object
 */
export class AgeValidator extends AbstractRuleValidator<Age> {
  constructor(
    subject: Age,
    private readonly options: AgeOptions,
  ) {
    super(subject);
  }

  addRules(): void {
    const value = this.subject.getValue();

    // Get options safely
    const options = this.options || this.subject.getOptions();

    // Null/undefined validation
    if (value === null || value === undefined) {
      this.addBrokenRule('value', 'Age cannot be null or undefined');
      return;
    }

    // Number validation
    if (typeof value !== 'number' || isNaN(value)) {
      this.addBrokenRule('value', 'Age must be a valid number');
      return;
    }

    // Integer validation
    if (!Number.isInteger(value)) {
      this.addBrokenRule('value', 'Age must be a whole number');
    }

    // Negative validation
    if (value < 0) {
      this.addBrokenRule('value', 'Age cannot be negative');
    }

    // Min age validation
    if (value < options.minAge) {
      this.addBrokenRule('value', `Age must be at least ${options.minAge}`);
    }

    // Max age validation
    if (value > options.maxAge) {
      this.addBrokenRule('value', `Age cannot exceed ${options.maxAge}`);
    }
  }
}
