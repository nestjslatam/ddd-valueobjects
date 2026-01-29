import { BirthDate } from '../birth-date.value-object';
import { BIRTH_DATE_CONSTRAINTS } from '../../../constants';

describe('BirthDateValidator', () => {
  describe('basic validation', () => {
    it('should pass for valid birth date', () => {
      const date = new Date('1990-01-15');

      const birthDate = BirthDate.create(date);

      expect(birthDate.getDate()).toEqual(date);
    });

    it('should pass for birth date today', () => {
      const today = new Date();

      const birthDate = BirthDate.create(today);

      expect(birthDate.getAge()).toBe(0);
    });

    it('should fail for future birth date', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);

      expect(() => BirthDate.create(future)).toThrow('Birth date cannot be in the future');
    });

    it('should fail for invalid date', () => {
      const invalid = new Date('invalid');

      expect(() => BirthDate.create(invalid)).toThrow('Birth date must be a valid date');
    });
  });

  describe('year constraints', () => {
    it('should pass for birth date at min year boundary', () => {
      const minDate = new Date(BIRTH_DATE_CONSTRAINTS.MIN_BIRTH_YEAR, 0, 1);

      const birthDate = BirthDate.create(minDate);

      expect(birthDate.getDate().getFullYear()).toBe(BIRTH_DATE_CONSTRAINTS.MIN_BIRTH_YEAR);
    });

    it('should fail for birth date before min year', () => {
      const tooOld = new Date(BIRTH_DATE_CONSTRAINTS.MIN_BIRTH_YEAR - 1, 11, 31);

      expect(() => BirthDate.create(tooOld)).toThrow(
        `Birth date cannot be before year ${BIRTH_DATE_CONSTRAINTS.MIN_BIRTH_YEAR}`,
      );
    });

    it('should pass for recent birth dates', () => {
      const recent = new Date('2020-01-01');

      const birthDate = BirthDate.create(recent);

      expect(birthDate.getDate()).toEqual(recent);
    });
  });

  describe('age calculations', () => {
    it('should calculate correct age for adult', () => {
      const date = new Date('1990-01-15');

      const birthDate = BirthDate.create(date);
      const age = birthDate.getAge(new Date('2024-01-15'));

      expect(age).toBe(34);
    });

    it('should calculate age 0 for baby', () => {
      const today = new Date();

      const birthDate = BirthDate.create(today);

      expect(birthDate.getAge()).toBe(0);
    });

    it('should handle leap year birthdays', () => {
      const leapDate = new Date('2000-02-29');

      const birthDate = BirthDate.create(leapDate);
      const age = birthDate.getAge(new Date('2024-02-28'));

      expect(age).toBe(23); // Birthday not yet reached
    });
  });

  describe('age category checks', () => {
    it('should identify minor correctly', () => {
      const date = new Date('2010-01-01');

      const birthDate = BirthDate.create(date);

      expect(birthDate.isMinor(new Date('2024-01-01'))).toBe(true);
      expect(birthDate.isAdult(new Date('2024-01-01'))).toBe(false);
    });

    it('should identify adult correctly', () => {
      const date = new Date('1990-01-01');

      const birthDate = BirthDate.create(date);

      expect(birthDate.isMinor(new Date('2024-01-01'))).toBe(false);
      expect(birthDate.isAdult(new Date('2024-01-01'))).toBe(true);
    });

    it('should identify senior correctly', () => {
      const date = new Date('1950-01-01');

      const birthDate = BirthDate.create(date);

      expect(birthDate.isSenior(new Date('2024-01-01'))).toBe(true);
    });

    it('should handle 18th birthday correctly', () => {
      const date = new Date('2006-01-15');

      const birthDate = BirthDate.create(date);

      expect(birthDate.isAdult(new Date('2024-01-15'))).toBe(true);
      expect(birthDate.isMinor(new Date('2024-01-14'))).toBe(true);
    });
  });

  describe('next birthday', () => {
    it('should calculate next birthday in current year', () => {
      const birthDate = BirthDate.fromComponents(1990, 12, 25);
      const referenceDate = new Date('2024-01-15');

      const nextBirthday = birthDate.getNextBirthday(referenceDate);

      expect(nextBirthday.getFullYear()).toBe(2024);
      expect(nextBirthday.getMonth()).toBe(11); // December
      expect(nextBirthday.getDate()).toBe(25);
    });

    it('should calculate next birthday in next year', () => {
      const birthDate = BirthDate.fromComponents(1990, 1, 10);
      const referenceDate = new Date('2024-06-15');

      const nextBirthday = birthDate.getNextBirthday(referenceDate);

      expect(nextBirthday.getFullYear()).toBe(2025);
    });

    it('should detect birthday based on month and day', () => {
      const birthDate = BirthDate.fromComponents(1990, 1, 15);
      const referenceDate1 = new Date(2024, 0, 15); // Same month and day

      expect(birthDate.isBirthdayToday(referenceDate1)).toBe(true);

      const referenceDate2 = new Date(2024, 0, 16); // Different day

      expect(birthDate.isBirthdayToday(referenceDate2)).toBe(false);
    });
  });
});
