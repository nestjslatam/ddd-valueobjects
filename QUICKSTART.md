# Quick Start Guide - Example App

## 🚀 Run the Example Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Application

```bash
npm run start:dev
```

The app will start on `http://localhost:3000`

### 3. Access Swagger Documentation

Open your browser and navigate to:

```
http://localhost:3000/api
```

## 📝 Try It Out

### Seed Example Users

```bash
curl -X POST http://localhost:3000/users/seed
```

### Create a New User

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Get All Users

```bash
curl http://localhost:3000/users
```

### Search User by Email

```bash
curl "http://localhost:3000/users/by-email?email=test@example.com"
```

## 🎯 What to Explore

1. **Open Swagger UI** at `/api` to see all available endpoints
2. **Check the code** in `apps/example-app/src/users/` to see:
   - How Email and UUID value objects are used
   - Result pattern implementation
   - Domain entity design
   - Service and controller integration

3. **Try invalid inputs** to see validation in action:

   ```bash
   # Invalid email
   curl -X POST http://localhost:3000/users \
     -H "Content-Type: application/json" \
     -d '{"email": "invalid-email", "name": "Test"}'

   # Invalid UUID
   curl http://localhost:3000/users/invalid-uuid
   ```

## 📚 Key Files to Review

- `apps/example-app/src/users/entities/user.entity.ts` - Domain entity using value objects
- `apps/example-app/src/users/users.service.ts` - Business logic with Result pattern
- `apps/example-app/src/users/users.controller.ts` - REST API endpoints
- `apps/example-app/src/example-app.module.ts` - Module configuration

## 💡 Learning Points

This example demonstrates:

- ✅ Creating and validating Email value objects
- ✅ Generating and validating UUID value objects
- ✅ Using Result pattern for error handling
- ✅ Integrating value objects in domain entities
- ✅ Converting between DTOs and domain entities
- ✅ REST API design with proper error handling
- ✅ Swagger/OpenAPI documentation

Enjoy exploring! 🎉
