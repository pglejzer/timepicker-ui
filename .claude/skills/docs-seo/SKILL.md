---
name: docs-seo
description: Audit and improve the discoverability of the timepicker-ui documentation site (docs-app/) across the full modern discoverability stack — SEO (ranking), AEO (answer engines / featured snippets), GEO (citations inside ChatGPT/Gemini/Perplexity/Claude), and AIO (Google AI Overviews). Use when the user wants to optimize docs SEO, improve Google ranking/positioning, win featured snippets or AI-answer boxes, get the docs cited by AI engines, add or fix sitemap/robots/manifest, fill in page metadata, add Open Graph/Twitter cards, answer-first copy, or JSON-LD (FAQPage/SoftwareApplication/TechArticle/BreadcrumbList). Drives the seo-optimizer subagent with an audit → approve → apply flow.
---

# Docs Discoverability (SEO + AEO + GEO + AIO)

Make `docs-app/` (the Next.js 16 documentation site for `timepicker-ui`) **found, read,
and cited** by people, search crawlers, and AI answer engines — so it is the answer a
developer, Google, and ChatGPT all reach for when someone wants a time picker. This skill
is a thin orchestrator: the real work is done by the **`seo-optimizer`** subagent (which
covers the full four-layer stack, not just classic SEO). The skill exists to manage the
**human approval gate** the subagent can't do itself.

Default production URL: `https://timepicker-ui.vercel.app` (use unless the user gives another).

This is a **fully public open-source** site: everything here is meant to be indexed and
cited. There is no private data and no protected branding. The subagent's guardrail is
**truthfulness** (never describe a feature the library lacks) and **quality** (no AI slop),
not privacy.

## Arguments (optional)
- A focus area narrows the run, e.g. `/docs-seo metadata`, `/docs-seo sitemap`,
  `/docs-seo structured-data`, `/docs-seo opengraph`, `/docs-seo aeo` (answer-first + FAQ),
  `/docs-seo geo` (entity footprint + citations). No argument = full audit of all layers.
- `--apply-all` skips the per-area approval prompt and applies every audited change (still
  reports at the end). Use only when the user explicitly wants unattended changes.

## Workflow

### Phase 1 — Audit (read-only)
Dispatch the `seo-optimizer` subagent (Task tool, `subagent_type: seo-optimizer`) in **audit
mode**. Brief it with the production URL and the focus area (if any), and tell it to discover
the current state for itself rather than trusting any baseline — what was missing last run
may already be fixed. Ask it to return a prioritized, file-level change plan grouped into:
1. **SEO — technical files** (sitemap / robots / manifest / metadataBase)
2. **SEO — per-page metadata** (the missing/duplicate titles + descriptions)
3. **SEO — root + Open Graph / Twitter** (+ OG image)
4. **AEO** — answer-first copy + question-formatted headings + `FAQPage` on Q&A pages
5. **GEO** — consistent entity footprint + concrete facts + `SoftwareApplication`/JSON-LD
6. **AIO / AI-crawler / Core Web Vitals** flags (llms.txt + robots AI user-agents are the
   owner's call; default is to welcome AI crawlers on a public OSS site)

The subagent's own definition already mandates the two checks below — this is the reminder to
put in its brief, not a second source of truth (if the agent's rules change, its file wins).
The subagent MUST, **every run, in both audit and apply mode**:
- **Check the web first.** Derive today's real date (`date +%Y-%m-%d`) and web-search the
  current best practice across **all four layers** — Next.js APIs, Google ranking + AI-slop +
  AI-features guidance, AEO/GEO/AIO tactics, the AI-crawler / `llms.txt` state — rather than
  optimizing from memory. Live sources win over anything hardcoded; it cites sources + dates.
- **Run the AI-slop check on text AND icons.** Scan existing and proposed titles/descriptions/
  FAQ copy for slop and long dashes (`—`/`–`), and the SEO/OG surface for stray Unicode emojis
  or native/system icons (the site uses `lucide-react` — emoji/native icons are a defect to
  flag, not ship).

It makes NO edits in this phase.

### Phase 2 — Present & approve (gate)
Relay the audit plan to the user concisely (counts + the concrete titles/descriptions/FAQ Q&A
and files per group). Then **use AskUserQuestion** to let the user choose which groups (and,
where it matters, which items) to apply. AskUserQuestion caps at 4 options per question, so
present the six groups as a multi-select batched into two questions when needed, then a
follow-up for item-level choices where it matters. This is a mandatory gate — do not skip it
unless `--apply-all` was passed. Capture the approved set.

### Phase 3 — Apply
Dispatch the `seo-optimizer` subagent again in **apply mode** with the exact approved list
(files + the decided titles/descriptions/answer-first copy/structured data). It implements the
changes under `docs-app/` using real Next 16 typed APIs, keeping titles/descriptions unique,
on-keyword, answer-first where it's a docs page, and written like a human — short, specific, no
AI slop, no long dashes, and no emojis/native icons (lucide or none). It keeps the entity
footprint consistent across hero copy, metadata, OG, and JSON-LD.

### Phase 4 — Verify & report
- Offer to run `cd docs-app && npm run build` to confirm the site still builds (don't assume —
  the user may prefer to run it). If you run it, report pass/fail honestly with output.
- Summarize what changed, grouped by the six areas, with the file list.
- Give the manual verification checklist: open `/sitemap.xml`, `/robots.txt`,
  `/manifest.webmanifest`; view-source a couple of routes for `<title>`, OG/Twitter tags, and
  JSON-LD; validate structured data with Google Rich Results Test / Schema.org validator. Note
  that AEO/GEO wins (featured snippets, AI-Overview appearance, ChatGPT/Perplexity citations)
  show up over time and are tracked separately from classic rankings.
- Note that git is the user's job — propose a commit message but do not commit.

## Guardrails
- The subagent edits ONLY `docs-app/`; it never touches the library in `app/` or `dist/`.
- **Truthfulness over reach.** Metadata, keywords, FAQ answers, and JSON-LD must match the real
  library — a fabricated fact is what gets the entity distrusted by AI engines and demoted by
  Google. When unsure a feature exists, verify against `app/src/types/options.d.ts` or the docs.
- Don't regress existing good metadata/JSON-LD — extend it (FAQ/TechArticle JSON-LD already ships).
- Best practices are re-derived live every run from today's real date, never from memory or a
  hardcoded year — for all four layers. A run today and a run months from now both research the
  *current* guidance.
- The generated copy is human, short, slop-free: no filler openers or empty intensifiers, no
  keyword stuffing, no long dashes (`—`/`–`, use short hyphens), and no Unicode emojis or
  native icons (use `lucide-react`).
- Keep this skill and the agent file in CRLF; for `docs-app/` source files, match docs-app's
  own conventions.
- One run optimizes discoverability; it does not redesign the site. Visual/content rewrites
  beyond SEO/answer-first copy belong to the `docs-site` agent.
