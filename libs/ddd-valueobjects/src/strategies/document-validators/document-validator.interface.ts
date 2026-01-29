import { DocumentIdType } from '../../implementations/document-id/document-id.value-object';

/**
 * Document Validation Result
 */
export interface DocumentValidationResult {
  isValid: boolean;
  errors: Array<{ field: string; message: string }>;
}

/**
 * Document Validator Strategy Interface
 * Defines the contract for document-specific validation strategies
 * Implements Strategy Pattern to replace switch statements (OCP compliance)
 */
export interface IDocumentValidatorStrategy {
  /**
   * The document type this strategy validates
   */
  readonly type: DocumentIdType;

  /**
   * Validates a document ID value
   * @param value - The document ID value to validate
   * @param country - Optional country code for country-specific validation
   * @returns ValidationResult with errors if any
   */
  validate(value: string, country?: string): DocumentValidationResult;

  /**
   * Cleans the document ID by removing formatting characters
   * @param value - The raw document ID value
   * @returns Cleaned value with only relevant characters
   */
  clean(value: string): string;
}
