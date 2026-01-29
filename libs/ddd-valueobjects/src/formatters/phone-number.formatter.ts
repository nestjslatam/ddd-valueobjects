import { Injectable } from '@nestjs/common';
import { PhoneNumber } from '../implementations/phone-number/phone-number.value-object';

/**
 * Phone Number Formatter
 * Handles presentation layer concerns for PhoneNumber value objects
 * Separated from domain layer to respect SRP and SoC principles
 */
@Injectable()
export class PhoneNumberFormatter {
  /**
   * Returns formatted phone number in international format
   * Format: +1 (555) 123-4567
   */
  formatInternational(phoneNumber: PhoneNumber, countryCode: string = '+1'): string {
    const digits = this.getDigitsOnly(phoneNumber);

    if (digits.length === 10) {
      return `${countryCode} (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    if (digits.length === 11) {
      return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }

    return phoneNumber.getValue();
  }

  /**
   * Returns formatted phone number in national format (without country code)
   * Format: (555) 123-4567
   */
  formatNational(phoneNumber: PhoneNumber): string {
    const digits = this.getDigitsOnly(phoneNumber);

    if (digits.length >= 10) {
      const nationalDigits = digits.slice(-10);
      return `(${nationalDigits.slice(0, 3)}) ${nationalDigits.slice(3, 6)}-${nationalDigits.slice(6)}`;
    }

    return phoneNumber.getValue();
  }

  /**
   * Returns formatted phone number based on format option
   */
  format(
    phoneNumber: PhoneNumber,
    format: 'international' | 'national' = 'international',
    countryCode: string = '+1',
  ): string {
    if (format === 'national') {
      return this.formatNational(phoneNumber);
    }

    return this.formatInternational(phoneNumber, countryCode);
  }

  /**
   * Returns phone number with only digits (no formatting)
   */
  getDigitsOnly(phoneNumber: PhoneNumber): string {
    return phoneNumber.getValue().replace(/\D/g, '');
  }

  /**
   * Returns E.164 format (+15551234567)
   * This is the standard international format for phone numbers
   */
  formatE164(phoneNumber: PhoneNumber, countryCode: string = '+1'): string {
    const digits = this.getDigitsOnly(phoneNumber);

    if (digits.length === 10) {
      return `${countryCode}${digits}`;
    }

    // If 11 digits and starts with 1, it already includes US country code
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }

    return countryCode + digits;
  }

  /**
   * Returns phone number as a clickable tel: link
   */
  formatTelLink(phoneNumber: PhoneNumber, countryCode: string = '+1'): string {
    return `tel:${this.formatE164(phoneNumber, countryCode)}`;
  }
}
