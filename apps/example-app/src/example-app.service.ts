import { Injectable } from '@nestjs/common';

/**
 * Example App Service
 * Provides application information
 */
@Injectable()
export class ExampleAppService {
  getInfo() {
    return {
      name: '@nestjslatam/ddd-valueobjects - Example App',
      version: '1.0.0',
      description: 'Example application demonstrating the usage of DDD Value Objects library',
      documentation: '/api',
      endpoints: {
        users: '/users',
        swagger: '/api',
        health: '/health',
      },
      examples: [
        {
          description: 'Seed example users',
          method: 'POST',
          endpoint: '/users/seed',
        },
        {
          description: 'Get all users',
          method: 'GET',
          endpoint: '/users',
        },
        {
          description: 'Create a new user',
          method: 'POST',
          endpoint: '/users',
          body: {
            email: 'user@example.com',
            name: 'John Doe',
          },
        },
        {
          description: 'Find user by email',
          method: 'GET',
          endpoint: '/users/by-email?email=user@example.com',
        },
      ],
    };
  }
}
