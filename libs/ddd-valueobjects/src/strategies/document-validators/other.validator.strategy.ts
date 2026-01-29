import {
  IDocumentValidatorStrategy,
  DocumentValidationResult,
} from './document-validator.interface';

/**
 * Generic Document Validator Strategy
 * Validates generic/other document types with basic rules
 */
export class OtherDocumentValidatorStrategy implements IDocumentValidatorStrategy {
  readonly type = 'OTHER' as const;

  clean(value: string): string {
    return value.trim();
  }

  validate(value: string): DocumentValidationResult {
    const errors: Array<{ field: string; message: string }> = [];
    const clean = this.clean(value);

    // Basic length validation
    if (clean.length < 3 || clean.length > 50) {
      errors.push({
        field: 'value',
        message: 'Document ID must be between 3 and 50 characters',
      });
    }

    // No special characters validation (allow alphanumeric + common separators)
    if (!/^[A-Z0-9\s\-._/]+$/i.test(clean)) {
      errors.push({
        field: 'value',
        message: 'Document ID contains invalid characters',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
