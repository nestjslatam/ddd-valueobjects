import { DddValueObject } from '@nestjslatam/ddd-lib';
import { DocumentIdValidator } from './document-id.validator';

export type DocumentIdType = 'DNI' | 'PASSPORT' | 'SSN' | 'TAX_ID' | 'DRIVER_LICENSE' | 'OTHER';

interface DocumentIdProps {
  value: string;
  type: DocumentIdType;
  country?: string;
}

/**
 * DocumentId Value Object
 * Represents a government-issued document identifier
 */
export class DocumentId extends DddValueObject<DocumentIdProps> {
  private constructor(props: DocumentIdProps) {
    super(props);
  }

  /**
   * Creates a new DocumentId with validation
   */
  static create(value: string, type: DocumentIdType, country?: string): DocumentId {
    const documentId = new DocumentId({
      value: value?.trim() || '',
      type,
      country,
    });
    documentId.addValidators();

    if (!documentId.isValid) {
      throw new Error(`Invalid DocumentId: ${documentId.brokenRules.getBrokenRulesAsString()}`);
    }

    return documentId;
  }

  /**
   * Loads a DocumentId from persisted data
   */
  static load(value: string, type: DocumentIdType, country?: string): DocumentId {
    return new DocumentId({ value, type, country });
  }

  /**
   * Creates a DNI (Documento Nacional de Identidad) - common in Latin America
   */
  static createDNI(value: string, country?: string): DocumentId {
    return DocumentId.create(value, 'DNI', country);
  }

  /**
   * Creates a Passport number
   */
  static createPassport(value: string, country?: string): DocumentId {
    return DocumentId.create(value, 'PASSPORT', country);
  }

  /**
   * Creates a SSN (Social Security Number) - USA
   */
  static createSSN(value: string): DocumentId {
    return DocumentId.create(value, 'SSN', 'USA');
  }

  get value(): string {
    return this.getValue().value;
  }

  get type(): DocumentIdType {
    return this.getValue().type;
  }

  get country(): string | undefined {
    return this.getValue().country;
  }

  /**
   * Returns the document ID without formatting (digits and letters only)
   */
  getClean(): string {
    return this.value.replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Checks if document is from a specific country
   */
  isFromCountry(country: string): boolean {
    return this.country?.toUpperCase() === country.toUpperCase();
  }

  addValidators(): void {
    this.validatorRules.add(new DocumentIdValidator(this));
  }

  protected getEqualityComponents(): Iterable<any> {
    const props = this.getValue();
    return [props.value, props.type, props.country];
  }

  toString(): string {
    const { value, type, country } = this.getValue();
    return country ? `${type}:${value} (${country})` : `${type}:${value}`;
  }

  toJSON(): DocumentIdProps {
    return this.getValue();
  }
}
