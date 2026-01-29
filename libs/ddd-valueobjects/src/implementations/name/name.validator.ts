import { AbstractRuleValidator } from '@nestjslatam/ddd-lib';
import { Name } from './name.value-object';
import { NAME_CONSTRAINTS } from '../../constants';

/**
 * Validator for Name Value Object
 * Validates name constraints and business rules
 */
export class NameValidator extends AbstractRuleValidator<Name> {
  addRules(): void {
    const value = this.subject.getValue();

    // First name validation
    if (!value.firstName || value.firstName.trim().length === 0) {
      this.addBrokenRule('firstName', 'First name cannot be empty');
    } else if (value.firstName.length < NAME_CONSTRAINTS.MIN_FIRST_NAME_LENGTH) {
      this.addBrokenRule(
        'firstName',
        `First name must be at least ${NAME_CONSTRAINTS.MIN_FIRST_NAME_LENGTH} characters`,
      );
    } else if (value.firstName.length > NAME_CONSTRAINTS.MAX_FIRST_NAME_LENGTH) {
      this.addBrokenRule(
        'firstName',
        `First name cannot exceed ${NAME_CONSTRAINTS.MAX_FIRST_NAME_LENGTH} characters`,
      );
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(value.firstName)) {
      this.addBrokenRule('firstName', 'First name contains invalid characters');
    }

    // Last name validation
    if (!value.lastName || value.lastName.trim().length === 0) {
      this.addBrokenRule('lastName', 'Last name cannot be empty');
    } else if (value.lastName.length < NAME_CONSTRAINTS.MIN_LAST_NAME_LENGTH) {
      this.addBrokenRule(
        'lastName',
        `Last name must be at least ${NAME_CONSTRAINTS.MIN_LAST_NAME_LENGTH} characters`,
      );
    } else if (value.lastName.length > NAME_CONSTRAINTS.MAX_LAST_NAME_LENGTH) {
      this.addBrokenRule(
        'lastName',
        `Last name cannot exceed ${NAME_CONSTRAINTS.MAX_LAST_NAME_LENGTH} characters`,
      );
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(value.lastName)) {
      this.addBrokenRule('lastName', 'Last name contains invalid characters');
    }

    // Middle name validation (optional)
    if (value.middleName) {
      if (value.middleName.length > NAME_CONSTRAINTS.MAX_LENGTH) {
        this.addBrokenRule(
          'middleName',
          `Middle name cannot exceed ${NAME_CONSTRAINTS.MAX_LENGTH} characters`,
        );
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(value.middleName)) {
        this.addBrokenRule('middleName', 'Middle name contains invalid characters');
      }
    }
  }
}
