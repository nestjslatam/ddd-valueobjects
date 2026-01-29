# @nestjslatam/ddd-valueobjects

A NestJS library providing Domain-Driven Design (DDD) Value Objects patterns. This library helps you build robust domain models with immutable value objects and proper validation, following the official [NestJS library structure](https://docs.nestjs.com/cli/libraries).

Generated with:

```bash
nest g library ddd-valueobjects --prefix @nestjslatam
```

## 🚀 Example Application

This repository includes a **complete example application** that demonstrates how to use the library in a real NestJS project!

📖 **[View Example App Documentation](./apps/example-app/README.md)**

Run the example app:

```bash
npm run start:dev
# Visit http://localhost:3000/api for Swagger documentation
```

The example app includes:

- Complete CRUD operations using Email and UUID value objects
- Result pattern for error handling
- REST API with Swagger documentation
- Domain entities with value objects
- Practical usage examples

## Features

- 🏗️ **NestJS Module**: Full NestJS integration with `DddValueObjectsModule`
- �️ **Based on @nestjslatam/ddd-lib**: Built on enterprise DDD patterns with validators and broken rules
- 🎯 **Rich Value Objects**: 13+ pre-built value objects for common domain scenarios
- ✅ **Validation System**: Built-in validators with broken rules management
- 📝 **Text VOs**: Name, Description, Password, URL
- 🆔 **Identification VOs**: Email, PhoneNumber, DocumentId (DNI, Passport, SSN), Uuid
- 💰 **Numeric VOs**: Age, Money, Percentage
- 📅 **Date VOs**: DateRange, BirthDate
- 🔒 **Type-Safe**: Full TypeScript support with strict typing
- 🧪 **Well-Tested**: 99% code coverage with over 680 tests.
- 📦 **NestJS CLI**: Built with NestJS CLI following official library guidelines
- 🗂️ **Organized Structure**: Modular architecture with clear separation (core/implementations/module) - [See Structure Guide](./libs/ddd-valueobjects/STRUCTURE.md)
- 📖 **Complete Docs**: [Value Objects Reference Guide](./libs/ddd-valueobjects/VALUE-OBJECTS.md)
- CI/CD: Continuous integration and deployment pipeline with GitHub Actions.
- Git Hooks: Pre-commit and pre-push hooks with Husky to ensure code quality.
- Release Management: Automated release and changelog generation with standard-version.

## Design and Architecture

### Objective

The primary objective of this library is to provide a robust and easy-to-use set of Domain-Driven Design (DDD) Value Objects for NestJS applications. It aims to promote best practices in domain modeling by offering immutable, self-validating objects that encapsulate business logic and ensure data integrity.

### Core Concepts

This library is built on the following core concepts:

- **Value Object**: A fundamental DDD pattern representing a descriptive aspect of the domain with no conceptual identity. Value Objects are immutable and are compared by their values, not their identity.
- **Immutability**: Once a Value Object is created, it cannot be changed. Any operation that would change its value results in a new Value Object instance.
- **Self-Validation**: Each Value Object is responsible for its own validation. It cannot be created in an invalid state.
- **Broken Rules**: When validation fails, the Value Object provides a list of "broken rules" that explain what is wrong.

### Architectural Principles

The architecture is guided by the following principles:

- **Based on `@nestjslatam/ddd-lib`**: The library extends the core abstractions from `@nestjslatam/ddd-lib`, ensuring a solid foundation based on proven DDD patterns.
- **Modularity**: The project is organized into a `core` module (for base abstractions) and an `implementations` module (for concrete Value Objects), allowing for clear separation of concerns and easy extension.
- **NestJS Integration**: The library is provided as a NestJS module, allowing for seamless integration into any NestJS application.

### Architectural Diagram

```
+------------------------------------------------+
|              Your NestJS Application           |
+------------------------------------------------+
| - Uses DddValueObjectsModule                   |
| - Creates and uses Value Objects (Name, Age)   |
+------------------------^-----------------------+
                         |
+------------------------|-----------------------+
|  @nestjslatam/ddd-valueobjects (This Library)  |
+------------------------|-----------------------+
| - DddValueObjectsModule                        |
| - Concrete VOs (Name, Age, Money, etc.)        |
| - Concrete Validators (NameValidator, etc.)    |
+------------------------^-----------------------+
                         |
+------------------------|-----------------------+
|      @nestjslatam/ddd-lib (Base Library)       |
+------------------------|-----------------------+
| - DddValueObject (Abstract)                    |
| - AbstractRuleValidator (Abstract)             |
| - Result Pattern                               |
+------------------------------------------------+
```

## Installation

```bash
npm install @nestjslatam/ddd-valueobjects @nestjslatam/ddd-lib
```

## Quick Start

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { DddValueObjectsModule } from '@nestjslatam/ddd-valueobjects';

@Module({
  imports: [DddValueObjectsModule.forRoot()],
})
export class AppModule {}
```

### 2. Use Value Objects with Validators

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { Name, Email, Money, Age } from '@nestjslatam/ddd-valueobjects';

@Injectable()
export class UserService {
  async createUser(firstName: string, lastName: string, emailStr: string, birthDate: Date) {
    try {
      // Create value objects with validation
      const name = Name.create(firstName, lastName);
      const age = Age.fromBirthDate(birthDate);

      // Check broken rules
      if (!name.isValid) {
        throw new BadRequestException(name.brokenRules.getBrokenRulesAsString());
      }

      return {
        name: name.getFullName(),
        age: age.getValue(),
        isAdult: age.isAdult(),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async calculatePrice(basePrice: number, discountPercent: number) {
    const price = Money.create(basePrice, 'USD');
    const discount = Percentage.create(discountPercent);

    const finalPrice = discount.decrease(price.amount);
    return Money.create(finalPrice, 'USD').format();
  }
}
```

### 3. Legacy Value Objects (Result Pattern)

```typescript
import { Email, UUID, Result } from '@nestjslatam/ddd-valueobjects';

// Email with Result pattern
const emailOrError = Email.create('user@example.com');

if (emailOrError.isFailure) {
  console.log(emailOrError.getError());
} else {
  const email = emailOrError.getValue();
  console.log(email.value); // "user@example.com"
}

// UUID generation
const userId = UUID.generate();
console.log(userId.value); // "550e8400-e29b-41d4-a716-446655440000"
```

## Available Value Objects

### Text Value Objects

- **Name**: Full name with first, middle, and last names
- **Description**: Text descriptions with length constraints
- **Url**: URL validation with protocol and domain checking

### Identification Value Objects

- **PhoneNumber**: Phone numbers with country codes and formatting
- **DocumentId**: Government IDs (DNI, Passport, SSN, Tax ID, Driver License)

### Numeric Value Objects

- **Age**: Age with category classification (child, teenager, adult, senior)
- **Money**: Monetary amounts with currency and arithmetic operations
- **Percentage**: Percentages with ratio conversion and calculations

### Date Value Objects

- **DateRange**: Date ranges with overlap detection and duration calculation
- **BirthDate**: Birth dates with age calculation and zodiac signs

### Legacy Value Objects

- **Email**: Simple email validation (Result pattern)
- **UUID**: UUID generation and validation (Result pattern)

📖 **[Complete Value Objects Reference](./libs/ddd-valueobjects/VALUE-OBJECTS.md)**

## Usage

### Creating Custom Value Objects

```typescript
import { ValueObject, Result } from '@nestjslatam/ddd-valueobjects';

interface NameProps {
  value: string;
}

export class Name extends ValueObject<NameProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: NameProps) {
    super(props);
  }

  public static create(name: string): Result<Name> {
    if (!name || name.trim().length === 0) {
      return Result.fail<Name>('Name cannot be empty');
    }

    if (name.length < 2) {
      return Result.fail<Name>('Name is too short');
    }

    if (name.length > 100) {
      return Result.fail<Name>('Name is too long');
    }

    return Result.ok<Name>(new Name({ value: name.trim() }));
  }
}
```

### Using Pre-built Value Objects

```typescript
import { Email, UUID } from '@nestjslatam/ddd-valueobjects';

// Email
const emailOrError = Email.create('user@example.com');
if (emailOrError.isSuccess) {
  const email = emailOrError.getValue();
  console.log(email.value); // 'user@example.com'
}

// UUID
const uuidOrError = UUID.create('550e8400-e29b-41d4-a716-446655440000');
if (uuidOrError.isSuccess) {
  const uuid = uuidOrError.getValue();
  console.log(uuid.value);
}

// Generate UUID
const newUuid = UUID.generate();
```

### Using with NestJS

The library is designed as a NestJS module and automatically integrates with your application:

```typescript
import { Module } from '@nestjs/common';
import { DddValueObjectsModule } from '@nestjslatam/ddd-valueobjects';
import { UserService } from './user.service';

@Module({
  imports: [DddValueObjectsModule.forRoot()],
  providers: [UserService],
})
export class UserModule {}
```

## Result Pattern

The Result pattern helps handle errors functionally without throwing exceptions:

```typescript
const emailResult = Email.create('invalid-email');

if (emailResult.isFailure) {
  console.log(emailResult.getError()); // 'Email format is invalid'
}

if (emailResult.isSuccess) {
  const email = emailResult.getValue();
  // Work with email
}
```

### Combining Results

```typescript
const results = [
  Email.create('user1@example.com'),
  Email.create('user2@example.com'),
  Email.create('invalid'),
];

const combinedResult = Result.combine(results);
if (combinedResult.isFailure) {
  console.log('At least one email is invalid');
}
```

## Development

```bash
# Install dependencies
npm install

# Build the library with NestJS CLI
npm run build

# Build and watch for changes
npm run build:watch

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Check coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure (NestJS Library)

This project follows the official [NestJS library structure](https://docs.nestjs.com/cli/libraries):

```
ddd-valueobjects/
├── apps/                                     # Example applications
│   └── example-app/                         # Complete usage example
│       └── src/
│           ├── users/                       # Users module
│           └── main.ts
├── libs/
│   └── ddd-valueobjects/
│       ├── src/
│       │   ├── core/                        # Base abstractions
│       │   │   ├── value-object.base.ts     # Base ValueObject class
│       │   │   ├── result.ts                # Result pattern
│       │   │   └── index.ts
│       │   ├── implementations/             # Concrete value objects
│       │   │   ├── email/                   # Email VO
│       │   │   │   ├── email.value-object.ts
│       │   │   │   └── index.ts
│       │   │   ├── uuid/                    # UUID VO
│       │   │   │   ├── uuid.value-object.ts
│       │   │   │   └── index.ts
│       │   │   └── index.ts
│       │   ├── module/                      # NestJS integration
│       │   │   ├── ddd-value-objects.module.ts
│       │   │   └── index.ts
│       │   └── index.ts                     # Public API
│       ├── tsconfig.lib.json
│       └── STRUCTURE.md                      # 📖 Detailed structure guide
├── dist/                                     # Compiled output
├── coverage/                                 # Test coverage reports
├── nest-cli.json                            # NestJS CLI configuration
├── package.json
├── tsconfig.json                            # TypeScript base config
├── tsconfig.build.json
├── .eslintrc.js
└── .prettierrc
```

📖 **[Read the complete structure guide](./libs/ddd-valueobjects/STRUCTURE.md)** to understand the organization and how to extend it.

## Using as a NestJS Library

This library is built following NestJS CLI library guidelines. You can:

### 1. Use it in your NestJS applications

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { DddValueObjectsModule } from '@nestjslatam/ddd-valueobjects';

@Module({
  imports: [DddValueObjectsModule.forRoot()],
})
export class AppModule {}
```

### 2. Import value objects directly

```typescript
import { Email, UUID, ValueObject, Result } from '@nestjslatam/ddd-valueobjects';
```

### 3. Extend and create your own value objects

```typescript
import { ValueObject, Result } from '@nestjslatam/ddd-valueobjects';

export class CustomValueObject extends ValueObject<YourProps> {
  // Your implementation
}
```

## Publishing

This library is published under the `@nestjslatam` organization on npm.

```bash
npm run build
npm publish
```

## Contributing

Contributions are welcome! Please ensure all tests pass and add tests for new features.

## License

MIT

---

Made with ❤️ by [NestJS LATAM](https://github.com/nestjslatam)
