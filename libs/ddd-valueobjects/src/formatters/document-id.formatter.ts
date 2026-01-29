import { Injectable } from '@nestjs/common';
import { DocumentId } from '../implementations/document-id/document-id.value-object';

/**
 * DocumentId Formatter
 * Handles presentation layer concerns for DocumentId value objects
 * Separated from domain layer to respect SRP and SoC principles
 */
@Injectable()
export class DocumentIdFormatter {
  /**
   * Returns a masked version for display
   * Example: "***-**-1234" (SSN), "****5678" (DNI)
   */
  formatMasked(documentId: DocumentId, showLast: number = 4): string {
    const clean = this.getClean(documentId);

    if (clean.length <= showLast) {
      return '*'.repeat(clean.length);
    }

    const lastDigits = clean.slice(-showLast);
    const masked = '*'.repeat(clean.length - showLast);

    return this.applyFormatPattern(masked + lastDigits, documentId.type);
  }

  /**
   * Returns fully masked version
   * Example: "***-**-****" (SSN), "********" (DNI)
   */
  formatFullyMasked(documentId: DocumentId): string {
    const clean = this.getClean(documentId);
    const masked = '*'.repeat(clean.length);
    return this.applyFormatPattern(masked, documentId.type);
  }

  /**
   * Returns formatted document ID with standard format
   * Example: "123-45-6789" (SSN), "12.345.678-9" (DNI Brazil)
   */
  format(documentId: DocumentId): string {
    return this.applyFormatPattern(documentId.value, documentId.type, documentId.country);
  }

  /**
   * Returns clean document ID (alphanumeric only)
   */
  getClean(documentId: DocumentId): string {
    return documentId.value.replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Formats with document type label
   * Example: "DNI: 12.345.678-9", "SSN: ***-**-1234"
   */
  formatWithLabel(documentId: DocumentId, masked: boolean = false): string {
    const formatted = masked ? this.formatMasked(documentId) : this.format(documentId);
    return `${documentId.type}: ${formatted}`;
  }

  /**
   * Formats with document type and country
   * Example: "DNI (Argentina): 12.345.678", "Passport (USA): AB1234567"
   */
  formatWithCountry(documentId: DocumentId, masked: boolean = false): string {
    const formatted = masked ? this.formatMasked(documentId) : this.format(documentId);
    const country = documentId.country ? ` (${documentId.country})` : '';
    return `${documentId.type}${country}: ${formatted}`;
  }

  /**
   * Formats for display in forms (partially masked)
   * Shows first and last characters
   * Example: "1**-**-***9" (SSN), "1******9" (DNI)
   */
  formatPartialMasked(documentId: DocumentId): string {
    const clean = this.getClean(documentId);

    if (clean.length <= 2) {
      return '*'.repeat(clean.length);
    }

    const first = clean.charAt(0);
    const last = clean.charAt(clean.length - 1);
    const middle = '*'.repeat(clean.length - 2);

    return this.applyFormatPattern(first + middle + last, documentId.type);
  }

  /**
   * Applies standard formatting pattern based on document type and country
   */
  private applyFormatPattern(value: string, type: string, country?: string): string {
    const clean = value.replace(/[^a-zA-Z0-9*]/g, '');

    switch (type) {
      case 'SSN':
        // USA: 123-45-6789
        if (clean.length === 9) {
          return `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5)}`;
        }
        break;

      case 'DNI':
        if (country === 'ARG' || country === 'Argentina') {
          // Argentina: 12.345.678
          if (clean.length === 8) {
            return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5)}`;
          }
        } else if (country === 'BRA' || country === 'Brazil') {
          // Brazil: 12.345.678-9
          if (clean.length === 9) {
            return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}-${clean.slice(8)}`;
          }
        } else if (country === 'CHL' || country === 'Chile') {
          // Chile: 12.345.678-9
          if (clean.length === 9) {
            return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}-${clean.slice(8)}`;
          }
        }
        // Default DNI format
        if (clean.length >= 7) {
          return clean;
        }
        break;

      case 'PASSPORT':
        // Standard passport format (no special formatting)
        return clean.toUpperCase();

      case 'TAX_ID':
        if (country === 'USA') {
          // EIN: 12-3456789
          if (clean.length === 9) {
            return `${clean.slice(0, 2)}-${clean.slice(2)}`;
          }
        }
        break;

      case 'DRIVER_LICENSE':
        // Varies by country, keep as-is
        return clean.toUpperCase();

      default:
        return clean;
    }

    return value;
  }
}
