import { Module } from '@nestjs/common';
import { DddValueObjectsModule } from '@nestjslatam/ddd-valueobjects';
import { UsersModule } from './users/users.module';
import { ExampleAppController } from './example-app.controller';
import { ExampleAppService } from './example-app.service';

/**
 * Example App Module
 * Demonstrates integration of @nestjslatam/ddd-valueobjects library
 *
 * This module:
 * - Imports DddValueObjectsModule.forRoot() for global access to value objects
 * - Includes UsersModule with practical examples of using Email and UUID value objects
 * - Serves as a reference implementation for consuming the library
 */
@Module({
  imports: [
    DddValueObjectsModule.forRoot(), // Import the DDD Value Objects library
    UsersModule, // Example module using the library
  ],
  controllers: [ExampleAppController],
  providers: [ExampleAppService],
})
export class ExampleAppModule {}
