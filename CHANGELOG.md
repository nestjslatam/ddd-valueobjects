# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
