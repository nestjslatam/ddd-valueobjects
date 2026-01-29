import { Injectable } from '@nestjs/common';
import { DateRange } from '../implementations/date-range/date-range.value-object';

/**
 * DateRange Formatter
 * Handles presentation layer concerns for DateRange value objects
 * Separated from domain layer to respect SRP and SoC principles
 */
@Injectable()
export class DateRangeFormatter {
  /**
   * Formats date range with full dates
   * Example: "Jan 1, 2024 - Dec 31, 2024"
   */
  format(dateRange: DateRange, locale: string = 'en-US'): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const start = dateRange.startDate.toLocaleDateString(locale, options);
    const end = dateRange.endDate.toLocaleDateString(locale, options);
    return `${start} - ${end}`;
  }

  /**
   * Formats date range with short dates
   * Example: "01/01/24 - 12/31/24"
   */
  formatShort(dateRange: DateRange, locale: string = 'en-US'): string {
    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    };
    const start = dateRange.startDate.toLocaleDateString(locale, options);
    const end = dateRange.endDate.toLocaleDateString(locale, options);
    return `${start} - ${end}`;
  }

  /**
   * Formats date range with long dates
   * Example: "January 1, 2024 - December 31, 2024"
   */
  formatLong(dateRange: DateRange, locale: string = 'en-US'): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const start = dateRange.startDate.toLocaleDateString(locale, options);
    const end = dateRange.endDate.toLocaleDateString(locale, options);
    return `${start} - ${end}`;
  }

  /**
   * Formats date range with relative description
   * Example: "2 days ago - yesterday", "today - tomorrow"
   */
  formatRelative(dateRange: DateRange, locale: string = 'en-US'): string {
    const now = new Date();
    const startRelative = this.getRelativeDate(dateRange.startDate, now, locale);
    const endRelative = this.getRelativeDate(dateRange.endDate, now, locale);
    return `${startRelative} - ${endRelative}`;
  }

  /**
   * Formats date range with ISO 8601 format
   * Example: "2024-01-01/2024-12-31"
   */
  formatISO(dateRange: DateRange): string {
    const start = dateRange.startDate.toISOString().split('T')[0];
    const end = dateRange.endDate.toISOString().split('T')[0];
    return `${start}/${end}`;
  }

  /**
   * Formats date range with duration
   * Example: "Jan 1, 2024 - Dec 31, 2024 (365 days)"
   */
  formatWithDuration(dateRange: DateRange, locale: string = 'en-US'): string {
    const formatted = this.format(dateRange, locale);
    const days = dateRange.getDurationDays();
    return `${formatted} (${days} ${days === 1 ? 'day' : 'days'})`;
  }

  /**
   * Formats date range for calendar display
   * Example: "Jan 1 - 31, 2024" (same month), "Jan 1 - Feb 28, 2024" (different months)
   */
  formatCalendar(dateRange: DateRange, locale: string = 'en-US'): string {
    const startYear = dateRange.startDate.getFullYear();
    const endYear = dateRange.endDate.getFullYear();
    const startMonth = dateRange.startDate.getMonth();
    const endMonth = dateRange.endDate.getMonth();

    // Same month and year
    if (startYear === endYear && startMonth === endMonth) {
      const monthYear = dateRange.startDate.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
      });
      const startDay = dateRange.startDate.getDate();
      const endDay = dateRange.endDate.getDate();
      return `${monthYear} ${startDay}-${endDay}`;
    }

    // Same year
    if (startYear === endYear) {
      const start = dateRange.startDate.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
      });
      const end = dateRange.endDate.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
      });
      return `${start} - ${end}, ${endYear}`;
    }

    // Different years
    return this.format(dateRange, locale);
  }

  /**
   * Gets relative date description
   */
  private getRelativeDate(date: Date, now: Date, locale: string): string {
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays === -1) return 'yesterday';
    if (diffDays > 0 && diffDays <= 7) return `in ${diffDays} days`;
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
