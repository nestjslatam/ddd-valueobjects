# Code Examples - @nestjslatam/ddd-valueobjects

This document provides quick code examples for common use cases.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Creating Value Objects](#creating-value-objects)
- [Result Pattern](#result-pattern)
- [Domain Entities](#domain-entities)
- [Service Layer](#service-layer)
- [Controller Layer](#controller-layer)

---

## Basic Usage

### Module Import

```typescript
import { Module } from '@nestjs/common';
import { DddValueObjectsModule } from '@nestjslatam/ddd-valueobjects';

@Module({
  imports: [DddValueObjectsModule.forRoot()],
})
export class AppModule {}
```

---

## Creating Value Objects

### Email Value Object

```typescript
import { Email } from '@nestjslatam/ddd-valueobjects';

// Valid email
const emailResult = Email.create('user@example.com');
if (emailResult.isSuccess) {
  const email = emailResult.getValue();
  console.log(email.value); // 'user@example.com'
}

// Invalid email
const invalidEmail = Email.create('invalid-email');
if (invalidEmail.isFailure) {
  console.log(invalidEmail.getError()); // 'Email format is invalid'
}
```

### UUID Value Object

```typescript
import { UUID } from '@nestjslatam/ddd-valueobjects';

// Generate new UUID
const newId = UUID.generate();
console.log(newId.value); // '550e8400-e29b-41d4-a716-446655440000'

// Validate existing UUID
const uuidResult = UUID.create('550e8400-e29b-41d4-a716-446655440000');
if (uuidResult.isSuccess) {
  const uuid = uuidResult.getValue();
  console.log(uuid.value);
}
```

---

## Result Pattern

### Basic Result Usage

```typescript
import { Result } from '@nestjslatam/ddd-valueobjects';

// Success result
const successResult = Result.ok({ data: 'some value' });
if (successResult.isSuccess) {
  const value = successResult.getValue();
}

// Failure result
const failureResult = Result.fail<string>('Something went wrong');
if (failureResult.isFailure) {
  const error = failureResult.getError();
}
```

### Combining Results

```typescript
import { Result, Email } from '@nestjslatam/ddd-valueobjects';

const results = [
  Email.create('user1@example.com'),
  Email.create('user2@example.com'),
  Email.create('invalid'),
];

const combined = Result.combine(results);
if (combined.isFailure) {
  console.log('At least one email is invalid');
}
```

---

## Domain Entities

### Entity with Value Objects

```typescript
import { Email, UUID } from '@nestjslatam/ddd-valueobjects';

export class User {
  private readonly _id: UUID;
  private readonly _email: Email;
  private _name: string;

  private constructor(id: UUID, email: Email, name: string) {
    this._id = id;
    this._email = email;
    this._name = name;
  }

  // Getters
  get id(): string {
    return this._id.value;
  }

  get email(): string {
    return this._email.value;
  }

  get name(): string {
    return this._name;
  }

  // Factory method
  static create(id: UUID, email: Email, name: string): User {
    return new User(id, email, name);
  }

  // Business logic
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this._name = name;
  }
}
```

---

## Service Layer

### Service with Result Pattern

```typescript
import { Injectable, ConflictException } from '@nestjs/common';
import { Email, UUID } from '@nestjslatam/ddd-valueobjects';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async createUser(emailString: string, name: string) {
    // Validate email
    const emailResult = Email.create(emailString);
    if (emailResult.isFailure) {
      throw new ConflictException(emailResult.getError());
    }

    // Generate UUID
    const userId = UUID.generate();

    // Create entity
    const user = User.create(userId, emailResult.getValue(), name);

    return user;
  }

  async findByEmail(emailString: string) {
    // Validate email format
    const emailResult = Email.create(emailString);
    if (emailResult.isFailure) {
      throw new ConflictException(emailResult.getError());
    }

    const email = emailResult.getValue();
    // ... find user by email.value
  }
}
```

---

## Controller Layer

### REST Controller

```typescript
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto.email, dto.name);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // UUID validation happens in service
    return this.usersService.findOne(id);
  }

  @Get('by-email')
  async findByEmail(@Query('email') email: string) {
    // Email validation happens in service
    return this.usersService.findByEmail(email);
  }
}
```

### DTOs with Validation

```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
```

---

## Custom Value Objects

### Creating Your Own Value Object

```typescript
import { ValueObject, Result } from '@nestjslatam/ddd-valueobjects';

interface PhoneProps {
  value: string;
}

export class Phone extends ValueObject<PhoneProps> {
  private static readonly PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PhoneProps) {
    super(props);
  }

  public static create(phone: string): Result<Phone> {
    if (!phone || phone.trim().length === 0) {
      return Result.fail<Phone>('Phone cannot be empty');
    }

    const cleaned = phone.replace(/[\s-()]/g, '');

    if (!this.PHONE_REGEX.test(cleaned)) {
      return Result.fail<Phone>('Phone format is invalid');
    }

    return Result.ok<Phone>(new Phone({ value: cleaned }));
  }
}
```

---

## Error Handling Patterns

### HTTP Exception Mapping

```typescript
import { ConflictException, NotFoundException } from '@nestjs/common';

// In service
const emailResult = Email.create(email);
if (emailResult.isFailure) {
  throw new ConflictException(emailResult.getError());
}

// Not found
const user = this.users.get(id);
if (!user) {
  throw new NotFoundException(`User with ID ${id} not found`);
}
```

### Try-Catch with Value Objects

```typescript
try {
  const emailResult = Email.create(emailString);
  if (emailResult.isFailure) {
    return {
      success: false,
      error: emailResult.getError(),
    };
  }

  const user = await this.createUser(emailResult.getValue());
  return {
    success: true,
    data: user,
  };
} catch (error) {
  return {
    success: false,
    error: error.message,
  };
}
```

---

## Testing Examples

### Testing Value Objects

```typescript
describe('Email Value Object', () => {
  it('should create valid email', () => {
    const result = Email.create('test@example.com');
    expect(result.isSuccess).toBe(true);
    expect(result.getValue().value).toBe('test@example.com');
  });

  it('should fail for invalid email', () => {
    const result = Email.create('invalid');
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe('Email format is invalid');
  });
});
```

### Testing Services

```typescript
describe('UsersService', () => {
  it('should create user with valid email', async () => {
    const service = new UsersService();
    const user = await service.createUser('test@example.com', 'Test User');

    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
  });

  it('should throw on invalid email', async () => {
    const service = new UsersService();

    await expect(service.createUser('invalid-email', 'Test')).rejects.toThrow();
  });
});
```

---

For more examples, check the [example-app](./apps/example-app) directory.
