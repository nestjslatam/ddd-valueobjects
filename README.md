<div align="center">

# `@nestjslatam/ddd-valueobjects`

**Twelve ready-made value objects for [`@nestjslatam/ddd-lib`](https://github.com/nestjslatam/ddd)** — email, money, phone, document IDs, dates and more, each with its rules, formatters and equality already written.

[![npm](https://img.shields.io/npm/v/%40nestjslatam%2Fddd-valueobjects?color=1e73be&label=ddd-valueobjects)](https://www.npmjs.com/package/@nestjslatam/ddd-valueobjects)
[![CI](https://github.com/nestjslatam/ddd-valueobjects/actions/workflows/ci.yml/badge.svg)](https://github.com/nestjslatam/ddd-valueobjects/actions/workflows/ci.yml)
[![tests](https://img.shields.io/badge/tests-681%20passing-00d084)](#tests)
[![license](https://img.shields.io/badge/license-MIT-575760)](LICENSE)

[Quick start](#quick-start) · [What is in the box](#what-is-in-the-box) · [FAQ](#faq) · [Contributing](#contributing)

</div>

---

```bash
npm install @nestjslatam/ddd-valueobjects @nestjslatam/ddd-lib
```

## Quick start

```ts
import { Money, MoneyFormatter, Email, BirthDate, DocumentId } from '@nestjslatam/ddd-valueobjects';

// Most value objects throw on invalid input.
const price = Money.create(1999, 'USD');
new MoneyFormatter().format(price); // '$1,999.00'

Money.create(10, 'XYZ');
// Invalid Money: Property: currency, Message: Currency code 'XYZ' is not
// a commonly recognized ISO 4217 code

// Email and UUID are the two that return a Result instead of throwing.
const email = Email.create('ada@example.com');
email.isSuccess; // true
email.getValue().getValue(); // 'ada@example.com'

Email.create('not-an-email').getError(); // 'Email format is invalid'

// Anything that depends on "now" takes an optional reference date.
BirthDate.create(new Date('1990-06-15')).getAge(new Date('2026-08-28')); // 36

DocumentId.create('12345678', 'DNI', 'PE').getValue();
// { value: '12345678', type: 'DNI', country: 'PE' }
```

That reference-date parameter is the detail worth stealing even if you write your own: `getAge`, `isMinor`, `isAdult`, `getNextBirthday`, `getDaysUntilBirthday` and `isBirthdayToday` all accept one, so their behaviour is testable without freezing the clock.

## What is in the box

|                        |                                                                    |
| ---------------------- | ------------------------------------------------------------------ |
| **Identity & contact** | `Email`, `PhoneNumber`, `Url`, `UUID`, `Name`                      |
| **Money & numbers**    | `Money`, `Percentage`                                              |
| **Time**               | `BirthDate`, `DateRange`, `Age`                                    |
| **Documents**          | `DocumentId` — DNI, passport, driver's licence, SSN, tax ID, other |
| **Text**               | `Description`                                                      |

Plus formatters (`MoneyFormatter` alone has `format`, `formatWithoutSymbol`, `formatWithCode`, `formatAccounting`, `formatCompact` and `formatAsWords`), and services — `ZodiacCalculatorService` scores compatibility between two signs, `BirthdayCalendarService` finds upcoming birthdays and milestones.

### Document validation is pluggable

`DocumentId` dispatches to a strategy per document type, and the registry is open:

```ts
class PeruvianDni implements IDocumentValidatorStrategy {
  readonly type = 'DNI';

  clean(value: string): string {
    return value.replace(/\D/g, '');
  }

  validate(value: string) {
    const errors = /^\d{8}$/.test(value)
      ? []
      : [{ field: 'value', message: 'A Peruvian DNI is 8 digits' }];
    return { isValid: errors.length === 0, errors };
  }
}

DocumentValidatorRegistry.registerStrategy(new PeruvianDni());
DocumentValidatorRegistry.getRegisteredTypes();
// ['DNI', 'PASSPORT', 'SSN', 'TAX_ID', 'DRIVER_LICENSE', 'OTHER']
```

The strategy carries its own `type`, so registering it replaces the built-in rules for that document type. Six strategies ship. Writing one for a country whose format you actually live with is the easiest useful contribution here.

## Requirements

Node `>=20.11`, and **`@nestjslatam/ddd-lib` as a peer** — you install it yourself:

```
@nestjslatam/ddd-lib  ^2.0.0 || ^3.0.0
@nestjs/common        ^10.0.0 || ^11.0.0
@nestjs/core          ^10.0.0 || ^11.0.0
reflect-metadata      ^0.1.13 || ^0.2.0
rxjs                  ^7.2.0
```

> [!IMPORTANT]
> **`1.1.0` and earlier declared `ddd-lib` as a regular dependency**, so installing them beside `ddd-lib@3.0.0` gave you _two copies_:
>
> ```
> @nestjslatam/ddd-lib                                3.0.0   isValid -> getter
> @nestjslatam/ddd-valueobjects/node_modules/ddd-lib  2.1.2   isValid -> method
> ```
>
> Two class identities, two shapes, and `instanceof` failing across them. It is a peer dependency from `1.2.0` on, which resolves to your single copy. Upgrade if you are on `1.1.0` or earlier and using `ddd-lib` 3.x.

## Tests

```bash
npm install
npm test        # 32 suites, 681 tests, ~15s
```

They pass on a clean checkout, and the release pipeline goes further: it packs the tarball, installs it into an empty scratch project with **nothing hand-installed**, and `require()`s it under `node --no-experimental-require-module`. That flag matters — modern Node loads ESM through `require()` transparently, which hides ESM-only dependencies that break real CommonJS consumers. A sibling package shipped exactly that bug and nobody noticed until it was published.

## FAQ

<details>
<summary><b>Four <code>@nestjslatam</code> packages — which do I need?</b></summary>

[`ddd-lib`](https://github.com/nestjslatam/ddd) is required; it is the library everything else builds on. **This package is optional** — it saves you writing `Email`, `Money` and friends by hand. [`ddd-cli`](https://github.com/nestjslatam/ddd-cli) is a dev tool. [`ddd-es-lib`](https://github.com/nestjslatam/ddd-event-sourcing) is for event sourcing on MongoDB.
</details>

<details>
<summary><b>Does it work with the current <code>ddd-lib</code>?</b></summary>

Yes, from `1.2.0`. The peer range is `^2.0.0 || ^3.0.0`, and the full 681-test suite was re-run against `ddd-lib@3.0.0` before that range was widened. On `1.1.0` or earlier, see the warning in [Requirements](#requirements) — you will silently get two copies of the library.
</details>

<details>
<summary><b>Why does <code>Email.create()</code> return something different from <code>Money.create()</code>?</b></summary>

History, not design. `Email` and `UUID` are the two that return a `Result`; everything else throws on invalid input. Unifying them is a breaking change nobody has taken yet — it is [on the list](#contributing).
</details>

<details>
<summary><b><code>Money.create()</code> rejects my currency code. Bug?</b></summary>

Probably not — it validates against commonly recognised ISO 4217 codes and rejects anything else with a message naming the code. If a legitimate code is missing, that is a one-line fix and a welcome PR.
</details>

<details>
<summary><b>I could write an <code>Email</code> class myself. What does this buy me?</b></summary>

For `Email`, mostly the tests. The ones that earn their keep are the ones with real surface area: `Money` with six formatters and ISO 4217 validation, `DocumentId` with six pluggable country strategies, `BirthDate` and `DateRange` with the reference-date discipline, and `PhoneNumber`. Wiring cost is one import — they are ordinary `ddd-lib` value objects.
</details>

<details>
<summary><b>Is it production-ready?</b></summary>

It is more thoroughly tested than its siblings — 681 tests — but it sits on `ddd-lib`, whose API is explicitly unstable. Pin exact versions of both.
</details>

<details>
<summary><b>Which NestJS and Node versions?</b></summary>

NestJS 10 or 11 declared, Node `>=20.11`. Only NestJS 11 is exercised in CI.
</details>

## Contributing

Concrete, and each verifiable in minutes:

1. **A document strategy for a country you know.** `DocumentValidatorRegistry.registerStrategy()` is the extension point and six strategies already show the shape. Rules written by someone who actually lives with the format beat rules written from a spec.
2. **Fix `Result`'s own error message.** `getValue()` on a failed result says _"Use errorValue instead"_, but the method is `getError()`. One line, in `libs/ddd-valueobjects/src/core/result.ts`.
3. **Unify `create()`.** `Email` and `UUID` return a `Result` while the other ten throw. Pick one — it is breaking, so it needs a major and a migration note.
4. **Document `Description` and `Url`.** Both have the richest option-driven APIs here and neither appears in this README.

Before opening a PR:

```bash
npm run lint && npm test
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/).

## Building and publishing

`npm run build` uses `nest build`, which bundles with webpack and **emits no declarations** — not publishable. `npm run build:lib` compiles with `tsc` and derives the published manifest, and the package is published from `dist/libs/ddd-valueobjects` so subpath imports resolve without an `exports` map.

## Who is behind this

Built and maintained by **[BeyondNet Tech](https://beyondnet.info/)** with the [NestJS Latam](https://nestjslatam.dev/) community.

- **[Evolith](https://github.com/beyondnetcode/evolith_arch32)** — executable architecture governance: a CLI, MCP server and REST API that check a repository against Rego/OPA rules, reporting a rule they could not evaluate as a failure rather than a silent pass.
- **[Shell.ddd](https://github.com/beyondnetcode/Shell.ddd)** — the .NET counterpart of `ddd-lib`.

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

**Powered by [BeyondNetCode](https://beyondnet.info/)**

[Website](https://beyondnet.info/) · [GitHub](https://github.com/beyondnetcode) · [NestJS Latam](https://nestjslatam.dev/)

</div>
