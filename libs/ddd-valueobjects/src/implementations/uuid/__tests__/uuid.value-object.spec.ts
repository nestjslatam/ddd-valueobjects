import { UUID } from '../uuid.value-object';

describe('UUID Value Object', () => {
  describe('create', () => {
    it('should create a valid UUID v4', () => {
      const result = UUID.create('550e8400-e29b-41d4-a716-446655440000');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should convert UUID to lowercase', () => {
      const result = UUID.create('550E8400-E29B-41D4-A716-446655440000');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should accept UUID v1', () => {
      const result = UUID.create('6ba7b810-9dad-11d1-80b4-00c04fd430c8');

      expect(result.isSuccess).toBe(true);
    });

    it('should accept UUID v3', () => {
      const result = UUID.create('6ba7b810-9dad-31d1-80b4-00c04fd430c8');

      expect(result.isSuccess).toBe(true);
    });

    it('should accept UUID v5', () => {
      const result = UUID.create('6ba7b810-9dad-51d1-80b4-00c04fd430c8');

      expect(result.isSuccess).toBe(true);
    });

    it('should fail for empty UUID', () => {
      const result = UUID.create('');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('UUID cannot be empty');
    });

    it('should fail for invalid UUID format', () => {
      const result = UUID.create('not-a-uuid');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('UUID format is invalid');
    });

    it('should fail for UUID without dashes', () => {
      const result = UUID.create('550e8400e29b41d4a716446655440000');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('UUID format is invalid');
    });

    it('should fail for UUID with wrong length', () => {
      const result = UUID.create('550e8400-e29b-41d4-a716-4466554400');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('UUID format is invalid');
    });

    it('should fail for UUID v6 or higher', () => {
      const result = UUID.create('6ba7b810-9dad-61d1-80b4-00c04fd430c8');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('UUID format is invalid');
    });

    it('should fail for UUID v0', () => {
      const result = UUID.create('6ba7b810-9dad-01d1-80b4-00c04fd430c8');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('UUID format is invalid');
    });
  });

  describe('generate', () => {
    it('should generate a valid UUID v4', () => {
      const uuid = UUID.generate();

      expect(uuid.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    });

    it('should generate different UUIDs', () => {
      const uuid1 = UUID.generate();
      const uuid2 = UUID.generate();

      expect(uuid1.value).not.toBe(uuid2.value);
    });

    it('should generate UUID with version 4', () => {
      const uuid = UUID.generate();
      const parts = uuid.value.split('-');

      expect(parts[2].charAt(0)).toBe('4'); // Version 4
    });

    it('should generate UUID with correct variant', () => {
      const uuid = UUID.generate();
      const parts = uuid.value.split('-');
      const variantChar = parts[3].charAt(0);

      expect(['8', '9', 'a', 'b']).toContain(variantChar); // Variant bits
    });
  });

  describe('equality', () => {
    it('should be equal for same UUIDs', () => {
      const uuid1 = UUID.create('550e8400-e29b-41d4-a716-446655440000').getValue();
      const uuid2 = UUID.create('550e8400-e29b-41d4-a716-446655440000').getValue();

      expect(uuid1.equals(uuid2)).toBe(true);
    });

    it('should be equal regardless of case', () => {
      const uuid1 = UUID.create('550E8400-E29B-41D4-A716-446655440000').getValue();
      const uuid2 = UUID.create('550e8400-e29b-41d4-a716-446655440000').getValue();

      expect(uuid1.equals(uuid2)).toBe(true);
    });

    it('should not be equal for different UUIDs', () => {
      const uuid1 = UUID.create('550e8400-e29b-41d4-a716-446655440000').getValue();
      const uuid2 = UUID.create('6ba7b810-9dad-11d1-80b4-00c04fd430c8').getValue();

      expect(uuid1.equals(uuid2)).toBe(false);
    });
  });
});
