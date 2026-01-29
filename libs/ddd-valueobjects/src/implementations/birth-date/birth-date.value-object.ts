import { DddValueObject } from '@nestjslatam/ddd-lib';
import { BirthDateValidator } from './birth-date.validator';

/**
 * BirthDate Value Object
 * Represents a person's date of birth with age calculation
 */
export class BirthDate extends DddValueObject<Date> {
  private constructor(value: Date) {
    super(value);
  }

  /**
   * Creates a new BirthDate with validation
   */
  static create(date: Date): BirthDate {
    const birthDate = new BirthDate(new Date(date));
    birthDate.addValidators();

    if (!birthDate.isValid) {
      throw new Error(`Invalid BirthDate: ${birthDate.brokenRules.getBrokenRulesAsString()}`);
    }

    return birthDate;
  }

  /**
   * Creates a BirthDate from a string
   */
  static fromString(dateString: string): BirthDate {
    return BirthDate.create(new Date(dateString));
  }

  /**
   * Creates a BirthDate from components
   */
  static fromComponents(year: number, month: number, day: number): BirthDate {
    return BirthDate.create(new Date(year, month - 1, day));
  }

  /**
   * Loads a BirthDate from persisted data
   */
  static load(date: Date): BirthDate {
    return new BirthDate(date);
  }

  /**
   * Returns the birth date as Date object
   */
  getDate(): Date {
    return new Date(this.getValue());
  }

  /**
   * Calculates current age in years
   */
  getAge(referenceDate: Date = new Date()): number {
    const birthDate = this.getValue();
    let age = referenceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = referenceDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Checks if person is a minor (under 18)
   */
  isMinor(referenceDate: Date = new Date()): boolean {
    return this.getAge(referenceDate) < 18;
  }

  /**
   * Checks if person is an adult (18 or over)
   */
  isAdult(referenceDate: Date = new Date()): boolean {
    return this.getAge(referenceDate) >= 18;
  }

  /**
   * Checks if person is a senior (65 or over)
   */
  isSenior(referenceDate: Date = new Date()): boolean {
    return this.getAge(referenceDate) >= 65;
  }

  /**
   * Returns the next birthday date
   */
  getNextBirthday(referenceDate: Date = new Date()): Date {
    const birthDate = this.getValue();
    const nextBirthday = new Date(
      referenceDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
    );

    if (nextBirthday < referenceDate) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }

    return nextBirthday;
  }

  /**
   * Returns days until next birthday
   */
  getDaysUntilBirthday(referenceDate: Date = new Date()): number {
    const nextBirthday = this.getNextBirthday(referenceDate);
    const diffMs = nextBirthday.getTime() - referenceDate.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Checks if today is the birthday
   */
  isBirthdayToday(referenceDate: Date = new Date()): boolean {
    const birthDate = this.getValue();
    return (
      birthDate.getMonth() === referenceDate.getMonth() &&
      birthDate.getDate() === referenceDate.getDate()
    );
  }

  addValidators(): void {
    this.validatorRules.add(new BirthDateValidator(this));
  }

  protected getEqualityComponents(): Iterable<any> {
    return [this.getValue().getTime()];
  }

  toString(): string {
    return this.getValue().toISOString();
  }

  toJSON(): string {
    return this.getValue().toISOString();
  }
}
