import { ZodiacCalculatorService } from '../zodiac-calculator.service';
import { BirthDate } from '../../implementations/birth-date/birth-date.value-object';

describe('ZodiacCalculatorService', () => {
  let service: ZodiacCalculatorService;

  beforeEach(() => {
    service = new ZodiacCalculatorService();
  });

  describe('calculateZodiacSign', () => {
    it('should calculate Aries (March 21 - April 19)', () => {
      const birthDate1 = BirthDate.create(new Date(1990, 2, 21)); // March 21 (month is 0-indexed)
      const birthDate2 = BirthDate.create(new Date(1990, 3, 10)); // April 10
      const birthDate3 = BirthDate.create(new Date(1990, 3, 19)); // April 19

      expect(service.calculateZodiacSign(birthDate1)).toBe('Aries');
      expect(service.calculateZodiacSign(birthDate2)).toBe('Aries');
      expect(service.calculateZodiacSign(birthDate3)).toBe('Aries');
    });

    it('should calculate Taurus (April 20 - May 20)', () => {
      const birthDate1 = BirthDate.create(new Date(1990, 3, 20)); // April 20 (month 0-indexed)
      const birthDate2 = BirthDate.create(new Date(1990, 4, 10)); // May 10
      const birthDate3 = BirthDate.create(new Date(1990, 4, 20)); // May 20

      expect(service.calculateZodiacSign(birthDate1)).toBe('Taurus');
      expect(service.calculateZodiacSign(birthDate2)).toBe('Taurus');
      expect(service.calculateZodiacSign(birthDate3)).toBe('Taurus');
    });

    it('should calculate Gemini (May 21 - June 20)', () => {
      const birthDate = BirthDate.create(new Date('1990-06-01'));

      expect(service.calculateZodiacSign(birthDate)).toBe('Gemini');
    });

    it('should calculate Cancer (June 21 - July 22)', () => {
      const birthDate = BirthDate.create(new Date('1990-07-10'));

      expect(service.calculateZodiacSign(birthDate)).toBe('Cancer');
    });

    it('should calculate Leo (July 23 - August 22)', () => {
      const birthDate = BirthDate.create(new Date('1990-08-10'));

      expect(service.calculateZodiacSign(birthDate)).toBe('Leo');
    });

    it('should calculate Virgo (August 23 - September 22)', () => {
      const birthDate = BirthDate.create(new Date('1990-09-10'));

      expect(service.calculateZodiacSign(birthDate)).toBe('Virgo');
    });

    it('should calculate Libra (September 23 - October 22)', () => {
      const birthDate = BirthDate.create(new Date('1990-10-10'));

      expect(service.calculateZodiacSign(birthDate)).toBe('Libra');
    });

    it('should calculate Scorpio (October 23 - November 21)', () => {
      const birthDate = BirthDate.create(new Date('1990-11-10'));

      expect(service.calculateZodiacSign(birthDate)).toBe('Scorpio');
    });

    it('should calculate Sagittarius (November 22 - December 21)', () => {
      const birthDate = BirthDate.create(new Date('1990-12-10'));

      expect(service.calculateZodiacSign(birthDate)).toBe('Sagittarius');
    });

    it('should calculate Capricorn (December 22 - January 19)', () => {
      const birthDate1 = BirthDate.create(new Date('1990-12-25')); // December part
      const birthDate2 = BirthDate.create(new Date('1991-01-10')); // January part

      expect(service.calculateZodiacSign(birthDate1)).toBe('Capricorn');
      expect(service.calculateZodiacSign(birthDate2)).toBe('Capricorn');
    });

    it('should calculate Aquarius (January 20 - February 18)', () => {
      const birthDate = BirthDate.create(new Date('1990-02-01'));

      expect(service.calculateZodiacSign(birthDate)).toBe('Aquarius');
    });

    it('should calculate Pisces (February 19 - March 20)', () => {
      const birthDate = BirthDate.create(new Date('1990-03-10'));

      expect(service.calculateZodiacSign(birthDate)).toBe('Pisces');
    });

    it('should handle cusp dates correctly - Pisces/Aries boundary', () => {
      const pisces = BirthDate.create(new Date(1990, 2, 20)); // March 20
      const aries = BirthDate.create(new Date(1990, 2, 21)); // March 21

      expect(service.calculateZodiacSign(pisces)).toBe('Pisces');
      expect(service.calculateZodiacSign(aries)).toBe('Aries');
    });

    it('should handle cusp dates correctly - Capricorn/Aquarius boundary', () => {
      const capricorn = BirthDate.create(new Date(1990, 0, 19)); // January 19 (month 0 = Jan)
      const aquarius = BirthDate.create(new Date(1990, 0, 20)); // January 20

      expect(service.calculateZodiacSign(capricorn)).toBe('Capricorn');
      expect(service.calculateZodiacSign(aquarius)).toBe('Aquarius');
    });

    it('should work for any year (zodiac is year-independent)', () => {
      const birthDate1950 = BirthDate.create(new Date('1950-07-15'));
      const birthDate2000 = BirthDate.create(new Date('2000-07-15'));
      const birthDate2024 = BirthDate.create(new Date('2024-07-15'));

      expect(service.calculateZodiacSign(birthDate1950)).toBe('Cancer');
      expect(service.calculateZodiacSign(birthDate2000)).toBe('Cancer');
      expect(service.calculateZodiacSign(birthDate2024)).toBe('Cancer');
    });
  });

  describe('getZodiacInfo', () => {
    it('should return complete zodiac info for Aries', () => {
      const birthDate = BirthDate.create(new Date('1990-04-01'));
      const info = service.getZodiacInfo(birthDate);

      expect(info.sign).toBe('Aries');
      expect(info.element).toBe('Fire');
      expect(info.quality).toBe('Cardinal');
      expect(info.rulingPlanet).toBe('Mars');
      expect(info.symbol).toBe('♈');
      expect(info.dateRange).toBe('March 21 - April 19');
    });

    it('should return complete zodiac info for Leo', () => {
      const birthDate = BirthDate.create(new Date('1990-08-01'));
      const info = service.getZodiacInfo(birthDate);

      expect(info.sign).toBe('Leo');
      expect(info.element).toBe('Fire');
      expect(info.quality).toBe('Fixed');
      expect(info.rulingPlanet).toBe('Sun');
      expect(info.symbol).toBe('♌');
      expect(info.dateRange).toContain('July 23');
    });

    it('should return complete zodiac info for Pisces', () => {
      const birthDate = BirthDate.create(new Date('1990-03-01'));
      const info = service.getZodiacInfo(birthDate);

      expect(info.sign).toBe('Pisces');
      expect(info.element).toBe('Water');
      expect(info.quality).toBe('Mutable');
      expect(info.rulingPlanet).toBe('Neptune');
      expect(info.symbol).toBe('♓');
    });

    it('should include all required fields', () => {
      const birthDate = BirthDate.create(new Date('1990-05-15'));
      const info = service.getZodiacInfo(birthDate);

      expect(info).toHaveProperty('sign');
      expect(info).toHaveProperty('element');
      expect(info).toHaveProperty('quality');
      expect(info).toHaveProperty('rulingPlanet');
      expect(info).toHaveProperty('symbol');
      expect(info).toHaveProperty('dateRange');
    });
  });

  describe('checkCompatibility', () => {
    it('should show high compatibility for same element (Fire)', () => {
      const result = service.checkCompatibility('Aries', 'Leo');

      expect(result.compatible).toBe(true);
      expect(result.score).toBe(90);
      expect(result.description).toBe('Highly compatible - same element');
    });

    it('should show high compatibility for same element (Water)', () => {
      const result = service.checkCompatibility('Cancer', 'Pisces');

      expect(result.compatible).toBe(true);
      expect(result.score).toBe(90);
    });

    it('should show high compatibility for same element (Earth)', () => {
      const result = service.checkCompatibility('Taurus', 'Virgo');

      expect(result.compatible).toBe(true);
      expect(result.score).toBe(90);
    });

    it('should show high compatibility for same element (Air)', () => {
      const result = service.checkCompatibility('Gemini', 'Libra');

      expect(result.compatible).toBe(true);
      expect(result.score).toBe(90);
    });

    it('should show good compatibility for Fire and Air', () => {
      const result = service.checkCompatibility('Aries', 'Gemini');

      expect(result.compatible).toBe(true);
      expect(result.score).toBe(70);
      expect(result.description).toBe('Compatible elements');
    });

    it('should show good compatibility for Earth and Water', () => {
      const result = service.checkCompatibility('Taurus', 'Cancer');

      expect(result.compatible).toBe(true);
      expect(result.score).toBe(70);
    });

    it('should show challenging compatibility for Fire and Water', () => {
      const result = service.checkCompatibility('Aries', 'Cancer');

      expect(result.compatible).toBe(false);
      expect(result.score).toBe(50);
      expect(result.description).toBe('Challenging elements');
    });

    it('should show challenging compatibility for Fire and Earth', () => {
      const result = service.checkCompatibility('Leo', 'Taurus');

      expect(result.compatible).toBe(false);
      expect(result.score).toBe(50);
    });

    it('should show challenging compatibility for Air and Water', () => {
      const result = service.checkCompatibility('Gemini', 'Pisces');

      expect(result.compatible).toBe(false);
      expect(result.score).toBe(50);
    });

    it('should show challenging compatibility for Air and Earth', () => {
      const result = service.checkCompatibility('Libra', 'Virgo');

      expect(result.compatible).toBe(false);
      expect(result.score).toBe(50);
    });

    it('should be symmetric - order should not matter', () => {
      const result1 = service.checkCompatibility('Aries', 'Gemini');
      const result2 = service.checkCompatibility('Gemini', 'Aries');

      expect(result1.compatible).toBe(result2.compatible);
      expect(result1.score).toBe(result2.score);
      expect(result1.description).toBe(result2.description);
    });

    it('should handle same sign compatibility', () => {
      const result = service.checkCompatibility('Leo', 'Leo');

      expect(result.compatible).toBe(true);
      expect(result.score).toBe(90); // Same element
    });
  });

  describe('getAllZodiacSigns', () => {
    it('should return exactly 12 zodiac signs', () => {
      const all = service.getAllZodiacSigns();

      expect(all).toHaveLength(12);
    });

    it('should include all expected zodiac signs', () => {
      const all = service.getAllZodiacSigns();
      const signs = all.map((z) => z.sign);

      expect(signs).toContain('Aries');
      expect(signs).toContain('Taurus');
      expect(signs).toContain('Gemini');
      expect(signs).toContain('Cancer');
      expect(signs).toContain('Leo');
      expect(signs).toContain('Virgo');
      expect(signs).toContain('Libra');
      expect(signs).toContain('Scorpio');
      expect(signs).toContain('Sagittarius');
      expect(signs).toContain('Capricorn');
      expect(signs).toContain('Aquarius');
      expect(signs).toContain('Pisces');
    });

    it('should have complete info for each sign', () => {
      const all = service.getAllZodiacSigns();

      all.forEach((info) => {
        expect(info.sign).toBeDefined();
        expect(info.element).toBeDefined();
        expect(info.quality).toBeDefined();
        expect(info.rulingPlanet).toBeDefined();
        expect(info.symbol).toBeDefined();
        expect(info.dateRange).toBeDefined();
      });
    });

    it('should have correct distribution of elements', () => {
      const all = service.getAllZodiacSigns();
      const elements = all.map((z) => z.element);

      // Each element should appear 3 times
      expect(elements.filter((e) => e === 'Fire')).toHaveLength(3);
      expect(elements.filter((e) => e === 'Earth')).toHaveLength(3);
      expect(elements.filter((e) => e === 'Air')).toHaveLength(3);
      expect(elements.filter((e) => e === 'Water')).toHaveLength(3);
    });

    it('should have correct distribution of qualities', () => {
      const all = service.getAllZodiacSigns();
      const qualities = all.map((z) => z.quality);

      // Each quality should appear 4 times
      expect(qualities.filter((q) => q === 'Cardinal')).toHaveLength(4);
      expect(qualities.filter((q) => q === 'Fixed')).toHaveLength(4);
      expect(qualities.filter((q) => q === 'Mutable')).toHaveLength(4);
    });
  });
});
