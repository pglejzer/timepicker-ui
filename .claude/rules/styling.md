---
paths:
  - "app/src/styles/**/*.scss"
---

# Styling & theme rules

Applies when working in `app/src/styles/`. Pairs with `.claude/rules/architecture.md`.

- **`tp-ui-` class prefix is a contract** with the TypeScript and templates. Don't rename a
  class without coordinating (`core-architect` / `plugin-dev`); add new classes under the same
  prefix. Cross-check selectors against the live templates - dead/renamed selectors silently
  break styling (e.g. focus rings that target classes no longer rendered).
- **Layering:** core rules in `main.scss`; theme-specific looks in the matching theme partial.
  Never leak theme color into `main`. Drive look from `variables.scss` / `_mixins.scss`; reuse
  existing variables/mixins instead of hardcoding. 10 themes: basic, crane, crane-straight, m2,
  m3-green, dark, glassmorphic, pastel, ai, cyberpunk; a new theme registers in the rollup CSS job.
- **Never break a theme's visual identity / Material Design 3.** Do NOT use `font-weight: 700`
  or `text-decoration: line-through` as state cues - that breaks the look and is not MD3. MD3
  conveys selected/active with **state layers / tonal containers** (fill) and disabled with
  **reduced opacity / dimmed color**. For a WCAG 1.4.1 non-color cue, first check if a
  fill/container/opacity cue already exists (then add nothing); otherwise pick the lightest
  MD3-consistent affordance, never exceed weight 500, and flag real WCAG-vs-design tradeoffs.
- **Visible focus** (`:focus-visible`) on every focusable control, ring contrast >= 3:1 on all
  themes; never `outline:none` without a replacement.
- CSS is mocked in Jest, so visual regressions are invisible to tests - describe what to eyeball
  (which mode, which theme, mobile vs desktop). `build:rollup` can verify SCSS compiles.
