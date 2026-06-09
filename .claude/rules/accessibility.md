---
paths:
  - "app/src/utils/template/**/*.ts"
  - "app/src/utils/accessibility/**/*.ts"
  - "app/src/managers/**/*.ts"
---

# Accessibility rules (library)

Applies when editing templates / managers / a11y utils. Standard: **WCAG 2.2 AA + WAI-ARIA APG**.
Pairs with `.claude/rules/architecture.md`.

- **Keyboard:** every actionable control works without a mouse and with **Enter and Space**
  (`role="button"` divs use `bindActivate` from `utils/accessibility`). Spinbutton inputs handle
  Arrow + Home/End + PageUp/PageDown. The modal traps focus and restores it on close; Escape
  closes only when open. Follow the APG dialog / listbox / combobox / spinbutton / tablist patterns.
- **ARIA:** modal is `role="dialog"` + `aria-modal` with an accessible name. Every control has an
  accessible name (icon-only buttons too). Keep state in sync: `aria-pressed` only on real toggles
  (AM/PM, view switch - NOT OK/Cancel/Clear), `aria-selected`, `aria-disabled`,
  `aria-valuenow/min/max/text` on spinbuttons, `aria-activedescendant` for the timezone listbox.
- **Screen reader:** announce meaningful transitions via `announceToScreenReader` (the
  `.timepicker-announcer` live region); validation errors use `role="alert"`.
- **Text is localizable:** all visible/AT strings come from the `labels` group (with English
  defaults in `mergeOptions`) - never hardcode AT text.
- **Motion:** gate JS-driven motion on `prefersReducedMotion()`.
- Don't convey state by color alone (markup/role part here; CSS contrast + focus ring is
  `styling-themes`). Keep engine pure (no DOM), the manager contract, SSR-safety, and the public
  API / `getValue()` shape unchanged.
