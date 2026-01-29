import { Email, UUID } from '@nestjslatam/ddd-valueobjects';

/**
 * User Entity using DDD Value Objects
 * Demonstrates how to use Email and UUID value objects in domain entities
 */
export class User {
  private readonly _id: UUID;
  private readonly _email: Email;
  private _name: string;
  private readonly _createdAt: Date;

  private constructor(id: UUID, email: Email, name: string, createdAt: Date) {
    this._id = id;
    this._email = email;
    this._name = name;
    this._createdAt = createdAt;
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

  get createdAt(): Date {
    return this._createdAt;
  }

  // Factory method
  static create(id: UUID, email: Email, name: string): User {
    return new User(id, email, name, new Date());
  }

  // For creating from persistence
  static reconstitute(id: string, email: string, name: string, createdAt: Date): User {
    const idResult = UUID.create(id);
    const emailResult = Email.create(email);

    if (idResult.isFailure) {
      throw new Error(`Invalid user ID: ${idResult.getError()}`);
    }

    if (emailResult.isFailure) {
      throw new Error(`Invalid user email: ${emailResult.getError()}`);
    }

    return new User(idResult.getValue(), emailResult.getValue(), name, createdAt);
  }

  // Business logic methods
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this._name = name;
  }

  // For presentation/API responses
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
    };
  }
}
