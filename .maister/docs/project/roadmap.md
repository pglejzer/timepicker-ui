# Development Roadmap

This roadmap outlines the planned evolution of `timepicker-ui`. It is derived from the current codebase state, recent git history, and the documented refactor backlog.

## Current State

- **Version**: 4.4.0 published; 4.5.0 prepared, not released yet
- **Key Features**:
  - Three UI modes — analog clock, scroll wheel, compact-wheel
  - 12h/24h support, optional seconds, increments, disabled-time, current-time, smooth hour snap
  - Optional tree-shakeable plugins: **range** (start/end tabs), **timezone** (dropdown + keyboard nav), **wheel**
  - 12 standalone CSS themes (`tp-ui-` prefixed)
  - Zero-dependency, framework-agnostic, SSR-safe
  - Public API: `create`, `open`, `close`, `destroy`, `getValue`, `setValue`, `update`, event subscriptions, static instance registry
- **Recent Updates**: v4.4.0 released 2026-06-10 (blueprint themes, localizable accessibility labels, Home/End/PageUp/PageDown). v4.5.0 adds optional seconds (`clock.showSeconds`) and the bug fixes found during browser verification.

## Planned Enhancements (Next 3-6 Months)

### High Priority

- [ ] **Ship v4.5.0** — optional seconds and the bug-fix batch; the changelog is dated 2026-10-12; publishing is left.
- [ ] **Contributor-ready documentation** — architecture guide + coding standards so the composition pattern, manager contract, and plugin system are approachable to new contributors.

### Medium Priority

- [ ] **Plugin development guide** — document the `Plugin` interface, registry registration, and tree-shaking constraints for authors of new plugins.
- [ ] **Expanded integration examples** — quick-starts for Svelte, Astro, and other environments beyond the existing React wrapper.

### Technical Debt

- [ ] **Consolidate time-math duplication** — shared logic across `HourEngine` / `MinuteEngine` in the clock engine layer.
- [ ] **Reduce CoreState boilerplate** — repetitive getters/setters in the state bag.
- [ ] **Close the E2E testing gap** — `jest.config` references an E2E path with no suites present; add real end-to-end UI coverage.
- [ ] **Audit follow-up** — address remaining items from the 2026-05-26 duplication/refactor punch list (e.g. THEME_CLASSES destroy behavior).

## Future Considerations

- **Feature Ideas**: richer mobile/touch optimizations for wheel mode; advanced middleware/hook extension points.
- **Scalability**: formalize performance benchmarks for clock rendering and large increment sets.
- **Maintenance**: reduce single-maintainer bus-factor risk through clearer contribution onboarding.

---
**Effort Scale**: `S`: 2-3 days | `M`: 1 week | `L`: 2+ weeks
*Assessment based on project analysis performed 2026-06-08*
