# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.0.1 (2026-01-29)


### Bug Fixes

* **config:** resolve husky and eslint path issues ([232a7ef](https://github.com/nestjslatam/ddd-valueobjects/commit/232a7ef2e3c9a08de454cc0b3336f50b8c43b394))
* resolve test failures in value objects ([4cdf1b0](https://github.com/nestjslatam/ddd-valueobjects/commit/4cdf1b05c7c4c92023721fec0d30918ac4cb30c8))
* **value-objects:** force revalidation in create() for Description and Url ([ffe47ae](https://github.com/nestjslatam/ddd-valueobjects/commit/ffe47aea2f7319297fdac072053cfd02e3cde538))

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
