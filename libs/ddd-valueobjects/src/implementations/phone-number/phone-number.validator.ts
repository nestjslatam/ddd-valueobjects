import { AbstractRuleValidator } from '@nestjslatam/ddd-lib';
import { PhoneNumber } from './phone-number.value-object';
import { PHONE_NUMBER_CONSTRAINTS } from '../../constants';

interface PhoneNumberOptions {
  countryCode: string;
  format: 'international' | 'national';
}

/**
 * Validator for PhoneNumber Value Object
 */
export class PhoneNumberValidator extends AbstractRuleValidator<PhoneNumber> {
  constructor(
    subject: PhoneNumber,
    private readonly options: PhoneNumberOptions,
  ) {
    super(subject);
  }

  addRules(): void {
    const value = this.subject.getValue();

    // Guard against undefined options (can happen if validation runs before constructor completes)
    if (!this.options) {
      return;
    }

    // Empty validation
    if (!value || value.trim().length === 0) {
      this.addBrokenRule('value', 'Phone number cannot be empty');
      return;
    }

    // Extract digits only
    const digits = value.replace(/\D/g, '');

    // Minimum length validation
    if (digits.length < PHONE_NUMBER_CONSTRAINTS.MIN_DIGITS) {
      this.addBrokenRule(
        'value',
        `Phone number must have at least ${PHONE_NUMBER_CONSTRAINTS.MIN_DIGITS} digits`,
      );
    }

    // Maximum length validation
    if (digits.length > PHONE_NUMBER_CONSTRAINTS.MAX_DIGITS) {
      this.addBrokenRule(
        'value',
        `Phone number cannot exceed ${PHONE_NUMBER_CONSTRAINTS.MAX_DIGITS} digits`,
      );
    }

    // Format validation - allow digits, spaces, parentheses, dashes, plus
    if (!/^[\d\s\-\(\)\+]+$/.test(value)) {
      this.addBrokenRule('value', 'Phone number contains invalid characters');
    }

    // Country code validation for international format
    if (
      this.options.format === 'international' &&
      !value.startsWith('+') &&
      !value.startsWith(this.options.countryCode)
    ) {
      // Allow numbers without explicit country code if they're the right length
      if (digits.length !== PHONE_NUMBER_CONSTRAINTS.MIN_DIGITS) {
        this.addBrokenRule(
          'value',
          `Phone number must start with ${this.options.countryCode} for international format`,
        );
      }
    }

    // Check for sequential digits (e.g., 1234567890)
    if (digits.length >= PHONE_NUMBER_CONSTRAINTS.MIN_DIGITS) {
      const isSequential = /^0123456789|1234567890|9876543210/.test(digits);
      if (isSequential) {
        this.addBrokenRule('value', 'Phone number appears to be a sequential pattern');
      }
    }

    // Check for repeated digits (e.g., 1111111111)
    if (digits.length >= PHONE_NUMBER_CONSTRAINTS.MIN_DIGITS) {
      const isRepeated = /^(\d)\1+$/.test(digits);
      if (isRepeated) {
        this.addBrokenRule('value', 'Phone number cannot consist of repeated digits');
      }
    }
  }
}
