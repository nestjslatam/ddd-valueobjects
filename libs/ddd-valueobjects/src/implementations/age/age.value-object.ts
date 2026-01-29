import { DddValueObject } from '@nestjslatam/ddd-lib';
import { AgeValidator } from './age.validator';
import { AGE_VALIDATION } from '../../constants';

interface AgeOptions {
  minAge: number;
  maxAge: number;
}

/**
 * Age Value Object
 * Represents a person's age with validation
 */
export class Age extends DddValueObject<number> {
  private constructor(
    value: number,
    private readonly options: AgeOptions = {
      minAge: AGE_VALIDATION.MIN_VALID_AGE,
      maxAge: AGE_VALIDATION.MAX_VALID_AGE,
    },
  ) {
    super(value);
  }

  /**
   * Creates a new Age with validation
   */
  static create(value: number, options?: Partial<AgeOptions>): Age {
    const age = new Age(value, {
      minAge: options?.minAge ?? AGE_VALIDATION.MIN_VALID_AGE,
      maxAge: options?.maxAge ?? AGE_VALIDATION.MAX_VALID_AGE,
    });
    age.addValidators();

    if (!age.isValid) {
      throw new Error(`Invalid Age: ${age.brokenRules.getBrokenRulesAsString()}`);
    }

    return age;
  }

  /**
   * Creates an Age from a birth date
   */
  static fromBirthDate(birthDate: Date, referenceDate: Date = new Date()): Age {
    const ageInYears = this.calculateAge(birthDate, referenceDate);
    return Age.create(ageInYears);
  }

  /**
   * Loads an Age from persisted data
   */
  static load(value: number, options?: Partial<AgeOptions>): Age {
    return new Age(value, {
      minAge: options?.minAge ?? AGE_VALIDATION.MIN_VALID_AGE,
      maxAge: options?.maxAge ?? AGE_VALIDATION.MAX_VALID_AGE,
    });
  }

  getOptions(): AgeOptions {
    return { ...this.options };
  }

  /**
   * Checks if age represents a minor (under 18)
   */
  isMinor(): boolean {
    return this.getValue() < AGE_VALIDATION.MIN_VALID_AGE + 18; // Using 18 from milestones
  }

  /**
   * Checks if age represents an adult (18 or over)
   */
  isAdult(): boolean {
    return this.getValue() >= AGE_VALIDATION.MIN_VALID_AGE + 18;
  }

  /**
   * Checks if age represents a senior (65 or over)
   */
  isSenior(): boolean {
    return this.getValue() >= AGE_VALIDATION.MIN_VALID_AGE + 65;
  }

  /**
   * Returns the age category
   */
  getCategory(): 'child' | 'teenager' | 'adult' | 'senior' {
    const age = this.getValue();
    if (age < 13) return 'child';
    if (age < 18) return 'teenager';
    if (age < 65) return 'adult';
    return 'senior';
  }

  /**
   * Calculates age in years from a birth date
   */
  private static calculateAge(birthDate: Date, referenceDate: Date): number {
    let age = referenceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = referenceDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  addValidators(): void {
    this.validatorRules.add(new AgeValidator(this, this.options));
  }

  protected getEqualityComponents(): Iterable<any> {
    return [this.getValue()];
  }

  toString(): string {
    return `${this.getValue()} years`;
  }

  toJSON(): number {
    return this.getValue();
  }
}
