import {
  IDocumentValidatorStrategy,
  DocumentValidationResult,
} from './document-validator.interface';
import { DOCUMENT_ID_CONSTRAINTS } from '../../constants';

/**
 * SSN (Social Security Number) Validator Strategy
 * Validates US Social Security Numbers
 */
export class SsnValidatorStrategy implements IDocumentValidatorStrategy {
  readonly type = 'SSN' as const;

  clean(value: string): string {
    return value.replace(/[^0-9]/g, '');
  }

  validate(value: string): DocumentValidationResult {
    const errors: Array<{ field: string; message: string }> = [];
    const clean = this.clean(value);

    // Exact length validation
    if (clean.length !== DOCUMENT_ID_CONSTRAINTS.SSN.EXACT_LENGTH) {
      errors.push({
        field: 'value',
        message: `SSN must be exactly ${DOCUMENT_ID_CONSTRAINTS.SSN.EXACT_LENGTH} digits`,
      });
      return { isValid: false, errors };
    }

    // Invalid SSN patterns
    const invalidPatterns = ['000000000', '111111111', '123456789', '987654321'];
    if (invalidPatterns.includes(clean)) {
      errors.push({
        field: 'value',
        message: 'Invalid SSN pattern',
      });
    }

    // Area number validation (first 3 digits)
    const areaNumber = parseInt(clean.substring(0, 3), 10);
    if (areaNumber === 0 || areaNumber === 666 || areaNumber >= 900) {
      errors.push({
        field: 'value',
        message: 'Invalid SSN area number (000, 666, or 900-999 not allowed)',
      });
    }

    // Group number validation (middle 2 digits)
    const groupNumber = parseInt(clean.substring(3, 5), 10);
    if (groupNumber === 0) {
      errors.push({
        field: 'value',
        message: 'Invalid SSN group number (cannot be 00)',
      });
    }

    // Serial number validation (last 4 digits)
    const serialNumber = parseInt(clean.substring(5, 9), 10);
    if (serialNumber === 0) {
      errors.push({
        field: 'value',
        message: 'Invalid SSN serial number (cannot be 0000)',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
