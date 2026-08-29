# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.2.0 (2026-08-28)

### `@nestjslatam/ddd-lib` is a peer dependency now

It was a regular `dependency` pinned to `^2.0.0`, which meant installing this package beside `@nestjslatam/ddd-lib@3.0.0` gave you **two copies of the library**:

```
@nestjslatam/ddd-lib                                3.0.0   isValid -> getter
@nestjslatam/ddd-valueobjects/node_modules/ddd-lib  2.1.2   isValid -> method
```

Two class identities with two different shapes for the same member, and `instanceof` failing across them. A value object from this package was not the same `DddValueObject` your aggregate expected.

A library that extends another library's base classes must share the consumer's copy, so it is `peerDependencies` at `^2.0.0 || ^3.0.0`. **Verified rather than assumed**: the full suite — 32 suites, 681 tests — was re-run against `ddd-lib@3.0.0`, and the built tarball was installed into an empty project beside `ddd-lib@3.0.0`, which now resolves to a single copy and exports all 58 symbols.

Minor rather than patch: npm 7+ installs peers automatically, so most consumers see no change, but anyone pinned to `ddd-lib` 1.x now gets an honest peer conflict instead of a silent nested install.

## 1.1.0 (2026-08-28)

First release published to npm as `@nestjslatam/ddd-valueobjects@1.1.0`.

### 🐛 Bug Fixes

- **build:** make the package installable. It was not publishable as it stood — three defects would have shipped on the first release:
  - `main` pointed at `dist/index.js`, but `nest build` emits `dist/libs/ddd-valueobjects/index.js`, so `require()` would have failed with `MODULE_NOT_FOUND`
  - `types` pointed at `dist/index.d.ts`, and **no declarations were emitted at all** — `nest build` bundles with webpack, which does not produce `.d.ts`
  - no `files` field and no `.npmignore`, so the tarball was 150 files and 742 kB of `apps/`, raw `.ts` sources, tsconfigs and planning documents

  The build now compiles with `tsc -p libs/ddd-valueobjects/tsconfig.lib.json`, derives the published manifest in `copy.sh`, and publishes from `dist/libs/ddd-valueobjects` so subpath imports resolve. Result: 133 files, 32 kB, 65 declaration files.

- **validators:** remove invalid regex escapes in `phone-number.validator.ts`.
- **test:** adapt to supertest 7, which no longer exposes a callable namespace.
- **ci:** pin `@commitlint` to 20.x — 21 requires Node >=22.12, against the declared engines and CI matrix. Replace the unmaintained `standard-version` with `commit-and-tag-version`, its maintained drop-in fork, which also restores a reproducible `npm ci`.

### ⬆️ Dependencies

- Refresh the NestJS 11 line to 11.2.3. Peer ranges widened to `^10.0.0 || ^11.0.0`.
- Toolchain: TypeScript 5.7 → 5.9, ESLint 9 → 10, Jest 29 → 30, supertest 6 → 7, `@types/node` 22 → 24.
- TypeScript stays on 5.x: `ts-jest` declares `typescript >=4.3 <7`.

## [1.0.0](https://github.com/nestjslatam/ddd-valueobjects-lib/compare/v1.0.1...v1.0.0) (2026-01-29)

### 1.0.1 (2026-01-29)

### Bug Fixes

- **config:** resolve husky and eslint path issues ([232a7ef](https://github.com/nestjslatam/ddd-valueobjects/commit/232a7ef2e3c9a08de454cc0b3336f50b8c43b394))
- resolve test failures in value objects ([4cdf1b0](https://github.com/nestjslatam/ddd-valueobjects/commit/4cdf1b05c7c4c92023721fec0d30918ac4cb30c8))
- **value-objects:** force revalidation in create() for Description and Url ([ffe47ae](https://github.com/nestjslatam/ddd-valueobjects/commit/ffe47aea2f7319297fdac072053cfd02e3cde538))

## [1.0.0] - 2026-01-29

### Added

- Initial release as NestJS library using `nest g library ddd-valueobjects`
- Published under `@nestjslatam` organization
- Base ValueObject abstract class with equality and immutability
- Result pattern for functional error handling
- Email value object with validation
- UUID value object with validation and generation
- DddValueObjectsModule for NestJS integration
- Full TypeScript support with strict typing
- Comprehensive test suite
- ESLint and Prettier configuration
- Complete documentation following NestJS library standards

### Project Structure

- Generated with NestJS CLI following official library guidelines
- Organized in `libs/ddd-valueobjects` structure
- Proper TypeScript path mappings
- Modular exports through index.ts
