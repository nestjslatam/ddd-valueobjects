# Example App - @nestjslatam/ddd-valueobjects

Esta es una aplicación de ejemplo que demuestra el uso de la biblioteca **@nestjslatam/ddd-valueobjects** en una aplicación NestJS real.

## 🎯 Propósito

Esta aplicación sirve como referencia técnica para desarrolladores que quieran integrar los patrones de DDD Value Objects en sus proyectos NestJS.

## 📚 Qué Demuestra

### 1. **Value Objects en Entidades de Dominio**

- Uso de `Email` y `UUID` value objects en la entidad `User`
- Inmutabilidad y validación automática
- Métodos factory para creación segura

### 2. **Result Pattern para Manejo de Errores**

- Validación funcional sin excepciones
- Manejo elegante de errores de validación
- Separación de lógica de negocio y presentación

### 3. **Integración con NestJS**

- Importación del módulo `DddValueObjectsModule.forRoot()`
- DTOs con `class-validator` para validación de entrada
- Servicios que usan value objects
- Controladores REST con Swagger

### 4. **Casos de Uso Prácticos**

- CRUD completo de usuarios
- Búsqueda por email con validación
- Generación de UUIDs
- Manejo de errores HTTP apropiados

## 🚀 Ejecutar la Aplicación

### Instalar dependencias

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm run start:dev
```

### Acceder a la documentación Swagger

```
http://localhost:3000/api
```

## 📋 Endpoints Principales

### Seed de datos de ejemplo

```bash
curl -X POST http://localhost:3000/users/seed
```

### Crear usuario

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe"
  }'
```

### Listar usuarios

```bash
curl http://localhost:3000/users
```

### Buscar por email

```bash
curl "http://localhost:3000/users/by-email?email=john@example.com"
```

### Obtener usuario por ID

```bash
curl http://localhost:3000/users/{uuid}
```

### Actualizar usuario

```bash
curl -X PATCH http://localhost:3000/users/{uuid} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe"
  }'
```

### Eliminar usuario

```bash
curl -X DELETE http://localhost:3000/users/{uuid}
```

## 🏗️ Estructura del Código

```
apps/example-app/
├── src/
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts      # DTO de entrada con validación
│   │   │   ├── update-user.dto.ts      # DTO de actualización
│   │   │   └── user-response.dto.ts    # DTO de respuesta
│   │   ├── entities/
│   │   │   └── user.entity.ts          # Entidad de dominio con value objects
│   │   ├── users.controller.ts         # Controlador REST
│   │   ├── users.service.ts            # Lógica de negocio con Result pattern
│   │   └── users.module.ts             # Módulo de usuarios
│   ├── example-app.controller.ts       # Controlador principal
│   ├── example-app.module.ts           # Módulo principal con DddValueObjectsModule
│   ├── example-app.service.ts
│   └── main.ts                         # Bootstrap con Swagger
└── test/
    └── app.e2e-spec.ts                 # Tests E2E
```

## 💡 Puntos Clave de Aprendizaje

### 1. Creación de Value Objects

```typescript
const emailResult = Email.create('user@example.com');
if (emailResult.isSuccess) {
  const email = emailResult.getValue();
  console.log(email.value); // 'user@example.com'
}
```

### 2. Manejo del Result Pattern

```typescript
const emailResult = Email.create(dto.email);
if (emailResult.isFailure) {
  throw new ConflictException(emailResult.getError());
}
const email = emailResult.getValue();
```

### 3. Uso en Entidades

```typescript
export class User {
  private readonly _id: UUID;
  private readonly _email: Email;

  static create(id: UUID, email: Email, name: string): User {
    return new User(id, email, name, new Date());
  }
}
```

### 4. Generación de UUIDs

```typescript
const userId = UUID.generate(); // Genera un UUID v4 válido
console.log(userId.value); // '550e8400-e29b-41d4-a716-446655440000'
```

## 🧪 Testing

Los ejemplos incluyen tests que demuestran:

- Validación de value objects
- Manejo de errores
- Integración con controladores

## 📖 Recursos

- [Documentación de la Biblioteca](../../README.md)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
- [NestJS Documentation](https://docs.nestjs.com)

## 🤝 Contribuir

Esta aplicación de ejemplo es parte del proyecto `@nestjslatam/ddd-valueobjects`. Las contribuciones son bienvenidas!

## 📝 Licencia

MIT
