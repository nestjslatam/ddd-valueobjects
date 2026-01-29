import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for user data
 * Represents the user data returned to clients
 */
export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2026-01-29T00:00:00.000Z',
  })
  createdAt: Date;
}
