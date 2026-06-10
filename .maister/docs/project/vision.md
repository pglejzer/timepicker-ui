# Project Vision

## Overview

`timepicker-ui` is a zero-dependency, framework-agnostic, SSR-safe time picker library that gives any web project a polished time-selection UI — analog clock, scroll wheel, or compact-wheel — without pulling in a UI framework or runtime dependencies.

## Current State

- **Age**: ~5.5 years (first commit 2020-10-27)
- **Status**: Active development — currently on branch `feature/4.4.0` (released line: v4.3.0)
- **Maturity**: Mature & maintained — 284 commits, published to npm as `timepicker-ui`
- **Users**: Web developers across React, Vue, Angular, Svelte, and vanilla JS projects
- **Tech Stack**: TypeScript 5.8 (strict), SCSS (10 themes), built with tsup + rollup, tested with Jest + jsdom
- **Distribution**: ESM + CJS bundles, standalone CSS themes, tree-shakeable optional plugins (range, timezone, wheel)

## Purpose

Most time pickers force a trade-off: either adopt a heavy component framework, or hand-roll fragile clock/wheel interaction logic. `timepicker-ui` exists to remove that trade-off — a single, dependency-free library that:

- Works identically in any framework or none at all (framework-agnostic DOM API).
- Stays safe in server-rendered environments (no bare `window`/`document` at module load).
- Keeps bundles lean by tree-shaking out plugins and themes you don't import.
- Ships multiple interaction modes (analog clock, scroll wheel, compact wheel) and 10 built-in themes out of the box.

## Goals (Next 6-12 Months)

- **Ship v4.4.0** — the current in-flight release line on `feature/4.4.0`.
- **Strengthen contributor onboarding** — clear architecture docs and standards so the composition pattern (TimepickerUI / CoreState / Managers / Lifecycle) and the plugin/manager contracts are easy to extend consistently.
- **Maintain internal consistency** — codify conventions so new managers and plugins follow the same contract, event-flow, and option-grouping patterns.
- **Reduce technical debt** — consolidate time-math duplication across the clock engine layer, trim CoreState boilerplate, and close the E2E testing gap.

## Evolution

The project began as a focused analog time picker and grew, through the v4.0.0 breaking change, into a grouped-options, plugin-driven architecture. The internal design moved to a composition pattern with an event-driven manager layer and a registry-based plugin system, enabling optional features (range, timezone, wheel) to stay tree-shakeable. The direction continues toward a clean, well-documented core that outside contributors can extend without learning the whole codebase first.

---
*Based on codebase analysis performed 2026-06-08*
