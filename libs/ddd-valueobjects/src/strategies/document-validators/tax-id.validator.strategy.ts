import {
  IDocumentValidatorStrategy,
  DocumentValidationResult,
} from './document-validator.interface';
import { DOCUMENT_ID_CONSTRAINTS } from '../../constants';

/**
 * Tax ID Validator Strategy
 * Validates tax identification numbers (EIN, VAT, etc.)
 */
export class TaxIdValidatorStrategy implements IDocumentValidatorStrategy {
  readonly type = 'TAX_ID' as const;

  clean(value: string): string {
    return value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  }

  validate(value: string, country?: string): DocumentValidationResult {
    const errors: Array<{ field: string; message: string }> = [];
    const clean = this.clean(value);

    // Length validation
    if (
      clean.length < DOCUMENT_ID_CONSTRAINTS.TAX_ID.MIN_LENGTH ||
      clean.length > DOCUMENT_ID_CONSTRAINTS.TAX_ID.MAX_LENGTH
    ) {
      errors.push({
        field: 'value',
        message: `Tax ID must be between ${DOCUMENT_ID_CONSTRAINTS.TAX_ID.MIN_LENGTH} and ${DOCUMENT_ID_CONSTRAINTS.TAX_ID.MAX_LENGTH} characters`,
      });
    }

    // Country-specific validation
    if (country) {
      this.validateCountrySpecific(clean, country, errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private validateCountrySpecific(
    clean: string,
    country: string,
    errors: Array<{ field: string; message: string }>,
  ): void {
    switch (country.toUpperCase()) {
      case 'USA':
        // EIN: 9 digits (XX-XXXXXXX)
        if (clean.length !== 9 || !/^\d{9}$/.test(clean)) {
          errors.push({
            field: 'value',
            message: 'US EIN must be exactly 9 digits',
          });
        }
        break;

      case 'GBR':
      case 'UK':
        // UK VAT: 9 or 12 digits
        if ((clean.length !== 9 && clean.length !== 12) || !/^\d+$/.test(clean)) {
          errors.push({
            field: 'value',
            message: 'UK VAT must be 9 or 12 digits',
          });
        }
        break;
    }
  }
}
