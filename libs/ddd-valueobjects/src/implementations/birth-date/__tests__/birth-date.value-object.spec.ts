import { BirthDate } from '../birth-date.value-object';

describe('BirthDate', () => {
  describe('create', () => {
    it('should create valid birth date', () => {
      const date = new Date('1990-01-15');

      const birthDate = BirthDate.create(date);

      expect(birthDate.getDate()).toEqual(date);
    });

    it('should load birth date without validation', () => {
      const futureDate = new Date('2030-01-01');

      const birthDate = BirthDate.load(futureDate);

      expect(birthDate.getDate()).toEqual(futureDate);
    });
  });

  describe('fromString', () => {
    it('should create birth date from string', () => {
      const birthDate = BirthDate.fromString('1990-01-15');

      expect(birthDate.getDate()).toEqual(new Date('1990-01-15'));
    });
  });

  describe('fromComponents', () => {
    it('should create birth date from components', () => {
      const birthDate = BirthDate.fromComponents(1990, 1, 15);

      const date = birthDate.getDate();
      expect(date.getFullYear()).toBe(1990);
      expect(date.getMonth()).toBe(0); // January is 0
      expect(date.getDate()).toBe(15);
    });
  });

  describe('getAge', () => {
    it('should calculate age correctly', () => {
      const birthDate = BirthDate.create(new Date('1990-01-15'));
      const referenceDate = new Date('2024-01-15');

      const age = birthDate.getAge(referenceDate);

      expect(age).toBe(34);
    });

    it('should calculate age for birthday not yet reached', () => {
      const birthDate = BirthDate.create(new Date('1990-12-31'));
      const referenceDate = new Date('2024-01-15');

      const age = birthDate.getAge(referenceDate);

      expect(age).toBe(33);
    });

    it('should calculate age for birthday today', () => {
      const birthDate = BirthDate.create(new Date('1990-01-15'));
      const referenceDate = new Date('2024-01-15');

      const age = birthDate.getAge(referenceDate);

      expect(age).toBe(34);
    });

    it('should calculate age 0 for baby', () => {
      const birthDate = BirthDate.create(new Date('2024-01-15'));
      const referenceDate = new Date('2024-06-15');

      const age = birthDate.getAge(referenceDate);

      expect(age).toBe(0);
    });

    it('should handle leap year birthdays', () => {
      const birthDate = BirthDate.create(new Date('2000-02-29'));
      const referenceDate = new Date('2024-02-28');

      const age = birthDate.getAge(referenceDate);

      expect(age).toBe(23); // Birthday not yet reached (Feb 29)
    });
  });

  describe('age category checks', () => {
    it('should identify minor (under 18)', () => {
      const birthDate = BirthDate.create(new Date('2010-01-15'));
      const referenceDate = new Date('2024-01-15');

      expect(birthDate.isMinor(referenceDate)).toBe(true);
      expect(birthDate.isAdult(referenceDate)).toBe(false);
      expect(birthDate.isSenior(referenceDate)).toBe(false);
    });

    it('should identify adult (18-64)', () => {
      const birthDate = BirthDate.create(new Date('1990-01-15'));
      const referenceDate = new Date('2024-01-15');

      expect(birthDate.isMinor(referenceDate)).toBe(false);
      expect(birthDate.isAdult(referenceDate)).toBe(true);
      expect(birthDate.isSenior(referenceDate)).toBe(false);
    });

    it('should identify senior (65+)', () => {
      const birthDate = BirthDate.create(new Date('1950-01-15'));
      const referenceDate = new Date('2024-01-15');

      expect(birthDate.isMinor(referenceDate)).toBe(false);
      expect(birthDate.isAdult(referenceDate)).toBe(true);
      expect(birthDate.isSenior(referenceDate)).toBe(true);
    });

    it('should identify boundary at 18 (adult)', () => {
      const birthDate = BirthDate.create(new Date('2006-01-15'));
      const referenceDate = new Date('2024-01-15');

      expect(birthDate.isMinor(referenceDate)).toBe(false);
      expect(birthDate.isAdult(referenceDate)).toBe(true);
    });

    it('should identify boundary at 65 (senior)', () => {
      const birthDate = BirthDate.create(new Date('1959-01-15'));
      const referenceDate = new Date('2024-01-15');

      expect(birthDate.isSenior(referenceDate)).toBe(true);
    });
  });

  describe('getNextBirthday', () => {
    it('should get next birthday in current year', () => {
      const birthDate = BirthDate.fromComponents(1990, 12, 25); // Christmas
      const referenceDate = new Date('2024-01-15');

      const nextBirthday = birthDate.getNextBirthday(referenceDate);

      expect(nextBirthday.getFullYear()).toBe(2024);
      expect(nextBirthday.getMonth()).toBe(11); // December
      expect(nextBirthday.getDate()).toBe(25);
    });

    it('should get next birthday in next year', () => {
      const birthDate = BirthDate.fromComponents(1990, 1, 10);
      const referenceDate = new Date('2024-06-15');

      const nextBirthday = birthDate.getNextBirthday(referenceDate);

      expect(nextBirthday.getFullYear()).toBe(2025);
      expect(nextBirthday.getMonth()).toBe(0); // January
      expect(nextBirthday.getDate()).toBe(10);
    });

    it('should get next birthday when today is birthday', () => {
      const birthDate = BirthDate.fromComponents(1990, 1, 15);
      const referenceDate = new Date('2024-01-15');

      const nextBirthday = birthDate.getNextBirthday(referenceDate);

      // If reference time is before birthday time, returns same day, otherwise next year
      expect(nextBirthday.getMonth()).toBe(0);
      expect(nextBirthday.getDate()).toBe(15);
    });
  });

  describe('getDaysUntilBirthday', () => {
    it('should calculate days until birthday', () => {
      const birthDate = BirthDate.create(new Date('1990-01-20'));
      const referenceDate = new Date('2024-01-15');

      const days = birthDate.getDaysUntilBirthday(referenceDate);

      expect(days).toBe(5);
    });

    it('should calculate days until birthday next year', () => {
      const birthDate = BirthDate.create(new Date('1990-01-10'));
      const referenceDate = new Date('2024-01-15');

      const days = birthDate.getDaysUntilBirthday(referenceDate);

      expect(days).toBeGreaterThan(350);
      expect(days).toBeLessThanOrEqual(365);
    });
  });

  describe('isBirthdayToday', () => {
    it('should detect birthday today', () => {
      const birthDate = BirthDate.create(new Date('1990-01-15'));
      const referenceDate = new Date('2024-01-15');

      expect(birthDate.isBirthdayToday(referenceDate)).toBe(true);
    });

    it('should detect not birthday today', () => {
      const birthDate = BirthDate.create(new Date('1990-01-15'));
      const referenceDate = new Date('2024-01-16');

      expect(birthDate.isBirthdayToday(referenceDate)).toBe(false);
    });
  });

  describe('equality', () => {
    it('should be equal for same birth dates', () => {
      const birthDate1 = BirthDate.create(new Date('1990-01-15'));
      const birthDate2 = BirthDate.create(new Date('1990-01-15'));

      expect(birthDate1.equals(birthDate2)).toBe(true);
    });

    it('should not be equal for different birth dates', () => {
      const birthDate1 = BirthDate.create(new Date('1990-01-15'));
      const birthDate2 = BirthDate.create(new Date('1990-01-16'));

      expect(birthDate1.equals(birthDate2)).toBe(false);
    });
  });

  describe('serialization', () => {
    it('should serialize to string', () => {
      const date = new Date('1990-01-15T00:00:00.000Z');
      const birthDate = BirthDate.create(date);

      expect(birthDate.toString()).toBe('1990-01-15T00:00:00.000Z');
    });

    it('should serialize to JSON', () => {
      const date = new Date('1990-01-15T00:00:00.000Z');
      const birthDate = BirthDate.create(date);

      expect(birthDate.toJSON()).toBe('1990-01-15T00:00:00.000Z');
    });
  });
});
