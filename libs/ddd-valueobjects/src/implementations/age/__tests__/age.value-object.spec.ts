import { Age } from '../age.value-object';

describe('Age', () => {
  describe('create', () => {
    it('should create a valid age', () => {
      const age = Age.create(25);

      expect(age.getValue()).toBe(25);
    });

    it('should create age with min boundary (0)', () => {
      const age = Age.create(0);

      expect(age.getValue()).toBe(0);
    });

    it('should create age with max boundary (150)', () => {
      const age = Age.create(150);

      expect(age.getValue()).toBe(150);
    });

    it('should create age with custom options using load', () => {
      const age = Age.load(5, { minAge: 5, maxAge: 10 });

      expect(age.getValue()).toBe(5);
      expect(age.getOptions().minAge).toBe(5);
      expect(age.getOptions().maxAge).toBe(10);
    });

    it('should load age outside valid range', () => {
      const age = Age.load(-5);

      expect(age.getValue()).toBe(-5);
    });

    it('should load age over max', () => {
      const age = Age.load(200);

      expect(age.getValue()).toBe(200);
    });
  });

  describe('fromBirthDate', () => {
    it('should calculate age from birth date', () => {
      const birthDate = new Date('1990-01-01');
      const referenceDate = new Date('2024-01-01');

      const age = Age.fromBirthDate(birthDate, referenceDate);

      expect(age.getValue()).toBe(34);
    });

    it('should calculate age for birthday not yet reached this year', () => {
      const birthDate = new Date('1990-12-31');
      const referenceDate = new Date('2024-01-01');

      const age = Age.fromBirthDate(birthDate, referenceDate);

      expect(age.getValue()).toBe(33);
    });

    it('should calculate age for birthday today', () => {
      const birthDate = new Date('1990-01-01');
      const referenceDate = new Date('2024-01-01');

      const age = Age.fromBirthDate(birthDate, referenceDate);

      expect(age.getValue()).toBe(34);
    });

    it('should calculate age 0 for baby born this year', () => {
      const birthDate = new Date('2024-01-01');
      const referenceDate = new Date('2024-12-31');

      const age = Age.fromBirthDate(birthDate, referenceDate);

      expect(age.getValue()).toBe(0);
    });
  });

  describe('age categories', () => {
    it('should identify child (under 13)', () => {
      const age = Age.create(10);

      expect(age.getCategory()).toBe('child');
      expect(age.isMinor()).toBe(true);
      expect(age.isAdult()).toBe(false);
      expect(age.isSenior()).toBe(false);
    });

    it('should identify teenager (13-17)', () => {
      const age = Age.create(15);

      expect(age.getCategory()).toBe('teenager');
      expect(age.isMinor()).toBe(true);
      expect(age.isAdult()).toBe(false);
      expect(age.isSenior()).toBe(false);
    });

    it('should identify adult (18-64)', () => {
      const age = Age.create(30);

      expect(age.getCategory()).toBe('adult');
      expect(age.isMinor()).toBe(false);
      expect(age.isAdult()).toBe(true);
      expect(age.isSenior()).toBe(false);
    });

    it('should identify senior (65+)', () => {
      const age = Age.create(70);

      expect(age.getCategory()).toBe('senior');
      expect(age.isMinor()).toBe(false);
      expect(age.isAdult()).toBe(true);
      expect(age.isSenior()).toBe(true);
    });

    it('should identify boundary at 18 (adult)', () => {
      const age = Age.create(18);

      expect(age.getCategory()).toBe('adult');
      expect(age.isMinor()).toBe(false);
      expect(age.isAdult()).toBe(true);
    });

    it('should identify boundary at 65 (senior)', () => {
      const age = Age.create(65);

      expect(age.getCategory()).toBe('senior');
      expect(age.isSenior()).toBe(true);
    });
  });

  describe('equality', () => {
    it('should be equal for same age', () => {
      const age1 = Age.create(25);
      const age2 = Age.create(25);

      expect(age1.equals(age2)).toBe(true);
    });

    it('should not be equal for different ages', () => {
      const age1 = Age.create(25);
      const age2 = Age.create(30);

      expect(age1.equals(age2)).toBe(false);
    });
  });

  describe('serialization', () => {
    it('should serialize to string', () => {
      const age = Age.create(25);

      expect(age.toString()).toBe('25 years');
    });

    it('should serialize to JSON', () => {
      const age = Age.create(25);

      expect(age.toJSON()).toBe(25);
    });
  });
});
