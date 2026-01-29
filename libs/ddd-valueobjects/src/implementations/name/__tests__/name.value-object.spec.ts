import { Name } from '../name.value-object';

describe('Name Value Object', () => {
  describe('create', () => {
    it('should create a valid name with first and last name', () => {
      const name = Name.create('John', 'Doe');

      expect(name).toBeDefined();
      expect(name.firstName).toBe('John');
      expect(name.lastName).toBe('Doe');
      expect(name.middleName).toBeUndefined();
    });

    it('should create a valid name with middle name', () => {
      const name = Name.create('John', 'Doe', 'Michael');

      expect(name.firstName).toBe('John');
      expect(name.middleName).toBe('Michael');
      expect(name.lastName).toBe('Doe');
    });

    it('should throw error for empty first name', () => {
      expect(() => Name.create('', 'Doe')).toThrow('Invalid Name');
    });

    it('should throw error for empty last name', () => {
      expect(() => Name.create('John', '')).toThrow('Invalid Name');
    });

    it('should throw error for first name that is too short', () => {
      expect(() => Name.create('J', 'Doe')).toThrow('Invalid Name');
    });

    it('should throw error for last name that is too short', () => {
      expect(() => Name.create('John', 'D')).toThrow('Invalid Name');
    });

    it('should throw error for first name that is too long', () => {
      const longName = 'A'.repeat(51);
      expect(() => Name.create(longName, 'Doe')).toThrow('Invalid Name');
    });

    it('should throw error for last name that is too long', () => {
      const longName = 'A'.repeat(51);
      expect(() => Name.create('John', longName)).toThrow('Invalid Name');
    });

    it('should throw error for middle name that is too long', () => {
      const longName = 'A'.repeat(51);
      expect(() => Name.create('John', 'Doe', longName)).toThrow('Invalid Name');
    });
  });

  describe('load', () => {
    it('should load a name without validation', () => {
      const name = Name.load('J', 'D'); // Would fail with create()

      expect(name.firstName).toBe('J');
      expect(name.lastName).toBe('D');
    });

    it('should load a name with middle name', () => {
      const name = Name.load('John', 'Doe', 'Michael');

      expect(name.firstName).toBe('John');
      expect(name.middleName).toBe('Michael');
      expect(name.lastName).toBe('Doe');
    });
  });

  describe('getFullName', () => {
    it('should return full name without middle name', () => {
      const name = Name.create('John', 'Doe');

      expect(name.getFullName()).toBe('John Doe');
    });

    it('should return full name with middle name', () => {
      const name = Name.create('John', 'Doe', 'Michael');

      expect(name.getFullName()).toBe('John Michael Doe');
    });
  });

  describe('getInitials', () => {
    it('should return initials without middle name', () => {
      const name = Name.create('John', 'Doe');

      expect(name.getInitials()).toBe('JD');
    });

    it('should return initials with middle name', () => {
      const name = Name.create('John', 'Doe', 'Michael');

      expect(name.getInitials()).toBe('JMD');
    });

    it('should return initials in uppercase', () => {
      const name = Name.create('john', 'doe');

      expect(name.getInitials()).toBe('JD');
    });
  });

  describe('equality', () => {
    it('should be equal for same names', () => {
      const name1 = Name.create('John', 'Doe');
      const name2 = Name.create('John', 'Doe');

      expect(name1.equals(name2)).toBe(true);
    });

    it('should be equal for same names with middle name', () => {
      const name1 = Name.create('John', 'Doe', 'Michael');
      const name2 = Name.create('John', 'Doe', 'Michael');

      expect(name1.equals(name2)).toBe(true);
    });

    it('should not be equal for different first names', () => {
      const name1 = Name.create('John', 'Doe');
      const name2 = Name.create('Jane', 'Doe');

      expect(name1.equals(name2)).toBe(false);
    });

    it('should not be equal for different last names', () => {
      const name1 = Name.create('John', 'Doe');
      const name2 = Name.create('John', 'Smith');

      expect(name1.equals(name2)).toBe(false);
    });

    it('should not be equal when one has middle name', () => {
      const name1 = Name.create('John', 'Doe');
      const name2 = Name.create('John', 'Doe', 'Michael');

      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return full name as string', () => {
      const name = Name.create('John', 'Doe');

      expect(name.toString()).toBe('John Doe');
    });

    it('should return full name with middle name as string', () => {
      const name = Name.create('John', 'Doe', 'Michael');

      expect(name.toString()).toBe('John Michael Doe');
    });
  });

  describe('toJSON', () => {
    it('should return name props without middle name', () => {
      const name = Name.create('John', 'Doe');

      expect(name.toJSON()).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        middleName: undefined,
      });
    });

    it('should return name props with middle name', () => {
      const name = Name.create('John', 'Doe', 'Michael');

      expect(name.toJSON()).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Michael',
      });
    });
  });
});
