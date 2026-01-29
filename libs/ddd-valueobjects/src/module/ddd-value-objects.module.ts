import { Module, DynamicModule, Global } from '@nestjs/common';
import {
  PhoneNumberFormatter,
  MoneyFormatter,
  DateRangeFormatter,
  DocumentIdFormatter,
} from '../formatters';
import {
  MoneyAllocatorService,
  ZodiacCalculatorService,
  BirthdayCalendarService,
} from '../services';

/**
 * DDD Value Objects Module for NestJS
 *
 * This module provides Domain-Driven Design patterns and Value Objects
 * that can be used across your NestJS application.
 *
 * Includes:
 * - Formatters for presentation layer concerns (SoC principle)
 * - Services for application layer logic (SoC principle)
 *
 * @example
 * // Import in your app module
 * @Module({
 *   imports: [DddValueObjectsModule.forRoot()],
 * })
 * export class AppModule {}
 *
 * // Inject formatters and services in your components
 * @Injectable()
 * export class UserService {
 *   constructor(
 *     private readonly phoneNumberFormatter: PhoneNumberFormatter,
 *     private readonly moneyFormatter: MoneyFormatter,
 *     private readonly moneyAllocator: MoneyAllocatorService,
 *   ) {}
 *
 *   formatUserPhone(phone: PhoneNumber): string {
 *     return this.phoneNumberFormatter.formatInternational(phone);
 *   }
 *
 *   splitPayment(amount: Money, parts: number): Money[] {
 *     return this.moneyAllocator.allocateEqually(amount, parts);
 *   }
 * }
 */
@Global()
@Module({})
export class DddValueObjectsModule {
  static forRoot(): DynamicModule {
    const formatters = [
      PhoneNumberFormatter,
      MoneyFormatter,
      DateRangeFormatter,
      DocumentIdFormatter,
    ];

    const services = [MoneyAllocatorService, ZodiacCalculatorService, BirthdayCalendarService];

    return {
      module: DddValueObjectsModule,
      global: true,
      providers: [...formatters, ...services],
      exports: [...formatters, ...services],
    };
  }
}
