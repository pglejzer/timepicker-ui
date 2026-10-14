# timepicker-ui MCP server

An MCP server for `timepicker-ui`. Connect it to Claude Code, Claude Desktop or another MCP client and the model can look up options, events and themes, generate setup snippets and custom themes, and migrate v3 code. Everything it returns comes from the library source, not from the model's memory.

It runs over stdio and needs Node 18 or newer.

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
| `migration_guide` | `v3->v4` field mapping, or the `v4.3->v4.4` / `v4.4->v4.5` changes. |
| `generate_snippet` | Vanilla JS or React setup (CSS imports and plugin registration). |
| `generate_custom_theme` | A `[data-theme]` CSS block from `overrides`, or a full scaffold. |
| `validate_time` | Checks `HH:MM`, `HH:MM:SS`, `h:MM AM/PM` or `h:MM:SS AM/PM` against a 12h or 24h clock. |
| `validate_disabled_time` | Checks a `clock.disabledTime` config (hours, minutes, seconds, range strings). |

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
| `integrate` | `framework` | Walk through a framework integration. |
| `build-custom-theme` | `description` | Turn a palette into a theme. |
| `migrate-v3-to-v4` | `code` | Convert v3 code to v4 grouped options. |

## Build and test

```bash
cd mcp-server
npm install
npm run build      # generate data, compile, copy generated JSON into build/
npm test           # start the server and check that tools, resources and prompts respond
npm run inspect    # open the MCP Inspector against the built server
```

## Where the data comes from

`npm run build` first runs `scripts/generate.mjs`. It reads the library source in `../app` and writes `src/generated/*.json`: options and event payloads from `options.d.ts` and `types.d.ts`, the EventEmitter map, the theme stylesheets and `variables.scss`, and the `tp-ui-` classes from the templates.

The generated JSON is committed, so the server works without the `app/` source next to it. After changing the library, run `npm run build` again to refresh it.

## Adding it to Claude Code

Build it first. No API keys or env vars are needed. `--scope user` makes it available in every project; leave it out to register it for the current project only. Check it with `claude mcp list`, which should show `timepicker-ui  ✓ Connected`.

Point at the built file directly:

```bash
claude mcp add --scope user timepicker-ui -- node /absolute/path/to/timepicker-ui/mcp-server/build/index.js
```

Or link the bin once with `npm link` (or `npm install -g .`) and skip the path:

```bash
npm link
claude mcp add --scope user timepicker-ui -- timepicker-ui-mcp
```

The package isn't on npm yet. Once it is, this will work without cloning anything:

```bash
claude mcp add --scope user timepicker-ui -- npx -y timepicker-ui-mcp
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
