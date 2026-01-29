import { DddValueObject } from '@nestjslatam/ddd-lib';
import { DateRangeValidator } from './date-range.validator';

interface DateRangeProps {
  startDate: Date;
  endDate: Date;
}

/**
 * DateRange Value Object
 * Represents a period between two dates
 */
export class DateRange extends DddValueObject<DateRangeProps> {
  private constructor(props: DateRangeProps) {
    super(props);
  }

  /**
   * Creates a new DateRange with validation
   */
  static create(startDate: Date, endDate: Date): DateRange {
    const dateRange = new DateRange({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    dateRange.addValidators();

    if (!dateRange.isValid) {
      throw new Error(`Invalid DateRange: ${dateRange.brokenRules.getBrokenRulesAsString()}`);
    }

    return dateRange;
  }

  /**
   * Creates a DateRange from string dates
   */
  static fromStrings(startDate: string, endDate: string): DateRange {
    return DateRange.create(new Date(startDate), new Date(endDate));
  }

  /**
   * Creates a DateRange for the current month
   */
  static currentMonth(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return DateRange.create(start, end);
  }

  /**
   * Creates a DateRange for the current year
   */
  static currentYear(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    return DateRange.create(start, end);
  }

  /**
   * Creates a DateRange for the last N days
   */
  static lastDays(days: number): DateRange {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return DateRange.create(start, end);
  }

  /**
   * Loads a DateRange from persisted data
   */
  static load(startDate: Date, endDate: Date): DateRange {
    return new DateRange({ startDate, endDate });
  }

  get startDate(): Date {
    return new Date(this.getValue().startDate);
  }

  get endDate(): Date {
    return new Date(this.getValue().endDate);
  }

  /**
   * Returns the duration in milliseconds
   */
  getDurationMs(): number {
    return this.endDate.getTime() - this.startDate.getTime();
  }

  /**
   * Returns the duration in days
   */
  getDurationDays(): number {
    return Math.ceil(this.getDurationMs() / (1000 * 60 * 60 * 24));
  }

  /**
   * Returns the duration in hours
   */
  getDurationHours(): number {
    return Math.ceil(this.getDurationMs() / (1000 * 60 * 60));
  }

  /**
   * Checks if a date is within this range
   */
  contains(date: Date): boolean {
    const time = date.getTime();
    return time >= this.startDate.getTime() && time <= this.endDate.getTime();
  }

  /**
   * Checks if this range overlaps with another
   */
  overlaps(other: DateRange): boolean {
    return this.startDate <= other.endDate && this.endDate >= other.startDate;
  }

  /**
   * Checks if this range is entirely before another
   */
  isBefore(other: DateRange): boolean {
    return this.endDate < other.startDate;
  }

  /**
   * Checks if this range is entirely after another
   */
  isAfter(other: DateRange): boolean {
    return this.startDate > other.endDate;
  }

  /**
   * Returns the intersection with another range (if any)
   */
  intersect(other: DateRange): DateRange | null {
    if (!this.overlaps(other)) return null;

    const start = this.startDate > other.startDate ? this.startDate : other.startDate;
    const end = this.endDate < other.endDate ? this.endDate : other.endDate;

    return DateRange.create(start, end);
  }

  /**
   * Extends the range by adding days
   */
  extendByDays(days: number): DateRange {
    const newEnd = new Date(this.endDate);
    newEnd.setDate(newEnd.getDate() + days);
    return DateRange.create(this.startDate, newEnd);
  }

  addValidators(): void {
    this.validatorRules.add(new DateRangeValidator(this));
  }

  protected getEqualityComponents(): Iterable<any> {
    const props = this.getValue();
    return [props.startDate.getTime(), props.endDate.getTime()];
  }

  toString(): string {
    return `${this.startDate.toISOString()} - ${this.endDate.toISOString()}`;
  }

  toJSON(): { startDate: string; endDate: string } {
    return {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
    };
  }
}
