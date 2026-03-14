---
description: "Use when: ecosystem research, framework updates, browser API status, library compatibility, roadmap evaluation, technology recommendations, version checks, migration planning. Ensures ecosystem information is verified against current sources before being cited."
---

# Research & Ecosystem Freshness Rules

## Verification Before Citation

Before citing or relying on ecosystem information (framework versions, API status, browser support, roadmap items):

1. **Web-search first** — prefer live sources over static notes in the repository
2. **Check official sources** — GitHub releases, official docs, npm registry, TC39 proposals
3. **Verify browser support** — use Can I Use or MDN baseline data, not assumptions
4. **Flag uncertainty** — if current status cannot be confirmed, explicitly state the information may be outdated

## Stale Data Handling

Repository files like "Key Opportunities to Track" tables, version references, and browser support claims may be outdated. When encountering these:

- Do NOT assume the listed status is still accurate
- Re-evaluate using current web sources before making recommendations
- Update the table or note if the information has changed significantly

## Source Priority

1. Official documentation and release notes
2. GitHub repository releases / changelogs
3. npm registry (latest published version, publish date)
4. MDN Web Docs / Can I Use for browser APIs
5. TC39 proposal tracker for ECMAScript features
6. Repository notes and static tables (lowest priority — always verify)

## When Recommending Changes

- Cite the specific version number and release date of any framework or tool mentioned
- Include browser support baseline year or percentage
- Check competing timepicker components for patterns worth adopting
- Verify that suggested APIs are available in the project's target environments (ES6 target, SSR-safe)
