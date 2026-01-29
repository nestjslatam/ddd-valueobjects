import { OtherDocumentValidatorStrategy } from '../other.validator.strategy';

describe('OtherDocumentValidatorStrategy', () => {
  let strategy: OtherDocumentValidatorStrategy;

  beforeEach(() => {
    strategy = new OtherDocumentValidatorStrategy();
  });

  it('should have type OTHER', () => {
    expect(strategy.type).toBe('OTHER');
  });

  describe('clean', () => {
    it('should trim whitespace', () => {
      expect(strategy.clean('  ABC123  ')).toBe('ABC123');
      expect(strategy.clean(' ABC-123 ')).toBe('ABC-123');
    });

    it('should preserve internal content', () => {
      expect(strategy.clean('ABC-123/XYZ')).toBe('ABC-123/XYZ');
    });
  });

  describe('validate', () => {
    it('should validate generic alphanumeric document', () => {
      const result = strategy.validate('ABC123');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate document with allowed separators', () => {
      const result = strategy.validate('ABC-123_XYZ.456/789');

      expect(result.isValid).toBe(true);
    });

    it('should validate document with spaces', () => {
      const result = strategy.validate('ABC 123 XYZ');

      expect(result.isValid).toBe(true);
    });

    it('should reject document shorter than 3 characters', () => {
      const result = strategy.validate('AB'); // 2 chars

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('between 3 and 50'))).toBe(true);
    });

    it('should reject document longer than 50 characters', () => {
      const result = strategy.validate('A'.repeat(51)); // 51 chars

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('between 3 and 50'))).toBe(true);
    });

    it('should reject document with invalid special characters', () => {
      const result = strategy.validate('ABC@123');

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.message.includes('invalid characters'))).toBe(true);
    });

    it('should validate minimum length document', () => {
      const result = strategy.validate('ABC'); // Exactly 3 chars

      expect(result.isValid).toBe(true);
    });

    it('should validate maximum length document', () => {
      const result = strategy.validate('A'.repeat(50)); // Exactly 50 chars

      expect(result.isValid).toBe(true);
    });

    it('should validate various generic document formats', () => {
      const validDocs = [
        'DOC123',
        'ABC-123',
        'DOC_123',
        'REF.456',
        'ID/789',
        'GENERIC 123',
        'A123B456C789',
      ];

      validDocs.forEach((doc) => {
        const result = strategy.validate(doc);
        expect(result.isValid).toBe(true);
      });
    });
  });
});
