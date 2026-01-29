import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExampleAppModule } from './example-app.module';

/**
 * Bootstrap the Example App
 *
 * This application demonstrates the usage of @nestjslatam/ddd-valueobjects library
 * with practical examples in the Users module.
 *
 * Features:
 * - REST API with Swagger documentation
 * - Global validation pipe for DTOs
 * - Example CRUD operations using Email and UUID value objects
 * - Result pattern for error handling
 */
async function bootstrap() {
  const app = await NestFactory.create(ExampleAppModule);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('DDD Value Objects - Example App')
    .setDescription(
      'Example application demonstrating the usage of @nestjslatam/ddd-valueobjects library. ' +
        'This API showcases how to use Email and UUID value objects with the Result pattern in a NestJS application.',
    )
    .setVersion('1.0')
    .addTag('users', 'User management endpoints using DDD Value Objects')
    .addTag('health', 'Health check and app info endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`
  🚀 Example App is running!
  
  📖 Swagger Documentation: http://localhost:${port}/api
  🔗 API Base URL: http://localhost:${port}
  
  📝 Try these endpoints:
  - POST http://localhost:${port}/users/seed (Seed example users)
  - GET  http://localhost:${port}/users (Get all users)
  - POST http://localhost:${port}/users (Create a new user)
  
  💡 This app demonstrates @nestjslatam/ddd-valueobjects usage
  `);
}
bootstrap();
