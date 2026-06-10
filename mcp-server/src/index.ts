#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  API_METHODS,
  MODES,
  MODE_NAMES,
  PACKAGE_VERSION,
  PLUGINS,
  PLUGIN_NAMES,
  THEMES,
  THEME_NAMES,
} from './data.js';
import {
  CSS_CLASSES,
  CSS_VARS,
  EVENTS,
  OPTION_GROUPS,
  OPTION_GROUP_NAMES,
  THEME_VARS,
} from './generated.js';
import {
  FRAMEWORK_NAMES,
  FRAMEWORK_RECIPES,
  IO_CONTRACT,
  MIGRATION_V3_TO_V4,
  MIGRATION_V43_TO_V44,
  TROUBLESHOOTING,
} from './content.js';
import { buildSnippet, modeRequiresWheel } from './snippet.js';
import { buildCustomTheme } from './theme.js';
import { parseTime, validateDisabledTime } from './validate.js';

const server = new McpServer({
  name: 'timepicker-ui',
  version: '1.0.0',
});

function text(value: unknown) {
  const body = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return { content: [{ type: 'text' as const, text: body }] };
}

server.registerTool(
  'list_themes',
  {
    title: 'List timepicker-ui themes',
    description: 'Lists every built-in theme with its CSS import path.',
    inputSchema: {},
  },
  async () => text(THEMES),
);

server.registerTool(
  'list_modes',
  {
    title: 'List timepicker-ui UI modes',
    description: 'Lists the UI modes (clock, wheel, compact-wheel) and which plugin each needs.',
    inputSchema: {},
  },
  async () => text(MODES),
);

server.registerTool(
  'list_plugins',
  {
    title: 'List timepicker-ui plugins',
    description: 'Lists the optional plugins (range, timezone, wheel) with import paths and enable options.',
    inputSchema: {},
  },
  async () => text(PLUGINS),
);

server.registerTool(
  'list_events',
  {
    title: 'List timepicker-ui events',
    description:
      'Lists every EventEmitter event with its payload type name AND the resolved payload fields, so you know exactly what picker.on(event, handler) receives. Extracted from source.',
    inputSchema: {},
  },
  async () => text(EVENTS),
);

server.registerTool(
  'list_api',
  {
    title: 'List the public API',
    description:
      'Lists the public TimepickerUI instance and static methods with signatures, plus the getValue/setValue I/O contract.',
    inputSchema: {},
  },
  async () => text({ methods: API_METHODS, io: IO_CONTRACT }),
);

server.registerTool(
  'list_css_classes',
  {
    title: 'List tp-ui- CSS classes',
    description:
      'Lists the tp-ui- class names rendered by the templates (the styling contract), for targeting custom CSS beyond CSS variables.',
    inputSchema: {},
  },
  async () => text(CSS_CLASSES),
);

server.registerTool(
  'get_options',
  {
    title: 'Get grouped options',
    description:
      'Returns the full grouped options reference (clock, ui, labels, behavior, callbacks, timezone, range, wheel, clearBehavior) with each option type, default and description, extracted from options.d.ts. Pass a group to narrow it.',
    inputSchema: {
      group: z
        .enum(OPTION_GROUP_NAMES as [string, ...string[]])
        .optional()
        .describe('Limit to a single option group.'),
    },
  },
  async (args) => {
    const group = args.group as string | undefined;
    if (group) return text(OPTION_GROUPS[group] ?? { error: `Unknown group "${group}"` });
    return text(OPTION_GROUPS);
  },
);

server.registerTool(
  'explain_option',
  {
    title: 'Explain a single option',
    description: 'Returns the full detail (type, default, description, example) for one option in a group.',
    inputSchema: {
      group: z.enum(OPTION_GROUP_NAMES as [string, ...string[]]).describe('Option group.'),
      name: z.string().describe('Option name within the group, e.g. "smoothHourSnap".'),
    },
  },
  async (args) => {
    const group = OPTION_GROUPS[args.group as string];
    if (!group) return text({ error: `Unknown group "${args.group}"` });
    const option = group.options.find((o) => o.name === args.name);
    if (!option) {
      return text({
        error: `Unknown option "${args.name}" in "${args.group}"`,
        available: group.options.map((o) => o.name),
      });
    }
    return text({ group: args.group, ...option });
  },
);

server.registerTool(
  'get_theme',
  {
    title: 'Get a built-in theme variable set',
    description:
      'Returns the exact --tp- CSS variables a built-in theme overrides (with their values), so you can derive or tweak a custom theme from it.',
    inputSchema: {
      name: z.enum(Object.keys(THEME_VARS) as [string, ...string[]]).describe('Built-in theme name.'),
    },
  },
  async (args) => text({ theme: args.name, variables: THEME_VARS[args.name as string] ?? [] }),
);

server.registerTool(
  'framework_recipe',
  {
    title: 'Framework integration recipe',
    description:
      'Returns a correct integration recipe (lifecycle + SSR guidance + code) for a given framework: vanilla, react, next, vue, angular, svelte.',
    inputSchema: {
      framework: z.enum(FRAMEWORK_NAMES as unknown as [string, ...string[]]).describe('Target framework.'),
    },
  },
  async (args) => text(FRAMEWORK_RECIPES[args.framework as keyof typeof FRAMEWORK_RECIPES]),
);

server.registerTool(
  'migration_guide',
  {
    title: 'Migration guide',
    description:
      'Returns migration guidance between major versions. "v3->v4" gives the full flat->grouped field mapping; "v4.3->v4.4" lists the non-breaking additions.',
    inputSchema: {
      path: z.enum(['v3->v4', 'v4.3->v4.4']).default('v3->v4').describe('Which migration to return.'),
    },
  },
  async (args) => {
    if (args.path === 'v4.3->v4.4') return text({ path: 'v4.3->v4.4', changes: MIGRATION_V43_TO_V44 });
    return text({ path: 'v3->v4', ...MIGRATION_V3_TO_V4 });
  },
);

server.registerTool(
  'generate_snippet',
  {
    title: 'Generate a timepicker-ui setup snippet',
    description:
      'Generates a ready-to-paste vanilla JS or React snippet wiring up TimepickerUI with the chosen theme, mode, clock type and plugins (CSS imports + plugin registration included). For full framework lifecycle/SSR, use framework_recipe.',
    inputSchema: {
      selector: z.string().default('#time').describe('CSS selector of the target input (vanilla only).'),
      theme: z.enum(THEME_NAMES as [string, ...string[]]).default('basic').describe('Theme name.'),
      mode: z.enum(MODE_NAMES as [string, ...string[]]).default('clock').describe('UI mode.'),
      clockType: z.enum(['12h', '24h']).default('24h').describe('12-hour or 24-hour clock.'),
      plugins: z
        .array(z.enum(PLUGIN_NAMES as [string, ...string[]]))
        .default([])
        .describe('Plugins to import and register.'),
      framework: z.enum(['vanilla', 'react']).default('vanilla').describe('Output flavor.'),
    },
  },
  async (args) => {
    const plugins = new Set(args.plugins as string[]);
    if (modeRequiresWheel(args.mode as string)) plugins.add('wheel');

    const snippet = buildSnippet({
      selector: args.selector as string,
      theme: args.theme as string,
      mode: args.mode as string,
      clockType: args.clockType as '12h' | '24h',
      plugins: [...plugins],
      framework: args.framework as 'vanilla' | 'react',
    });

    return text(snippet);
  },
);

server.registerTool(
  'generate_custom_theme',
  {
    title: 'Generate a custom theme stylesheet',
    description:
      'Produces a [data-theme="<name>"] CSS block for a custom theme. Pass `overrides` (a map of --tp- variables to values) to emit only those, or leave it empty to emit a full editable scaffold. Unknown variable names are flagged.',
    inputSchema: {
      name: z.string().describe("Theme name, e.g. 'ocean'. Used as the data-theme value."),
      overrides: z
        .record(z.string(), z.string())
        .default({})
        .describe("Map of CSS variables to values, e.g. { 'tp-primary': '#0ea5e9' }."),
      onlyCommon: z
        .boolean()
        .default(true)
        .describe('When emitting a full scaffold, include only the variables themes usually override.'),
    },
  },
  async (args) =>
    text(
      buildCustomTheme({
        name: args.name as string,
        overrides: (args.overrides as Record<string, string>) ?? {},
        onlyCommon: args.onlyCommon as boolean,
      }),
    ),
);

server.registerTool(
  'validate_time',
  {
    title: 'Validate a time string',
    description:
      'Validates a time string against a 12h or 24h clock and returns the parsed parts. Accepts "HH:MM" and "h:MM AM/PM".',
    inputSchema: {
      time: z.string().describe('The time string, e.g. "14:30" or "2:30 PM".'),
      clockType: z.enum(['12h', '24h']).default('24h'),
    },
  },
  async (args) => text(parseTime(args.time as string, args.clockType as '12h' | '24h')),
);

server.registerTool(
  'validate_disabled_time',
  {
    title: 'Validate a disabledTime config',
    description:
      'Validates a clock.disabledTime config: hours/minutes lists and interval strings ("10:00 AM - 12:00 PM"). Returns per-issue feedback.',
    inputSchema: {
      hours: z.array(z.union([z.string(), z.number()])).optional().describe('Disabled hours.'),
      minutes: z.array(z.union([z.string(), z.number()])).optional().describe('Disabled minutes.'),
      interval: z
        .union([z.string(), z.array(z.string())])
        .optional()
        .describe('Interval string or array, e.g. "10:00 AM - 12:00 PM".'),
      clockType: z.enum(['12h', '24h']).default('24h'),
    },
  },
  async (args) =>
    text(
      validateDisabledTime(
        {
          hours: args.hours as (string | number)[] | undefined,
          minutes: args.minutes as (string | number)[] | undefined,
          interval: args.interval as string | string[] | undefined,
        },
        args.clockType as '12h' | '24h',
      ),
    ),
);

server.registerResource(
  'timepicker-ui-reference',
  'timepicker-ui://reference',
  {
    title: 'timepicker-ui options reference',
    description: 'Grouped options reference for the current major version.',
    mimeType: 'text/markdown',
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: 'text/markdown',
        text: [
          `# timepicker-ui v${PACKAGE_VERSION} - options reference`,
          '',
          'Options are grouped (v4+). Use the `get_options` / `explain_option` tools for full detail.',
          '',
          ...OPTION_GROUP_NAMES.map((g) => {
            const grp = OPTION_GROUPS[g];
            return `- \`${g}\` (${grp.options.length} options): ${grp.options.map((o) => o.name).join(', ')}`;
          }),
          '',
          `Themes: ${THEME_NAMES.join(', ')}`,
          `Modes: ${MODE_NAMES.join(', ')} (wheel modes need the wheel plugin)`,
          `Plugins: ${PLUGINS.map((p) => p.name).join(', ')} (registered via PluginRegistry.register)`,
          `Events: ${EVENTS.length} (see list_events for payload fields)`,
          '',
          'CSS: always import `timepicker-ui/main.css`, then a `timepicker-ui/theme-<name>.css` for non-basic themes.',
        ].join('\n'),
      },
    ],
  }),
);

server.registerResource(
  'timepicker-ui-css-variables',
  'timepicker-ui://css-variables',
  {
    title: 'timepicker-ui CSS variables',
    description: 'Every --tp- CSS custom property with its default value; flags the ones themes usually override.',
    mimeType: 'text/markdown',
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: 'text/markdown',
        text: [
          '# timepicker-ui CSS variables',
          '',
          `${CSS_VARS.length} variables total. Variables marked **[themed]** are the ones built-in themes override.`,
          '',
          '| Variable | Default | Commonly themed |',
          '| --- | --- | --- |',
          ...CSS_VARS.map((v) => `| \`${v.name}\` | \`${v.value}\` | ${v.commonlyThemed ? '[themed]' : ''} |`),
        ].join('\n'),
      },
    ],
  }),
);

server.registerResource(
  'timepicker-ui-custom-theme-guide',
  'timepicker-ui://custom-theme-guide',
  {
    title: 'How to add a custom theme',
    description: 'Step-by-step guide for authoring a custom timepicker-ui theme.',
    mimeType: 'text/markdown',
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: 'text/markdown',
        text: [
          '# Adding a custom timepicker-ui theme',
          '',
          'A theme is just a `[data-theme="<name>"]` selector that overrides `--tp-` CSS variables.',
          'The picker sets `data-theme` on its modal element, so your overrides are scoped automatically.',
          '',
          '## Steps',
          '',
          "1. Pick a name (e.g. `ocean`). Use `generate_custom_theme` to scaffold the CSS, or `get_theme`",
          '   to copy a built-in theme as a starting point.',
          '2. Override the variables you care about (the `timepicker-ui://css-variables` resource flags the',
          '   ~39 colour variables built-in themes change; structural tokens usually stay default).',
          '3. Import your stylesheet **after** `timepicker-ui/main.css`.',
          "4. Pass the theme name via options: `ui: { theme: 'ocean' as any }` (custom names aren't in the union).",
          '',
          '## Example',
          '',
          '```css',
          "[data-theme='ocean'] {",
          '  --tp-bg: #06283d;',
          '  --tp-surface: #0a3a52;',
          '  --tp-text: #eaf6ff;',
          '  --tp-primary: #2ec4f1;',
          '  --tp-on-primary: #00131f;',
          '}',
          '```',
          '',
          '## Material Design 3 note',
          '',
          'Convey selected/active state with fill (state layers / tonal containers) and disabled with',
          'reduced opacity — not bold weight or strikethrough. Keep a visible focus ring with >= 3:1 contrast.',
        ].join('\n'),
      },
    ],
  }),
);

server.registerResource(
  'timepicker-ui-troubleshooting',
  'timepicker-ui://troubleshooting',
  {
    title: 'timepicker-ui troubleshooting',
    description: 'Common symptoms, their cause, and the fix.',
    mimeType: 'text/markdown',
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: 'text/markdown',
        text: [
          '# timepicker-ui troubleshooting',
          '',
          ...TROUBLESHOOTING.flatMap((t) => [
            `## ${t.symptom}`,
            `- **Cause:** ${t.cause}`,
            `- **Fix:** ${t.fix}`,
            '',
          ]),
        ].join('\n'),
      },
    ],
  }),
);

server.registerPrompt(
  'integrate',
  {
    title: 'Integrate timepicker-ui',
    description: 'Guide integrating timepicker-ui into a given framework with correct lifecycle and SSR handling.',
    argsSchema: {
      framework: z.string().describe('vanilla | react | next | vue | angular | svelte'),
    },
  },
  (args) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: [
            `Integrate timepicker-ui into a ${args.framework} app.`,
            'Call the `framework_recipe` tool with this framework for the correct lifecycle and SSR handling,',
            'use `get_options` for any options I mention, and `list_events` if I need to react to selections.',
            'Always import timepicker-ui/main.css and destroy the instance on unmount.',
          ].join(' '),
        },
      },
    ],
  }),
);

server.registerPrompt(
  'build-custom-theme',
  {
    title: 'Build a custom theme',
    description: 'Guide creating a custom timepicker-ui theme from a description or palette.',
    argsSchema: {
      description: z.string().describe('Describe the look or palette, e.g. "dark ocean blue, teal accent".'),
    },
  },
  (args) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: [
            `Create a custom timepicker-ui theme: ${args.description}.`,
            'Read the `timepicker-ui://css-variables` resource and optionally `get_theme` for a similar built-in,',
            'then call `generate_custom_theme` with concrete --tp- overrides.',
            'Follow Material Design 3 (state via fill/opacity, visible focus ring).',
          ].join(' '),
        },
      },
    ],
  }),
);

server.registerPrompt(
  'migrate-v3-to-v4',
  {
    title: 'Migrate v3 code to v4',
    description: 'Convert v3 flat-options timepicker-ui code to the v4 grouped structure.',
    argsSchema: {
      code: z.string().describe('Paste the v3 timepicker-ui setup code to migrate.'),
    },
  },
  (args) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: [
            'Migrate this v3 timepicker-ui code to v4 grouped options. Use the `migration_guide` tool',
            '(path "v3->v4") for the exact field mapping, then rewrite the code:',
            '',
            '```',
            args.code,
            '```',
          ].join('\n'),
        },
      },
    ],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write('timepicker-ui MCP server running on stdio\n');
}

main().catch((error) => {
  process.stderr.write(`Fatal error: ${String(error)}\n`);
  process.exit(1);
});
