# timepicker-ui MCP server

An MCP server for `timepicker-ui`. Connect it to Claude Code, Claude Desktop or another MCP client and the model can look up options, events, CSS variables and themes, search the reference, generate setup snippets and custom themes, and get migration steps. Options, events, payloads, CSS variables, classes, troubleshooting and the 5.0 rename tables are generated from the library source and the docs site. Themes, modes, plugins, the method list, framework recipes and migration notes are written by hand in `src/data.ts` and `src/content.ts`.

Every tool only reads this reference data and is marked `readOnlyHint`. Deprecated options and events are flagged, and left out of lists unless a tool is asked for them. Results link to the docs at https://timepicker-ui.vercel.app.

It runs over stdio and needs Node 20 or newer. It is built on the MCP TypeScript SDK v2 and serves clients on the 2025 protocol (`initialize`) and on the 2026-07-28 revision.

## Tools

| Tool                     | Description                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `search_reference`       | Keyword search across options, nested fields, events, CSS variables, classes, methods and fixes.    |
| `get_options`            | Grouped options with type, default, description and nested fields. `group`, `includeDeprecated`.  |
| `explain_option`         | One option (`group` + `name`, dotted for nested fields such as `disabledTime.ranges`).            |
| `list_events`            | Events with payload fields. `includeInternal`, `includeDeprecated`.                                |
| `list_api`               | Instance and static methods with deprecations, plus the `getValue`/`setValue` contract.            |
| `list_css_variables`     | `--tp-` variables with group and default. `group`, `includeUnread`.                               |
| `list_css_classes`       | `tp-ui-` class names and state modifiers with example selectors.                                   |
| `list_themes`            | Built-in themes and their CSS import paths.                                                         |
| `get_theme`              | The `--tp-` variables a built-in theme sets.                                                       |
| `list_modes`             | UI modes (`clock`, `wheel`, `compact-wheel`) and the plugin each needs.                             |
| `list_plugins`           | Optional plugins (range, timezone, wheel) with import paths and registration.                       |
| `framework_recipe`       | Recipe and SSR notes for vanilla, react, react-wrapper (`timepicker-ui-react`), next, vue, angular, svelte. |
| `migration_guide`        | `v3->v4`, `v4.3->v4.4`, `v4.4->v4.5` (with every renamed option) or `v4.5->v5` (draft).           |
| `generate_snippet`       | Vanilla JS or React setup with theme, mode, clock type, seconds and plugins.                        |
| `generate_custom_theme`  | CSS for a theme applied with `ui.cssClass`, from `overrides` or as a scaffold.                     |
| `validate_time`          | Checks `HH:MM`, `HH:MM:SS`, `h:MM AM/PM` or `h:MM:SS AM/PM` against a 12h or 24h clock.             |
| `validate_disabled_time` | Checks a `clock.disabledTime` config (hours, minutes, seconds, range strings).                      |

Wrong arguments, such as an unknown option name, come back with `isError: true` and a hint, so the model can correct the call.

## Resources

| URI                                  | Description                                              |
| ------------------------------------ | -------------------------------------------------------- |
| `timepicker-ui://reference`          | Grouped-options summary.                                 |
| `timepicker-ui://css-variables`      | Every `--tp-` variable with group, default and notes.    |
| `timepicker-ui://custom-theme-guide` | How to style the picker with `ui.cssClass`.              |
| `timepicker-ui://troubleshooting`    | The docs troubleshooting entries with fixes and code.    |

## Prompts

| Prompt               | Argument      | Purpose                                                  |
| -------------------- | ------------- | -------------------------------------------------------- |
| `integrate`          | `framework`   | Walk through a framework integration (with completion).  |
| `build-custom-theme` | `description` | Turn a palette into a theme.                             |
| `migrate-v3-to-v4`   | `code`        | Convert v3 code to v4 grouped options.                   |
| `prepare-for-v5`     | `code`        | Replace deprecated 4.x API with the names 5.0 keeps.     |

## Build and test

```bash
cd mcp-server
npm install
npm run build      # generate data, compile, copy generated JSON into build/
npm test           # start the server and check that tools, resources and prompts respond
npm run inspect    # open the MCP Inspector against the built server
```

## Where the data comes from

`npm run build` first runs `scripts/generate.mjs`, which writes `src/generated/*.json`:

- From the library source in `../app` and the root `package.json`: options with defaults, examples, nested fields and `@deprecated` notes (`options.d.ts`), events and payloads (`EventEmitter.ts`, `types.d.ts`), the variables each built-in theme sets, and the library version.
- From the docs site in `../docs-app`: CSS variables and classes (`lib/generated/css-reference.json`, built from the published package CSS), the troubleshooting entries, and the renamed and removed tables of the 5.0 migration guide.

The generated JSON is committed, so the server works without `app/` and `docs-app/` next to it. A source that is missing keeps its existing JSON. After changing the library or those docs pages, run `npm run build` again. When the CSS changes, regenerate the docs CSS reference first.

## Adding it to Claude Code

No API keys or env vars are needed. `--scope user` makes it available in every project. Leave it out to register it for the current project only. Check it with `claude mcp list`, which should show `timepicker-ui  ✓ Connected`.

```bash
claude mcp add --scope user timepicker-ui -- npx -y timepicker-ui-mcp
```

On native Windows, wrap `npx` in `cmd /c`:

```bash
claude mcp add --scope user timepicker-ui -- cmd /c npx -y timepicker-ui-mcp
```

To run a local build instead, build it first and point at the built file:

```bash
claude mcp add --scope user timepicker-ui -- node /absolute/path/to/timepicker-ui/mcp-server/build/index.js
```

If you work in this repo, you can also add a project `.mcp.json` (after `npm install && npm run build` in `mcp-server/`):

```json
{
  "mcpServers": {
    "timepicker-ui": {
      "command": "node",
      "args": ["mcp-server/build/index.js"]
    }
  }
}
```

## Adding it to Claude Desktop

Edit `claude_desktop_config.json`. It's in `%APPDATA%\Claude\` on Windows and `~/Library/Application Support/Claude/` on macOS.

```json
{
  "mcpServers": {
    "timepicker-ui": {
      "command": "node",
      "args": ["/absolute/path/to/timepicker-ui/mcp-server/build/index.js"]
    }
  }
}
```

Restart Claude Desktop after saving.
