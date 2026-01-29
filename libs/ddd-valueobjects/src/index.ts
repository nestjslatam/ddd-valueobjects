/**
 * @nestjslatam/ddd-valueobjects
 * Domain-Driven Design Value Objects Library for NestJS
 *
 * @module @nestjslatam/ddd-valueobjects
 * @description
 * This library provides a comprehensive set of tools for implementing
 * Domain-Driven Design (DDD) Value Objects in NestJS applications.
 * Built on top of @nestjslatam/ddd-lib with validators and broken rules.
 *
 * @structure
 * - core/         : Base abstractions (ValueObject, Result pattern - legacy)
 * - implementations/: Pre-built value objects with validators and broken rules
 *   - Text: Name, Description, URL
 *   - Identification: PhoneNumber, DocumentId
 *   - Numeric: Age, Money, Percentage
 *   - Date: DateRange, BirthDate
 *   - Legacy: Email, UUID
 * - formatters/   : Presentation layer concerns (SoC principle)
 * - services/     : Application layer logic (SoC principle)
 * - module/       : NestJS module configuration
 */

// ===== Core Abstractions (Legacy) =====
// Base classes and patterns for building value objects
export * from './core';

// ===== Pre-built Value Objects =====
// Ready-to-use implementations with validators and broken rules
export * from './implementations';

// ===== Formatters (Presentation Layer) =====
// Formatters for displaying value objects
export * from './formatters';

// ===== Services (Application Layer) =====
// Services for complex operations on value objects
export * from './services';

// ===== Constants =====
// Centralized constants to eliminate magic numbers
export * from './constants';

// ===== Strategies =====
// Validation strategies (Strategy Pattern for OCP compliance)
export * from './strategies';

// ===== NestJS Module =====
// Module configuration for dependency injection
export * from './module';

// ===== Re-export from @nestjslatam/ddd-lib =====
// Advanced DDD patterns and base classes
export {
  DddValueObject,
  BrokenRulesManager,
  ValidatorRuleManager,
  AbstractRuleValidator,
  BrokenRule,
} from '@nestjslatam/ddd-lib';
