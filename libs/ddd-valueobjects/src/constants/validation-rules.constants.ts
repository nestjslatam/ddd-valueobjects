/**
 * Validation Rules Constants
 * Centralized validation constraints to eliminate magic numbers
 * @module constants/validation-rules
 */

/**
 * Phone Number Validation Rules
 */
export const PHONE_NUMBER_CONSTRAINTS = {
  MIN_DIGITS: 10,
  MAX_DIGITS: 15,
  DEFAULT_COUNTRY_CODE: '+1',
} as const;

/**
 * Name Validation Rules
 */
export const NAME_CONSTRAINTS = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 50,
  MIN_FIRST_NAME_LENGTH: 2,
  MAX_FIRST_NAME_LENGTH: 50,
  MIN_LAST_NAME_LENGTH: 2,
  MAX_LAST_NAME_LENGTH: 50,
} as const;

/**
 * Description Validation Rules
 */
export const DESCRIPTION_CONSTRAINTS = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 500,
} as const;

/**
 * URL Validation Rules
 */
export const URL_CONSTRAINTS = {
  MAX_LENGTH: 2048,
  MIN_LENGTH: 10,
} as const;

/**
 * Document ID Validation Rules
 */
export const DOCUMENT_ID_CONSTRAINTS = {
  DNI: {
    MIN_LENGTH: 7,
    MAX_LENGTH: 10,
  },
  PASSPORT: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 12,
  },
  SSN: {
    EXACT_LENGTH: 9,
  },
  TAX_ID: {
    MIN_LENGTH: 9,
    MAX_LENGTH: 15,
  },
  DRIVER_LICENSE: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 20,
  },
} as const;

/**
 * UUID Validation Rules
 */
export const UUID_CONSTRAINTS = {
  VERSION_4_VARIANT_BITS: 0x3,
  VERSION_4_BYTE_INDEX: 16,
  VARIANT_BYTE_MASK: 0x8,
} as const;
