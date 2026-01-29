import { AbstractRuleValidator } from '@nestjslatam/ddd-lib';
import { Description } from './description.value-object';

interface DescriptionOptions {
  minLength: number;
  maxLength: number;
  allowEmpty: boolean;
}

/**
 * Validator for Description Value Object
 */
export class DescriptionValidator extends AbstractRuleValidator<Description> {
  private readonly options: DescriptionOptions;

  constructor(subject: Description, options: DescriptionOptions) {
    super(subject);
    this.options = options;
  }

  addRules(): void {
    const value = this.subject.getValue();
    const trimmedValue = value?.trim() || '';

    // Empty validation
    if (!this.options.allowEmpty && trimmedValue.length === 0) {
      this.addBrokenRule('value', 'Description cannot be empty');
      return;
    }

    // Skip other validations if empty is allowed and value is empty
    if (this.options.allowEmpty && trimmedValue.length === 0) {
      return;
    }

    // Min length validation
    if (trimmedValue.length < this.options.minLength) {
      this.addBrokenRule(
        'value',
        `Description must be at least ${this.options.minLength} characters (current: ${trimmedValue.length})`,
      );
    }

    // Max length validation
    if (trimmedValue.length > this.options.maxLength) {
      this.addBrokenRule(
        'value',
        `Description cannot exceed ${this.options.maxLength} characters (current: ${trimmedValue.length})`,
      );
    }
    if (!/[a-zA-Z0-9]/.test(trimmedValue)) {
      this.addBrokenRule('value', 'Description must contain at least one alphanumeric character');
    }
  }
}
