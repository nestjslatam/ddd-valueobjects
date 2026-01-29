import { DddValueObject } from '@nestjslatam/ddd-lib';
import { NameValidator } from './name.validator';

interface NameProps {
  firstName: string;
  lastName: string;
  middleName?: string;
}

/**
 * Name Value Object
 * Represents a person's full name with validation
 */
export class Name extends DddValueObject<NameProps> {
  private constructor(value: NameProps) {
    super(value);
  }

  /**
   * Creates a new Name instance with validation
   */
  static create(firstName: string, lastName: string, middleName?: string): Name {
    const name = new Name({ firstName, lastName, middleName });
    name.addValidators();

    if (!name.isValid) {
      throw new Error(`Invalid Name: ${name.brokenRules.getBrokenRulesAsString()}`);
    }

    return name;
  }

  /**
   * Loads a Name from persisted data (skips validation)
   */
  static load(firstName: string, lastName: string, middleName?: string): Name {
    return new Name({ firstName, lastName, middleName });
  }

  get firstName(): string {
    return this.getValue().firstName;
  }

  get lastName(): string {
    return this.getValue().lastName;
  }

  get middleName(): string | undefined {
    return this.getValue().middleName;
  }

  /**
   * Returns the full name as a string
   */
  getFullName(): string {
    const { firstName, middleName, lastName } = this.getValue();
    return middleName ? `${firstName} ${middleName} ${lastName}` : `${firstName} ${lastName}`;
  }

  /**
   * Returns initials (e.g., "John Doe" -> "JD")
   */
  getInitials(): string {
    const { firstName, middleName, lastName } = this.getValue();
    let initials = firstName.charAt(0) + lastName.charAt(0);
    if (middleName) {
      initials = firstName.charAt(0) + middleName.charAt(0) + lastName.charAt(0);
    }
    return initials.toUpperCase();
  }

  addValidators(): void {
    this.validatorRules.add(new NameValidator(this));
  }

  protected getEqualityComponents(): Iterable<any> {
    const value = this.getValue();
    return [value.firstName, value.lastName, value.middleName];
  }

  toString(): string {
    return this.getFullName();
  }

  toJSON(): NameProps {
    return this.getValue();
  }
}
