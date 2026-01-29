import { Injectable } from '@nestjs/common';
import { BirthDate } from '../implementations/birth-date/birth-date.value-object';

export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

interface ZodiacInfo {
  sign: ZodiacSign;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  quality: 'Cardinal' | 'Fixed' | 'Mutable';
  rulingPlanet: string;
  symbol: string;
  dateRange: string;
}

/**
 * Zodiac Calculator Service
 * Handles astrological calculations (Different Bounded Context)
 * Separated from BirthDate domain to respect SoC principles
 *
 * This belongs to an "Astrology" bounded context, not "Person" context
 */
@Injectable()
export class ZodiacCalculatorService {
  private readonly zodiacData: Record<ZodiacSign, Omit<ZodiacInfo, 'sign'>> = {
    Aries: {
      element: 'Fire',
      quality: 'Cardinal',
      rulingPlanet: 'Mars',
      symbol: '♈',
      dateRange: 'March 21 - April 19',
    },
    Taurus: {
      element: 'Earth',
      quality: 'Fixed',
      rulingPlanet: 'Venus',
      symbol: '♉',
      dateRange: 'April 20 - May 20',
    },
    Gemini: {
      element: 'Air',
      quality: 'Mutable',
      rulingPlanet: 'Mercury',
      symbol: '♊',
      dateRange: 'May 21 - June 20',
    },
    Cancer: {
      element: 'Water',
      quality: 'Cardinal',
      rulingPlanet: 'Moon',
      symbol: '♋',
      dateRange: 'June 21 - July 22',
    },
    Leo: {
      element: 'Fire',
      quality: 'Fixed',
      rulingPlanet: 'Sun',
      symbol: '♌',
      dateRange: 'July 23 - August 22',
    },
    Virgo: {
      element: 'Earth',
      quality: 'Mutable',
      rulingPlanet: 'Mercury',
      symbol: '♍',
      dateRange: 'August 23 - September 22',
    },
    Libra: {
      element: 'Air',
      quality: 'Cardinal',
      rulingPlanet: 'Venus',
      symbol: '♎',
      dateRange: 'September 23 - October 22',
    },
    Scorpio: {
      element: 'Water',
      quality: 'Fixed',
      rulingPlanet: 'Pluto',
      symbol: '♏',
      dateRange: 'October 23 - November 21',
    },
    Sagittarius: {
      element: 'Fire',
      quality: 'Mutable',
      rulingPlanet: 'Jupiter',
      symbol: '♐',
      dateRange: 'November 22 - December 21',
    },
    Capricorn: {
      element: 'Earth',
      quality: 'Cardinal',
      rulingPlanet: 'Saturn',
      symbol: '♑',
      dateRange: 'December 22 - January 19',
    },
    Aquarius: {
      element: 'Air',
      quality: 'Fixed',
      rulingPlanet: 'Uranus',
      symbol: '♒',
      dateRange: 'January 20 - February 18',
    },
    Pisces: {
      element: 'Water',
      quality: 'Mutable',
      rulingPlanet: 'Neptune',
      symbol: '♓',
      dateRange: 'February 19 - March 20',
    },
  };

  /**
   * Calculates zodiac sign from birth date
   * Uses lookup table for better performance and maintainability
   */
  calculateZodiacSign(birthDate: BirthDate): ZodiacSign {
    const date = birthDate.getDate();
    const month = date.getMonth() + 1; // 1-based
    const day = date.getDate();

    // Lookup table approach (CCN = 1, much better than 12 ifs)
    const zodiacRanges: Array<[number, number, number, number, ZodiacSign]> = [
      [3, 21, 4, 19, 'Aries'],
      [4, 20, 5, 20, 'Taurus'],
      [5, 21, 6, 20, 'Gemini'],
      [6, 21, 7, 22, 'Cancer'],
      [7, 23, 8, 22, 'Leo'],
      [8, 23, 9, 22, 'Virgo'],
      [9, 23, 10, 22, 'Libra'],
      [10, 23, 11, 21, 'Scorpio'],
      [11, 22, 12, 21, 'Sagittarius'],
      [12, 22, 1, 19, 'Capricorn'],
      [1, 20, 2, 18, 'Aquarius'],
      [2, 19, 3, 20, 'Pisces'],
    ];

    for (const [startMonth, startDay, endMonth, endDay, sign] of zodiacRanges) {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign;
      }
    }

    return 'Pisces'; // Fallback (should never reach)
  }

  /**
   * Gets detailed zodiac information
   */
  getZodiacInfo(birthDate: BirthDate): ZodiacInfo {
    const sign = this.calculateZodiacSign(birthDate);
    return {
      sign,
      ...this.zodiacData[sign],
    };
  }

  /**
   * Checks compatibility between two zodiac signs
   * Simplified compatibility based on elements
   */
  checkCompatibility(
    sign1: ZodiacSign,
    sign2: ZodiacSign,
  ): {
    compatible: boolean;
    score: number;
    description: string;
  } {
    const info1 = this.zodiacData[sign1];
    const info2 = this.zodiacData[sign2];

    // Same element = high compatibility
    if (info1.element === info2.element) {
      return {
        compatible: true,
        score: 90,
        description: 'Highly compatible - same element',
      };
    }

    // Compatible elements
    const compatiblePairs: Array<[string, string]> = [
      ['Fire', 'Air'],
      ['Earth', 'Water'],
    ];

    const isCompatible = compatiblePairs.some(
      ([e1, e2]) =>
        (info1.element === e1 && info2.element === e2) ||
        (info1.element === e2 && info2.element === e1),
    );

    if (isCompatible) {
      return {
        compatible: true,
        score: 70,
        description: 'Compatible elements',
      };
    }

    return {
      compatible: false,
      score: 50,
      description: 'Challenging elements',
    };
  }

  /**
   * Gets all zodiac signs with their info
   */
  getAllZodiacSigns(): ZodiacInfo[] {
    return (Object.keys(this.zodiacData) as ZodiacSign[]).map((sign) => ({
      sign,
      ...this.zodiacData[sign],
    }));
  }
}
