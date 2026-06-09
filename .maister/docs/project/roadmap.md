# Development Roadmap

This roadmap outlines the planned evolution of `timepicker-ui`. It is derived from the current codebase state, recent git history, and the documented refactor backlog.

## Current State

- **Version**: 4.3.0 (active line: `feature/4.4.0`)
- **Key Features**:
  - Three UI modes — analog clock, scroll wheel, compact-wheel
  - 12h/24h support, increments, disabled-time, current-time, smooth hour snap
  - Optional tree-shakeable plugins: **range** (start/end tabs), **timezone** (dropdown + keyboard nav), **wheel**
  - 10 standalone CSS themes (`tp-ui-` prefixed)
  - Zero-dependency, framework-agnostic, SSR-safe
  - Public API: `create`, `open`, `close`, `destroy`, `getValue`, `setValue`, `update`, event subscriptions, static instance registry
- **Recent Updates** (from git history): merged v4.3.0, removed SpeedInsights, documentation/README updates, in-flight v4.4.0 work touching plugins (wheel momentum, range), clock engine (Hour/Minute), and core (Lifecycle, SetValue, CoreState).

## Planned Enhancements (Next 3-6 Months)

### High Priority

- [ ] **Ship v4.4.0** — finalize and release the in-flight `feature/4.4.0` branch (wheel momentum, range, lifecycle/setValue refactors).
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
