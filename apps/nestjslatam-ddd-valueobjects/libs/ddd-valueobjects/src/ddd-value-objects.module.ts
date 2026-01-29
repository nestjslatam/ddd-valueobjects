import { Module, DynamicModule, Global } from '@nestjs/common';

/**
 * DDD Value Objects Module for NestJS
 *
 * This module provides Domain-Driven Design patterns and Value Objects
 * that can be used across your NestJS application.
 *
 * @example
 * // Import in your app module
 * @Module({
 *   imports: [DddValueObjectsModule.forRoot()],
 * })
 * export class AppModule {}
 */
@Global()
@Module({})
export class DddValueObjectsModule {
  static forRoot(): DynamicModule {
    return {
      module: DddValueObjectsModule,
      global: true,
      exports: [],
    };
  }
}
