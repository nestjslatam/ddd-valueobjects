# Value Objects Reference Guide

Esta guía documenta todos los Value Objects disponibles en la librería, basados en la arquitectura de `@nestjslatam/ddd-lib` con **validators** y **broken rules**.

## 📋 Índice

- [Conceptos Fundamentales](#conceptos-fundamentales)
- [Text Value Objects](#text-value-objects)
- [Identification Value Objects](#identification-value-objects)
- [Numeric Value Objects](#numeric-value-objects)
- [Date Value Objects](#date-value-objects)
- [Legacy Value Objects](#legacy-value-objects)

---

## Conceptos Fundamentales

### DddValueObject

Todos los Value Objects extienden de `DddValueObject<T>` de `@nestjslatam/ddd-lib`, que proporciona:

- **Validators**: Sistema de validación con reglas reutilizables
- **Broken Rules**: Gestión de errores de validación
- **Tracking State**: Seguimiento de cambios
- **Equality**: Comparación por valor
- **Immutability**: Objetos inmutables

### Patrón de Uso

```typescript
import { Name } from '@nestjslatam/ddd-valueobjects';

// Crear con validación
const name = Name.create('John', 'Doe', 'Michael');

// Verificar validez
if (!name.isValid) {
  console.log(name.brokenRules.getBrokenRulesAsString());
}

// Acceder a propiedades
console.log(name.getFullName()); // "John Michael Doe"
console.log(name.getInitials()); // "JMD"
```

---

## Text Value Objects

### 📝 Name

Representa el nombre completo de una persona con validación.

**Props:**

```typescript
interface NameProps {
  firstName: string;
  lastName: string;
  middleName?: string;
}
```

**Ejemplo:**

```typescript
import { Name } from '@nestjslatam/ddd-valueobjects';

// Crear nombre
const name = Name.create('María', 'García', 'Isabel');

// Métodos disponibles
name.getFullName(); // "María Isabel García"
name.getInitials(); // "MIG"
name.firstName; // "María"
name.lastName; // "García"
name.middleName; // "Isabel"
```

**Validaciones:**

- First name y last name son requeridos
- Mínimo 2 caracteres cada uno
- Máximo 50 caracteres
- Solo letras, espacios, guiones y apóstrofes
- Soporta caracteres latinos (á, é, í, ó, ú, ñ)

**Broken Rules:**

```typescript
const name = Name.create('A', 'B'); // Lanza error
// Error: Invalid Name: First name must be at least 2 characters, Last name must be at least 2 characters
```

---

### 📄 Description

Representa una descripción de texto con límites configurables.

**Options:**

```typescript
interface DescriptionOptions {
  minLength: number; // default: 10
  maxLength: number; // default: 500
  allowEmpty: boolean; // default: false
}
```

**Ejemplo:**

```typescript
import { Description } from '@nestjslatam/ddd-valueobjects';

// Crear descripción
const desc = Description.create(
  'Este es un producto de alta calidad fabricado con los mejores materiales.',
  { minLength: 20, maxLength: 1000 },
);

// Métodos disponibles
desc.length; // 72
desc.isEmpty(); // false
desc.preview(30); // "Este es un producto de alta..."
desc.wordCount(); // 12
```

**Validaciones:**

- Respeta minLength y maxLength configurados
- No permite solo espacios en blanco
- Debe contener al menos un carácter alfanumérico

---

### 🔗 Url

Representa una URL válida con validación de protocolo y dominio.

**Options:**

```typescript
interface UrlOptions {
  requireProtocol: boolean; // default: true
  allowedProtocols: string[]; // default: ['http', 'https']
}
```

**Ejemplo:**

```typescript
import { Url } from '@nestjslatam/ddd-valueobjects';

// Crear URL
const url = Url.create('https://api.example.com/users?page=1');

// Métodos disponibles
url.getProtocol(); // "https"
url.getDomain(); // "api.example.com"
url.getPath(); // "/users"
url.getQueryParams(); // { page: "1" }
url.isSecure(); // true
```

**Validaciones:**

- Formato de URL válido
- Protocolo requerido (configurable)
- Protocolo en lista permitida
- Dominio válido
- Máximo 2048 caracteres

---

## Identification Value Objects

### 📱 PhoneNumber

Representa un número telefónico con código de país.

**Options:**

```typescript
interface PhoneNumberOptions {
  countryCode?: string; // default: '+1'
  format?: 'international' | 'national'; // default: 'international'
}
```

**Ejemplo:**

```typescript
import { PhoneNumber } from '@nestjslatam/ddd-valueobjects';

// Crear teléfono
const phone = PhoneNumber.create('5551234567', { countryCode: '+1' });

// Métodos disponibles
phone.getDigitsOnly(); // "5551234567"
phone.getFormatted(); // "+1 (555) 123-4567"
phone.getNationalFormat(); // "(555) 123-4567"
phone.countryCode; // "+1"
```

**Validaciones:**

- Mínimo 10 dígitos
- Máximo 15 dígitos
- Solo dígitos, espacios, paréntesis, guiones, y +
- No permite patrones secuenciales (1234567890)
- No permite dígitos repetidos (1111111111)

---

### 🆔 DocumentId

Representa un documento de identificación gubernamental.

**Types:**

```typescript
type DocumentIdType =
  | 'DNI' // Documento Nacional de Identidad
  | 'PASSPORT' // Pasaporte
  | 'SSN' // Social Security Number (USA)
  | 'TAX_ID' // ID Fiscal
  | 'DRIVER_LICENSE' // Licencia de conducir
  | 'OTHER'; // Otro tipo
```

**Ejemplo:**

```typescript
import { DocumentId } from '@nestjslatam/ddd-valueobjects';

// Crear DNI
const dni = DocumentId.createDNI('12345678', 'ARG');

// Crear Pasaporte
const passport = DocumentId.createPassport('AB123456', 'USA');

// Crear SSN
const ssn = DocumentId.createSSN('123-45-6789');

// Métodos disponibles
dni.value; // "12345678"
dni.type; // "DNI"
dni.country; // "ARG"
dni.getClean(); // "12345678"
dni.getMasked(); // "****5678"
dni.isFromCountry('ARG'); // true
```

**Validaciones por tipo:**

- **DNI**: 7-10 dígitos
- **PASSPORT**: 6-12 caracteres alfanuméricos
- **SSN**: Exactamente 9 dígitos, validación de patrones inválidos
- **TAX_ID**: 9-15 caracteres
- **DRIVER_LICENSE**: 5-20 caracteres

---

## Numeric Value Objects

### 👤 Age

Representa la edad de una persona.

**Options:**

```typescript
interface AgeOptions {
  minAge: number; // default: 0
  maxAge: number; // default: 150
}
```

**Ejemplo:**

```typescript
import { Age } from '@nestjslatam/ddd-valueobjects';

// Crear edad
const age = Age.create(25);

// Crear desde fecha de nacimiento
const birthDate = new Date('1998-05-15');
const age2 = Age.fromBirthDate(birthDate);

// Métodos disponibles
age.isMinor(); // false
age.isAdult(); // true
age.isSenior(); // false
age.getCategory(); // 'adult'
```

**Categorías:**

- `child`: < 13 años
- `teenager`: 13-17 años
- `adult`: 18-64 años
- `senior`: >= 65 años

**Validaciones:**

- Número entero
- No negativo
- Entre minAge y maxAge configurados

---

### 💰 Money

Representa una cantidad monetaria con moneda.

**Ejemplo:**

```typescript
import { Money } from '@nestjslatam/ddd-valueobjects';

// Crear dinero
const price = Money.create(99.99, 'USD');
const tax = Money.create(8.5, 'USD');

// Operaciones aritméticas
const total = price.add(tax); // $108.49
const discount = price.multiply(0.1); // $10.00
const final = price.subtract(discount); // $89.99

// Métodos disponibles
price.amount; // 99.99
price.currency; // "USD"
price.isPositive(); // true
price.format('es-AR'); // "$99,99"

// Dividir proporcionalemente
const shares = total.allocate([1, 2, 1]); // [27.12, 54.25, 27.12]
```

**Validaciones:**

- Amount debe ser número finito
- Máximo 2 decimales (excepto JPY que usa 0)
- Currency debe ser código ISO 4217 de 3 letras
- Solo se pueden operar monedas iguales

---

### 📊 Percentage

Representa un porcentaje (0-100% por defecto).

**Options:**

```typescript
interface PercentageOptions {
  min: number; // default: 0
  max: number; // default: 100
  allowNegative: boolean; // default: false
}
```

**Ejemplo:**

```typescript
import { Percentage } from '@nestjslatam/ddd-valueobjects';

// Crear porcentaje
const discount = Percentage.create(25);

// Desde ratio
const commission = Percentage.fromRatio(0.15); // 15%

// Desde fracción
const share = Percentage.fromFraction(1, 4); // 25%

// Aplicar porcentaje
discount.applyTo(100); // 25
discount.increase(100); // 125
discount.decrease(100); // 75

// Métodos disponibles
discount.toDecimal(); // 0.25
discount.toRatio(); // 0.25
discount.format(1); // "25.0%"
discount.isZero(); // false
discount.isOneHundred(); // false
```

**Validaciones:**

- Número finito
- Entre min y max configurados
- Máximo 2 decimales
- Negativo solo si allowNegative es true

---

## Date Value Objects

### 📅 DateRange

Representa un rango de fechas.

**Ejemplo:**

```typescript
import { DateRange } from '@nestjslatam/ddd-valueobjects';

// Crear rango
const range = DateRange.create(new Date('2024-01-01'), new Date('2024-12-31'));

// Desde strings
const range2 = DateRange.fromStrings('2024-01-01', '2024-12-31');

// Rangos predefinidos
const thisMonth = DateRange.currentMonth();
const thisYear = DateRange.currentYear();
const last30Days = DateRange.lastDays(30);

// Métodos disponibles
range.getDurationDays(); // 365
range.getDurationHours(); // 8760
range.contains(new Date('2024-06-15')); // true

// Operaciones con rangos
const range3 = DateRange.create(new Date('2024-06-01'), new Date('2024-12-31'));
range.overlaps(range3); // true
range.intersect(range3); // DateRange(2024-06-01, 2024-12-31)
range.extendByDays(10); // Extiende 10 días
```

**Validaciones:**

- Fechas válidas
- startDate <= endDate
- Máximo 100 años de rango
- endDate no más de 10 años en el futuro
- startDate no antes de 1900

---

### 🎂 BirthDate

Representa una fecha de nacimiento con cálculo de edad.

**Ejemplo:**

```typescript
import { BirthDate } from '@nestjslatam/ddd-valueobjects';

// Crear fecha de nacimiento
const birthDate = BirthDate.create(new Date('1990-05-15'));

// Desde string
const birthDate2 = BirthDate.fromString('1990-05-15');

// Desde componentes
const birthDate3 = BirthDate.fromComponents(1990, 5, 15);

// Métodos disponibles
birthDate.getAge(); // 33 (edad actual)
birthDate.isMinor(); // false
birthDate.isAdult(); // true
birthDate.isSenior(); // false
birthDate.getNextBirthday(); // Date(2025-05-15)
birthDate.getDaysUntilBirthday(); // 106
birthDate.isBirthdayToday(); // false
birthDate.getZodiacSign(); // "Taurus"
birthDate.format('es-AR'); // "15 de mayo de 1990"
```

**Validaciones:**

- Fecha válida
- No puede ser futura
- No antes de 1900
- Edad máxima razonable: 150 años

---

## Legacy Value Objects

### 📧 Email

Value Object simple para emails (sin validators).

**Ejemplo:**

```typescript
import { Email } from '@nestjslatam/ddd-valueobjects';

const emailResult = Email.create('user@example.com');

if (emailResult.isFailure) {
  console.log(emailResult.error);
} else {
  const email = emailResult.getValue();
  console.log(email.value); // "user@example.com"
}
```

---

### 🔑 UUID

Value Object simple para UUIDs (sin validators).

**Ejemplo:**

```typescript
import { UUID } from '@nestjslatam/ddd-valueobjects';

// Generar nuevo UUID
const id = UUID.generate();

// Validar UUID existente
const idResult = UUID.create('550e8400-e29b-41d4-a716-446655440000');
```

---

## Crear Custom Value Objects

Para crear tus propios Value Objects:

```typescript
import { DddValueObject, AbstractRuleValidator } from '@nestjslatam/ddd-valueobjects';

// 1. Definir el Value Object
export class CustomVO extends DddValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string): CustomVO {
    const vo = new CustomVO(value);
    vo.addValidators();

    if (!vo.isValid) {
      throw new Error(vo.brokenRules.getBrokenRulesAsString());
    }

    return vo;
  }

  addValidators(): void {
    this.validatorRules.add(new CustomValidator(this));
  }

  protected getEqualityComponents(): Iterable<any> {
    return [this.getValue()];
  }
}

// 2. Definir el Validator
export class CustomValidator extends AbstractRuleValidator<CustomVO> {
  addRules(): void {
    const value = this.subject.getValue();

    if (!value) {
      this.addBrokenRule('value', 'Value cannot be empty');
    }

    // Más reglas de validación...
  }
}
```

---

## Testing Value Objects

```typescript
import { Name } from '@nestjslatam/ddd-valueobjects';

describe('Name Value Object', () => {
  it('should create valid name', () => {
    const name = Name.create('John', 'Doe');

    expect(name.isValid).toBe(true);
    expect(name.getFullName()).toBe('John Doe');
  });

  it('should fail with short first name', () => {
    expect(() => Name.create('J', 'Doe')).toThrow();
  });

  it('should have broken rules', () => {
    try {
      Name.create('J', 'D');
    } catch (error) {
      expect(error.message).toContain('First name must be at least 2 characters');
    }
  });
});
```

---

## Best Practices

1. **Siempre validar en create()**: Use `create()` para instancias nuevas, `load()` para datos persistidos
2. **Manejar broken rules**: Verifica `isValid` o captura errores
3. **Immutability**: Los Value Objects son inmutables, operaciones retornan nuevas instancias
4. **Equality**: Compara por valor usando `equals()`
5. **Serialización**: Usa `toJSON()` para persistencia
6. **Factory methods**: Usa métodos estáticos específicos (`fromRatio`, `fromBirthDate`, etc.)

---

## Recursos Adicionales

- [Estructura de la librería](./STRUCTURE.md)
- [Guía de inicio rápido](../../../QUICKSTART.md)
- [Ejemplos completos](../../../EXAMPLES.md)
- [@nestjslatam/ddd-lib](https://www.npmjs.com/package/@nestjslatam/ddd-lib)
