/**
 * Age Milestones Constants
 * Defines significant age thresholds across the lifespan
 * @module constants/age-milestones
 */

/**
 * Age Categories and Milestones
 */
export const AGE_MILESTONES = {
  /** Minimum valid age (newborn) */
  MIN_AGE: 0,

  /** Maximum realistic age for validation */
  MAX_AGE: 150,

  /** Age of majority/adulthood in most countries */
  ADULT_AGE: 18,

  /** Legal drinking age in some countries */
  LEGAL_DRINKING_AGE_US: 21,

  /** Typical retirement age */
  RETIREMENT_AGE: 65,

  /** Senior citizen threshold */
  SENIOR_AGE: 65,

  /** Teenager threshold */
  TEENAGER_MIN_AGE: 13,
  TEENAGER_MAX_AGE: 19,

  /** Young adult threshold */
  YOUNG_ADULT_MIN_AGE: 20,
  YOUNG_ADULT_MAX_AGE: 29,

  /** Middle age threshold */
  MIDDLE_AGE_MIN_AGE: 30,
  MIDDLE_AGE_MAX_AGE: 64,
} as const;

/**
 * Age Validation Rules
 */
export const AGE_VALIDATION = {
  MIN_VALID_AGE: AGE_MILESTONES.MIN_AGE,
  MAX_VALID_AGE: AGE_MILESTONES.MAX_AGE,
} as const;
