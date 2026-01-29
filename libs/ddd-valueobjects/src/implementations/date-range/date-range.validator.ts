import { AbstractRuleValidator } from '@nestjslatam/ddd-lib';
import { DateRange } from './date-range.value-object';

/**
 * Validator for DateRange Value Object
 */
export class DateRangeValidator extends AbstractRuleValidator<DateRange> {
  addRules(): void {
    const props = this.subject.getValue();
    const { startDate, endDate } = props;

    // Null/undefined validation
    if (!startDate) {
      this.addBrokenRule('startDate', 'Start date cannot be null or undefined');
    }

    if (!endDate) {
      this.addBrokenRule('endDate', 'End date cannot be null or undefined');
    }

    // If either is null, skip further validation
    if (!startDate || !endDate) return;

    // Valid date validation
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      this.addBrokenRule('startDate', 'Start date must be a valid date');
    }

    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      this.addBrokenRule('endDate', 'End date must be a valid date');
    }

    // Skip chronological validation if dates are invalid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return;

    // Chronological order validation
    if (startDate > endDate) {
      this.addBrokenRule('dateRange', 'Start date must be before or equal to end date');
    }

    // Reasonable range validation (e.g., not more than 100 years)
    const maxRangeMs = 100 * 365 * 24 * 60 * 60 * 1000; // 100 years
    const rangeMs = endDate.getTime() - startDate.getTime();

    if (rangeMs > maxRangeMs) {
      this.addBrokenRule('dateRange', 'Date range cannot exceed 100 years');
    }

    // Future date validation (optional - can be removed if future dates are needed)
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 10); // 10 years in future

    if (endDate > maxFutureDate) {
      this.addBrokenRule('endDate', 'End date cannot be more than 10 years in the future');
    }

    // Historical date validation
    const minDate = new Date('1900-01-01');
    if (startDate < minDate) {
      this.addBrokenRule('startDate', 'Start date cannot be before year 1900');
    }
  }
}
