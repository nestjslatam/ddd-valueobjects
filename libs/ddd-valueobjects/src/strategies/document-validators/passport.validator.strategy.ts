import {
  IDocumentValidatorStrategy,
  DocumentValidationResult,
} from './document-validator.interface';
import { DOCUMENT_ID_CONSTRAINTS } from '../../constants';

/**
 * Passport Number Validator Strategy
 * Validates international passport numbers
 */
export class PassportValidatorStrategy implements IDocumentValidatorStrategy {
  readonly type = 'PASSPORT' as const;

  clean(value: string): string {
    return value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  }

  validate(value: string): DocumentValidationResult {
    const errors: Array<{ field: string; message: string }> = [];
    const clean = this.clean(value);

    // Length validation
    if (
      clean.length < DOCUMENT_ID_CONSTRAINTS.PASSPORT.MIN_LENGTH ||
      clean.length > DOCUMENT_ID_CONSTRAINTS.PASSPORT.MAX_LENGTH
    ) {
      errors.push({
        field: 'value',
        message: `Passport number must be between ${DOCUMENT_ID_CONSTRAINTS.PASSPORT.MIN_LENGTH} and ${DOCUMENT_ID_CONSTRAINTS.PASSPORT.MAX_LENGTH} characters`,
      });
    }

    // Format validation - alphanumeric only
    if (!/^[A-Z0-9]+$/i.test(clean)) {
      errors.push({
        field: 'value',
        message: 'Passport number must contain only letters and numbers',
      });
    }

    // Most passports start with 1-2 letters
    if (clean.length > 0 && !/^[A-Z]/.test(clean)) {
      errors.push({
        field: 'value',
        message: 'Passport number typically starts with a letter',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
