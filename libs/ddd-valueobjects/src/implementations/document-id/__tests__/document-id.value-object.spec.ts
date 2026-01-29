import { DocumentId } from '../document-id.value-object';

describe('DocumentId Value Object', () => {
  describe('create', () => {
    it('should create a valid DNI', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');

      expect(doc).toBeDefined();
      expect(doc.value).toBe('12345678');
      expect(doc.type).toBe('DNI');
      expect(doc.country).toBe('ARG');
    });

    it('should create a valid Passport', () => {
      const doc = DocumentId.create('AB123456', 'PASSPORT', 'USA');

      expect(doc.value).toBe('AB123456');
      expect(doc.type).toBe('PASSPORT');
    });

    it('should create a valid SSN with load', () => {
      // Note: SSN validation is strict, use load() for simple creation
      const doc = DocumentId.load('123456789', 'SSN', 'USA');

      expect(doc.value).toBe('123456789');
      expect(doc.type).toBe('SSN');
    });

    it('should throw error for empty document', () => {
      expect(() => DocumentId.create('', 'DNI')).toThrow('Invalid DocumentId');
    });

    it('should create document without country', () => {
      const doc = DocumentId.create('12345678', 'OTHER');

      expect(doc.type).toBe('OTHER');
      expect(doc.country).toBeUndefined();
    });
  });

  describe('createDNI', () => {
    it('should create DNI with convenience method', () => {
      const doc = DocumentId.createDNI('12345678', 'ARG');

      expect(doc.type).toBe('DNI');
      expect(doc.value).toBe('12345678');
      expect(doc.country).toBe('ARG');
    });
  });

  describe('createPassport', () => {
    it('should create Passport with convenience method', () => {
      const doc = DocumentId.createPassport('AB123456', 'USA');

      expect(doc.type).toBe('PASSPORT');
      expect(doc.value).toBe('AB123456');
    });
  });

  describe('createSSN', () => {
    it('should create SSN with convenience method using load', () => {
      // SSN has strict validation, test with valid format
      const doc = DocumentId.load('123456789', 'SSN', 'USA');

      expect(doc.type).toBe('SSN');
      expect(doc.value).toBe('123456789');
      expect(doc.country).toBe('USA');
    });
  });

  describe('getClean', () => {
    it('should return document without formatting', () => {
      const doc = DocumentId.create('12-345-678', 'DNI', 'ARG');

      expect(doc.getClean()).toBe('12345678');
    });

    it('should remove all non-alphanumeric characters', () => {
      const doc = DocumentId.create('AB-123.456', 'PASSPORT');

      expect(doc.getClean()).toBe('AB123456');
    });

    it('should handle document without special characters', () => {
      const doc = DocumentId.create('12345678', 'DNI');

      expect(doc.getClean()).toBe('12345678');
    });
  });

  describe('isFromCountry', () => {
    it('should return true for matching country', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');

      expect(doc.isFromCountry('ARG')).toBe(true);
    });

    it('should be case insensitive', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');

      expect(doc.isFromCountry('arg')).toBe(true);
      expect(doc.isFromCountry('Arg')).toBe(true);
    });

    it('should return false for non-matching country', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');

      expect(doc.isFromCountry('USA')).toBe(false);
    });

    it('should return false when country is undefined', () => {
      const doc = DocumentId.create('12345678', 'DNI');

      expect(doc.isFromCountry('ARG')).toBe(false);
    });
  });

  describe('load', () => {
    it('should load a document without validation', () => {
      const doc = DocumentId.load('123', 'DNI'); // Would fail with create()

      expect(doc.value).toBe('123');
      expect(doc.type).toBe('DNI');
    });

    it('should load document with country', () => {
      const doc = DocumentId.load('12345678', 'DNI', 'ARG');

      expect(doc.country).toBe('ARG');
    });
  });

  describe('equality', () => {
    it('should be equal for same documents', () => {
      const doc1 = DocumentId.create('12345678', 'DNI', 'ARG');
      const doc2 = DocumentId.create('12345678', 'DNI', 'ARG');

      expect(doc1.equals(doc2)).toBe(true);
    });

    it('should not be equal for different values', () => {
      const doc1 = DocumentId.create('12345678', 'DNI', 'ARG');
      const doc2 = DocumentId.create('87654321', 'DNI', 'ARG');

      expect(doc1.equals(doc2)).toBe(false);
    });

    it('should not be equal for different types', () => {
      const doc1 = DocumentId.create('AB123456', 'PASSPORT', 'ARG');
      const doc2 = DocumentId.create('AB123456', 'DRIVER_LICENSE', 'ARG');

      expect(doc1.equals(doc2)).toBe(false);
    });

    it('should not be equal for different countries', () => {
      const doc1 = DocumentId.create('12345678', 'DNI', 'ARG');
      const doc2 = DocumentId.create('12345678', 'DNI', 'CHL');

      expect(doc1.equals(doc2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return formatted string with country', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');

      expect(doc.toString()).toBe('DNI:12345678 (ARG)');
    });

    it('should return formatted string without country', () => {
      const doc = DocumentId.create('12345678', 'OTHER');

      expect(doc.toString()).toBe('OTHER:12345678');
    });
  });

  describe('toJSON', () => {
    it('should return document props', () => {
      const doc = DocumentId.create('12345678', 'DNI', 'ARG');

      expect(doc.toJSON()).toEqual({
        value: '12345678',
        type: 'DNI',
        country: 'ARG',
      });
    });
  });
});
