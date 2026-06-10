# Technology Stack

## Overview

This document describes the technology choices and rationale for `timepicker-ui` — a zero-dependency, framework-agnostic, SSR-safe time picker library published to npm. All source, build, and test work happens in `app/`; a separate Next.js documentation site lives in `docs-app/`.

## Languages

### TypeScript (5.8.3)
- **Usage**: Primary language — ~101 source files in `app/src/`
- **Rationale**: Strict static typing for a public library API, fully typed options groups and event map, generated `.d.ts` declarations for consumers.
- **Key Features Used**: strict mode, `EventEmitter<TimepickerEventMap>` typed bus, grouped option interfaces, `@/` path alias to `app/src/`. `@typescript-eslint/no-explicit-any` is intentionally off — `any` is permitted but typed code is preferred.

### SCSS
- **Usage**: 11 stylesheets in `app/src/styles/` (core + 10 themes)
- **Rationale**: Variables, mixins, and effects shared across themes; compiled to standalone CSS so consumers load only what they need.
- **Key Features Used**: `variables.scss`, `_mixins.scss`, `_effects.scss`; `tp-ui-` class prefix; standalone per-theme output.

### JavaScript
- **Usage**: Build configuration (`rollup.config.js`, `webpack.config.js`) and emitted ESM/CJS bundles.

## Frameworks

### Frontend
- **None (framework-agnostic).** The library manipulates the DOM directly and is consumed by React, Vue, Angular, Svelte, or vanilla JS. A separate React wrapper exists in its own repository.

### Backend
- **None.** This is a client-side library with no server component.

### Testing
- **Jest 30.0.4** with **ts-jest** preset, **jsdom** environment.
- **@testing-library/dom**, **@testing-library/jest-dom**, **@testing-library/user-event** for DOM-centric assertions and interaction.
- CSS imports mocked to `tests/__mocks__/styleMock.ts`; SVG imports mocked to `tests/__mocks__/svgMock.ts`. Test files mirror `src/` structure; `.edge.test.ts` suffix for edge-case suites.

## Database

Not applicable — `timepicker-ui` has no persistence layer.

## Build Tools & Package Management

- **Package manager**: npm (`package-lock.json`).
- **tsup** — compiles TypeScript to ESM (`.js`) + CJS (`.cjs`), minified, target ES2022. Four entry points: `index`, `plugins/range`, `plugins/timezone`, `plugins/wheel`. Output to `../dist/`. SVGs loaded as text.
- **rollup** — two jobs: SCSS → CSS (`dist/css/`, core + theme files) via Sass/PostCSS, and TypeScript → `.d.ts` bundles via `rollup-plugin-dts`.
- **webpack** — local dev server only (`npm run start`); not part of the production build.
- **Sass 1.89.2**, **PostCSS 8.5.6**, **Autoprefixer 10.4.21** — CSS compilation pipeline.
- **Babel** (`@babel/core`, `@babel/preset-env`) — supporting transpilation.

### Production build flow
`npm run build:prod` → eslint → tsup (JS) → rollup (CSS + `.d.ts`).

## Infrastructure

### Containerization
None detected.

### CI/CD
- GitHub Actions workflows present in `.github/workflows/`.
- Git hooks via **Husky 9.1.7** + **lint-staged 16.1.2** + **pretty-quick 4.2.2** for pre-commit formatting/linting.

### Hosting
- The documentation site (`docs-app/`, Next.js 16) is deployed on **Vercel** (live demo: timepicker-ui.vercel.app). The library itself is distributed via **npm**.

## Development Tools

### Linting & Formatting
- **ESLint 9.31.0** — flat config (`app/eslint.config.js`), `typescript-eslint` recommended rules + Prettier. Notable rules: `linebreak-style: ["error", "windows"]` (CRLF), `no-nested-ternary: error`, `@typescript-eslint/no-explicit-any: off`, unused vars checked with `ignoreRestSiblings`.
- **Prettier 3.6.2** — `singleQuote`, `semi`, `trailingComma: all`, `printWidth: 110`, `endOfLine: crlf`.

### Type Checking
- **TypeScript** — `tsconfig.json` (dev), `tsconfig.prod.json` (used by tsup), `tsconfig.test.json` (tests). Strict mode, declarations emitted for the published package.

## Key Dependencies

- **Runtime dependencies**: none (zero-dependency by design — a core constraint, not an accident).
- **Dev dependencies** (major): typescript, tsup, rollup + rollup-plugin-dts, webpack, sass, postcss/autoprefixer, jest + ts-jest, @testing-library/*, eslint + typescript-eslint, prettier, husky, lint-staged.

## Version Management

- Semantic Versioning; changes tracked in `CHANGELOG.md` (Keep a Changelog format).
- Animation/delay values centralized in `app/src/constants/timings.ts` (`TIMINGS`) rather than hardcoded.
- Current published version 4.3.0; active development on `feature/4.4.0`.

## Migration Path

Not applicable — modern, actively maintained stack with no legacy components requiring migration.

---
*Last Updated*: 2026-06-08
*Auto-detected*: languages, frameworks, build tools, test framework, linting/formatting config, CI hooks, hosting (docs site). *User-provided*: documentation goals (contributor onboarding, consistency, v4.4.0 planning).
