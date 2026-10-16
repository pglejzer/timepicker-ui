---
paths:
  - "docs-app/**"
---

# Docs site rules

Applies in `docs-app/` - the **separate** Next.js 16 documentation site (App Router, deployed on
Vercel). It is NOT the library. Pairs with `.claude/rules/architecture.md`.

- **Different project, different rules.** It has its own toolchain (`npm run dev` / `build` from
  `docs-app/`, run only by the main agent); do not apply the library's tsup/rollup/lint rules here. Match docs-app's own
  conventions: TypeScript, App Router, its component/import style (`@/`), and **CRLF line
  endings** (every source file in `docs-app/` is CRLF; files created with Write come out LF; list them in your report and the main agent converts them).
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
- **Generated data:** `public/bundle-data.json` (bench script) and
  `lib/generated/css-reference.json` (`scripts/generate-css-reference.mjs`, run by the main agent).
  Never edit them by hand.
- **Changelogs mirror packages, never the site.** `/docs/changelog` mirrors the library
  `CHANGELOG.md`, `/docs/changelog/react` mirrors the `CHANGELOG.md` of `timepicker-ui-react`
  (separate repo) and `/docs/changelog/mcp` mirrors `mcp-server/CHANGELOG.md`; the shared
  components are in `components/changelog.tsx`. docs-app's own changes (SEO, page content,
  fixes) are never logged on any of them and never bump a version.
- Specialized concerns have agents/skills: `seo-optimizer` (`/docs-seo`),
  `docs-accessibility` (`/docs-a11y`); general docs work is `docs-site`.
