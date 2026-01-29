import {
  IDocumentValidatorStrategy,
  DocumentValidationResult,
} from './document-validator.interface';
import { DOCUMENT_ID_CONSTRAINTS } from '../../constants';

/**
 * DNI (Documento Nacional de Identidad) Validator
 * Validates national identity documents common in Latin America
 */
export class DniValidatorStrategy implements IDocumentValidatorStrategy {
  readonly type = 'DNI' as const;

  clean(value: string): string {
    return value.replace(/[^0-9]/g, '');
  }

  validate(value: string, country?: string): DocumentValidationResult {
    const errors: Array<{ field: string; message: string }> = [];
    const clean = this.clean(value);

    // Length validation
    if (
      clean.length < DOCUMENT_ID_CONSTRAINTS.DNI.MIN_LENGTH ||
      clean.length > DOCUMENT_ID_CONSTRAINTS.DNI.MAX_LENGTH
    ) {
      errors.push({
        field: 'value',
        message: `DNI must be between ${DOCUMENT_ID_CONSTRAINTS.DNI.MIN_LENGTH} and ${DOCUMENT_ID_CONSTRAINTS.DNI.MAX_LENGTH} digits`,
      });
    }

    // Format validation
    if (!/^\d+$/.test(clean)) {
      errors.push({
        field: 'value',
        message: 'DNI must contain only digits',
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
      case 'ARG':
      case 'ARGENTINA':
        // Argentina DNI: 8 digits
        if (clean.length !== 8) {
          errors.push({
            field: 'value',
            message: 'Argentina DNI must be exactly 8 digits',
          });
        }
        break;

      case 'BRA':
      case 'BRAZIL':
        // Brazil CPF: 11 digits (but using DNI type)
        if (clean.length !== 9 && clean.length !== 11) {
          errors.push({
            field: 'value',
            message: 'Brazil DNI/CPF must be 9 or 11 digits',
          });
        }
        break;

      case 'CHL':
      case 'CHILE':
        // Chile RUT: 8-9 digits + verification digit
        if (clean.length !== 8 && clean.length !== 9) {
          errors.push({
            field: 'value',
            message: 'Chile RUT must be 8-9 characters',
          });
        }
        break;
    }
  }
}
