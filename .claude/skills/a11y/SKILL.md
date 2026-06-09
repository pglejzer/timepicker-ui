---
name: a11y
description: Audit and improve the accessibility of the timepicker-ui LIBRARY (app/src) - ARIA, keyboard operability, focus trap/management, screen-reader announcements, labels - against WCAG 2.2 AA and the WAI-ARIA Authoring Practices. Use when the user wants an a11y audit/fix of the picker itself (clock, wheel, plugins, modal, inputs). Drives the accessibility subagent in an audit → approve → apply flow. Does NOT cover docs-app (use /docs-a11y for that).
---

# Library Accessibility (a11y)

Make the `timepicker-ui` picker fully usable by keyboard and assistive technology. This skill is a
thin orchestrator: the real work is done by the **`accessibility`** subagent. The skill exists to
hold the **approval gate** the subagent can't run itself.

Standard: **WCAG 2.2 AA** + the **WAI-ARIA Authoring Practices** (dialog / listbox / combobox /
spinbutton patterns). Scope is **`app/src` only** - the docs site is `/docs-a11y`.

## Arguments (optional)
- A focus area narrows the run, e.g. `/a11y clock`, `/a11y wheel`, `/a11y range`, `/a11y timezone`,
  `/a11y modal`, `/a11y keyboard`. No argument = full audit.
- `--apply-all` skips the per-area approval prompt and applies the whole audited plan (still reports
  + verifies). Use only for an explicitly unattended run.

## Workflow

### Phase 1 — Audit (read-only)
Dispatch the `accessibility` subagent (Task tool, `subagent_type: accessibility`) in **audit mode**,
with the focus area if given. Ask for a prioritized, file-level plan grouped into:
1. Keyboard operability (open/close, selection, AM/PM, OK/Cancel/Clear, tabs, dropdown, wheel)
2. ARIA roles/names/states (dialog, listbox, spinbutton; `aria-pressed/selected/disabled/valuenow`)
3. Screen-reader feedback (the `.timepicker-announcer` live region; validation/error announcements)
4. Forms, labels & relationships (all text via the `labels` group)
5. Non-text & motion (no color-only state; `prefers-reduced-motion`)
Each finding cites its WCAG/APG reference and the exact file + attribute/handler. No edits.

### Phase 2 — Present & approve (gate)
Relay the plan concisely (grouped, with references). **Use AskUserQuestion** to approve all, pick
which groups/items to apply, or skip. Capture the approved set. Do not skip this gate unless
`--apply-all` was passed.

### Phase 3 — Apply
Dispatch `accessibility` again in **apply mode** with the exact approved list. It implements fixes
with native ARIA + the existing helpers (`announceToScreenReader`, `updateAriaPressed`), adds any new
strings to the `labels` group, and stays within the architecture (engine = no DOM; manager contract;
public API unchanged; SSR-safe; CRLF; zero new deps).

### Phase 4 — Verify & report
- Offer to run focused checks: relevant Jest specs (`npx jest --testPathPattern=...`) and/or
  `npm run eslint` in `app/`. Report real output; defer the full suite to the user's batched run.
- Summarize what changed, grouped by the five areas, with the file list.
- Give the manual checklist: keyboard-only walkthrough (Tab/Shift+Tab/Arrows/Esc/Enter/Space), an
  NVDA/VoiceOver pass on open→select→confirm, and focus returning to the input on close.
- Surface any CSS-contrast item for `styling-themes` and any structural/logic item for
  `core-architect` / `clock-engine-dev` / `plugin-dev`.

## Guardrails
- `app/src` only; never edit `docs-app/` or `dist/`.
- Don't change the public API or `getValue()` shape; visible/AT text goes through `labels`.
- Keep engine pure (no DOM), manager `(core, emitter)`+`destroy()` contract, SSR-safety, CRLF, and
  the zero-dependency promise intact.
- This skill audits/fixes; git and npm publish stay with the user.
