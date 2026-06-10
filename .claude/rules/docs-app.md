---
paths:
  - "docs-app/**"
---

# Docs site rules

Applies in `docs-app/` - the **separate** Next.js 16 documentation site (App Router, deployed on
Vercel). It is NOT the library. Pairs with `.claude/rules/architecture.md`.

- **Different project, different rules.** Run its own toolchain (`npm run dev` / `build` from
  `docs-app/`); do not apply the library's tsup/rollup/CRLF/lint rules here. Match docs-app's own
  conventions: TypeScript, App Router, its component/import style (`@/`), and its **LF line
  endings** (not the library's CRLF).
- **Never edit the library from here.** `docs-app/` consumes `timepicker-ui` as a dependency. If a
  demo reveals a real library bug/API gap, write it up and flag it for `core-architect` /
  `plugin-dev` / `accessibility` - don't patch `app/`.
- **Document the real API.** Examples use the actual public methods and v4 option groups
  (`clock` / `ui` / `labels` / `behavior` / `callbacks` / `range` / `timezone` / `wheel` /
  `clearBehavior`). Show plugin imports explicitly (`import { ... } from 'timepicker-ui/plugins/wheel'`).
  Verify an option exists in `app/src/types/options.d.ts` rather than inventing it.
- **SSR-safe demos:** the library guards the DOM, so initialize the picker in a client
  component / effect. Avoid hydration mismatches (no `Date.now()`/`Math.random()`/locale-variant
  or unrounded float output in server-rendered markup).
- **Changelog is library-only.** docs-app's own changes (SEO, page content, fixes) are never
  logged in `CHANGELOG.md` / the docs changelog page and never bump the library version.
- Specialized concerns have agents/skills: `seo-optimizer` (`/docs-seo`),
  `docs-accessibility` (`/docs-a11y`); general docs work is `docs-site`.
