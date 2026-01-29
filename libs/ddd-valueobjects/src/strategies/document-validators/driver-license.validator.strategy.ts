import {
  IDocumentValidatorStrategy,
  DocumentValidationResult,
} from './document-validator.interface';
import { DOCUMENT_ID_CONSTRAINTS } from '../../constants';

/**
 * Driver License Validator Strategy
 * Validates driver's license numbers (varies by jurisdiction)
 */
export class DriverLicenseValidatorStrategy implements IDocumentValidatorStrategy {
  readonly type = 'DRIVER_LICENSE' as const;

  clean(value: string): string {
    return value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  }

  validate(value: string): DocumentValidationResult {
    const errors: Array<{ field: string; message: string }> = [];
    const clean = this.clean(value);

    // Length validation
    if (
      clean.length < DOCUMENT_ID_CONSTRAINTS.DRIVER_LICENSE.MIN_LENGTH ||
      clean.length > DOCUMENT_ID_CONSTRAINTS.DRIVER_LICENSE.MAX_LENGTH
    ) {
      errors.push({
        field: 'value',
        message: `Driver License must be between ${DOCUMENT_ID_CONSTRAINTS.DRIVER_LICENSE.MIN_LENGTH} and ${DOCUMENT_ID_CONSTRAINTS.DRIVER_LICENSE.MAX_LENGTH} characters`,
      });
    }

    // Alphanumeric validation
    if (!/^[A-Z0-9]+$/i.test(clean)) {
      errors.push({
        field: 'value',
        message: 'Driver License must contain only letters and numbers',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
