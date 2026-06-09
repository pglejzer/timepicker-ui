## CSS

### Consistent Methodology
Stick to the project's chosen approach (Tailwind, BEM, CSS modules, etc.) across the entire codebase.

### Work With the Framework
Use framework patterns as intended rather than fighting them with excessive overrides.

### Design Tokens
Establish and document consistent values for colors, spacing, and typography.

### Minimize Custom CSS
Prefer framework utilities to reduce custom styling maintenance.

### Production Optimization
Use CSS purging or tree-shaking to remove unused styles.

### `tp-ui-` Class Prefix Is a Contract
All CSS class names use the `tp-ui-` prefix and form a contract with the TypeScript and HTML templates — do not rename a class without coordinating across SCSS, TS, and templates; add new classes under the same prefix. Core styles go in `main.scss`; theme-specific looks live in theme partials (never leak theme color into `main`). Drive looks from `variables.scss` and `_mixins.scss` rather than hardcoding values. Selectors are queried through `CoreState` getters / constant lists, not scattered string literals. Sources: code, docs.
