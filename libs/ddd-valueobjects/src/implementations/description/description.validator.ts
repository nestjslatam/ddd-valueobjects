import { AbstractRuleValidator } from '@nestjslatam/ddd-lib';
import { Description } from './description.value-object';

/**
 * Validator for Description Value Object
 */
export class DescriptionValidator extends AbstractRuleValidator<Description> {
  addRules(): void {
    const value = this.subject.getValue();
    const trimmedValue = value?.trim() || '';
    const options = this.subject.getOptions();

    // Empty validation
    if (!options.allowEmpty && trimmedValue.length === 0) {
      this.addBrokenRule('value', 'Description cannot be empty');
      return;
    }

    // Skip other validations if empty is allowed and value is empty
    if (options.allowEmpty && trimmedValue.length === 0) {
      return;
    }

    // Min length validation
    if (trimmedValue.length < options.minLength) {
      this.addBrokenRule(
        'value',
        `Description must be at least ${options.minLength} characters (current: ${trimmedValue.length})`,
      );
    }

    // Max length validation
    if (trimmedValue.length > options.maxLength) {
      this.addBrokenRule(
        'value',
        `Description cannot exceed ${options.maxLength} characters (current: ${trimmedValue.length})`,
      );
    }

    // Content validation - no only special characters
    if (!/[a-zA-Z0-9]/.test(trimmedValue)) {
      this.addBrokenRule('value', 'Description must contain at least one alphanumeric character');
    }
  }
}
