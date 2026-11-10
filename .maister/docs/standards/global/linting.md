# Linting & Lint Rules

ESLint flat config targeting src/**/*.ts, extending typescript-eslint recommended + Prettier.

### ESLint Flat Config + typescript-eslint Recommended
Lint uses flat config (`app/eslint.config.js`) spreading `tseslint.configs.recommended`, type-aware via `project: ./tsconfig.json`, Prettier plugin integrated, scoped to `src/**/*.ts` (`npm run eslint`). Sources: config, docs.

### No Nested Ternaries
`no-nested-ternary: error`. Refactor nested ternaries into if/else or extracted variables. Sources: config, docs.

### No `any` (Owner Rule)
`@typescript-eslint/no-explicit-any` is `off` in the ESLint config, but the owner forbids `any` everywhere: use `unknown`, generics or real types. `ban-ts-comment` is also off (`@ts-ignore`/`@ts-expect-error` allowed). Sources: config, owner.

### Unused Variables Are Errors (Ignore Rest Siblings)
`@typescript-eslint/no-unused-vars: ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }]`. Rest-sibling destructuring used to omit props is allowed (`const { omit, ...rest } = obj`). Sources: config, docs.

### Pre-Commit Linting
`npm run lint` runs `lint-staged && pretty-quick --staged` on staged files (husky-wired). Source: config.
