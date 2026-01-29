/**
 * Date Range Constraints
 * Defines time-related calculations and limits
 * @module constants/date-constraints
 */

/**
 * Time Unit Conversions (in milliseconds)
 */
export const TIME_UNITS = {
  MILLISECONDS_PER_SECOND: 1000,
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  DAYS_PER_YEAR: 365,
  DAYS_PER_LEAP_YEAR: 366,
} as const;

/**
 * Derived Time Conversions
 */
export const TIME_CONVERSIONS = {
  /** Milliseconds in one second */
  MS_PER_SECOND: TIME_UNITS.MILLISECONDS_PER_SECOND,

  /** Milliseconds in one minute */
  MS_PER_MINUTE: TIME_UNITS.MILLISECONDS_PER_SECOND * TIME_UNITS.SECONDS_PER_MINUTE,

  /** Milliseconds in one hour */
  MS_PER_HOUR:
    TIME_UNITS.MILLISECONDS_PER_SECOND *
    TIME_UNITS.SECONDS_PER_MINUTE *
    TIME_UNITS.MINUTES_PER_HOUR,

  /** Milliseconds in one day */
  MS_PER_DAY:
    TIME_UNITS.MILLISECONDS_PER_SECOND *
    TIME_UNITS.SECONDS_PER_MINUTE *
    TIME_UNITS.MINUTES_PER_HOUR *
    TIME_UNITS.HOURS_PER_DAY,
} as const;

/**
 * Date Range Validation Constraints
 */
export const DATE_RANGE_CONSTRAINTS = {
  /** Maximum duration in days (100 years) */
  MAX_DURATION_DAYS: 36500,

  /** Minimum year for date validation */
  MIN_YEAR: 1900,

  /** Maximum year for date validation (current + 100) */
  MAX_YEAR: new Date().getFullYear() + 100,

  /** Days in typical year */
  DAYS_IN_YEAR: TIME_UNITS.DAYS_PER_YEAR,
} as const;

/**
 * Birthday/BirthDate Constraints
 */
export const BIRTH_DATE_CONSTRAINTS = {
  /** Earliest valid birth year */
  MIN_BIRTH_YEAR: 1900,

  /** Latest birth year (cannot be future) */
  MAX_BIRTH_YEAR: new Date().getFullYear(),

  /** Maximum age for validation (years) */
  MAX_AGE: 150,
} as const;
