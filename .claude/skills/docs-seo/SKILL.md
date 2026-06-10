---
name: docs-seo
description: Audit and improve the SEO of the timepicker-ui documentation site (docs-app/). Use when the user wants to optimize docs SEO, improve Google ranking/positioning, add or fix sitemap/robots/manifest, fill in page metadata, add Open Graph/Twitter cards or JSON-LD structured data, or run an SEO audit on docs-app. Drives the seo-optimizer subagent with an audit → approve → apply flow.
---

# Docs SEO

Optimize the SEO of `docs-app/` (the Next.js 16 documentation site for `timepicker-ui`) so
it ranks as the top result for time-picker searches. This skill is a thin orchestrator: the
real work is done by the **`seo-optimizer`** subagent. The skill exists to manage the
**human approval gate** the subagent can't do itself.

Default production URL: `https://timepicker-ui.vercel.app` (use unless the user gives another).

## Arguments (optional)
- A focus area narrows the run, e.g. `/docs-seo metadata`, `/docs-seo sitemap`,
  `/docs-seo structured-data`, `/docs-seo opengraph`. No argument = full audit of all areas.
- `--apply-all` skips the per-area approval prompt and applies every audited change (still
  reports at the end). Use only when the user explicitly wants unattended changes.

## Workflow

### Phase 1 — Audit (read-only)
Dispatch the `seo-optimizer` subagent (Task tool, `subagent_type: seo-optimizer`) in **audit
mode**. Brief it with: the production URL, the focus area (if any), and a reminder that the
known gaps as of init are — no `sitemap.ts` / `robots.ts` / `manifest.ts`, ~62 of ~90 routes
missing metadata, and root metadata lacking `metadataBase` / canonical / Twitter / OG image /
JSON-LD. Ask it to return a prioritized, file-level change plan grouped into:
1. Technical files (sitemap / robots / manifest / metadataBase)
2. Per-page metadata (the missing routes)
3. Root + Open Graph / Twitter (+ OG image)
4. JSON-LD structured data
5. On-page / performance flags

The subagent may use WebSearch/WebFetch to confirm current Next 16 APIs and keyword/competitor
positioning. It makes NO edits in this phase.

### Phase 2 — Present & approve (gate)
Relay the audit plan to the user concisely (counts + the concrete titles/descriptions and
files per group). Then **use AskUserQuestion** to let the user choose which groups (and, where
it matters, which items) to apply. This is a mandatory gate — do not skip it unless
`--apply-all` was passed. Capture the approved set.

### Phase 3 — Apply
Dispatch the `seo-optimizer` subagent again in **apply mode** with the exact approved list
(files + the decided titles/descriptions/structured-data). It implements the changes under
`docs-app/` using real Next 16 typed APIs, keeping titles/descriptions unique and on-keyword.

### Phase 4 — Verify & report
- Offer to run `cd docs-app && npm run build` to confirm the site still builds (don't assume —
  the user may prefer to run it). If you run it, report pass/fail honestly with output.
- Summarize what changed, grouped by the five areas, with the file list.
- Give the manual verification checklist: open `/sitemap.xml`, `/robots.txt`,
  `/manifest.webmanifest`; view-source a couple of routes for `<title>`, OG/Twitter tags, and
  JSON-LD; validate structured data with Google Rich Results Test / Schema.org validator.
- Note that git is the user's job — propose a commit message but do not commit.

## Guardrails
- The subagent edits ONLY `docs-app/`; it never touches the library in `app/` or `dist/`.
- Don't regress existing good metadata — extend it.
- Keep this skill and the agent file in CRLF; for `docs-app/` source files, match docs-app's
  own conventions.
- One run optimizes; it does not redesign the site. Visual/content rewrites beyond SEO copy
  belong to the `docs-site` agent.
