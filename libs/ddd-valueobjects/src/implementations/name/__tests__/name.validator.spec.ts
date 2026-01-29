import { Name } from '../name.value-object';
import { NAME_CONSTRAINTS } from '../../../constants';

describe('NameValidator', () => {
  describe('firstName validation', () => {
    it('should fail for empty firstName', () => {
      expect(() => Name.create('', 'Doe')).toThrow('First name cannot be empty');
    });

    it('should fail for firstName too short', () => {
      expect(() => Name.create('A', 'Doe')).toThrow(
        `First name must be at least ${NAME_CONSTRAINTS.MIN_FIRST_NAME_LENGTH}`,
      );
    });

    it('should fail for firstName too long', () => {
      const longName = 'A'.repeat(NAME_CONSTRAINTS.MAX_FIRST_NAME_LENGTH + 1);

      expect(() => Name.create(longName, 'Doe')).toThrow(
        `First name cannot exceed ${NAME_CONSTRAINTS.MAX_FIRST_NAME_LENGTH}`,
      );
    });

    it('should fail for firstName with invalid characters', () => {
      expect(() => Name.create('John123', 'Doe')).toThrow('First name contains invalid characters');
    });

    it('should accept valid firstName', () => {
      const name = Name.create('John', 'Doe');

      expect(name.firstName).toBe('John');
    });

    it('should accept firstName with accents', () => {
      const name = Name.create('José', 'García');

      expect(name.firstName).toBe('José');
    });

    it('should accept firstName with hyphen', () => {
      const name = Name.create('Mary-Jane', 'Watson');

      expect(name.firstName).toBe('Mary-Jane');
    });

    it('should accept firstName with apostrophe', () => {
      const name = Name.create("O'Connor", 'Smith');

      expect(name.firstName).toBe("O'Connor");
    });
  });

  describe('lastName validation', () => {
    it('should fail for empty lastName', () => {
      expect(() => Name.create('John', '')).toThrow('Last name cannot be empty');
    });

    it('should fail for lastName too short', () => {
      expect(() => Name.create('John', 'D')).toThrow(
        `Last name must be at least ${NAME_CONSTRAINTS.MIN_LAST_NAME_LENGTH}`,
      );
    });

    it('should fail for lastName too long', () => {
      const longName = 'D'.repeat(NAME_CONSTRAINTS.MAX_LAST_NAME_LENGTH + 1);

      expect(() => Name.create('John', longName)).toThrow(
        `Last name cannot exceed ${NAME_CONSTRAINTS.MAX_LAST_NAME_LENGTH}`,
      );
    });

    it('should fail for lastName with invalid characters', () => {
      expect(() => Name.create('John', 'Doe123')).toThrow('Last name contains invalid characters');
    });

    it('should accept valid lastName', () => {
      const name = Name.create('John', 'Doe');

      expect(name.lastName).toBe('Doe');
    });

    it('should accept lastName with spaces', () => {
      const name = Name.create('John', 'Van Der Berg');

      expect(name.lastName).toBe('Van Der Berg');
    });
  });

  describe('middleName validation', () => {
    it('should accept name without middleName', () => {
      const name = Name.create('John', 'Doe');

      expect(name.middleName).toBeUndefined();
    });

    it('should fail for middleName too long', () => {
      const longMiddle = 'M'.repeat(NAME_CONSTRAINTS.MAX_LENGTH + 1);

      expect(() => Name.create('John', 'Doe', longMiddle)).toThrow(
        `Middle name cannot exceed ${NAME_CONSTRAINTS.MAX_LENGTH}`,
      );
    });

    it('should fail for middleName with invalid characters', () => {
      expect(() => Name.create('John', 'Doe', 'Michael123')).toThrow(
        'Middle name contains invalid characters',
      );
    });

    it('should accept valid middleName', () => {
      const name = Name.create('John', 'Doe', 'Michael');

      expect(name.middleName).toBe('Michael');
    });
  });
});
