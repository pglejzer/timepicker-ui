---
applyTo: "app/src/styles/themes/**"
description: "Use when: theme editing, color changes, contrast fixes, Material Design tokens, M2 M3 palette, surface roles, color system, theme variables. Enforces Material Design compatibility for official themes."
---

# Material Design Theme Constraints

## Protected Themes

The following themes are based on **official Material Design color systems** and their base palettes must not be modified:

| Theme      | File                             | Design System                     |
| ---------- | -------------------------------- | --------------------------------- |
| `basic`    | `theme-basic.scss` (base styles) | Material Design 3 baseline        |
| `m2`       | `theme-m2.scss`                  | Material Design 2                 |
| `m3-green` | `theme-m3-green.scss`            | Material Design 3 (green primary) |

## Rules

### MUST NOT

- Modify Material color palettes (`--tp-primary`, `--tp-secondary`, `--tp-tertiary` base values)
- Suggest arbitrary color replacements for Material tokens
- Override Material surface role hierarchy
- Change Material elevation/shadow tokens outside the spec

### MAY

- Report contrast issues found during accessibility audits
- Adjust text color tokens (`--tp-on-primary`, `--tp-on-surface`, etc.) for contrast
- Adjust opacity values on overlay layers
- Adjust surface overlay tints
- Use proper Material surface roles (`surface`, `surface-variant`, `surface-container`)

## Contrast Issue Resolution

When a contrast problem is found in a Material theme:

1. **Verify** whether the palette follows official Material tokens — cross-check against the Material Design 3 color system
2. **If it follows the spec** — do NOT change the base color. Instead:
   - Adjust the `--tp-on-*` (foreground/text) token
   - Adjust `--tp-*-opacity` overlay values
   - Use a different Material surface role (`surface-container-high` instead of `surface`)
   - Add a tint overlay layer
3. **If it deviates from the spec** — note the deviation and suggest realigning with official tokens

Material tokens from the official spec are the **source of truth**.

## Non-Material Themes

These themes are NOT bound by Material constraints and may be freely modified:

`crane`, `crane-straight`, `dark`, `glassmorphic`, `pastel`, `ai`, `cyberpunk`
