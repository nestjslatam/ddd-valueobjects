import { DocumentIdType } from '../../implementations/document-id/document-id.value-object';
import { IDocumentValidatorStrategy } from './document-validator.interface';
import { DniValidatorStrategy } from './dni.validator.strategy';
import { PassportValidatorStrategy } from './passport.validator.strategy';
import { SsnValidatorStrategy } from './ssn.validator.strategy';
import { TaxIdValidatorStrategy } from './tax-id.validator.strategy';
import { DriverLicenseValidatorStrategy } from './driver-license.validator.strategy';
import { OtherDocumentValidatorStrategy } from './other.validator.strategy';

/**
 * Document Validator Registry
 * Manages document validation strategies using Strategy Pattern
 * Eliminates switch statements and enables easy extension (OCP)
 */
export class DocumentValidatorRegistry {
  private static readonly strategies = new Map<DocumentIdType, IDocumentValidatorStrategy>([
    ['DNI', new DniValidatorStrategy()],
    ['PASSPORT', new PassportValidatorStrategy()],
    ['SSN', new SsnValidatorStrategy()],
    ['TAX_ID', new TaxIdValidatorStrategy()],
    ['DRIVER_LICENSE', new DriverLicenseValidatorStrategy()],
    ['OTHER', new OtherDocumentValidatorStrategy()],
  ]);

  /**
   * Gets the validator strategy for a document type
   * @throws Error if no strategy exists for the type
   */
  static getStrategy(type: DocumentIdType): IDocumentValidatorStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`No validation strategy found for document type: ${type}`);
    }
    return strategy;
  }

  /**
   * Registers a new custom validation strategy
   * Enables extension without modification (OCP)
   */
  static registerStrategy(strategy: IDocumentValidatorStrategy): void {
    this.strategies.set(strategy.type, strategy);
  }

  /**
   * Gets all registered document types
   */
  static getRegisteredTypes(): DocumentIdType[] {
    return Array.from(this.strategies.keys());
  }

  /**
   * Checks if a strategy exists for a document type
   */
  static hasStrategy(type: DocumentIdType): boolean {
    return this.strategies.has(type);
  }
}
