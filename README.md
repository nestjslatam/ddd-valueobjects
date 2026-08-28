# @nestjslatam/ddd-valueobjects

Ready-made value objects for `@nestjslatam/ddd-lib` — money, age, names, government document ids, date ranges — each with its own validator and broken rules.

[![npm](https://img.shields.io/npm/v/%40nestjslatam%2Fddd-valueobjects.svg)](https://www.npmjs.com/package/@nestjslatam/ddd-valueobjects) [![CI](https://github.com/nestjslatam/ddd-valueobjects/actions/workflows/ci.yml/badge.svg)](https://github.com/nestjslatam/ddd-valueobjects/actions/workflows/ci.yml)

> [!WARNING]
> `1.1.0` is the only version currently on npm. A `1.0.1` was published in January and later unpublished, so the registry's release history has a gap. The API has not been through a deprecation cycle, and two families of value objects with incompatible construction APIs currently coexist in the same entry point (see [Known limitations](#known-limitations)). Pin an exact version.

```bash
npm install @nestjslatam/ddd-valueobjects
```

```typescript
import { Money, Percentage } from '@nestjslatam/ddd-valueobjects';

const price = Money.create(19.99, 'USD'); // amount rounded to 2 decimals, currency uppercased
const vat = Percentage.create(21);
price.multiply(1 + vat.toRatio()).toString(); // '24.19 USD'

Money.create(10, 'US');
// Error: Invalid Money: Property: currency, Message: Currency code must be exactly 3 characters (ISO 4217)
```

`create()` builds the object, runs its validator, and throws with every broken rule it found. That holds for the ten value objects built on `DddValueObject`; `Email` and `UUID` are the exceptions and return a `Result` instead.

## The ecosystem

| Package | What it is |
|---|---|
| [`@nestjslatam/ddd-lib`](https://www.npmjs.com/package/@nestjslatam/ddd-lib) | DDD building blocks: aggregates, value objects, validators, broken rules, state tracking |
| [`@nestjslatam/ddd-cli`](https://www.npmjs.com/package/@nestjslatam/ddd-cli) | Inventory the stereotypes, scaffold them, subclass them, audit your code. Runs as an MCP server so an AI agent can drive it |
| **`@nestjslatam/ddd-valueobjects`** | Ready-made value objects: email, phone number, money, date range, document id — you are here |
| [`@nestjslatam/ddd-es-lib`](https://www.npmjs.com/package/@nestjslatam/ddd-es-lib) | Event sourcing: event store, snapshots, upcasting, sagas, materialised views |

## Requirements

- `engines` declares Node `>=20.11` while CI runs the suite on 18.x and 20.x, so the two disagree. Neither is enforced: npm only warns on an engine mismatch unless `engine-strict` is set, so a Node 18 install succeeds with an `EBADENGINE` warning.
- Peer dependencies you must already have: `@nestjs/common` and `@nestjs/core` (`^10.0.0 || ^11.0.0`), `reflect-metadata` (`^0.1.13 || ^0.2.0`), `rxjs` (`^7.2.0`).
- `@nestjslatam/ddd-lib` (`^2.0.0`) is a regular dependency and is installed for you.
- The tarball is CommonJS with `.d.ts` declarations alongside it — 65 of each, no source, no source maps.

## Creating a value and reading its broken rules

```typescript
import { Name, Money } from '@nestjslatam/ddd-valueobjects';

const name = Name.create('Ada', 'Lovelace');
name.getFullName(); // 'Ada Lovelace'
name.getInitials(); // 'AL'
name.equals(Name.create('Ada', 'Lovelace')); // true — compared by value, not identity

// load() is the rehydration path and does not validate at all
const stored = Money.load(-5, 'XXX');
stored.addValidators();
stored.isValid; // false
stored.brokenRules.getBrokenRulesAsString();
// "Property: currency, Message: Currency code 'XXX' is not a commonly recognized ISO 4217 code"
```

Every `DddValueObject`-based type exposes the same pair. `create()` validates and throws; `load()` trusts its input, so reading a row that was written under an older rule set never blows up in your repository. Validation is not lost, it is deferred: call `addValidators()` and read `isValid` and `brokenRules` when you want the verdict. This also means `load()` is the one door that hands you an object which fails its own invariants — deliberately.

Equality comes from `getEqualityComponents()`, which every `DddValueObject`-based type defines over its own fields. `PhoneNumber` compares on digits, punctuation stripped — but the country code is part of those digits:

```typescript
PhoneNumber.create('(555) 123-4567').equals(PhoneNumber.create('5551234567')); // true
PhoneNumber.create('+1 555 123 4567').equals(PhoneNumber.create('5551234567')); // false
```

`Email` and `UUID` do not define `getEqualityComponents()` at all; they inherit a `JSON.stringify(props)` comparison from the legacy base.

## Validating government document ids

```typescript
import { DocumentId, DocumentIdFormatter } from '@nestjslatam/ddd-valueobjects';

const ssn = DocumentId.createSSN('536-24-1234');
ssn.getClean(); // '536241234'
new DocumentIdFormatter().formatMasked(ssn); // '***-**-1234'

DocumentId.createSSN('123-45-6789');
// Error: Invalid DocumentId: Property: value, Message: Invalid SSN pattern
```

`DocumentId` covers six types — `DNI`, `PASSPORT`, `SSN`, `TAX_ID`, `DRIVER_LICENSE`, `OTHER` — and dispatches to one strategy per type through `DocumentValidatorRegistry`, so there is no switch statement to edit when a rule changes. The SSN strategy is the strictest of the six: it rejects four known placeholder numbers, area numbers `000`, `666` and `900`–`999`, a `00` group and a `0000` serial. `DocumentValidatorRegistry.registerStrategy()` replaces the strategy for a type you already have.

## Working with dates and ages

```typescript
import { DateRange, BirthDate, Age } from '@nestjslatam/ddd-valueobjects';

const quarter = DateRange.create(new Date('2026-01-01'), new Date('2026-03-31'));
quarter.getDurationDays(); // 89
quarter.contains(new Date('2026-02-01')); // true
quarter.overlaps(DateRange.fromStrings('2026-03-01', '2026-04-30')); // true

const born = BirthDate.fromComponents(1990, 5, 12); // month is 1-based
born.getAge(); // whole years, against today unless you pass a reference date
born.getDaysUntilBirthday();

Age.create(34).getCategory(); // 'adult'
```

`DateRange` answers the questions a booking or billing period actually gets asked — duration, containment, overlap, `intersect()`, `extendByDays()` — rather than leaving you to subtract timestamps. `BirthDate` and `Age` are separate on purpose: a birth date is a stable fact you store, an age is derived and goes stale, so every `BirthDate` method that depends on "now" — and `Age.fromBirthDate()` — takes an optional reference date for a deterministic answer.

## Formatting and splitting money in NestJS

```typescript
import { Module } from '@nestjs/common';
import { DddValueObjectsModule } from '@nestjslatam/ddd-valueobjects';

@Module({ imports: [DddValueObjectsModule.forRoot()] })
export class AppModule {}
```

```typescript
import { Injectable } from '@nestjs/common';
import { Money, MoneyFormatter, MoneyAllocatorService } from '@nestjslatam/ddd-valueobjects';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly formatter: MoneyFormatter,
    private readonly allocator: MoneyAllocatorService,
  ) {}

  splitEqually(total: Money, ways: number): string[] {
    return this.allocator
      .allocateEqually(total, ways)
      .map((part) => this.formatter.format(part, 'en-US'));
  }
}

// splitEqually(Money.create(100, 'USD'), 3)
// ['$33.34', '$33.33', '$33.33']
// splitEqually(Money.create(100, 'USD'), 6)
// ['$16.70', '$16.66', '$16.66', '$16.66', '$16.66', '$16.66']
```

`forRoot()` registers a global module, so one import in the root module makes the four formatters (`MoneyFormatter`, `PhoneNumberFormatter`, `DateRangeFormatter`, `DocumentIdFormatter`) and the three services (`MoneyAllocatorService`, `ZodiacCalculatorService`, `BirthdayCalendarService`) injectable everywhere. The value objects themselves need no module — they are plain classes you import and call.

Allocation exists because dividing money loses cents. Note the six-way split above: the whole remainder is added to the first part, not spread a cent at a time. With three parts that is invisible (`33.34`, `33.33`, `33.33`); with six it is not.

Formatting is kept out of the value objects deliberately. `Money.toString()` gives you `'19.99 USD'` and nothing more; locale, currency symbols, accounting parentheses and compact notation all live in `MoneyFormatter`, so the domain layer never depends on `Intl`.

## Known limitations

- **Two families of value objects share one entry point.** `Email` and `UUID` extend a local `ValueObject` base and return `Result<T>`; the other ten extend `DddValueObject` from `ddd-lib` and throw. `Email.create('a@b.c')` gives you a `Result` you must unwrap with `isFailure` / `getValue()` / `getError()`, while `Money.create(...)` gives you the object directly. Neither has a `load()`. The source marks the `Result` pair as legacy; treat them as the exception, not the pattern to copy.
- **The allocator is not the largest-remainder method its own comment claims.** `MoneyAllocatorService.allocate()` floors every share and then adds the entire remainder to `results[0]`.
- **`validateAllocation()` tolerates a cent of drift.** It returns true when the parts are within `0.01` of the original, so it catches gross errors, not exact-sum guarantees. Floating-point sums land at `99.99999999999999` for a six-way split of `100.00`.
- **`Money` rejects currencies it does not recognise.** The validator carries an allow-list of 26 ISO 4217 codes, and anything outside it is a broken rule, not a warning — `Money.create(10, 'PLN')` throws. Extend `MoneyValidator` or use `Money.load()` if you need a code that is missing.
- **A seventh document type cannot be registered.** `IDocumentValidatorStrategy.type` is the closed `DocumentIdType` union, so passing a strategy for a new type to `DocumentValidatorRegistry.registerStrategy()` is a compile error. You can only override one of the six built-in types.
- **`Email` validation is a shape check**, not deliverability: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, then lowercased, capped at 255 characters. The value object also calls `.trim()`, but that is dead code -- the pattern's `[^\s@]+` anchors reject surrounding whitespace first, so `Email.create(' a@b.co ')` throws rather than trimming. `Email.create('AdA@Example.COM')` does normalise to `ada@example.com`.
- **`MoneyFormatter.formatAsWords()` is English-only** and names only USD, EUR, GBP, JPY, CAD and AUD; any other code falls back to the lowercased code itself (`'five pln'`).

## Documentation

Part of the reference material in this repository is written in Spanish.

- [`libs/ddd-valueobjects/VALUE-OBJECTS.md`](libs/ddd-valueobjects/VALUE-OBJECTS.md) — every value object, its options, its factory methods and the broken rules it can raise. Spanish.
- [`libs/ddd-valueobjects/TESTING-EXAMPLES.md`](libs/ddd-valueobjects/TESTING-EXAMPLES.md) — a snippet per value object. English.
- [`libs/ddd-valueobjects/STRUCTURE.md`](libs/ddd-valueobjects/STRUCTURE.md) — how the source tree is organised and where to add a new value object. Spanish.
- [`EXAMPLES.md`](EXAMPLES.md) — value objects used across entities, services and controllers. English.
- [`QUICKSTART.md`](QUICKSTART.md) and [`apps/example-app/README.md`](apps/example-app/README.md) — running the bundled example app and calling its endpoints.
- [`CHANGELOG.md`](CHANGELOG.md) — what changed in each release.

## Development

```bash
npm install
npm test           # jest over libs/ and apps/ — 32 suites, 681 tests
npm run lint       # eslint
npm run build:lib  # tsc + copy.sh -> dist/libs/ddd-valueobjects; this is what gets published
npm run start:dev  # runs apps/example-app on http://localhost:3000, Swagger on /api
```

`npm run build` is not the publishable build. It runs `nest build ddd-valueobjects`, which bundles through webpack into a single `index.js` and emits no `.d.ts`; `npm run build:lib` compiles with `tsc`, emits declarations, and derives the published manifest in `copy.sh`. Publishing is driven by pushing a `v*` tag, which runs the CD workflow — it verifies the tag matches the manifest version and installs the packed tarball into an empty project before publishing.

Commits go through `commitlint` with the conventional-commits ruleset (a Husky `commit-msg` hook), and `lint-staged` runs ESLint and Prettier over staged `.ts` files. CI runs lint, tests and build on Node 18.x and 20.x for pushes and pull requests targeting `main`; open an [issue](https://github.com/nestjslatam/ddd-valueobjects/issues) first if the change alters a public signature.

## License

MIT — see [LICENSE](LICENSE). The root `package.json` agrees, and `copy.sh` ships both into the tarball.
