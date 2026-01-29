import { AbstractRuleValidator } from '@nestjslatam/ddd-lib';
import { DocumentId } from './document-id.value-object';
import { DocumentValidatorRegistry } from '../../strategies';

/**
 * Validator for DocumentId Value Object
 * Uses Strategy Pattern for type-specific validation (OCP compliance)
 * No more switch statements - easily extensible!
 */
export class DocumentIdValidator extends AbstractRuleValidator<DocumentId> {
  addRules(): void {
    const props = this.subject.getValue();
    const { value, type, country } = props;

    // Empty validation
    if (!value || value.trim().length === 0) {
      this.addBrokenRule('value', 'Document ID cannot be empty');
      return;
    }

    // Type validation
    if (!type) {
      this.addBrokenRule('type', 'Document type is required');
      return;
    }

    // Get validation strategy for document type
    try {
      const strategy = DocumentValidatorRegistry.getStrategy(type);
      const result = strategy.validate(value, country);

      // Add any validation errors
      if (!result.isValid) {
        result.errors.forEach((err) => {
          this.addBrokenRule(err.field, err.message);
        });
      }
    } catch {
      this.addBrokenRule('type', `Unsupported document type: ${type}`);
    }
  }
}
