# Documentation Index

**IMPORTANT**: Read this file at the beginning of any development task to understand available documentation and standards.

## Quick Reference

### Project Documentation
Project-level documentation covering vision, goals, architecture, and technology choices.

### Technical Standards
Coding standards, conventions, and best practices organized by domain.

---

## Project Documentation

Located in `.maister/docs/project/`

#### Vision (`project/vision.md`)
Project overview as a zero-dependency, framework-agnostic, SSR-safe time picker; current state (maturity, users, distribution), purpose and the trade-off it removes, goals for the next 6-12 months (ship v4.4.0, contributor onboarding, internal consistency, tech-debt reduction), and the project's evolution toward a documented, extensible core.

#### Roadmap (`project/roadmap.md`)
Current state and key features (three UI modes, plugins, themes, public API), planned enhancements by priority (ship v4.4.0, contributor docs, plugin authoring guide, integration examples), technical-debt items (time-math duplication, CoreState boilerplate, E2E gap, audit follow-up), and future considerations.

#### Tech Stack (`project/tech-stack.md`)
Technology choices and rationale: TypeScript 5.8 (strict), SCSS (core + 10 themes), JavaScript build config; framework-agnostic frontend with no backend/database; Jest 30 + ts-jest + jsdom testing; and the tsup + rollup + webpack build tooling.

#### Architecture (`project/architecture.md`)
System architecture: composition pattern (TimepickerUI / CoreState / Managers / Lifecycle), event-driven manager layer with the shared-state + EventEmitter coupling mechanism, the eight built-in managers, the layered clock subsystem (engine/controller/renderer/handlers), and the registry-based plugin system.

---

## Technical Standards

### Global Standards

Located in `.maister/docs/standards/global/`

#### Build Pipeline (`standards/global/build-pipeline.md`)
Three-Tool Pipeline (tsup / rollup / webpack), Tree-Shakeable Multi-Entry Bundle, and Standardized Script Naming.

#### Coding Style (`standards/global/coding-style.md`)
Naming consistency, automatic formatting, descriptive names, focused functions, uniform indentation, no dead code, no backward compatibility unless required, and DRY (Don't Repeat Yourself).

#### Commenting (`standards/global/commenting.md`)
Let code speak for itself, comment sparingly, and no change-history comments in code.

#### Conventions (`standards/global/conventions.md`)
Predictable structure, up-to-date documentation, clean version control, environment variables, minimal dependencies, consistent reviews, testing standards, feature flags, changelog updates, and building only what's needed.

#### Dependencies (`standards/global/dependencies.md`)
Zero Runtime Dependencies.

#### Error Handling (`standards/global/error-handling.md`)
Clear user messages, fail fast, typed exceptions, centralized handling, graceful degradation, retry with backoff, and resource cleanup.

#### Formatting (`standards/global/formatting.md`)
CRLF Line Endings (Windows), Single Quotes / Semicolons / Trailing Commas, Print Width 110 with Prettier as Sole Formatter, and Indentation & File Hygiene.

#### Git Workflow (`standards/global/git-workflow.md`)
Git Is the User's Responsibility, Batch Execution, and Pull Request Process.

#### Linting (`standards/global/linting.md`)
ESLint Flat Config + typescript-eslint Recommended, No Nested Ternaries, `any` Permitted But Prefer Types, Unused Variables Are Errors (Ignore Rest Siblings), and Pre-Commit Linting.

#### Minimal Implementation (`standards/global/minimal-implementation.md`)
Build what you need, clear purpose, delete exploration artifacts, no future stubs, no speculative abstractions, review before commit, and treating unused code as debt.

#### TypeScript (`standards/global/typescript.md`)
Strict Mode, Modules & Resolution, and Compile Targets.

#### Validation (`standards/global/validation.md`)
Server-side always, client-side for feedback, validate early, specific errors, allowlists over blocklists, type and format checks, input sanitization, business rules, and consistent enforcement.

### Frontend Standards

Located in `.maister/docs/standards/frontend/`

#### Accessibility (`standards/frontend/accessibility.md`)
Semantic HTML, keyboard navigation, color contrast, alt text and labels, screen reader testing, ARIA when needed, heading structure, and focus management.

#### Architecture (`standards/frontend/architecture.md`)
Composition Pattern (No Business Logic in TimepickerUI), Manager Contract, Communicate Only via CoreState and the Event Bus, User Callbacks Go Through the Callback Bridge, Public API Stability, Grouped Options (v4) + mergeOptions, Plugins Stay Tree-Shakeable, and Default Export per Manager / Named Exports Elsewhere.

#### Clock Subsystem (`standards/frontend/clock-subsystem.md`)
Keep Clock Layers Clean (engine = pure math / controller / renderer / handlers).

#### Components (`standards/frontend/components.md`)
Single responsibility, reusability, composability, clear interfaces, encapsulation, consistent naming, local state, minimal props, and documentation.

#### Conventions (`standards/frontend/conventions.md`)
Centralized Timing Constants, File Naming (PascalCase Classes / camelCase Utilities), Relative Imports in src (No `@/` Alias), and Synchronous Guard-Based Code.

#### CSS (`standards/frontend/css.md`)
Consistent Methodology, Work With the Framework, Design Tokens, Minimize Custom CSS, Production Optimization, and `tp-ui-` Class Prefix Is a Contract.

#### Responsive Design (`standards/frontend/responsive.md`)
Mobile-first approach, standard breakpoints, fluid layouts, relative units, cross-device testing, touch-friendly targets, mobile performance, readable typography, and content priority.

#### SSR Safety (`standards/frontend/ssr-safety.md`)
No Top-Level DOM Access.

### Testing Standards

Located in `.maister/docs/standards/testing/`

#### Test Writing (`standards/testing/test-writing.md`)
Test Behavior, Clear Names, Mock External Dependencies, Fast Execution, Risk-Based Testing, Balance Coverage and Velocity, Critical Path Focus, Appropriate Depth, Jest + ts-jest on jsdom, Tests Mirror the Source Tree, Test Through the Public Surface, and Coverage Scope.

### Backend Standards

*Not initialized for this project. If you need backend standards, you can:*
- *Add them manually using the docs-manager skill*
- *Run `/maister:standards-discover --scope=backend` to auto-discover them from the codebase*

---

## How to Use This Documentation

1. **Start Here**: Always read this INDEX.md first to understand what documentation exists
2. **Project Context**: Read relevant project documentation before starting work
3. **Standards**: Reference appropriate standards when writing code
4. **Keep Updated**: Update documentation when making significant changes
5. **Customize**: Adapt all documentation to your project's specific needs

## Updating Documentation

- Project documentation should be updated when goals, tech stack, or architecture changes
- Technical standards should be updated when team conventions evolve
- Always update INDEX.md when adding, removing, or significantly changing documentation
