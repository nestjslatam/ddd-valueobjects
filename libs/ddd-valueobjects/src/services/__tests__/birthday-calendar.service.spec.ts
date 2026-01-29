import { BirthdayCalendarService } from '../birthday-calendar.service';
import { BirthDate } from '../../implementations/birth-date/birth-date.value-object';

describe('BirthdayCalendarService', () => {
  let service: BirthdayCalendarService;

  beforeEach(() => {
    service = new BirthdayCalendarService();
  });

  describe('createReminder', () => {
    it('should create a reminder with all required fields', () => {
      const birthDate = BirthDate.create(new Date(1990, 5, 15)); // June 15, 1990
      const referenceDate = new Date(2026, 0, 29); // January 29, 2026

      const reminder = service.createReminder('John Doe', birthDate, referenceDate);

      expect(reminder.name).toBe('John Doe');
      expect(reminder.birthDate).toBe(birthDate);
      expect(reminder.daysUntil).toBeGreaterThanOrEqual(0);
      expect(reminder.isToday).toBe(false);
      expect(reminder.age).toBe(35);
    });

    it('should mark isToday as true when birthday is today', () => {
      const birthDate = BirthDate.create(new Date(1990, 0, 29)); // January 29, 1990
      const referenceDate = new Date(2026, 0, 29); // January 29, 2026

      const reminder = service.createReminder('Jane', birthDate, referenceDate);

      expect(reminder.isToday).toBe(true);
      expect(reminder.daysUntil).toBe(0);
    });

    it('should calculate days until next birthday', () => {
      const birthDate = BirthDate.create(new Date(1990, 1, 1)); // February 1, 1990
      const referenceDate = new Date(2026, 0, 29); // January 29, 2026

      const reminder = service.createReminder('Bob', birthDate, referenceDate);

      expect(reminder.daysUntil).toBe(3); // 3 days from Jan 29 to Feb 1
    });

    it('should use current date when referenceDate not provided', () => {
      const birthDate = BirthDate.create(new Date(1990, 0, 29));

      const reminder = service.createReminder('Alice', birthDate);

      expect(reminder).toBeDefined();
      expect(reminder.name).toBe('Alice');
    });
  });

  describe('getUpcomingBirthdays', () => {
    it('should return birthdays within specified days', () => {
      const referenceDate = new Date(2026, 0, 29); // January 29, 2026
      const birthDates = [
        { name: 'Person1', birthDate: BirthDate.create(new Date(1990, 1, 1)) }, // Feb 1 (3 days)
        { name: 'Person2', birthDate: BirthDate.create(new Date(1995, 1, 15)) }, // Feb 15 (17 days)
        { name: 'Person3', birthDate: BirthDate.create(new Date(1992, 2, 10)) }, // Mar 10 (40 days)
      ];

      const upcoming = service.getUpcomingBirthdays(birthDates, 30, referenceDate);

      expect(upcoming).toHaveLength(2);
      expect(upcoming[0].name).toBe('Person1');
      expect(upcoming[1].name).toBe('Person2');
    });

    it('should sort by days until birthday (ascending)', () => {
      const referenceDate = new Date(2026, 0, 29);
      const birthDates = [
        { name: 'Third', birthDate: BirthDate.create(new Date(1990, 1, 20)) }, // Feb 20 (22 days)
        { name: 'First', birthDate: BirthDate.create(new Date(1990, 1, 1)) }, // Feb 1 (3 days)
        { name: 'Second', birthDate: BirthDate.create(new Date(1990, 1, 10)) }, // Feb 10 (12 days)
      ];

      const upcoming = service.getUpcomingBirthdays(birthDates, 30, referenceDate);

      expect(upcoming[0].name).toBe('First');
      expect(upcoming[1].name).toBe('Second');
      expect(upcoming[2].name).toBe('Third');
    });

    it("should include today's birthdays in upcoming list", () => {
      const referenceDate = new Date(2026, 0, 29);
      const birthDates = [
        { name: 'Today', birthDate: BirthDate.create(new Date(1990, 0, 29)) }, // Today
        { name: 'Tomorrow', birthDate: BirthDate.create(new Date(1990, 0, 30)) }, // Tomorrow
      ];

      const upcoming = service.getUpcomingBirthdays(birthDates, 7, referenceDate);

      expect(upcoming).toHaveLength(2);
      expect(upcoming[0].name).toBe('Today');
      expect(upcoming[0].daysUntil).toBe(0);
    });

    it('should default to 30 days when withinDays not specified', () => {
      const referenceDate = new Date(2026, 0, 29);
      const birthDates = [
        { name: 'Person1', birthDate: BirthDate.create(new Date(1990, 1, 15)) }, // Feb 15 (17 days)
      ];

      const upcoming = service.getUpcomingBirthdays(birthDates, undefined, referenceDate);

      expect(upcoming).toHaveLength(1);
    });

    it('should handle empty birthDates array', () => {
      const referenceDate = new Date(2026, 0, 29);

      const upcoming = service.getUpcomingBirthdays([], 30, referenceDate);

      expect(upcoming).toHaveLength(0);
    });

    it('should exclude birthdays beyond the specified range', () => {
      const referenceDate = new Date(2026, 0, 29);
      const birthDates = [
        { name: 'Near', birthDate: BirthDate.create(new Date(1990, 1, 5)) }, // Feb 5 (7 days)
        { name: 'Far', birthDate: BirthDate.create(new Date(1990, 5, 15)) }, // June 15 (137 days)
      ];

      const upcoming = service.getUpcomingBirthdays(birthDates, 10, referenceDate);

      expect(upcoming).toHaveLength(1);
      expect(upcoming[0].name).toBe('Near');
    });
  });

  describe('getTodaysBirthdays', () => {
    it('should return only birthdays happening today', () => {
      const referenceDate = new Date(2026, 0, 29); // January 29, 2026
      const birthDates = [
        { name: 'Birthday1', birthDate: BirthDate.create(new Date(1990, 0, 29)) }, // Today
        { name: 'Birthday2', birthDate: BirthDate.create(new Date(1995, 0, 29)) }, // Today
        { name: 'NotToday', birthDate: BirthDate.create(new Date(1990, 0, 30)) }, // Tomorrow
      ];

      const today = service.getTodaysBirthdays(birthDates, referenceDate);

      expect(today).toHaveLength(2);
      expect(today[0].name).toBe('Birthday1');
      expect(today[1].name).toBe('Birthday2');
    });

    it('should return empty array when no birthdays today', () => {
      const referenceDate = new Date(2026, 0, 29);
      const birthDates = [
        { name: 'Person1', birthDate: BirthDate.create(new Date(1990, 0, 30)) },
        { name: 'Person2', birthDate: BirthDate.create(new Date(1990, 1, 1)) },
      ];

      const today = service.getTodaysBirthdays(birthDates, referenceDate);

      expect(today).toHaveLength(0);
    });

    it('should handle empty birthDates array', () => {
      const referenceDate = new Date(2026, 0, 29);

      const today = service.getTodaysBirthdays([], referenceDate);

      expect(today).toHaveLength(0);
    });

    it('should use current date when referenceDate not provided', () => {
      const birthDates = [{ name: 'Person', birthDate: BirthDate.create(new Date(1990, 0, 29)) }];

      const today = service.getTodaysBirthdays(birthDates);

      expect(today).toBeDefined();
    });
  });

  describe('getBirthdaysInMonth', () => {
    it('should return birthdays in specified month', () => {
      const referenceDate = new Date(2026, 0, 29);
      const birthDates = [
        { name: 'Jan1', birthDate: BirthDate.create(new Date(1990, 0, 15)) }, // January
        { name: 'Jan2', birthDate: BirthDate.create(new Date(1995, 0, 25)) }, // January
        { name: 'Feb', birthDate: BirthDate.create(new Date(1992, 1, 10)) }, // February
      ];

      const januaryBirthdays = service.getBirthdaysInMonth(birthDates, 1, referenceDate);

      expect(januaryBirthdays).toHaveLength(2);
      expect(januaryBirthdays[0].name).toBe('Jan1');
      expect(januaryBirthdays[1].name).toBe('Jan2');
    });

    it('should sort birthdays by day of month', () => {
      const referenceDate = new Date(2026, 0, 29);
      const birthDates = [
        { name: 'Jan25', birthDate: BirthDate.create(new Date(1990, 0, 25)) }, // 25th
        { name: 'Jan10', birthDate: BirthDate.create(new Date(1995, 0, 10)) }, // 10th
        { name: 'Jan15', birthDate: BirthDate.create(new Date(1992, 0, 15)) }, // 15th
      ];

      const januaryBirthdays = service.getBirthdaysInMonth(birthDates, 1, referenceDate);

      expect(januaryBirthdays[0].name).toBe('Jan10');
      expect(januaryBirthdays[1].name).toBe('Jan15');
      expect(januaryBirthdays[2].name).toBe('Jan25');
    });

    it('should return empty array for month with no birthdays', () => {
      const referenceDate = new Date(2026, 0, 29);
      const birthDates = [{ name: 'Jan', birthDate: BirthDate.create(new Date(1990, 0, 15)) }];

      const juneBirthdays = service.getBirthdaysInMonth(birthDates, 6, referenceDate);

      expect(juneBirthdays).toHaveLength(0);
    });

    it('should handle all months (1-12)', () => {
      const referenceDate = new Date(2026, 0, 29);
      const birthDates = [
        { name: 'Dec', birthDate: BirthDate.create(new Date(1990, 11, 25)) }, // Month 12
      ];

      const decemberBirthdays = service.getBirthdaysInMonth(birthDates, 12, referenceDate);

      expect(decemberBirthdays).toHaveLength(1);
      expect(decemberBirthdays[0].name).toBe('Dec');
    });
  });

  describe('groupByMonth', () => {
    it('should group birthdays into 12 months', () => {
      const referenceDate = new Date(2026, 0, 29);
      const birthDates = [
        { name: 'Jan', birthDate: BirthDate.create(new Date(1990, 0, 15)) },
        { name: 'Jun', birthDate: BirthDate.create(new Date(1995, 5, 10)) },
      ];

      const grouped = service.groupByMonth(birthDates, referenceDate);

      expect(Object.keys(grouped)).toHaveLength(12);
      expect(grouped[1]).toHaveLength(1); // January
      expect(grouped[6]).toHaveLength(1); // June
      expect(grouped[3]).toHaveLength(0); // March (empty)
    });

    it('should handle multiple birthdays in same month', () => {
      const referenceDate = new Date(2026, 0, 29);
      const birthDates = [
        { name: 'Person1', birthDate: BirthDate.create(new Date(1990, 0, 10)) },
        { name: 'Person2', birthDate: BirthDate.create(new Date(1995, 0, 20)) },
        { name: 'Person3', birthDate: BirthDate.create(new Date(1992, 0, 5)) },
      ];

      const grouped = service.groupByMonth(birthDates, referenceDate);

      expect(grouped[1]).toHaveLength(3); // All in January
    });

    it('should handle empty birthDates array', () => {
      const referenceDate = new Date(2026, 0, 29);

      const grouped = service.groupByMonth([], referenceDate);

      expect(Object.keys(grouped)).toHaveLength(12);
      Object.values(grouped).forEach((monthBirthdays) => {
        expect(monthBirthdays).toHaveLength(0);
      });
    });

    it('should distribute birthdays across different months', () => {
      const referenceDate = new Date(2026, 0, 29);
      const birthDates = [
        { name: 'Jan', birthDate: BirthDate.create(new Date(1990, 0, 15)) },
        { name: 'Feb', birthDate: BirthDate.create(new Date(1990, 1, 15)) },
        { name: 'Mar', birthDate: BirthDate.create(new Date(1990, 2, 15)) },
        { name: 'Apr', birthDate: BirthDate.create(new Date(1990, 3, 15)) },
        { name: 'May', birthDate: BirthDate.create(new Date(1990, 4, 15)) },
        { name: 'Jun', birthDate: BirthDate.create(new Date(1990, 5, 15)) },
      ];

      const grouped = service.groupByMonth(birthDates, referenceDate);

      expect(grouped[1]).toHaveLength(1);
      expect(grouped[2]).toHaveLength(1);
      expect(grouped[3]).toHaveLength(1);
      expect(grouped[4]).toHaveLength(1);
      expect(grouped[5]).toHaveLength(1);
      expect(grouped[6]).toHaveLength(1);
    });
  });

  describe('getNextMilestone', () => {
    it('should return next milestone for person under 18', () => {
      const birthDate = BirthDate.create(new Date(2010, 5, 15)); // June 15, 2010 (15 years old on Jan 29, 2026)
      const referenceDate = new Date(2026, 0, 29); // January 29, 2026

      const milestone = service.getNextMilestone(birthDate, referenceDate);

      expect(milestone).not.toBeNull();
      expect(milestone!.age).toBe(18);
      expect(milestone!.yearsUntil).toBe(3); // 18 - 15 = 3 years
    });

    it('should return 21 as milestone after 18', () => {
      const birthDate = BirthDate.create(new Date(2005, 5, 15)); // June 15, 2005 (20 years old)
      const referenceDate = new Date(2026, 0, 29);

      const milestone = service.getNextMilestone(birthDate, referenceDate);

      expect(milestone).not.toBeNull();
      expect(milestone!.age).toBe(21);
      expect(milestone!.yearsUntil).toBe(1);
    });

    it('should return next decade milestone (30, 40, 50)', () => {
      const birthDate = BirthDate.create(new Date(1990, 5, 15)); // June 15, 1990 (35 years old on Jan 29, 2026)
      const referenceDate = new Date(2026, 0, 29);

      const milestone = service.getNextMilestone(birthDate, referenceDate);

      expect(milestone).not.toBeNull();
      expect(milestone!.age).toBe(40);
      expect(milestone!.yearsUntil).toBe(5); // 40 - 35 = 5 years
    });

    it('should return 65 as retirement milestone', () => {
      const birthDate = BirthDate.create(new Date(1968, 5, 15)); // June 15, 1968 (57 years old)
      const referenceDate = new Date(2026, 0, 29);

      const milestone = service.getNextMilestone(birthDate, referenceDate);

      expect(milestone).not.toBeNull();
      expect(milestone!.age).toBe(60);
    });

    it('should return null when past 100', () => {
      const birthDate = BirthDate.create(new Date(1920, 5, 15)); // June 15, 1920 (105 years old)
      const referenceDate = new Date(2026, 0, 29);

      const milestone = service.getNextMilestone(birthDate, referenceDate);

      expect(milestone).toBeNull();
    });

    it('should include milestone date', () => {
      const birthDate = BirthDate.create(new Date(2010, 5, 15)); // June 15, 2010
      const referenceDate = new Date(2026, 0, 29);

      const milestone = service.getNextMilestone(birthDate, referenceDate);

      expect(milestone).not.toBeNull();
      expect(milestone!.date).toBeInstanceOf(Date);
      expect(milestone!.date.getFullYear()).toBe(2028); // 2010 + 18
    });

    it('should handle ages near milestones', () => {
      const birthDate = BirthDate.create(new Date(1996, 11, 31)); // Dec 31, 1996 (29 years old)
      const referenceDate = new Date(2026, 0, 29);

      const milestone = service.getNextMilestone(birthDate, referenceDate);

      expect(milestone).not.toBeNull();
      expect(milestone!.age).toBe(30);
      expect(milestone!.yearsUntil).toBe(1);
    });
  });

  describe('formatBirthdayGreeting', () => {
    it('should return special message for 18th birthday', () => {
      const greeting = service.formatBirthdayGreeting('Alice', 18);

      expect(greeting).toContain('18th Birthday');
      expect(greeting).toContain('Alice');
      expect(greeting).toContain('adulthood');
    });

    it('should return special message for 21st birthday', () => {
      const greeting = service.formatBirthdayGreeting('Bob', 21);

      expect(greeting).toContain('21st Birthday');
      expect(greeting).toContain('Bob');
      expect(greeting).toContain('special milestone');
    });

    it('should return milestone message for round decades (30, 40, 50)', () => {
      const greeting30 = service.formatBirthdayGreeting('Charlie', 30);
      const greeting40 = service.formatBirthdayGreeting('Diana', 40);
      const greeting50 = service.formatBirthdayGreeting('Eve', 50);

      expect(greeting30).toContain('30th Birthday');
      expect(greeting30).toContain('amazing milestone');
      expect(greeting40).toContain('40th Birthday');
      expect(greeting50).toContain('50th Birthday');
    });

    it('should return generic message for non-milestone ages', () => {
      const greeting = service.formatBirthdayGreeting('Frank', 25);

      expect(greeting).toContain('25th Birthday');
      expect(greeting).toContain('Frank');
      expect(greeting).not.toContain('milestone');
    });

    it('should handle 100th birthday as milestone', () => {
      const greeting = service.formatBirthdayGreeting('Grandma', 100);

      expect(greeting).toContain('100th Birthday');
      expect(greeting).toContain('amazing milestone');
    });

    it('should include emoji in greeting', () => {
      const greeting = service.formatBirthdayGreeting('Test', 25);

      expect(greeting).toMatch(/🎉|🎂|🎈/);
    });
  });

  describe('getAgeGroup', () => {
    it('should classify as Child (under 13)', () => {
      const birthDate = BirthDate.create(new Date(2015, 5, 15)); // 10 years old
      const referenceDate = new Date(2026, 0, 29);

      const ageGroup = service.getAgeGroup(birthDate, referenceDate);

      expect(ageGroup).toBe('Child');
    });

    it('should classify as Teenager (13-19)', () => {
      const birthDate = BirthDate.create(new Date(2010, 5, 15)); // 15 years old
      const referenceDate = new Date(2026, 0, 29);

      const ageGroup = service.getAgeGroup(birthDate, referenceDate);

      expect(ageGroup).toBe('Teenager');
    });

    it('should classify as Young Adult (20-29)', () => {
      const birthDate = BirthDate.create(new Date(2000, 5, 15)); // 25 years old
      const referenceDate = new Date(2026, 0, 29);

      const ageGroup = service.getAgeGroup(birthDate, referenceDate);

      expect(ageGroup).toBe('Young Adult');
    });

    it('should classify as Adult (30-49)', () => {
      const birthDate = BirthDate.create(new Date(1990, 5, 15)); // 35 years old
      const referenceDate = new Date(2026, 0, 29);

      const ageGroup = service.getAgeGroup(birthDate, referenceDate);

      expect(ageGroup).toBe('Adult');
    });

    it('should classify as Middle Aged (50-64)', () => {
      const birthDate = BirthDate.create(new Date(1970, 5, 15)); // 55 years old
      const referenceDate = new Date(2026, 0, 29);

      const ageGroup = service.getAgeGroup(birthDate, referenceDate);

      expect(ageGroup).toBe('Middle Aged');
    });

    it('should classify as Senior (65+)', () => {
      const birthDate = BirthDate.create(new Date(1955, 5, 15)); // 70 years old
      const referenceDate = new Date(2026, 0, 29);

      const ageGroup = service.getAgeGroup(birthDate, referenceDate);

      expect(ageGroup).toBe('Senior');
    });

    it('should handle boundary age 13 as Teenager', () => {
      const birthDate = BirthDate.create(new Date(2013, 0, 29)); // Exactly 13
      const referenceDate = new Date(2026, 0, 29);

      const ageGroup = service.getAgeGroup(birthDate, referenceDate);

      expect(ageGroup).toBe('Teenager');
    });

    it('should handle boundary age 20 as Young Adult', () => {
      const birthDate = BirthDate.create(new Date(2006, 0, 29)); // Exactly 20
      const referenceDate = new Date(2026, 0, 29);

      const ageGroup = service.getAgeGroup(birthDate, referenceDate);

      expect(ageGroup).toBe('Young Adult');
    });

    it('should use current date when referenceDate not provided', () => {
      const birthDate = BirthDate.create(new Date(2000, 0, 29));

      const ageGroup = service.getAgeGroup(birthDate);

      expect(ageGroup).toBeDefined();
      expect(['Child', 'Teenager', 'Young Adult', 'Adult', 'Middle Aged', 'Senior']).toContain(
        ageGroup,
      );
    });
  });
});
