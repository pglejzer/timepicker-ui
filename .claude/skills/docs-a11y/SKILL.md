---
name: docs-a11y
description: Audit and improve the accessibility of the timepicker-ui documentation site (docs-app/) - landmarks, heading order, skip links, keyboard nav, focus management in the command menu / sidebar / dialogs, color contrast, alt text, ARIA on custom components, Radix usage, reduced motion - against WCAG 2.2 AA. Use when the user wants an a11y audit/fix of the docs site. Drives the docs-accessibility subagent in an audit → approve → apply flow. Does NOT cover the library (use /a11y for that).
---

# Docs Accessibility (a11y)

Make the `timepicker-ui` documentation site (`docs-app/`, Next.js 16) usable by keyboard and
assistive technology. This skill is a thin orchestrator: the real work is done by the
**`docs-accessibility`** subagent. The skill exists to hold the **approval gate** the subagent
can't run itself.

Standard: **WCAG 2.2 AA**. Scope is **`docs-app/` only** - the library is `/a11y`.

## Arguments (optional)
- A focus area narrows the run, e.g. `/docs-a11y nav`, `/docs-a11y command-menu`,
  `/docs-a11y contrast`, `/docs-a11y headings`, `/docs-a11y keyboard`. No argument = full audit.
- `--apply-all` skips the per-area approval prompt and applies the whole audited plan (still reports
  + verifies). Use only for an explicitly unattended run.

## Workflow

### Phase 1 — Audit (read-only)
Dispatch the `docs-accessibility` subagent (Task tool, `subagent_type: docs-accessibility`) in
**audit mode**, with the focus area if given. Ask for a prioritized, file-level plan grouped into:
1. Structure & landmarks (one `<main>`, nav/header/footer, skip link, heading order)
2. Keyboard & focus (command menu, mobile sidebar, dialogs: trap/Escape/focus-return, visible focus,
   `aria-expanded`/`aria-current`)
3. Names, roles, contrast (icon-button labels, decorative `aria-hidden`, ≥4.5:1 text contrast in
   light AND dark)
4. Content & media (`lang`, descriptive links, labelled copy buttons, alt text)
5. Motion & responsiveness (`prefers-reduced-motion`, reflow at 320px / 400% zoom)
Each finding cites its WCAG reference and the exact file + change. No edits.

### Phase 2 — Present & approve (gate)
Relay the plan concisely (grouped, with references). **Use AskUserQuestion** to approve all, pick
which groups/items to apply, or skip. Capture the approved set. Do not skip this gate unless
`--apply-all` was passed.

### Phase 3 — Apply
Dispatch `docs-accessibility` again in **apply mode** with the exact approved list. It implements
fixes (landmarks, headings, `aria-*`, focus management, labels, contrast/markup) in docs-app's own
TS/App-Router style and line endings, using Radix primitives correctly and adding no heavy deps.

### Phase 4 — Verify & report
- Offer to run `npm run build` / `npm run lint` (and an axe/Lighthouse a11y pass if tooling is
  available) inside `docs-app/`. Report real output; never assume green.
- Summarize what changed, grouped by the five areas, with the file list.
- Give the manual checklist: keyboard-only walkthrough (header → command menu → sidebar → a docs
  page), Escape/focus-return on the menus, a screen-reader pass on one page, and a contrast check in
  both light and dark themes.
- Flag anything that's actually a library a11y bug (seen via a live demo) for `/a11y`, and any
  visual/content redesign for `docs-site`.

## Guardrails
- `docs-app/` only; never edit the library in `app/` or `dist/`.
- Match docs-app conventions and line endings (not the library's CRLF rule).
- Accessibility, not redesign; no new heavy a11y dependencies without flagging.
- This skill audits/fixes; git and deploy stay with the user.
