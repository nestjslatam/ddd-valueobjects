/**
 * Monetary Constants
 * Defines currency-related calculations and constraints
 * @module constants/monetary
 */

/**
 * Currency Conversion and Calculation Constants
 */
export const MONETARY_CONSTANTS = {
  /** Cents per dollar/euro/pound (decimal places = 2) */
  CENTS_MULTIPLIER: 100,

  /** Decimal places for most currencies */
  STANDARD_DECIMAL_PLACES: 2,

  /** Minimum money amount (0.01 for most currencies) */
  MIN_AMOUNT: 0.01,

  /** Maximum realistic money amount for validation */
  MAX_AMOUNT: 999999999999.99,

  /** Rounding precision for calculations */
  ROUNDING_PRECISION: 0.01,
} as const;

/**
 * Percentage Constants
 */
export const PERCENTAGE_CONSTANTS = {
  /** Minimum percentage value */
  MIN_VALUE: 0,

  /** Maximum percentage value */
  MAX_VALUE: 100,

  /** Percentage to decimal multiplier */
  DECIMAL_MULTIPLIER: 100,
} as const;
