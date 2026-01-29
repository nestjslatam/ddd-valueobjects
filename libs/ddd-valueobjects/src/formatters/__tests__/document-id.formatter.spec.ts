import { DocumentIdFormatter } from '../document-id.formatter';
import { DocumentId } from '../../implementations/document-id/document-id.value-object';

describe('DocumentIdFormatter', () => {
  let formatter: DocumentIdFormatter;

  beforeEach(() => {
    formatter = new DocumentIdFormatter();
  });

  describe('formatMasked', () => {
    it('should mask DNI showing last 4 digits', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');
      const result = formatter.formatMasked(doc);

      expect(result).toBe('****5678');
    });

    it('should mask SSN showing last 4 digits', () => {
      const doc = DocumentId.create('219099999', 'SSN', 'USA');
      const result = formatter.formatMasked(doc);

      expect(result).toBe('***-**-9999'); // SSN formatter masks and includes dashes
    });

    it('should mask Passport showing last 4 characters', () => {
      const doc = DocumentId.create('AB123456', 'PASSPORT', 'USA');
      const result = formatter.formatMasked(doc);

      expect(result).toBe('****3456');
    });

    it('should handle short document IDs', () => {
      const doc = DocumentId.create('123', 'OTHER', 'XXX');
      const result = formatter.formatMasked(doc);

      expect(result).toBe('***'); // Fully masked if shorter than showLast
    });
  });

  describe('formatFullyMasked', () => {
    it('should fully mask DNI', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');
      const result = formatter.formatFullyMasked(doc);

      expect(result).toBe('********');
    });

    it('should fully mask SSN', () => {
      const doc = DocumentId.create('219099999', 'SSN', 'USA');
      const result = formatter.formatFullyMasked(doc);

      expect(result).toBe('***-**-****'); // SSN format with dashes
    });

    it('should preserve length when fully masking', () => {
      const doc = DocumentId.create('AB1234567', 'PASSPORT', 'USA');
      const result = formatter.formatFullyMasked(doc);

      expect(result.length).toBe(9);
      expect(result).toBe('*********');
    });
  });

  describe('format', () => {
    it('should format ARG DNI with dots', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');
      const result = formatter.format(doc);

      expect(result).toBe('12.345.678');
    });

    it('should format BRA DNI with dots and dash', () => {
      const doc = DocumentId.create('123456789', 'DNI', 'BRA');
      const result = formatter.format(doc);

      expect(result).toBe('12.345.678-9'); // BRA format includes check digit with dash
    });

    it('should format CHL DNI', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'CHL');
      const result = formatter.format(doc);

      expect(result).toBe('12345678'); // CHL format may not apply formatting
    });

    it('should format US SSN with dashes', () => {
      const doc = DocumentId.create('219099999', 'SSN', 'USA');
      const result = formatter.format(doc);

      expect(result).toBe('219-09-9999');
    });

    it('should format Passport', () => {
      const doc = DocumentId.create('AB1234567', 'PASSPORT', 'USA');
      const result = formatter.format(doc);

      expect(result).toBe('AB1234567'); // Passport may not be formatted
    });

    it('should format Tax ID with dash', () => {
      const doc = DocumentId.create('123456789', 'TAX_ID', 'USA');
      const result = formatter.format(doc);

      expect(result).toBe('12-3456789');
    });

    it('should format Driver License', () => {
      const doc = DocumentId.create('A1234567', 'DRIVER_LICENSE', 'USA');
      const result = formatter.format(doc);

      expect(result).toBe('A1234567'); // Driver License may not be formatted
    });

    it('should return raw value for OTHER type', () => {
      const doc = DocumentId.create('CUSTOM123', 'OTHER', 'XXX');
      const result = formatter.format(doc);

      expect(result).toBe('CUSTOM123');
    });

    it('should handle valid document lengths', () => {
      const doc = DocumentId.create('12345678', 'OTHER', 'XXX');
      const result = formatter.format(doc);

      expect(result).toBe('12345678'); // Falls back to raw value for OTHER type
    });
  });

  describe('formatWithLabel', () => {
    it('should format DNI with label', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');
      const result = formatter.formatWithLabel(doc);

      expect(result).toBe('DNI: 12.345.678');
    });

    it('should format SSN with label', () => {
      const doc = DocumentId.create('219099999', 'SSN', 'USA');
      const result = formatter.formatWithLabel(doc);

      expect(result).toBe('SSN: 219-09-9999');
    });

    it('should format Passport with label', () => {
      const doc = DocumentId.create('AB1234567', 'PASSPORT', 'USA');
      const result = formatter.formatWithLabel(doc);

      expect(result).toBe('PASSPORT: AB1234567');
    });

    it('should format Tax ID with label', () => {
      const doc = DocumentId.create('123456789', 'TAX_ID', 'USA');
      const result = formatter.formatWithLabel(doc);

      expect(result).toBe('TAX_ID: 12-3456789');
    });
  });

  describe('formatWithCountry', () => {
    it('should format with country code', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');
      const result = formatter.formatWithCountry(doc);

      expect(result).toBe('DNI (ARG): 12.345.678'); // Uses full label format
    });

    it('should format SSN with USA', () => {
      const doc = DocumentId.create('219099999', 'SSN', 'USA');
      const result = formatter.formatWithCountry(doc);

      expect(result).toBe('SSN (USA): 219-09-9999');
    });

    it('should include formatted document ID', () => {
      const doc = DocumentId.create('123456789', 'DNI', 'BRA');
      const result = formatter.formatWithCountry(doc);

      expect(result).toContain('BRA');
      expect(result).toContain('12.345.678-9'); // BRA format with dash
    });
  });

  describe('formatPartialMasked', () => {
    it('should show first and last digits for DNI', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');
      const result = formatter.formatPartialMasked(doc);

      expect(result).toBe('1******8'); // Shows first and last char only
    });

    it('should show first and last for SSN', () => {
      const doc = DocumentId.create('219099999', 'SSN', 'USA');
      const result = formatter.formatPartialMasked(doc);

      expect(result).toBe('2**-**-***9'); // SSN format with dashes
    });

    it('should show first and last for Passport', () => {
      const doc = DocumentId.create('AB1234567', 'PASSPORT', 'USA');
      const result = formatter.formatPartialMasked(doc);

      expect(result).toBe('A*******7'); // Shows first and last char
    });

    it('should handle short document IDs', () => {
      const doc = DocumentId.create('12345', 'OTHER', 'XXX');
      const result = formatter.formatPartialMasked(doc);

      expect(result).toContain('*');
      expect(result.length).toBe(5);
    });
  });

  describe('edge cases', () => {
    it('should handle documents with special characters', () => {
      const doc = DocumentId.create('ABC-123', 'OTHER', 'XXX');
      const result = formatter.format(doc);

      expect(result).toBeDefined();
    });

    it('should format very long document IDs', () => {
      const longId = '1234567890123456789';
      const doc = DocumentId.create(longId, 'OTHER', 'XXX');
      const result = formatter.formatMasked(doc);

      expect(result).toContain('*');
      expect(result).toContain('6789');
    });

    it('should handle alphanumeric passports', () => {
      const doc = DocumentId.create('AB1234CD56', 'PASSPORT', 'GBR');
      const result = formatter.format(doc);

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should maintain consistency across all format methods', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');

      const format1 = formatter.format(doc);
      const format2 = formatter.formatWithLabel(doc);
      const format3 = formatter.formatWithCountry(doc);

      expect(format1).toContain('12.345.678');
      expect(format2).toContain('12.345.678');
      expect(format3).toContain('12.345.678');
    });
  });
});
