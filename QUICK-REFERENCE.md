# ⚡ Quick Reference - Comandos y Checklist

Comandos rápidos para implementar cada fase del plan

---

## 🚀 Setup Inicial

```bash
# 1. Crear branch de trabajo
git checkout -b feature/quality-improvements

# 2. Asegurar dependencias actualizadas
npm install

# 3. Verificar que compila
npm run build

# 4. Limpiar coverage anterior (si existe)
rm -rf coverage/
```

---

## 📊 Fase 1: Auditoría

### Comandos de Análisis

```bash
# Análisis de complejidad
npx complexity-report src/ --format json > complexity.json

# Análisis de duplicación
npx jscpd libs/ddd-valueobjects/src

# Contar líneas de código
npx cloc libs/ddd-valueobjects/src --exclude-dir=node_modules

# Listar todos los VOs
find libs/ddd-valueobjects/src/implementations -name "*.value-object.ts"

# Listar todos los validators
find libs/ddd-valueobjects/src/implementations -name "*.validator.ts"

# Buscar TODOs y FIXMEs
grep -r "TODO\|FIXME" libs/ddd-valueobjects/src

# Buscar magic numbers
grep -rn "[^a-zA-Z_][0-9]\{2,\}" libs/ddd-valueobjects/src/*.ts

# Buscar métodos largos (más de 20 líneas)
# Manual review needed
```

### Checklist Auditoría

#### SOLID

- [ ] Revisar cada VO para SRP
- [ ] Verificar extensibilidad (OCP)
- [ ] Verificar contratos (LSP)
- [ ] Identificar interfaces grandes (ISP)
- [ ] Verificar dependencias (DIP)
- [ ] Crear `docs/audits/AUDIT-SOLID.md`

#### SoC

- [ ] Verificar separación dominio/validación
- [ ] Verificar factories bien ubicados
- [ ] Verificar formatting no en dominio
- [ ] Crear `docs/audits/AUDIT-SOC.md`

#### Clean Code

- [ ] Verificar naming conventions
- [ ] Medir complejidad ciclomática
- [ ] Identificar code smells
- [ ] Crear `docs/audits/AUDIT-CLEAN-CODE.md`

---

## 🔧 Fase 2: Refactoring

### Template de Refactoring

```bash
# Para cada refactoring:

# 1. Crear branch específico
git checkout -b refactor/extract-validation-rules

# 2. Aplicar refactoring
# ... editar archivos ...

# 3. Verificar que compila
npm run build

# 4. Ejecutar linter
npm run lint

# 5. Commit con convención
git add .
git commit -m "refactor(validators): extract validation rules to reusable classes"

# 6. Merge a feature branch
git checkout feature/quality-improvements
git merge refactor/extract-validation-rules
```

### Refactorings por Prioridad

```bash
# ALTA PRIORIDAD
# R1: Extraer validaciones complejas
# Targets: name.validator.ts, document-id.validator.ts, phone-number.validator.ts

# R2: Extraer constantes
# Crear: libs/ddd-valueobjects/src/implementations/constants/

# R3: Crear interfaces
# Crear: libs/ddd-valueobjects/src/implementations/types/

# MEDIA PRIORIDAD
# R4-R6: Patterns (Builder, Strategy)

# BAJA PRIORIDAD
# R7-R9: Separación avanzada
```

### Checklist Refactoring

- [ ] R1: Validaciones extraídas
- [ ] R2: Constantes extraídas
- [ ] R3: Interfaces creadas
- [ ] R4: Builder implementado
- [ ] R5: Validation rules reutilizables
- [ ] R6: Strategy pattern aplicado
- [ ] R7: Presenters creados
- [ ] R8: Factories separados
- [ ] R9: Services creados
- [ ] R10: Métodos simplificados
- [ ] R11: Nombres mejorados
- [ ] R12: Duplicación eliminada
- [ ] Todo compila sin errores
- [ ] ESLint pasa
- [ ] Prettier aplicado
- [ ] PR creado con descripción detallada

---

## 🧪 Fase 3: Unit Testing

### Setup de Testing

```bash
# Instalar dependencias (si no están)
npm install --save-dev jest @types/jest ts-jest

# Configurar Jest
cat > jest.config.js << 'EOF'
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: [
    'libs/**/*.ts',
    '!libs/**/*.spec.ts',
    '!libs/**/index.ts',
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
EOF

# Agregar scripts a package.json
npm pkg set scripts.test="jest"
npm pkg set scripts.test:watch="jest --watch"
npm pkg set scripts.test:cov="jest --coverage"
npm pkg set scripts.test:debug="node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
```

### Comandos de Testing

```bash
# Ejecutar todos los tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# Ver coverage en HTML
open coverage/lcov-report/index.html  # macOS
start coverage/lcov-report/index.html # Windows
xdg-open coverage/lcov-report/index.html # Linux

# Ejecutar tests específicos
npm test -- name.value-object.spec.ts

# Ejecutar tests en modo verbose
npm test -- --verbose

# Actualizar snapshots
npm test -- --updateSnapshot
```

### Template de Test (Copiar y adaptar)

```typescript
// Copy from IMPROVEMENT-PLAN.md Section 3.3
```

### Orden de Implementación de Tests

```bash
# 1. Text VOs (más simples)
touch libs/ddd-valueobjects/src/implementations/name/name.value-object.spec.ts
touch libs/ddd-valueobjects/src/implementations/name/name.validator.spec.ts

# 2. Identification VOs
# ...

# 3. Numeric VOs (más complejos)
# ...

# 4. Date VOs (más complejos)
# ...

# 5. Legacy VOs
# ...
```

### Checklist Testing

- [ ] name.value-object.spec.ts (15+ tests) ✅ Passing
- [ ] name.validator.spec.ts (10+ tests) ✅ Passing
- [ ] description.value-object.spec.ts (12+ tests) ✅ Passing
- [ ] description.validator.spec.ts (8+ tests) ✅ Passing
- [ ] url.value-object.spec.ts (15+ tests) ✅ Passing
- [ ] url.validator.spec.ts (12+ tests) ✅ Passing
- [ ] phone-number.value-object.spec.ts (15+ tests) ✅ Passing
- [ ] phone-number.validator.spec.ts (10+ tests) ✅ Passing
- [ ] document-id.value-object.spec.ts (20+ tests) ✅ Passing
- [ ] document-id.validator.spec.ts (15+ tests) ✅ Passing
- [ ] age.value-object.spec.ts (12+ tests) ✅ Passing
- [ ] age.validator.spec.ts (8+ tests) ✅ Passing
- [ ] money.value-object.spec.ts (25+ tests) ✅ Passing
- [ ] money.validator.spec.ts (10+ tests) ✅ Passing
- [ ] percentage.value-object.spec.ts (20+ tests) ✅ Passing
- [ ] percentage.validator.spec.ts (8+ tests) ✅ Passing
- [ ] date-range.value-object.spec.ts (20+ tests) ✅ Passing
- [ ] date-range.validator.spec.ts (10+ tests) ✅ Passing
- [ ] birth-date.value-object.spec.ts (15+ tests) ✅ Passing
- [ ] birth-date.validator.spec.ts (8+ tests) ✅ Passing
- [ ] Legacy tests completados
- [ ] Coverage: Statements 100% ✅
- [ ] Coverage: Branches 100% ✅
- [ ] Coverage: Functions 100% ✅
- [ ] Coverage: Lines 100% ✅

---

## 🔒 Fase 4: Husky

### Instalación y Configuración

```bash
# Instalar Husky
npm install --save-dev husky

# Inicializar Husky
npx husky install

# Configurar script prepare
npm pkg set scripts.prepare="husky install"

# Instalar lint-staged
npm install --save-dev lint-staged

# Crear config de lint-staged
cat > .lintstagedrc.json << 'EOF'
{
  "*.ts": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
EOF

# Instalar commitlint
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Crear config de commitlint
cat > commitlint.config.js << 'EOF'
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
EOF

# Crear hooks
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/pre-push "npm run test:cov && npm run build"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'

# Hacer hooks ejecutables
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
```

### Probar Hooks

```bash
# Probar pre-commit (debe ejecutar lint-staged)
git add .
git commit -m "test: verify pre-commit hook"

# Probar commit-msg (debe validar formato)
git commit -m "invalid commit message"  # Debe fallar
git commit -m "feat: valid commit message"  # Debe pasar

# Probar pre-push (debe ejecutar tests y build)
git push origin feature/quality-improvements
```

### Checklist Husky

- [ ] Husky instalado
- [ ] pre-commit hook configurado
- [ ] pre-push hook configurado
- [ ] commit-msg hook configurado
- [ ] lint-staged configurado
- [ ] commitlint configurado
- [ ] Hooks probados manualmente
- [ ] Documentación actualizada

---

## 🚀 Fase 5: GitHub Actions

### Crear Workflows

```bash
# Crear directorio
mkdir -p .github/workflows

# CI Workflow
cat > .github/workflows/ci.yml << 'EOF'
# Copy content from IMPROVEMENT-PLAN.md Section 5.1
EOF

# Release Workflow
cat > .github/workflows/release.yml << 'EOF'
# Copy content from IMPROVEMENT-PLAN.md Section 5.2
EOF

# Dependabot Auto-merge
cat > .github/workflows/dependabot-auto-merge.yml << 'EOF'
# Copy content from IMPROVEMENT-PLAN.md Section 5.3
EOF
```

### Configurar Secrets

```bash
# En GitHub: Settings > Secrets and variables > Actions

# Agregar:
# NPM_TOKEN - Token de npm
# SONAR_TOKEN - Token de SonarCloud (opcional)
# CODECOV_TOKEN - Token de Codecov (opcional)
```

### Probar Workflows

```bash
# Push a branch para activar CI
git add .github/workflows/
git commit -m "ci: add GitHub Actions workflows"
git push origin feature/quality-improvements

# Crear PR para verificar CI
# GitHub UI: Create Pull Request

# Verificar que workflows ejecutan
# GitHub UI: Actions tab

# Verificar badges (después de primera ejecución)
# https://github.com/{org}/{repo}/actions
```

### Checklist GitHub Actions

- [ ] ci.yml creado
- [ ] release.yml creado
- [ ] dependabot-auto-merge.yml creado
- [ ] Secrets configurados (NPM_TOKEN, etc.)
- [ ] Branch protection rules configuradas
- [ ] CI workflow probado en PR
- [ ] All jobs passing ✅
- [ ] Coverage reports suben a Codecov
- [ ] SonarCloud integrado (opcional)

---

## 📦 Fase 6: Release Pipeline

### Crear Scripts

```bash
# Crear directorio
mkdir -p scripts

# Script de release
cat > scripts/prepare-release.sh << 'EOF'
# Copy content from IMPROVEMENT-PLAN.md Section 6.2
EOF

# Hacer ejecutable
chmod +x scripts/prepare-release.sh
```

### Crear CHANGELOG

```bash
# Crear CHANGELOG.md
cat > CHANGELOG.md << 'EOF'
# Changelog

## [Unreleased]

### Added
- SOLID principles applied
- 100% test coverage
- GitHub Actions CI/CD
- Automated npm publishing

## [2.0.0] - 2026-01-30

### Added
- 9 new value objects with validators
- Complete validation system
- Comprehensive documentation

[Unreleased]: https://github.com/nestjslatam/ddd-valueobjects/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/nestjslatam/ddd-valueobjects/releases/tag/v2.0.0
EOF
```

### Proceso de Release

```bash
# 1. Asegurar que estás en main
git checkout main
git pull origin main

# 2. Ejecutar script de release
./scripts/prepare-release.sh

# 3. El script preguntará tipo de bump (patch/minor/major)
# Seleccionar según cambios

# 4. Actualizar CHANGELOG.md cuando se solicite
# Agregar detalles de la release

# 5. El script crea tag y push automático

# 6. GitHub Actions se encarga del resto:
#    - Build
#    - Tests
#    - Publish to npm
#    - Create GitHub release
```

### Verificación Post-Release

```bash
# Verificar en npm
npm view @nestjslatam/ddd-valueobjects

# Verificar en GitHub
# https://github.com/nestjslatam/ddd-valueobjects/releases

# Probar instalación
cd /tmp
mkdir test-install
cd test-install
npm init -y
npm install @nestjslatam/ddd-valueobjects
```

### Checklist Release

- [ ] CHANGELOG.md creado
- [ ] prepare-release.sh creado y probado
- [ ] Release workflow funciona
- [ ] Versioning automático funciona
- [ ] npm publish automático funciona
- [ ] GitHub releases creados automáticamente
- [ ] Package.json actualizado
- [ ] Git tags creados
- [ ] Notificaciones enviadas

---

## 📚 Fase 7: Documentación

### Actualizar README

```bash
# Agregar badges al inicio del README
cat > temp_badges.md << 'EOF'
[![npm version](https://badge.fury.io/js/%40nestjslatam%2Fddd-valueobjects.svg)](https://www.npmjs.com/package/@nestjslatam/ddd-valueobjects)
[![CI](https://github.com/nestjslatam/ddd-valueobjects/workflows/CI/badge.svg)](https://github.com/nestjslatam/ddd-valueobjects/actions)
[![codecov](https://codecov.io/gh/nestjslatam/ddd-valueobjects/branch/main/graph/badge.svg)](https://codecov.io/gh/nestjslatam/ddd-valueobjects)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
EOF

# Merge manualmente con README.md existente
```

### Crear Documentos Adicionales

```bash
# CONTRIBUTING.md
cat > CONTRIBUTING.md << 'EOF'
# Copy content from IMPROVEMENT-PLAN.md Section 7.2
EOF

# CODE_OF_CONDUCT.md
curl -o CODE_OF_CONDUCT.md https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md
```

### Checklist Documentación

- [ ] README.md actualizado con badges
- [ ] CONTRIBUTING.md creado
- [ ] CODE_OF_CONDUCT.md creado
- [ ] Ejemplos actualizados
- [ ] Links verificados
- [ ] Screenshots agregados (si aplica)
- [ ] API docs generada
- [ ] Migration guide creada (si aplica)

---

## ✅ Checklist Final

### Pre-Merge

- [ ] Todas las fases completadas
- [ ] Todos los tests pasan
- [ ] Coverage 100%
- [ ] Build exitoso
- [ ] Linter pasa
- [ ] Commits siguen convención
- [ ] CHANGELOG actualizado
- [ ] Documentación actualizada

### Merge a Main

```bash
# 1. Rebase con main
git checkout feature/quality-improvements
git pull origin main --rebase

# 2. Resolver conflictos si existen
git add .
git rebase --continue

# 3. Verificar todo funciona
npm run test:cov
npm run build
npm run lint

# 4. Push
git push origin feature/quality-improvements --force-with-lease

# 5. Crear PR en GitHub
# 6. Esperar aprobación y CI
# 7. Merge a main
```

### Post-Merge

- [ ] Main build pasa
- [ ] Crear primera release
- [ ] Verificar npm publish
- [ ] Verificar GitHub release
- [ ] Notificar a equipo
- [ ] Celebrar 🎉

---

## 🆘 Troubleshooting

### Tests fallan

```bash
# Ver detalles
npm test -- --verbose

# Ejecutar test específico
npm test -- path/to/file.spec.ts

# Limpiar cache de Jest
npm test -- --clearCache
```

### Coverage no alcanza 100%

```bash
# Ver qué falta
npm run test:cov
open coverage/lcov-report/index.html

# Excluir archivos generados si es necesario
# Actualizar jest.config.js > collectCoverageFrom
```

### Husky hooks no funcionan

```bash
# Reinstalar hooks
rm -rf .husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/pre-push "npm run test:cov && npm run build"
```

### GitHub Actions falla

```bash
# Ver logs en GitHub
# Actions tab > Failed workflow > Job details

# Probar localmente
npm ci  # Simular CI install
npm run lint
npm run test:cov
npm run build
```

### npm publish falla

```bash
# Verificar token
npm whoami

# Login si es necesario
npm login

# Dry run
cd dist/libs/ddd-valueobjects
npm publish --dry-run

# Verificar package.json
cat package.json
```

---

## 📞 Ayuda y Recursos

- **Plan Completo**: [IMPROVEMENT-PLAN.md](./IMPROVEMENT-PLAN.md)
- **Resumen Ejecutivo**: [PLAN-EXECUTIVE-SUMMARY.md](./PLAN-EXECUTIVE-SUMMARY.md)
- **Tracking**: [TRACKING.md](./TRACKING.md)
- **Issues**: https://github.com/nestjslatam/ddd-valueobjects/issues

---

**Última actualización**: 2026-01-29  
**Versión**: 1.0.0
