import { DateRange } from '../date-range.value-object';

describe('DateRange', () => {
  describe('create', () => {
    it('should create valid date range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');

      const range = DateRange.create(start, end);

      expect(range.startDate).toEqual(start);
      expect(range.endDate).toEqual(end);
    });

    it('should create range with same start and end date', () => {
      const date = new Date('2024-01-01');

      const range = DateRange.create(date, date);

      expect(range.startDate).toEqual(date);
      expect(range.endDate).toEqual(date);
    });

    it('should load date range without validation', () => {
      const start = new Date('2024-01-31');
      const end = new Date('2024-01-01');

      // Invalid range (end before start) but using load()
      const range = DateRange.load(start, end);

      expect(range.startDate).toEqual(start);
      expect(range.endDate).toEqual(end);
    });
  });

  describe('fromStrings', () => {
    it('should create range from string dates', () => {
      const range = DateRange.fromStrings('2024-01-01', '2024-01-31');

      expect(range.startDate).toEqual(new Date('2024-01-01'));
      expect(range.endDate).toEqual(new Date('2024-01-31'));
    });
  });

  describe('factory methods', () => {
    it('should create range for current month', () => {
      const range = DateRange.currentMonth();

      expect(range.startDate.getDate()).toBe(1);
      expect(range.endDate.getDate()).toBeGreaterThan(27); // At least 28 days
    });

    it('should create range for current year', () => {
      const range = DateRange.currentYear();
      const now = new Date();

      expect(range.startDate.getFullYear()).toBe(now.getFullYear());
      expect(range.startDate.getMonth()).toBe(0); // January
      expect(range.endDate.getMonth()).toBe(11); // December
    });

    it('should create range for last N days', () => {
      const range = DateRange.lastDays(7);

      const durationDays = range.getDurationDays();
      expect(durationDays).toBeGreaterThanOrEqual(7);
      expect(durationDays).toBeLessThanOrEqual(8); // Accounting for ceiling
    });
  });

  describe('duration calculations', () => {
    it('should calculate duration in days', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const range = DateRange.create(start, end);

      expect(range.getDurationDays()).toBe(30);
    });

    it('should calculate duration for same day', () => {
      const date = new Date('2024-01-01');
      const range = DateRange.create(date, date);

      expect(range.getDurationDays()).toBe(0);
    });

    it('should calculate duration in hours', () => {
      const start = new Date('2024-01-01T00:00:00');
      const end = new Date('2024-01-01T12:00:00');
      const range = DateRange.create(start, end);

      expect(range.getDurationHours()).toBe(12);
    });

    it('should calculate duration in milliseconds', () => {
      const start = new Date('2024-01-01T00:00:00');
      const end = new Date('2024-01-01T00:00:01');
      const range = DateRange.create(start, end);

      expect(range.getDurationMs()).toBe(1000);
    });
  });

  describe('contains', () => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-31');
    const range = DateRange.create(start, end);

    it('should contain date within range', () => {
      const date = new Date('2024-01-15');

      expect(range.contains(date)).toBe(true);
    });

    it('should contain start date', () => {
      expect(range.contains(start)).toBe(true);
    });

    it('should contain end date', () => {
      expect(range.contains(end)).toBe(true);
    });

    it('should not contain date before range', () => {
      const date = new Date('2023-12-31');

      expect(range.contains(date)).toBe(false);
    });

    it('should not contain date after range', () => {
      const date = new Date('2024-02-01');

      expect(range.contains(date)).toBe(false);
    });
  });

  describe('overlaps', () => {
    const range1 = DateRange.create(new Date('2024-01-01'), new Date('2024-01-15'));

    it('should detect completely overlapping ranges', () => {
      const range2 = DateRange.create(new Date('2024-01-05'), new Date('2024-01-10'));

      expect(range1.overlaps(range2)).toBe(true);
      expect(range2.overlaps(range1)).toBe(true);
    });

    it('should detect partially overlapping ranges', () => {
      const range2 = DateRange.create(new Date('2024-01-10'), new Date('2024-01-20'));

      expect(range1.overlaps(range2)).toBe(true);
      expect(range2.overlaps(range1)).toBe(true);
    });

    it('should detect non-overlapping ranges', () => {
      const range2 = DateRange.create(new Date('2024-01-20'), new Date('2024-01-31'));

      expect(range1.overlaps(range2)).toBe(false);
      expect(range2.overlaps(range1)).toBe(false);
    });

    it('should detect touching ranges as overlapping', () => {
      const range2 = DateRange.create(new Date('2024-01-15'), new Date('2024-01-20'));

      expect(range1.overlaps(range2)).toBe(true);
    });
  });

  describe('isBefore and isAfter', () => {
    const range1 = DateRange.create(new Date('2024-01-01'), new Date('2024-01-15'));

    it('should detect range before another', () => {
      const range2 = DateRange.create(new Date('2024-02-01'), new Date('2024-02-15'));

      expect(range1.isBefore(range2)).toBe(true);
      expect(range2.isBefore(range1)).toBe(false);
    });

    it('should detect range after another', () => {
      const range2 = DateRange.create(new Date('2024-02-01'), new Date('2024-02-15'));

      expect(range2.isAfter(range1)).toBe(true);
      expect(range1.isAfter(range2)).toBe(false);
    });
  });

  describe('intersect', () => {
    const range1 = DateRange.create(new Date('2024-01-01'), new Date('2024-01-15'));

    it('should return intersection of overlapping ranges', () => {
      const range2 = DateRange.create(new Date('2024-01-10'), new Date('2024-01-20'));

      const intersection = range1.intersect(range2);

      expect(intersection).not.toBeNull();
      expect(intersection!.startDate).toEqual(new Date('2024-01-10'));
      expect(intersection!.endDate).toEqual(new Date('2024-01-15'));
    });

    it('should return null for non-overlapping ranges', () => {
      const range2 = DateRange.create(new Date('2024-02-01'), new Date('2024-02-15'));

      const intersection = range1.intersect(range2);

      expect(intersection).toBeNull();
    });
  });

  describe('extendByDays', () => {
    it('should extend range by days', () => {
      const range = DateRange.create(new Date('2024-01-01'), new Date('2024-01-15'));

      const extended = range.extendByDays(10);

      expect(extended.startDate).toEqual(new Date('2024-01-01'));
      expect(extended.endDate).toEqual(new Date('2024-01-25'));
    });
  });

  describe('equality', () => {
    it('should be equal for same date ranges', () => {
      const range1 = DateRange.create(new Date('2024-01-01'), new Date('2024-01-31'));
      const range2 = DateRange.create(new Date('2024-01-01'), new Date('2024-01-31'));

      expect(range1.equals(range2)).toBe(true);
    });

    it('should not be equal for different start dates', () => {
      const range1 = DateRange.create(new Date('2024-01-01'), new Date('2024-01-31'));
      const range2 = DateRange.create(new Date('2024-01-02'), new Date('2024-01-31'));

      expect(range1.equals(range2)).toBe(false);
    });

    it('should not be equal for different end dates', () => {
      const range1 = DateRange.create(new Date('2024-01-01'), new Date('2024-01-31'));
      const range2 = DateRange.create(new Date('2024-01-01'), new Date('2024-01-30'));

      expect(range1.equals(range2)).toBe(false);
    });
  });

  describe('serialization', () => {
    it('should serialize to string', () => {
      const start = new Date('2024-01-01T00:00:00.000Z');
      const end = new Date('2024-01-31T00:00:00.000Z');
      const range = DateRange.create(start, end);

      expect(range.toString()).toBe('2024-01-01T00:00:00.000Z - 2024-01-31T00:00:00.000Z');
    });

    it('should serialize to JSON', () => {
      const start = new Date('2024-01-01T00:00:00.000Z');
      const end = new Date('2024-01-31T00:00:00.000Z');
      const range = DateRange.create(start, end);

      const json = range.toJSON();

      expect(json).toEqual({
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-31T00:00:00.000Z',
      });
    });
  });
});
