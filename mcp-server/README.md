# timepicker-ui MCP server

A Model Context Protocol server (stdio, TypeScript) for `timepicker-ui`. It exposes tools,
resources and prompts so an MCP client (Claude Code, Claude Desktop, etc.) can answer questions
about options, events and themes, generate snippets, author custom themes, and migrate v3 code.
All data is extracted from the library source.

## Tools

| Tool | Description |
|------|-------------|
| `list_themes` | Built-in themes and their CSS import paths. |
| `list_modes` | UI modes (`clock`, `wheel`, `compact-wheel`) and the plugin each needs. |
| `list_plugins` | Optional plugins (range, timezone, wheel) with import paths. |
| `list_events` | Every EventEmitter event with its payload fields. |
| `list_api` | Public instance and static API, plus the `getValue`/`setValue` contract. |
| `list_css_classes` | The `tp-ui-` class names rendered by the templates. |
| `get_options` | Grouped options with type, default and description. Optional `group` filter. |
| `explain_option` | Full detail for one option (`group` + `name`). |
| `get_theme` | The `--tp-` variables a built-in theme overrides. |
| `framework_recipe` | Integration recipe and SSR notes for vanilla, react, next, vue, angular, svelte. |
| `migration_guide` | `v3->v4` field mapping, or `v4.3->v4.4` additions. |
| `generate_snippet` | Vanilla JS or React setup (CSS imports and plugin registration). |
| `generate_custom_theme` | A `[data-theme]` CSS block from `overrides`, or a full scaffold. |
| `validate_time` | Checks `HH:MM` or `h:MM AM/PM` against a 12h or 24h clock. |
| `validate_disabled_time` | Checks a `clock.disabledTime` config (hours, minutes, interval strings). |

## Resources

| URI | Description |
|-----|-------------|
| `timepicker-ui://reference` | Grouped-options summary. |
| `timepicker-ui://css-variables` | Every `--tp-` variable and its default. |
| `timepicker-ui://custom-theme-guide` | How to author a custom theme. |
| `timepicker-ui://troubleshooting` | Common symptoms, causes and fixes. |

## Prompts

| Prompt | Argument | Purpose |
|--------|----------|---------|
| `integrate` | `framework` | Drive a framework integration. |
| `build-custom-theme` | `description` | Turn a palette into a theme. |
| `migrate-v3-to-v4` | `code` | Convert v3 code to v4 grouped options. |

## Build and test

```bash
cd mcp-server
npm install
npm run build      # generate data, compile, copy generated JSON into build/
npm test           # spawn the server and assert tools/resources/prompts respond
npm run inspect    # open the MCP Inspector against the built server
```

## How the data stays accurate

`npm run build` runs `scripts/generate.mjs`, which reads the library source in the sibling
`app/` directory and writes `src/generated/*.json`: grouped options and event payload shapes
from `options.d.ts` and `types.d.ts`, the EventEmitter map, the theme stylesheets and
`variables.scss`, and the `tp-ui-` template classes. The generated JSON is committed, so the
published server runs without the app source. Re-run `npm run build` after changing the library
to refresh it.

## Installing in Claude Code

The server runs from anywhere once built. `--scope user` registers it for every project; without
it the registration is project-local. No API keys or env vars are needed. Verify with
`claude mcp list` (expect `timepicker-ui  ✓ Connected`).

**Absolute path**, no install:

```bash
claude mcp add --scope user timepicker-ui -- node /absolute/path/to/timepicker-ui/mcp-server/build/index.js
```

**Global bin** via `npm link` (or `npm install -g .`), no path:

```bash
npm link
claude mcp add --scope user timepicker-ui -- timepicker-ui-mcp
```

**From npm** once published, no clone and no path:

```bash
claude mcp add --scope user timepicker-ui -- npx -y timepicker-ui-mcp
```

**Project `.mcp.json`** for contributors who clone this repo (they run `npm install && npm run build`
in `mcp-server/` once):

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

## Installing in Claude Desktop

Edit `claude_desktop_config.json` (on Windows it lives at `%APPDATA%\Claude\`):

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

Restart Claude Desktop after editing.
