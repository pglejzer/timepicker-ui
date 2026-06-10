---
paths:
  - "app/src/plugins/**/*.ts"
  - "app/src/managers/plugins/**/*.ts"
  - "app/src/core/PluginRegistry.ts"
---

# Plugin rules

Applies to the range / timezone / wheel plugins + the registry. Pairs with
`.claude/rules/architecture.md`.

- **Tree-shaking is sacred.** Core code must NEVER statically import a plugin, and cross-plugin
  imports are forbidden. A user who doesn't import a plugin must not pay for its code. Each
  plugin has its own build entry (`plugins/range`, `plugins/timezone`, `plugins/wheel`); a new
  public entry must be added to tsup entries, the `.d.ts` job, and `package.json` `exports` in
  sync, and `sideEffects` kept accurate.
- **The `Plugin` contract:** a plain object with `name`, `factory(core, emitter)`, optional
  `optionsExtender` / `templateProvider` / `clearHandler`. Register once at startup; access via
  `managers.getPlugin<T>(name)`. Plugin managers follow the manager contract: `(core, emitter)`
  ctor + `destroy()`.
- **Communicate via the emitter** using the plugin's namespaced events (`range:*`, `timezone:*`,
  `wheel:*`) and shared `CoreState` - never direct manager-to-manager calls or cross-plugin refs.
  Emit `error` when a required plugin is missing or validation fails.
- SSR-safe, zero new runtime deps, CRLF. Visible/AT text goes through the `labels` group, not
  hardcoded. Keyboard + ARIA (tablist for range, listbox/combobox for timezone, spinbutton/list
  for wheel) follow the WAI-ARIA APG.
