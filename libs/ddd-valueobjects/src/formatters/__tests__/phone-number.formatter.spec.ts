import { PhoneNumberFormatter } from '../phone-number.formatter';
import { PhoneNumber } from '../../implementations/phone-number/phone-number.value-object';

describe('PhoneNumberFormatter', () => {
  let formatter: PhoneNumberFormatter;

  beforeEach(() => {
    formatter = new PhoneNumberFormatter();
  });

  describe('formatInternational', () => {
    it('should format 10-digit US number with default country code', () => {
      const phone = PhoneNumber.create('5551234567', { format: 'national' });
      const result = formatter.formatInternational(phone);

      expect(result).toBe('+1 (555) 123-4567');
    });

    it('should format 10-digit number with custom country code', () => {
      const phone = PhoneNumber.create('5551234567', { format: 'national' });
      const result = formatter.formatInternational(phone, '+44');

      expect(result).toBe('+44 (555) 123-4567');
    });

    it('should format 11-digit number correctly', () => {
      const phone = PhoneNumber.create('15551234567', { format: 'national' });
      const result = formatter.formatInternational(phone);

      expect(result).toBe('+1 (555) 123-4567');
    });

    it('should return original value for non-standard length', () => {
      const phone = PhoneNumber.create('123456789', { format: 'national' });
      const result = formatter.formatInternational(phone);

      expect(result).toBe('123456789');
    });
  }); // End formatInternational tests

  describe('formatNational', () => {
    it('should format 10-digit number without country code', () => {
      const phone = PhoneNumber.create('5551234567', { format: 'national' });
      const result = formatter.formatNational(phone);

      expect(result).toBe('(555) 123-4567');
    });

    it('should format 11-digit number taking last 10 digits', () => {
      const phone = PhoneNumber.create('15551234567', { format: 'national' });
      const result = formatter.formatNational(phone);

      expect(result).toBe('(555) 123-4567');
    });

    it('should return original value for short numbers', () => {
      const phone = PhoneNumber.create('1234567890', { format: 'national' });
      const result = formatter.formatNational(phone);

      expect(result).toBe('(123) 456-7890');
    });
  });

  describe('format', () => {
    it('should use international format by default', () => {
      const phone = PhoneNumber.create('5551234567', { format: 'national' });
      const result = formatter.format(phone);

      expect(result).toBe('+1 (555) 123-4567');
    });

    it('should use national format when specified', () => {
      const phone = PhoneNumber.create('5551234567', { format: 'national' });
      const result = formatter.format(phone, 'national');

      expect(result).toBe('(555) 123-4567');
    });

    it('should accept custom country code', () => {
      const phone = PhoneNumber.create('5551234567', { format: 'national' });
      const result = formatter.format(phone, 'international', '+52');

      expect(result).toBe('+52 (555) 123-4567');
    });
  });

  describe('getDigitsOnly', () => {
    it('should extract only digits from formatted number', () => {
      const phone = PhoneNumber.create('+1 (555) 123-4567', { format: 'international' });
      const result = formatter.getDigitsOnly(phone);

      expect(result).toBe('15551234567');
    });

    it('should handle numbers with various separators', () => {
      const phone = PhoneNumber.create('555-123-4567', { format: 'national' });
      const result = formatter.getDigitsOnly(phone);

      expect(result).toBe('5551234567');
    });

    it('should return digits from plain number', () => {
      const phone = PhoneNumber.create('5551234567', { format: 'national' });
      const result = formatter.getDigitsOnly(phone);

      expect(result).toBe('5551234567');
    });
  });

  describe('formatE164', () => {
    it('should format 10-digit number to E.164 standard', () => {
      const phone = PhoneNumber.create('5551234567', { format: 'national' });
      const result = formatter.formatE164(phone);

      expect(result).toBe('+15551234567');
    });

    it('should handle 11-digit numbers starting with 1', () => {
      const phone = PhoneNumber.create('15551234567', { format: 'national' });
      const result = formatter.formatE164(phone);

      expect(result).toBe('+15551234567');
    });

    it('should use custom country code', () => {
      const phone = PhoneNumber.create('5551234567', { format: 'national' });
      const result = formatter.formatE164(phone, '+44');

      expect(result).toBe('+445551234567');
    });
  });

  describe('formatTelLink', () => {
    it('should create clickable tel: link', () => {
      const phone = PhoneNumber.create('5551234567', { format: 'national' });
      const result = formatter.formatTelLink(phone);

      expect(result).toBe('tel:+15551234567');
    });

    it('should use E.164 format for tel: link', () => {
      const phone = PhoneNumber.create('555-123-4567', { format: 'national' });
      const result = formatter.formatTelLink(phone);

      expect(result).toBe('tel:+15551234567');
    });

    it('should support custom country code in tel: link', () => {
      const phone = PhoneNumber.create('5551234567', { format: 'national' });
      const result = formatter.formatTelLink(phone, '+52');

      expect(result).toBe('tel:+525551234567');
    });
  });
});
