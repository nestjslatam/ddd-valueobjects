# Plan de Mejora Completo - @nestjslatam/ddd-valueobjects

## 📋 Resumen Ejecutivo

Este plan cubre la mejora integral del proyecto aplicando principios SOLID, SoC (Separation of Concerns), Clean Code, testing completo, y automatización CI/CD.

**Duración estimada**: 5-7 días
**Prioridad**: Alta
**Estado**: Por iniciar

---

## 🎯 Objetivos

1. ✅ Verificar y aplicar principios SOLID en todas las clases
2. ✅ Implementar correctamente Separation of Concerns (SoC)
3. ✅ Aplicar Clean Code en toda la base de código
4. ✅ Lograr 100% de coverage con unit tests
5. ✅ Configurar Husky para validación pre-commit/pre-push
6. ✅ Implementar GitHub Actions para CI/CD
7. ✅ Crear pipeline completo de publicación a npm
8. ✅ Automatizar releases en GitHub

---

## 📊 Fase 1: Auditoría y Análisis (Día 1)

### 1.1 Auditoría SOLID

**Objetivo**: Verificar cumplimiento de principios SOLID en todo el código

#### Single Responsibility Principle (SRP)

- [ ] **Value Objects**: Cada VO solo maneja su propio dominio
  - ✅ Verificar que VOs no tengan lógica de persistencia
  - ✅ Verificar que VOs no tengan lógica de presentación
  - ⚠️ Identificar métodos con múltiples responsabilidades
- [ ] **Validators**: Cada validator solo valida su entidad
  - ✅ Verificar que validators no tengan lógica de negocio
  - ✅ Verificar que validators no modifiquen estado
  - ⚠️ Identificar validators con múltiples propósitos

**Archivos a revisar**:

```
libs/ddd-valueobjects/src/implementations/*/
  - *.value-object.ts (11 archivos)
  - *.validator.ts (9 archivos)
```

#### Open/Closed Principle (OCP)

- [ ] Verificar que VOs sean extensibles sin modificación
- [ ] Verificar que validators sean extensibles
- [ ] Identificar hardcoded values que deberían ser configurables

#### Liskov Substitution Principle (LSP)

- [ ] Verificar que todos los VOs puedan sustituir a `DddValueObject<T>`
- [ ] Verificar que todos los validators puedan sustituir a `AbstractRuleValidator<T>`
- [ ] Verificar contratos en métodos sobrescritos

#### Interface Segregation Principle (ISP)

- [ ] Identificar interfaces grandes que necesiten segregación
- [ ] Crear interfaces específicas por funcionalidad
- [ ] Evitar dependencias innecesarias

#### Dependency Inversion Principle (DIP)

- [ ] Verificar que dependencias sean sobre abstracciones
- [ ] Identificar acoplamiento concreto
- [ ] Refactorizar dependencias directas

**Entregable**: Documento `AUDIT-SOLID.md` con hallazgos y recomendaciones

---

### 1.2 Auditoría SoC (Separation of Concerns)

**Objetivo**: Verificar separación correcta de responsabilidades

#### Capas a verificar

1. **Domain Layer** (Value Objects)
   - [ ] Solo lógica de dominio puro
   - [ ] Sin dependencias de infraestructura
   - [ ] Sin dependencias de framework (excepto @nestjslatam/ddd-lib)

2. **Validation Layer** (Validators)
   - [ ] Solo reglas de validación
   - [ ] Sin lógica de negocio compleja
   - [ ] Sin side effects

3. **Module Layer** (NestJS Module)
   - [ ] Solo configuración de DI
   - [ ] Sin lógica de negocio

4. **Core Layer** (Legacy)
   - [ ] Evaluar si mantener o deprecar
   - [ ] Migrar a nueva arquitectura si es necesario

**Problemas comunes a identificar**:

- ❌ Lógica de validación mezclada con lógica de negocio
- ❌ Factory methods con validaciones complejas
- ❌ Métodos helper que deberían estar en servicios
- ❌ Formateo de datos en VOs (debería ser en DTOs/presenters)

**Entregable**: Documento `AUDIT-SOC.md` con refactorings necesarios

---

### 1.3 Auditoría Clean Code

**Objetivo**: Aplicar principios de código limpio

#### Naming Conventions

- [ ] Nombres de clases descriptivos y precisos
- [ ] Nombres de métodos que expresen intención
- [ ] Nombres de variables significativos
- [ ] Evitar abbreviaciones ambiguas

#### Method Length

- [ ] Métodos < 20 líneas (idealmente < 10)
- [ ] Extraer métodos largos en submétodos privados
- [ ] Un nivel de abstracción por método

#### Code Smells a identificar

- [ ] Duplicación de código
- [ ] Métodos muy largos
- [ ] Clases muy grandes
- [ ] Comentarios innecesarios
- [ ] Magic numbers
- [ ] Dead code

#### Code Quality Metrics

- [ ] Cyclomatic Complexity < 10
- [ ] Cognitive Complexity < 15
- [ ] Nesting level < 3
- [ ] Parameters per method < 4

**Herramientas a usar**:

- ESLint con reglas estrictas
- SonarQube / SonarCloud (opcional)
- Complexity reporter

**Entregable**: Documento `AUDIT-CLEAN-CODE.md` con issues encontrados

---

## 🔧 Fase 2: Refactoring (Días 2-3)

### 2.1 Refactorings SOLID

#### Prioridad Alta

**R1: Extraer validaciones complejas**

```typescript
// ANTES (Name.validator.ts)
addRules(): void {
  const value = this.subject.getValue();

  // 40+ líneas de validación en un método
  if (!value.firstName || value.firstName.trim().length === 0) {
    this.addBrokenRule('firstName', 'First name cannot be empty');
  } else if (value.firstName.length < 2) {
    // ... más validaciones
  }
}

// DESPUÉS
addRules(): void {
  this.validateFirstName();
  this.validateLastName();
  this.validateMiddleName();
}

private validateFirstName(): void {
  const firstName = this.subject.getValue().firstName;

  if (this.isEmpty(firstName)) {
    this.addBrokenRule('firstName', 'First name cannot be empty');
    return;
  }

  this.validateLength(firstName, 'firstName', 2, 50);
  this.validateCharacters(firstName, 'firstName');
}
```

**R2: Extraer constantes mágicas**

```typescript
// ANTES
if (value.firstName.length < 2) { ... }
if (value.firstName.length > 50) { ... }

// DESPUÉS
export const NAME_CONSTRAINTS = {
  FIRST_NAME: { MIN_LENGTH: 2, MAX_LENGTH: 50 },
  LAST_NAME: { MIN_LENGTH: 2, MAX_LENGTH: 50 },
  MIDDLE_NAME: { MAX_LENGTH: 50 },
  ALLOWED_PATTERN: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/,
} as const;

if (value.firstName.length < NAME_CONSTRAINTS.FIRST_NAME.MIN_LENGTH) { ... }
```

**R3: Crear interfaces para opciones**

```typescript
// ANTES (múltiples lugares con Partial<Options>)

// DESPUÉS
// Crear types/interfaces.ts
export interface ValueObjectOptions {
  // Base options
}

export interface TextValueObjectOptions extends ValueObjectOptions {
  minLength: number;
  maxLength: number;
  allowEmpty: boolean;
}

export interface NumericValueObjectOptions extends ValueObjectOptions {
  min: number;
  max: number;
  allowNegative: boolean;
}
```

**R4: Implementar Builder Pattern para VOs complejos**

```typescript
// Para VOs con muchas opciones (Money, Percentage, etc.)
export class MoneyBuilder {
  private amount: number;
  private currency: string = 'USD';

  withAmount(amount: number): this {
    this.amount = amount;
    return this;
  }

  withCurrency(currency: string): this {
    this.currency = currency;
    return this;
  }

  build(): Money {
    return Money.create(this.amount, this.currency);
  }
}

// Uso
const money = new MoneyBuilder().withAmount(100).withCurrency('EUR').build();
```

#### Prioridad Media

**R5: Extraer validation rules a clases reutilizables**

```typescript
// Crear validation-rules/
export class LengthRule {
  static validate(
    value: string,
    propertyName: string,
    min: number,
    max: number,
    addBrokenRule: (prop: string, msg: string) => void,
  ): void {
    if (value.length < min) {
      addBrokenRule(propertyName, `${propertyName} must be at least ${min} characters`);
    }
    if (value.length > max) {
      addBrokenRule(propertyName, `${propertyName} cannot exceed ${max} characters`);
    }
  }
}

export class PatternRule {
  static validate(
    value: string,
    propertyName: string,
    pattern: RegExp,
    message: string,
    addBrokenRule: (prop: string, msg: string) => void,
  ): void {
    if (!pattern.test(value)) {
      addBrokenRule(propertyName, message);
    }
  }
}
```

**R6: Implementar Strategy Pattern para formateo**

```typescript
// Para PhoneNumber, Money, etc. con múltiples formatos
export interface FormatStrategy<T> {
  format(value: T): string;
}

export class InternationalPhoneFormat implements FormatStrategy<string> {
  format(digits: string): string {
    // Formato internacional
  }
}

export class NationalPhoneFormat implements FormatStrategy<string> {
  format(digits: string): string {
    // Formato nacional
  }
}
```

---

### 2.2 Refactorings SoC

**R7: Extraer formatting a Presenters**

```typescript
// Crear presenters/
export class MoneyPresenter {
  static format(money: Money, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: money.currency,
    }).format(money.amount);
  }

  static toJSON(money: Money) {
    return {
      amount: money.amount,
      currency: money.currency,
    };
  }
}

// Money VO sin formateo
export class Money extends DddValueObject<MoneyProps> {
  // ... solo lógica de dominio
  // Sin método format()
}
```

**R8: Separar factory methods en Factory classes**

```typescript
// Crear factories/
export class DateRangeFactory {
  static currentMonth(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return DateRange.create(start, end);
  }

  static currentYear(): DateRange { ... }
  static lastDays(days: number): DateRange { ... }
}

// DateRange VO más simple
export class DateRange extends DddValueObject<DateRangeProps> {
  static create(startDate: Date, endDate: Date): DateRange { ... }
  // Sin factory methods complejos
}
```

**R9: Crear Value Object Services para operaciones complejas**

```typescript
// Para operaciones entre VOs
export class MoneyOperations {
  static add(a: Money, b: Money): Money {
    if (a.currency !== b.currency) {
      throw new Error('Cannot add different currencies');
    }
    return Money.create(a.amount + b.amount, a.currency);
  }

  static allocate(money: Money, ratios: number[]): Money[] {
    // Lógica compleja de asignación
  }
}

// Money VO más simple
export class Money extends DddValueObject<MoneyProps> {
  // Sin métodos add(), allocate() directamente
  // Solo propiedades y getters
}
```

---

### 2.3 Refactorings Clean Code

**R10: Simplificar métodos largos**

- [ ] Extraer submétodos de validators (target: < 10 líneas por método)
- [ ] Aplicar "Extract Method" refactoring
- [ ] Reducir nesting con guard clauses

**R11: Mejorar nombres**

- [ ] Renombrar métodos ambiguos
- [ ] Usar verbos para métodos de acción
- [ ] Usar sustantivos para getters

**R12: Eliminar código duplicado**

- [ ] Identificar validaciones duplicadas
- [ ] Crear helpers reutilizables
- [ ] Consolidar lógica común

**Entregable**: Pull Request con refactorings aplicados

---

## 🧪 Fase 3: Unit Testing (Días 3-4)

### 3.1 Configuración de Testing

**Herramientas**:

- Jest (ya configurado)
- @nestjs/testing
- Coverage reports (jest-coverage)

**Configurar jest.config.js**:

```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'libs/**/*.ts',
    '!libs/**/*.spec.ts',
    '!libs/**/index.ts',
    '!libs/**/*.d.ts',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/libs/'],
};
```

---

### 3.2 Estructura de Tests

**Organización**:

```
libs/ddd-valueobjects/src/
├── implementations/
│   ├── name/
│   │   ├── name.value-object.ts
│   │   ├── name.value-object.spec.ts       # Unit tests
│   │   ├── name.validator.ts
│   │   └── name.validator.spec.ts          # Unit tests
│   ├── age/
│   │   ├── age.value-object.spec.ts
│   │   └── age.validator.spec.ts
│   └── ...
├── core/
│   ├── value-object.base.spec.ts           # Legacy
│   └── result.spec.ts                      # Legacy
└── module/
    └── ddd-value-objects.module.spec.ts
```

---

### 3.3 Test Templates

#### Template 1: Value Object Tests

```typescript
// name.value-object.spec.ts
import { Name } from './name.value-object';

describe('Name Value Object', () => {
  describe('create', () => {
    it('should create a valid name with all components', () => {
      const name = Name.create('John', 'Doe', 'Michael');

      expect(name).toBeDefined();
      expect(name.isValid).toBe(true);
      expect(name.firstName).toBe('John');
      expect(name.lastName).toBe('Doe');
      expect(name.middleName).toBe('Michael');
    });

    it('should create a valid name without middle name', () => {
      const name = Name.create('John', 'Doe');

      expect(name.middleName).toBeUndefined();
      expect(name.getFullName()).toBe('John Doe');
    });

    it('should throw error for invalid first name', () => {
      expect(() => Name.create('A', 'Doe')).toThrow('Invalid Name');
    });

    it('should throw error for empty first name', () => {
      expect(() => Name.create('', 'Doe')).toThrow();
    });

    // ... más casos
  });

  describe('getFullName', () => {
    it('should return full name with middle name', () => {
      const name = Name.create('John', 'Doe', 'Michael');
      expect(name.getFullName()).toBe('John Michael Doe');
    });

    it('should return full name without middle name', () => {
      const name = Name.create('John', 'Doe');
      expect(name.getFullName()).toBe('John Doe');
    });
  });

  describe('getInitials', () => {
    it('should return initials with middle name', () => {
      const name = Name.create('John', 'Doe', 'Michael');
      expect(name.getInitials()).toBe('JMD');
    });

    it('should return initials without middle name', () => {
      const name = Name.create('John', 'Doe');
      expect(name.getInitials()).toBe('JD');
    });
  });

  describe('equals', () => {
    it('should be equal for same values', () => {
      const name1 = Name.create('John', 'Doe');
      const name2 = Name.create('John', 'Doe');

      expect(name1.equals(name2)).toBe(true);
    });

    it('should not be equal for different values', () => {
      const name1 = Name.create('John', 'Doe');
      const name2 = Name.create('Jane', 'Doe');

      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('load', () => {
    it('should load without validation', () => {
      // Simular datos de DB que podrían ser inválidos
      const name = Name.load('A', 'B');

      expect(name).toBeDefined();
      expect(name.firstName).toBe('A');
    });
  });
});
```

#### Template 2: Validator Tests

```typescript
// name.validator.spec.ts
import { Name } from './name.value-object';
import { NameValidator } from './name.validator';

describe('NameValidator', () => {
  let validator: NameValidator;

  describe('firstName validation', () => {
    it('should add broken rule for empty first name', () => {
      const name = Name.load('', 'Doe'); // load sin validación
      validator = new NameValidator(name);

      const brokenRules = validator.validate();

      expect(brokenRules.length).toBeGreaterThan(0);
      expect(brokenRules[0].property).toBe('firstName');
      expect(brokenRules[0].message).toContain('cannot be empty');
    });

    it('should add broken rule for short first name', () => {
      const name = Name.load('A', 'Doe');
      validator = new NameValidator(name);

      const brokenRules = validator.validate();

      expect(
        brokenRules.some(
          (br) => br.property === 'firstName' && br.message.includes('at least 2 characters'),
        ),
      ).toBe(true);
    });

    it('should add broken rule for long first name', () => {
      const longName = 'A'.repeat(51);
      const name = Name.load(longName, 'Doe');
      validator = new NameValidator(name);

      const brokenRules = validator.validate();

      expect(
        brokenRules.some(
          (br) => br.property === 'firstName' && br.message.includes('exceed 50 characters'),
        ),
      ).toBe(true);
    });

    it('should add broken rule for invalid characters', () => {
      const name = Name.load('John123', 'Doe');
      validator = new NameValidator(name);

      const brokenRules = validator.validate();

      expect(
        brokenRules.some(
          (br) => br.property === 'firstName' && br.message.includes('invalid characters'),
        ),
      ).toBe(true);
    });

    it('should accept valid first name', () => {
      const name = Name.load('John', 'Doe');
      validator = new NameValidator(name);

      const brokenRules = validator.validate();

      expect(brokenRules.filter((br) => br.property === 'firstName').length).toBe(0);
    });

    it('should accept first name with accents', () => {
      const name = Name.load('José', 'García');
      validator = new NameValidator(name);

      const brokenRules = validator.validate();

      expect(brokenRules.filter((br) => br.property === 'firstName').length).toBe(0);
    });
  });

  describe('lastName validation', () => {
    // Similar structure for lastName
  });

  describe('middleName validation', () => {
    it('should accept undefined middle name', () => {
      const name = Name.load('John', 'Doe');
      validator = new NameValidator(name);

      const brokenRules = validator.validate();

      expect(brokenRules.filter((br) => br.property === 'middleName').length).toBe(0);
    });

    // ... más tests
  });
});
```

---

### 3.4 Tests por Value Object

**Lista de tests a crear** (total estimado: ~90 archivos de test):

#### Text VOs

- [ ] `name.value-object.spec.ts` (15+ tests)
- [ ] `name.validator.spec.ts` (10+ tests)
- [ ] `description.value-object.spec.ts` (12+ tests)
- [ ] `description.validator.spec.ts` (8+ tests)
- [ ] `url.value-object.spec.ts` (15+ tests)
- [ ] `url.validator.spec.ts` (12+ tests)

#### Identification VOs

- [ ] `phone-number.value-object.spec.ts` (15+ tests)
- [ ] `phone-number.validator.spec.ts` (10+ tests)
- [ ] `document-id.value-object.spec.ts` (20+ tests)
- [ ] `document-id.validator.spec.ts` (15+ tests)

#### Numeric VOs

- [ ] `age.value-object.spec.ts` (12+ tests)
- [ ] `age.validator.spec.ts` (8+ tests)
- [ ] `money.value-object.spec.ts` (25+ tests)
- [ ] `money.validator.spec.ts` (10+ tests)
- [ ] `percentage.value-object.spec.ts` (20+ tests)
- [ ] `percentage.validator.spec.ts` (8+ tests)

#### Date VOs

- [ ] `date-range.value-object.spec.ts` (20+ tests)
- [ ] `date-range.validator.spec.ts` (10+ tests)
- [ ] `birth-date.value-object.spec.ts` (15+ tests)
- [ ] `birth-date.validator.spec.ts` (8+ tests)

#### Legacy

- [ ] `email.value-object.spec.ts` (8+ tests)
- [ ] `uuid.value-object.spec.ts` (6+ tests)
- [ ] `result.spec.ts` (10+ tests)

#### Module

- [ ] `ddd-value-objects.module.spec.ts` (5+ tests)

**Total estimado**: ~280+ tests individuales

---

### 3.5 Coverage Targets

```bash
# Comando para verificar coverage
npm run test:cov

# Targets esperados
Statements   : 100%
Branches     : 100%
Functions    : 100%
Lines        : 100%
```

**Estrategias para 100% coverage**:

1. Test de happy paths
2. Test de edge cases
3. Test de error handling
4. Test de boundary conditions
5. Test de métodos privados (indirectamente)

**Entregable**: Suite completa de tests con 100% coverage

---

## 🔒 Fase 4: Husky y Git Hooks (Día 4)

### 4.1 Instalación de Husky

```bash
npm install --save-dev husky lint-staged
npx husky install
npm pkg set scripts.prepare="husky install"
```

### 4.2 Configurar Git Hooks

**Pre-commit**: Lint y formato

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

**.lintstagedrc.json**:

```json
{
  "*.ts": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

**Pre-push**: Tests y build

```bash
npx husky add .husky/pre-push "npm run test:cov && npm run build"
```

### 4.3 Configurar Commit Lint

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

**commitlint.config.js**:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'perf',
        'ci',
        'build',
        'revert',
      ],
    ],
    'subject-case': [2, 'always', 'sentence-case'],
  },
};
```

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

### 4.4 Scripts adicionales

**package.json**:

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "format": "prettier --write \"**/*.{ts,json,md}\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "build": "nest build ddd-valueobjects",
    "build:prod": "nest build ddd-valueobjects --webpack",
    "validate": "npm run lint && npm run test:cov && npm run build"
  }
}
```

**Entregable**: Husky configurado y funcionando

---

## 🚀 Fase 5: GitHub Actions CI/CD (Día 5)

### 5.1 Workflow: CI (Continuous Integration)

**.github/workflows/ci.yml**:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    name: Test & Coverage
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Run tests with coverage
        run: npm run test:cov

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

      - name: Build library
        run: npm run build

      - name: Check bundle size
        run: |
          npm install -g bundlesize
          bundlesize

  lint-commit:
    name: Lint Commits
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'

      - name: Install dependencies
        run: npm ci

      - name: Validate commits
        run: npx commitlint --from ${{ github.event.pull_request.base.sha }} --to ${{ github.event.pull_request.head.sha }} --verbose

  code-quality:
    name: Code Quality
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

---

### 5.2 Workflow: Release

**.github/workflows/release.yml**:

````yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build-and-publish:
    name: Build & Publish to npm
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:cov

      - name: Build library
        run: npm run build

      - name: Extract version from tag
        id: extract_version
        run: echo "VERSION=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT

      - name: Update package version
        run: |
          cd dist/libs/ddd-valueobjects
          npm version ${{ steps.extract_version.outputs.VERSION }} --no-git-tag-version

      - name: Publish to npm
        run: |
          cd dist/libs/ddd-valueobjects
          npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ steps.extract_version.outputs.VERSION }}
          body: |
            ## Changes in this Release

            See [CHANGELOG.md](https://github.com/${{ github.repository }}/blob/main/CHANGELOG.md) for details.

            ## Installation

            ```bash
            npm install @nestjslatam/ddd-valueobjects@${{ steps.extract_version.outputs.VERSION }}
            ```
          draft: false
          prerelease: false
````

---

### 5.3 Workflow: Auto-merge Dependabot

**.github/workflows/dependabot-auto-merge.yml**:

```yaml
name: Dependabot Auto-merge

on:
  pull_request:
    branches: [main]

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'

    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v1
        with:
          github-token: '${{ secrets.GITHUB_TOKEN }}'

      - name: Enable auto-merge for Dependabot PRs
        if: steps.metadata.outputs.update-type == 'version-update:semver-patch'
        run: gh pr merge --auto --merge "$PR_URL"
        env:
          PR_URL: ${{github.event.pull_request.html_url}}
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

---

### 5.4 Configuración adicional

**sonar-project.properties**:

```properties
sonar.projectKey=nestjslatam_ddd-valueobjects
sonar.organization=nestjslatam

sonar.sources=libs/ddd-valueobjects/src
sonar.tests=libs/ddd-valueobjects/src
sonar.test.inclusions=**/*.spec.ts
sonar.exclusions=**/*.spec.ts,**/node_modules/**,**/dist/**

sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.javascript.lcov.reportPaths=coverage/lcov.info

sonar.coverage.exclusions=**/*.spec.ts,**/index.ts
```

**.bundlesizerc.json**:

```json
{
  "files": [
    {
      "path": "./dist/libs/ddd-valueobjects/**/*.js",
      "maxSize": "50 kB"
    }
  ]
}
```

**Entregable**: CI/CD completo funcionando

---

## 📦 Fase 6: Pipeline de Publicación (Día 6)

### 6.1 Preparación para Release

**CHANGELOG.md** template:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial implementation of DDD Value Objects

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [2.0.0] - 2026-01-30

### Added

- 9 new value objects with validators and broken rules
- Name, Description, Url value objects
- PhoneNumber, DocumentId value objects
- Age, Money, Percentage value objects
- DateRange, BirthDate value objects
- Complete validation system with @nestjslatam/ddd-lib
- Comprehensive documentation
- 100% test coverage
- CI/CD pipeline with GitHub Actions
- Automated npm publishing

### Changed

- Architecture based on @nestjslatam/ddd-lib
- Improved separation of concerns
- Applied SOLID principles
- Enhanced code quality

[Unreleased]: https://github.com/nestjslatam/ddd-valueobjects/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/nestjslatam/ddd-valueobjects/releases/tag/v2.0.0
```

---

### 6.2 Scripts de Release

**scripts/prepare-release.sh**:

```bash
#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Preparing release...${NC}"

# 1. Verificar que estamos en main
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
  echo -e "${RED}❌ Must be on main branch to release${NC}"
  exit 1
fi

# 2. Verificar que no hay cambios sin commitear
if [[ -n $(git status -s) ]]; then
  echo -e "${RED}❌ Working directory is not clean${NC}"
  exit 1
fi

# 3. Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
git pull origin main

# 4. Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
npm run test:cov

# 5. Build
echo -e "${YELLOW}🔨 Building...${NC}"
npm run build

# 6. Ask for version bump
echo -e "${YELLOW}📝 Current version: $(node -p "require('./package.json').version")${NC}"
echo -e "${YELLOW}Select version bump:${NC}"
echo "1) patch (bug fixes)"
echo "2) minor (new features)"
echo "3) major (breaking changes)"
read -p "Enter choice [1-3]: " choice

case $choice in
  1) BUMP="patch";;
  2) BUMP="minor";;
  3) BUMP="major";;
  *) echo -e "${RED}Invalid choice${NC}"; exit 1;;
esac

# 7. Bump version
echo -e "${YELLOW}⬆️  Bumping version ($BUMP)...${NC}"
npm version $BUMP -m "chore: release v%s"

NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}✅ New version: $NEW_VERSION${NC}"

# 8. Update CHANGELOG
echo -e "${YELLOW}📝 Update CHANGELOG.md manually and press enter${NC}"
read

# 9. Push changes and tags
echo -e "${YELLOW}🚢 Pushing changes and tags...${NC}"
git push origin main
git push origin --tags

echo -e "${GREEN}✅ Release v$NEW_VERSION prepared!${NC}"
echo -e "${GREEN}GitHub Actions will now build and publish to npm${NC}"
```

**Hacer ejecutable**:

```bash
chmod +x scripts/prepare-release.sh
```

---

### 6.3 Verificación Pre-publicación

**Checklist** antes de cada release:

- [ ] Todos los tests pasan (100% coverage)
- [ ] Build exitoso
- [ ] CHANGELOG.md actualizado
- [ ] README.md actualizado si es necesario
- [ ] Documentación actualizada
- [ ] Versión bumped correctamente
- [ ] Git tags creados
- [ ] CI passing en main branch

---

### 6.4 Post-publicación

**Verificar**:

1. Package publicado en npm: https://www.npmjs.com/package/@nestjslatam/ddd-valueobjects
2. Release creado en GitHub
3. Documentation actualizada
4. Badges actualizados en README

**Notificar**:

- Twitter/X
- LinkedIn
- Slack/Discord de la comunidad
- Blog post (opcional)

**Entregable**: Sistema completo de release automatizado

---

## 📊 Fase 7: Documentación y Badges (Día 7)

### 7.1 Badges para README

```markdown
# @nestjslatam/ddd-valueobjects

[![npm version](https://badge.fury.io/js/%40nestjslatam%2Fddd-valueobjects.svg)](https://www.npmjs.com/package/@nestjslatam/ddd-valueobjects)
[![CI](https://github.com/nestjslatam/ddd-valueobjects/workflows/CI/badge.svg)](https://github.com/nestjslatam/ddd-valueobjects/actions)
[![codecov](https://codecov.io/gh/nestjslatam/ddd-valueobjects/branch/main/graph/badge.svg)](https://codecov.io/gh/nestjslatam/ddd-valueobjects)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red.svg)](https://nestjs.com/)
[![Downloads](https://img.shields.io/npm/dm/@nestjslatam/ddd-valueobjects.svg)](https://www.npmjs.com/package/@nestjslatam/ddd-valueobjects)
[![Known Vulnerabilities](https://snyk.io/test/github/nestjslatam/ddd-valueobjects/badge.svg)](https://snyk.io/test/github/nestjslatam/ddd-valueobjects)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
```

---

### 7.2 Documentación completa

**Actualizar README.md** con:

- [ ] Badges
- [ ] Quick start mejorado
- [ ] Links a documentación
- [ ] Ejemplos actualizados
- [ ] Contribution guidelines
- [ ] Code of conduct

**CONTRIBUTING.md**:

```markdown
# Contributing to @nestjslatam/ddd-valueobjects

We love your input! We want to make contributing as easy and transparent as possible.

## Development Process

1. Fork the repo and create your branch from `main`
2. Install dependencies: `npm install`
3. Make your changes
4. Add tests for your changes
5. Ensure tests pass: `npm test`
6. Ensure coverage is 100%: `npm run test:cov`
7. Update documentation if needed
8. Follow commit conventions
9. Push to your fork and submit a pull request

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):
```

<type>(<scope>): <subject>

<body>

<footer>
```

Types:

- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

## Pull Request Process

1. Update README.md with details of changes if needed
2. Update CHANGELOG.md following Keep a Changelog format
3. The PR will be merged once you have approval from maintainers

## Code Quality Standards

- 100% test coverage required
- Follow SOLID principles
- Apply Clean Code practices
- ESLint must pass
- Prettier formatting required

## Any Questions?

Feel free to open an issue for discussion.

````

**CODE_OF_CONDUCT.md**:
```markdown
# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our
community a harassment-free experience for everyone...

[Standard Contributor Covenant text]
````

---

## 📋 Checklist Final

### Código

- [ ] SOLID principles aplicados
- [ ] SoC implementado correctamente
- [ ] Clean Code en toda la base
- [ ] No code smells
- [ ] No duplicación

### Testing

- [ ] 280+ tests implementados
- [ ] 100% coverage alcanzado
- [ ] Todos los tests pasan
- [ ] Tests mantibles y legibles

### CI/CD

- [ ] Husky configurado
- [ ] GitHub Actions CI funcionando
- [ ] GitHub Actions Release funcionando
- [ ] Dependabot configurado
- [ ] SonarCloud integrado

### Documentación

- [ ] README actualizado
- [ ] CHANGELOG.md creado
- [ ] CONTRIBUTING.md creado
- [ ] CODE_OF_CONDUCT.md creado
- [ ] Badges agregados
- [ ] Ejemplos actualizados

### Release

- [ ] Scripts de release creados
- [ ] Workflow de npm publish funcionando
- [ ] Versioning automático
- [ ] GitHub releases automáticos

---

## 📈 Métricas de Éxito

### Code Quality

- Cyclomatic Complexity: < 10 ✅
- Code Coverage: 100% ✅
- Technical Debt: < 1% ✅
- Code Duplication: < 3% ✅

### CI/CD

- Build Time: < 5 min ✅
- Test Execution: < 2 min ✅
- Deployment Time: < 3 min ✅
- Success Rate: > 95% ✅

### Package

- Bundle Size: < 50 KB ✅
- Tree-shakeable: Yes ✅
- TypeScript Support: Full ✅
- Documentation: Complete ✅

---

## 🎯 Próximos Pasos

Una vez completado este plan:

1. **Monitor**: Configurar alertas y monitoring
2. **Iterate**: Mejorar basado en feedback
3. **Expand**: Agregar más value objects
4. **Community**: Fomentar contribuciones
5. **Maintenance**: Actualizaciones regulares

---

## 📞 Contacto y Soporte

- Issues: https://github.com/nestjslatam/ddd-valueobjects/issues
- Discussions: https://github.com/nestjslatam/ddd-valueobjects/discussions
- Twitter: @nestjslatam
- Email: contact@nestjslatam.com

---

**Estado**: ⏳ Plan aprobado, listo para iniciar implementación

**Última actualización**: 2026-01-29
