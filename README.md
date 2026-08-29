<div align="center">

# `@nestjslatam/ddd-valueobjects`

**Doce value objects ya hechos para [`@nestjslatam/ddd-lib`](https://github.com/nestjslatam/ddd)** — email, dinero, teléfono, documentos de identidad, fechas y más, cada uno con sus reglas, sus formateadores y su igualdad ya escritos.

[![npm](https://img.shields.io/npm/v/%40nestjslatam%2Fddd-valueobjects?color=1e73be&label=ddd-valueobjects)](https://www.npmjs.com/package/@nestjslatam/ddd-valueobjects)
[![CI](https://github.com/nestjslatam/ddd-valueobjects/actions/workflows/ci.yml/badge.svg)](https://github.com/nestjslatam/ddd-valueobjects/actions/workflows/ci.yml)
[![tests](https://img.shields.io/badge/pruebas-681%20pasando-00d084)](#pruebas)
[![license](https://img.shields.io/badge/licencia-MIT-575760)](LICENSE)

[Inicio rápido](#inicio-rápido) · [Qué trae](#qué-trae) · [Preguntas frecuentes](#preguntas-frecuentes) · [Colaborar](#colaborar)

**[📖 Catálogo completo en docs.nestjslatam.dev](https://docs.nestjslatam.dev/valueobjects/)**

</div>

---

```bash
npm install @nestjslatam/ddd-valueobjects @nestjslatam/ddd-lib
```

## Inicio rápido

```ts
import { Money, MoneyFormatter, Email, BirthDate, DocumentId } from '@nestjslatam/ddd-valueobjects';

// La mayoría lanza ante una entrada inválida.
const price = Money.create(1999, 'USD');
new MoneyFormatter().format(price); // '$1,999.00'

Money.create(10, 'XYZ');
// Invalid Money: Property: currency, Message: Currency code 'XYZ' is not
// a commonly recognized ISO 4217 code

// Email y UUID son los dos que devuelven un Result en lugar de lanzar.
const email = Email.create('ada@example.com');
email.isSuccess;               // true
email.getValue().getValue();   // 'ada@example.com'

Email.create('no-es-un-email').getError(); // 'Email format is invalid'

// Todo lo que dependa de «ahora» acepta una fecha de referencia opcional.
BirthDate.create(new Date('1990-06-15')).getAge(new Date('2026-08-28')); // 36

DocumentId.create('12345678', 'DNI', 'PE').getValue();
// { value: '12345678', type: 'DNI', country: 'PE' }
```

Ese parámetro de fecha de referencia es el detalle que merece la pena copiar aunque escribas los tuyos: `getAge`, `isMinor`, `isAdult`, `getNextBirthday`, `getDaysUntilBirthday` e `isBirthdayToday` lo aceptan todos, así que su comportamiento se puede probar **sin congelar el reloj**.

## Qué trae

|                          |                                                                        |
| ------------------------ | ---------------------------------------------------------------------- |
| **Identidad y contacto** | `Email`, `PhoneNumber`, `Url`, `UUID`, `Name`                          |
| **Dinero y números**     | `Money`, `Percentage`                                                  |
| **Tiempo**               | `BirthDate`, `DateRange`, `Age`                                        |
| **Documentos**           | `DocumentId` — DNI, pasaporte, licencia de conducir, SSN, RUC, y otros |
| **Texto**                | `Description`                                                          |

Más los formateadores (`MoneyFormatter` por sí solo tiene `format`, `formatWithoutSymbol`, `formatWithCode`, `formatAccounting`, `formatCompact` y `formatAsWords`), y servicios: `ZodiacCalculatorService` puntúa la compatibilidad entre dos signos y `BirthdayCalendarService` encuentra cumpleaños próximos y efemérides.

### La validación de documentos es enchufable

`DocumentId` delega en una estrategia por tipo de documento, y el registro está abierto:

```ts
class PeruvianDni implements IDocumentValidatorStrategy {
  readonly type = 'DNI';

  clean(value: string): string {
    return value.replace(/\D/g, '');
  }

  validate(value: string) {
    const errors = /^\d{8}$/.test(value)
      ? []
      : [{ field: 'value', message: 'Un DNI peruano tiene 8 dígitos' }];
    return { isValid: errors.length === 0, errors };
  }
}

DocumentValidatorRegistry.registerStrategy(new PeruvianDni());
DocumentValidatorRegistry.getRegisteredTypes();
// ['DNI', 'PASSPORT', 'SSN', 'TAX_ID', 'DRIVER_LICENSE', 'OTHER']
```

La estrategia lleva su propio `type`, así que registrarla **sustituye** las reglas incorporadas para ese tipo de documento. Vienen seis. Escribir una para un país cuyo formato usas a diario es la contribución útil más fácil de este repositorio.

## Requisitos

Node `>=20.11`, y **`@nestjslatam/ddd-lib` como dependencia par** — la instalas tú:

```
@nestjslatam/ddd-lib  ^2.0.0 || ^3.0.0 || ^4.0.0
@nestjs/common        ^10.0.0 || ^11.0.0
@nestjs/core          ^10.0.0 || ^11.0.0
reflect-metadata      ^0.1.13 || ^0.2.0
rxjs                  ^7.2.0
```

> [!IMPORTANT]
> **La `1.1.0` y anteriores declaraban `ddd-lib` como dependencia normal**, así que instalarlas junto a `ddd-lib@3.0.0` te dejaba **dos copias**:
>
> ```
> @nestjslatam/ddd-lib                                3.0.0   isValid -> getter
> @nestjslatam/ddd-valueobjects/node_modules/ddd-lib  2.1.2   isValid -> método
> ```
>
> Dos identidades de clase, dos formas, y un `instanceof` que falla entre ellas. Desde la `1.2.0` es dependencia par, que resuelve a tu única copia. Actualiza si estás en la `1.1.0` o anterior y usas `ddd-lib` 3.x.

## Pruebas

```bash
npm install
npm test        # 32 suites, 681 pruebas, ~15s
```

Pasan en un clon limpio, y el pipeline de publicación va más allá: empaqueta el tarball, lo instala en un proyecto vacío **sin nada puesto a mano** y lo carga con `require()` bajo `node --no-experimental-require-module`.

Esa opción importa. Node moderno carga ESM a través de `require()` de forma transparente, lo que **esconde** las dependencias sólo-ESM que rompen a los consumidores CommonJS de verdad. Un paquete hermano publicó exactamente ese bug y nadie se enteró hasta que estaba en npm.

## Preguntas frecuentes

<details>
<summary><b>Cuatro paquetes <code>@nestjslatam</code>, ¿cuál necesito?</b></summary>

[`ddd-lib`](https://github.com/nestjslatam/ddd) es obligatorio; es la librería sobre la que se apoya todo lo demás. **Este paquete es opcional** — te ahorra escribir `Email`, `Money` y compañía a mano. [`ddd-cli`](https://github.com/nestjslatam/ddd-cli) es una herramienta de desarrollo. [`ddd-es-lib`](https://github.com/nestjslatam/ddd-event-sourcing) es para event sourcing sobre MongoDB.
</details>

<details>
<summary><b>¿Funciona con el <code>ddd-lib</code> actual?</b></summary>

Sí. El rango par es `^2.0.0 || ^3.0.0 || ^4.0.0`, y las 681 pruebas se volvieron a ejecutar contra cada nueva versión mayor **antes** de ampliar el rango — para la `4.0.0` eso significó empaquetar su tarball en local y probar contra él antes de que se publicara. En la `1.1.0` o anterior, mira el aviso de [Requisitos](#requisitos): te llevarás dos copias de la librería sin enterarte.
</details>

<details>
<summary><b>¿Por qué <code>Email.create()</code> devuelve algo distinto de <code>Money.create()</code>?</b></summary>

Historia, no diseño. `Email` y `UUID` son los dos que devuelven un `Result`; todo lo demás lanza ante una entrada inválida. Unificarlos es un cambio incompatible que nadie ha acometido todavía — está [en la lista](#colaborar).
</details>

<details>
<summary><b><code>Money.create()</code> rechaza mi código de moneda. ¿Es un bug?</b></summary>

Probablemente no — valida contra los códigos ISO 4217 de uso común y rechaza el resto con un mensaje que nombra el código. Si falta uno legítimo, es un arreglo de una línea y un PR bienvenido.
</details>

<details>
<summary><b>Podría escribir yo una clase <code>Email</code>. ¿Qué me aporta esto?</b></summary>

Para `Email`, sobre todo las pruebas. Los que se ganan el sitio son los que tienen superficie de verdad: `Money` con seis formateadores y validación ISO 4217, `DocumentId` con seis estrategias de país enchufables, `BirthDate` y `DateRange` con la disciplina de la fecha de referencia, y `PhoneNumber`. El coste de integración es un `import` — son value objects normales de `ddd-lib`.
</details>

<details>
<summary><b>¿Está listo para producción?</b></summary>

Sí, con versiones exactas clavadas tanto aquí como en `ddd-lib`.

681 pruebas en este paquete, y `ddd-lib@4.0.0` es la primera versión del cimiento con una batería real sobre las clases que este paquete extiende — 1017 pruebas, 98,6 % de cobertura, alcanzadas escribiendo specs que destaparon 34 defectos. La batería propia de este paquete se volvió a ejecutar contra la `4.0.0` antes de ampliar su rango par.

Lo que queda es cambio de API y no riesgo de corrección: `ddd-lib` 4.0.0 movió comportamiento en ocho sitios que el compilador no ve. Clava exacto y juzga la promesa de estabilidad en su `4.1.0`.
</details>

<details>
<summary><b>¿Qué versiones de NestJS y de Node?</b></summary>

NestJS 10 u 11 declaradas, Node `>=20.11`. En CI sólo se ejercita NestJS 11.
</details>

## Colaborar

Concreto, y cada punto verificable en minutos:

1. **Una estrategia de documento para un país que conozcas.** `DocumentValidatorRegistry.registerStrategy()` es el punto de extensión y seis estrategias ya enseñan la forma. Las reglas escritas por quien convive con el formato le ganan a las escritas desde una especificación.
2. **Arregla el mensaje de error del propio `Result`.** `getValue()` sobre un resultado fallido dice *«Use errorValue instead»*, pero el método se llama `getError()`. Una línea, en `libs/ddd-valueobjects/src/core/result.ts`.
3. **Unifica `create()`.** `Email` y `UUID` devuelven un `Result` mientras los otros diez lanzan. Elige uno — es incompatible, así que necesita una versión mayor y una nota de migración.
4. **Documenta `Description` y `Url`.** Son las dos APIs más ricas en opciones de todo el paquete y ninguna aparece en este README.

Antes de abrir un PR:

```bash
npm run lint && npm test
```

Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/).

## Construir y publicar

`npm run build` usa `nest build`, que empaqueta con webpack y **no emite declaraciones** — no es publicable. `npm run build:lib` compila con `tsc` y deriva el manifiesto publicado, y el paquete se publica desde `dist/libs/ddd-valueobjects` para que las importaciones por subruta resuelvan sin un mapa de `exports`.

> [!TIP]
> **[La guía completa del CLI →](https://github.com/nestjslatam/ddd-cli/blob/main/docs/GUIDE.md)** — cada comando y cada opción, recorridos construyendo un dominio completo desde cero hasta diez ficheros que compilan. Vale la pena aunque nunca instales el CLI: es la explicación más clara del idioma de esta librería que existe, porque cada afirmación se produjo ejecutando la herramienta.

## Quiénes están detrás

Construido y mantenido por **[BeyondNet Tech](https://beyondnet.info/)** junto a la comunidad [NestJS Latam](https://nestjslatam.dev/).

- **[Evolith](https://github.com/beyondnetcode/evolith_arch32)** — gobierno de arquitectura ejecutable: un CLI, un servidor MCP y una API REST que comprueban un repositorio contra reglas Rego/OPA, e informan de una regla que no pudieron evaluar como un fallo en lugar de dejarla pasar en silencio.
- **[Shell.ddd](https://github.com/beyondnetcode/Shell.ddd)** — la contraparte .NET de `ddd-lib`.

## Licencia

MIT — ver [LICENSE](LICENSE).

---

<div align="center">

**Impulsado por [BeyondNetCode](https://beyondnet.info/)**

[Web](https://beyondnet.info/) · [GitHub](https://github.com/beyondnetcode) · [NestJS Latam](https://nestjslatam.dev/)

</div>
