import { AbstractRuleValidator } from '@nestjslatam/ddd-lib';
import { BirthDate } from './birth-date.value-object';
import { BIRTH_DATE_CONSTRAINTS } from '../../constants';

/**
 * Validator for BirthDate Value Object
 */
export class BirthDateValidator extends AbstractRuleValidator<BirthDate> {
  addRules(): void {
    const value = this.subject.getValue();

    // Null/undefined validation
    if (!value) {
      this.addBrokenRule('value', 'Birth date cannot be null or undefined');
      return;
    }

    // Valid date validation
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      this.addBrokenRule('value', 'Birth date must be a valid date');
      return;
    }

    const now = new Date();

    // Future date validation
    if (value > now) {
      this.addBrokenRule('value', 'Birth date cannot be in the future');
    }

    // Reasonable past date validation (e.g., not before 1900)
    const minDate = new Date(`${BIRTH_DATE_CONSTRAINTS.MIN_BIRTH_YEAR}-01-01`);
    if (value < minDate) {
      this.addBrokenRule(
        'value',
        `Birth date cannot be before year ${BIRTH_DATE_CONSTRAINTS.MIN_BIRTH_YEAR}`,
      );
    }

    // Age validation - maximum reasonable age (150 years)
    const maxAgeDate = new Date();
    maxAgeDate.setFullYear(maxAgeDate.getFullYear() - BIRTH_DATE_CONSTRAINTS.MAX_AGE);

    if (value < maxAgeDate) {
      this.addBrokenRule(
        'value',
        `Birth date indicates age over ${BIRTH_DATE_CONSTRAINTS.MAX_AGE} years, which is not reasonable`,
      );
    }

    // Calculate age
    let age = now.getFullYear() - value.getFullYear();
    const monthDiff = now.getMonth() - value.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < value.getDate())) {
      age--;
    }

    // Newborn validation - at least 0 years old (born today is valid)
    if (age < 0) {
      this.addBrokenRule('value', 'Birth date cannot be in the future');
    }
  }
}
