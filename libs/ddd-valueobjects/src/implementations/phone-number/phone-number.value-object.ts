import { DddValueObject } from '@nestjslatam/ddd-lib';
import { PhoneNumberValidator } from './phone-number.validator';

interface PhoneNumberOptions {
  countryCode?: string;
  format?: 'international' | 'national';
}

/**
 * PhoneNumber Value Object
 * Represents a phone number with country code and validation
 */
export class PhoneNumber extends DddValueObject<string> {
  private options!: Required<PhoneNumberOptions>; // Use definite assignment assertion

  private constructor(value: string, opts: PhoneNumberOptions = {}) {
    super(value);
    // Initialize options after super() - guaranteed to be set before any method access
    this.options = {
      countryCode: opts?.countryCode ?? '+1',
      format: opts?.format ?? 'international',
    };
  }

  /**
   * Creates a new PhoneNumber with validation
   */
  static create(value: string, options?: PhoneNumberOptions): PhoneNumber {
    const phone = new PhoneNumber(value?.trim() || '', options);
    phone.addValidators();

    if (!phone.isValid) {
      throw new Error(`Invalid PhoneNumber: ${phone.brokenRules.getBrokenRulesAsString()}`);
    }

    return phone;
  }

  /**
   * Loads a PhoneNumber from persisted data
   */
  static load(value: string, options?: PhoneNumberOptions): PhoneNumber {
    return new PhoneNumber(value, options);
  }

  get countryCode(): string {
    return this.options.countryCode;
  }

  addValidators(): void {
    this.validatorRules.add(new PhoneNumberValidator(this, this.options));
  }

  protected getEqualityComponents(): Iterable<any> {
    return [this.getValue().replace(/\D/g, '')];
  }

  toString(): string {
    return this.getValue();
  }

  toJSON(): string {
    return this.getValue();
  }
}
