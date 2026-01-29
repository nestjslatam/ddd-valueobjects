import { DateRange } from '../date-range.value-object';

describe('DateRangeValidator', () => {
  describe('basic validation', () => {
    it('should pass for valid date range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');

      const range = DateRange.create(start, end);

      expect(range.startDate).toEqual(start);
      expect(range.endDate).toEqual(end);
    });

    it('should pass for same start and end date', () => {
      const date = new Date('2024-01-01');

      const range = DateRange.create(date, date);

      expect(range.startDate).toEqual(date);
      expect(range.endDate).toEqual(date);
    });

    it('should fail for start date after end date', () => {
      const start = new Date('2024-12-31');
      const end = new Date('2024-01-01');

      expect(() => DateRange.create(start, end)).toThrow(
        'Start date must be before or equal to end date',
      );
    });

    it('should fail for invalid start date', () => {
      const start = new Date('invalid');
      const end = new Date('2024-12-31');

      expect(() => DateRange.create(start, end)).toThrow('Start date must be a valid date');
    });

    it('should fail for invalid end date', () => {
      const start = new Date('2024-01-01');
      const end = new Date('invalid');

      expect(() => DateRange.create(start, end)).toThrow('End date must be a valid date');
    });
  });

  describe('range validation', () => {
    it('should pass for 1 day range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-01');

      const range = DateRange.create(start, end);

      expect(range.getDurationDays()).toBe(0);
    });

    it('should pass for 1 year range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');

      const range = DateRange.create(start, end);

      expect(range.getDurationDays()).toBeGreaterThan(360);
    });

    it('should pass for multi-year range (under 100 years)', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2034-01-01');

      const range = DateRange.create(start, end);

      expect(range.getDurationDays()).toBeGreaterThan(3650);
    });

    it('should fail for range exceeding 100 years', () => {
      const start = new Date('1900-01-01');
      const end = new Date('2025-01-01');

      expect(() => DateRange.create(start, end)).toThrow('Date range cannot exceed 100 years');
    });
  });

  describe('contains', () => {
    it('should contain date within range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');
      const range = DateRange.create(start, end);

      expect(range.contains(new Date('2024-06-15'))).toBe(true);
    });

    it('should contain start date', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');
      const range = DateRange.create(start, end);

      expect(range.contains(start)).toBe(true);
    });

    it('should contain end date', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');
      const range = DateRange.create(start, end);

      expect(range.contains(end)).toBe(true);
    });

    it('should not contain date before range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');
      const range = DateRange.create(start, end);

      expect(range.contains(new Date('2023-12-31'))).toBe(false);
    });

    it('should not contain date after range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-12-31');
      const range = DateRange.create(start, end);

      expect(range.contains(new Date('2025-01-01'))).toBe(false);
    });
  });

  describe('overlaps', () => {
    it('should detect overlapping ranges', () => {
      const range1 = DateRange.create(new Date('2024-01-01'), new Date('2024-06-30'));
      const range2 = DateRange.create(new Date('2024-03-01'), new Date('2024-09-30'));

      expect(range1.overlaps(range2)).toBe(true);
      expect(range2.overlaps(range1)).toBe(true);
    });

    it('should detect non-overlapping ranges', () => {
      const range1 = DateRange.create(new Date('2024-01-01'), new Date('2024-03-31'));
      const range2 = DateRange.create(new Date('2024-06-01'), new Date('2024-12-31'));

      expect(range1.overlaps(range2)).toBe(false);
      expect(range2.overlaps(range1)).toBe(false);
    });

    it('should detect touching ranges as overlapping', () => {
      const range1 = DateRange.create(new Date('2024-01-01'), new Date('2024-06-30'));
      const range2 = DateRange.create(new Date('2024-06-30'), new Date('2024-12-31'));

      expect(range1.overlaps(range2)).toBe(true);
    });
  });

  describe('duration calculations', () => {
    it('should calculate duration in days correctly', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-10');
      const range = DateRange.create(start, end);

      expect(range.getDurationDays()).toBe(9);
    });

    it('should calculate duration in hours correctly', () => {
      const start = new Date('2024-01-01T00:00:00');
      const end = new Date('2024-01-01T12:00:00');
      const range = DateRange.create(start, end);

      expect(range.getDurationHours()).toBe(12);
    });
  });
});
