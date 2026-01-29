import { Injectable } from '@nestjs/common';
import { BirthDate } from '../implementations/birth-date/birth-date.value-object';

interface BirthdayReminder {
  name: string;
  birthDate: BirthDate;
  daysUntil: number;
  isToday: boolean;
  age: number;
}

/**
 * Birthday Calendar Service
 * Handles birthday management and reminders (Application Layer)
 * Separated from BirthDate domain to respect SRP and SoC principles
 */
@Injectable()
export class BirthdayCalendarService {
  /**
   * Creates a birthday reminder object
   */
  createReminder(
    name: string,
    birthDate: BirthDate,
    referenceDate: Date = new Date(),
  ): BirthdayReminder {
    return {
      name,
      birthDate,
      daysUntil: birthDate.getDaysUntilBirthday(referenceDate),
      isToday: birthDate.isBirthdayToday(referenceDate),
      age: birthDate.getAge(referenceDate),
    };
  }

  /**
   * Gets upcoming birthdays within N days
   */
  getUpcomingBirthdays(
    birthDates: Array<{ name: string; birthDate: BirthDate }>,
    withinDays: number = 30,
    referenceDate: Date = new Date(),
  ): BirthdayReminder[] {
    return birthDates
      .map(({ name, birthDate }) => this.createReminder(name, birthDate, referenceDate))
      .filter((reminder) => reminder.daysUntil <= withinDays && reminder.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }

  /**
   * Gets birthdays happening today
   */
  getTodaysBirthdays(
    birthDates: Array<{ name: string; birthDate: BirthDate }>,
    referenceDate: Date = new Date(),
  ): BirthdayReminder[] {
    return birthDates
      .map(({ name, birthDate }) => this.createReminder(name, birthDate, referenceDate))
      .filter((reminder) => reminder.isToday);
  }

  /**
   * Gets birthdays in a specific month
   */
  getBirthdaysInMonth(
    birthDates: Array<{ name: string; birthDate: BirthDate }>,
    month: number, // 1-12
    referenceDate: Date = new Date(),
  ): BirthdayReminder[] {
    return birthDates
      .filter(({ birthDate }) => birthDate.getDate().getMonth() + 1 === month)
      .map(({ name, birthDate }) => this.createReminder(name, birthDate, referenceDate))
      .sort((a, b) => {
        const dayA = a.birthDate.getDate().getDate();
        const dayB = b.birthDate.getDate().getDate();
        return dayA - dayB;
      });
  }

  /**
   * Groups birthdays by month
   */
  groupByMonth(
    birthDates: Array<{ name: string; birthDate: BirthDate }>,
    referenceDate: Date = new Date(),
  ): Record<number, BirthdayReminder[]> {
    const grouped: Record<number, BirthdayReminder[]> = {};

    for (let month = 1; month <= 12; month++) {
      grouped[month] = this.getBirthdaysInMonth(birthDates, month, referenceDate);
    }

    return grouped;
  }

  /**
   * Calculates milestone birthdays (18, 21, 30, 40, 50, etc.)
   */
  getNextMilestone(
    birthDate: BirthDate,
    referenceDate: Date = new Date(),
  ): {
    age: number;
    date: Date;
    yearsUntil: number;
  } | null {
    const currentAge = birthDate.getAge(referenceDate);
    const milestones = [18, 21, 30, 40, 50, 60, 65, 70, 75, 80, 85, 90, 95, 100];

    const nextMilestone = milestones.find((m) => m > currentAge);

    if (!nextMilestone) {
      return null;
    }

    const yearsUntil = nextMilestone - currentAge;
    const milestoneDate = new Date(birthDate.getDate());
    milestoneDate.setFullYear(milestoneDate.getFullYear() + nextMilestone);

    return {
      age: nextMilestone,
      date: milestoneDate,
      yearsUntil,
    };
  }

  /**
   * Formats birthday greeting message
   */
  formatBirthdayGreeting(name: string, age: number): string {
    if (age === 18) {
      return `Happy 18th Birthday, ${name}! Welcome to adulthood! 🎉`;
    }
    if (age === 21) {
      return `Happy 21st Birthday, ${name}! Enjoy this special milestone! 🎂`;
    }
    if (age % 10 === 0) {
      return `Happy ${age}th Birthday, ${name}! What an amazing milestone! 🎈`;
    }
    return `Happy ${age}th Birthday, ${name}! 🎉`;
  }

  /**
   * Gets age group classification
   */
  getAgeGroup(birthDate: BirthDate, referenceDate: Date = new Date()): string {
    const age = birthDate.getAge(referenceDate);

    if (age < 13) return 'Child';
    if (age < 20) return 'Teenager';
    if (age < 30) return 'Young Adult';
    if (age < 50) return 'Adult';
    if (age < 65) return 'Middle Aged';
    return 'Senior';
  }
}
