# Library Structure - @nestjslatam/ddd-valueobjects

Esta biblioteca está organizada en una estructura modular que facilita la comprensión, mantenimiento y extensión del código.

## 📁 Estructura de Directorios

```
libs/ddd-valueobjects/src/
├── core/                           # Abstracciones base
│   ├── value-object.base.ts       # Clase abstracta ValueObject
│   ├── result.ts                  # Result pattern
│   └── index.ts                   # Exports del core
│
├── implementations/                # Implementaciones concretas
│   ├── email/                     # Value Object de Email
│   │   ├── email.value-object.ts
│   │   └── index.ts
│   │
│   ├── uuid/                      # Value Object de UUID
│   │   ├── uuid.value-object.ts
│   │   └── index.ts
│   │
│   └── index.ts                   # Exports de implementaciones
│
├── module/                         # Módulo NestJS
│   ├── ddd-value-objects.module.ts
│   └── index.ts
│
└── index.ts                        # API pública principal
```

## 🎯 Propósito de Cada Directorio

### `/core` - Abstracciones Base

Contiene las clases y patrones fundamentales que sirven como base para crear value objects:

- **`ValueObject<T>`**: Clase abstracta que implementa igualdad e inmutabilidad
- **`Result<T>`**: Patrón funcional para manejo de errores sin excepciones

**Uso:**

```typescript
import { ValueObject, Result } from '@nestjslatam/ddd-valueobjects';
```

### `/implementations` - Value Objects Concretos

Implementaciones listas para usar de value objects comunes:

- **`Email`**: Validación de direcciones de correo electrónico
- **`UUID`**: Validación y generación de UUIDs

Cada implementación tiene su propio subdirectorio con:

- El archivo principal del value object
- Tests específicos (opcional)
- Documentación adicional (opcional)

**Uso:**

```typescript
import { Email, UUID } from '@nestjslatam/ddd-valueobjects';
```

### `/module` - Configuración NestJS

Módulo de NestJS para integración con el framework:

- **`DddValueObjectsModule`**: Módulo global con método `forRoot()`

**Uso:**

```typescript
import { DddValueObjectsModule } from '@nestjslatam/ddd-valueobjects';
```

## 🔄 Flujo de Imports

La estructura permite imports específicos o generales:

```typescript
// Import general (recomendado)
import { Email, UUID, ValueObject, Result } from '@nestjslatam/ddd-valueobjects';

// Import específico del core
import { ValueObject, Result } from '@nestjslatam/ddd-valueobjects/core';

// Import específico de implementaciones
import { Email } from '@nestjslatam/ddd-valueobjects/implementations/email';
import { UUID } from '@nestjslatam/ddd-valueobjects/implementations/uuid';

// Import del módulo
import { DddValueObjectsModule } from '@nestjslatam/ddd-valueobjects/module';
```

## ➕ Agregar Nuevos Value Objects

Para agregar un nuevo value object:

1. **Crear directorio** en `/implementations`:

   ```
   implementations/
   └── phone/
       ├── phone.value-object.ts
       └── index.ts
   ```

2. **Implementar** usando las abstracciones del core:

   ```typescript
   import { ValueObject, Result } from '../../core';

   export class Phone extends ValueObject<PhoneProps> {
     // ... implementación
   }
   ```

3. **Exportar** en `/implementations/index.ts`:
   ```typescript
   export * from './phone';
   ```

## 🧪 Testing

Los tests siguen la misma estructura:

```
libs/ddd-valueobjects/src/
├── core/
│   ├── value-object.base.spec.ts
│   └── result.spec.ts
└── implementations/
    ├── email/
    │   └── email.value-object.spec.ts
    └── uuid/
        └── uuid.value-object.spec.ts
```

## 📚 Ventajas de Esta Estructura

1. **Separación de Concerns**: Core, implementaciones y configuración claramente separados
2. **Escalabilidad**: Fácil agregar nuevos value objects sin modificar código existente
3. **Mantenibilidad**: Cada componente tiene su lugar bien definido
4. **Discoverabilidad**: Los desarrolladores encuentran fácilmente lo que necesitan
5. **Testing**: Tests organizados junto a su código
6. **Tree-shaking**: Los bundlers pueden eliminar código no usado más eficientemente

## 🔍 Convenciones

- **Nombres de archivos**: kebab-case (ej: `email.value-object.ts`)
- **Nombres de clases**: PascalCase (ej: `Email`, `UUID`)
- **Cada directorio** tiene su propio `index.ts` para exports
- **Documentación JSDoc** en todas las clases y métodos públicos
- **Imports relativos** dentro de la lib, absolutos desde fuera

---

Esta estructura está diseñada para crecer con tu aplicación mientras mantiene el código organizado y fácil de mantener.
