import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Email, UUID } from '@nestjslatam/ddd-valueobjects';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

/**
 * Users Service
 * Demonstrates usage of DDD Value Objects with Result pattern
 *
 * This service showcases:
 * - Creating value objects from DTOs
 * - Handling Result pattern for error management
 * - Using value objects in domain entities
 * - Converting domain entities to DTOs for responses
 */
@Injectable()
export class UsersService {
  // In-memory storage for demonstration purposes
  // In production, this would be replaced with a database repository
  private users: Map<string, User> = new Map();

  /**
   * Create a new user with email and UUID value objects
   * Demonstrates the Result pattern for validation
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Create Email value object with validation
    const emailResult = Email.create(createUserDto.email);
    if (emailResult.isFailure) {
      throw new ConflictException(emailResult.getError());
    }

    const email = emailResult.getValue();

    // Check if email already exists
    const existingUser = Array.from(this.users.values()).find((u) => u.email === email.value);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate UUID for the new user
    const userId = UUID.generate();

    // Create the user entity using value objects
    const user = User.create(userId, email, createUserDto.name);

    // Store the user
    this.users.set(user.id, user);

    // Return DTO
    return this.toResponseDto(user);
  }

  /**
   * Find all users
   */
  async findAll(): Promise<UserResponseDto[]> {
    return Array.from(this.users.values()).map((user) => this.toResponseDto(user));
  }

  /**
   * Find a user by UUID
   * Demonstrates UUID validation using Result pattern
   */
  async findOne(id: string): Promise<UserResponseDto> {
    // Validate UUID format
    const uuidResult = UUID.create(id);
    if (uuidResult.isFailure) {
      throw new ConflictException(uuidResult.getError());
    }

    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.toResponseDto(user);
  }

  /**
   * Find a user by email
   * Demonstrates Email validation using Result pattern
   */
  async findByEmail(email: string): Promise<UserResponseDto> {
    // Validate email format
    const emailResult = Email.create(email);
    if (emailResult.isFailure) {
      throw new ConflictException(emailResult.getError());
    }

    const emailValue = emailResult.getValue();
    const user = Array.from(this.users.values()).find((u) => u.email === emailValue.value);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return this.toResponseDto(user);
  }

  /**
   * Update user information
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Validate UUID format
    const uuidResult = UUID.create(id);
    if (uuidResult.isFailure) {
      throw new ConflictException(uuidResult.getError());
    }

    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Update user properties using domain methods
    if (updateUserDto.name) {
      user.updateName(updateUserDto.name);
    }

    return this.toResponseDto(user);
  }

  /**
   * Delete a user
   */
  async remove(id: string): Promise<void> {
    // Validate UUID format
    const uuidResult = UUID.create(id);
    if (uuidResult.isFailure) {
      throw new ConflictException(uuidResult.getError());
    }

    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users.delete(id);
  }

  /**
   * Seed some example users for demonstration
   */
  async seed(): Promise<void> {
    const seedUsers = [
      { email: 'john.doe@example.com', name: 'John Doe' },
      { email: 'jane.smith@example.com', name: 'Jane Smith' },
      { email: 'bob.wilson@example.com', name: 'Bob Wilson' },
    ];

    for (const userData of seedUsers) {
      const emailResult = Email.create(userData.email);
      if (emailResult.isSuccess) {
        const userId = UUID.generate();
        const user = User.create(userId, emailResult.getValue(), userData.name);
        this.users.set(user.id, user);
      }
    }
  }

  /**
   * Convert domain entity to response DTO
   */
  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
