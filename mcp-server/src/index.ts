#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer, completable } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { z } from 'zod';
import {
  API_METHODS,
  DOCS,
  LIBRARY_VERSION,
  MODES,
  MODE_NAMES,
  PLUGINS,
  PLUGIN_NAMES,
  SITE_URL,
  THEMES,
  THEME_NAMES,
  docsUrl,
  optionGroupDocs,
} from './data.js';
import {
  CSS_CLASSES,
  CSS_VARS,
  CSS_VAR_GROUPS,
  EVENTS,
  MIGRATION_V5,
  OPTION_GROUPS,
  OPTION_GROUP_NAMES,
  THEME_VARS,
  TROUBLESHOOTING,
  type OptionEntry,
} from './generated.js';
import {
  FRAMEWORK_NAMES,
  FRAMEWORK_RECIPES,
  IO_CONTRACT,
  MIGRATION_V3_TO_V4,
  MIGRATION_V43_TO_V44,
  MIGRATION_V44_TO_V45,
  MIGRATION_V45_TO_V5,
} from './content.js';
import { searchReference } from './search.js';
import { buildSnippet, modeRequiresWheel } from './snippet.js';
import { CLASS_NAME, buildCustomTheme } from './theme.js';
import { parseTime, validateDisabledTime } from './validate.js';

const packageJson = JSON.parse(
  readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf8'),
) as { version: string };

const INSTRUCTIONS = [
  `Reference data for timepicker-ui ${LIBRARY_VERSION}, a zero-dependency time picker (npm package timepicker-ui).`,
  'Answer timepicker-ui questions from these tools rather than from memory.',
  'Options are grouped since 4.0: clock, ui, labels, behavior, callbacks, timezone, range, wheel, clearBehavior.',
  'Items marked deprecated still work in 4.x and are removed in 5.0, so suggest their replacement.',
  'Every setup imports timepicker-ui/main.css. The wheel and compact-wheel modes and the range and timezone features need their plugin registered once with PluginRegistry.register().',
  'For custom styling, set --tp- variables under .tp-ui-wrapper.<class> and pass the class in ui.cssClass.',
  'When you are not sure which option, event or CSS variable fits, call search_reference.',
  `Results link to the docs at ${SITE_URL}.`,
].join(' ');

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

function text(value: unknown) {
  const body = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  return { content: [{ type: 'text' as const, text: body }] };
}

function fail(message: string, details: Record<string, unknown> = {}) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify({ error: message, ...details }, null, 2) }],
    isError: true,
  };
}

function withoutDeprecated(options: OptionEntry[]): OptionEntry[] {
  return options
    .filter((option) => !option.deprecated)
    .map((option) => (option.fields ? { ...option, fields: withoutDeprecated(option.fields) } : option));
}

function deprecatedNames(options: OptionEntry[], path: string): string[] {
  return options.flatMap((option) => {
    const name = `${path}.${option.name}`;
    if (option.deprecated) return [name];
    return option.fields ? deprecatedNames(option.fields, name) : [];
  });
}

function findOption(group: string, path: string): OptionEntry | undefined {
  let list: OptionEntry[] | undefined = OPTION_GROUPS[group]?.options;
  let found: OptionEntry | undefined;
  for (const part of path.split('.')) {
    found = list?.find((option) => option.name === part);
    if (!found) return undefined;
    list = found.fields;
  }
  return found;
}

const groupEnum = z.enum(OPTION_GROUP_NAMES as [string, ...string[]]);

const CACHE_HINT = { ttlMs: 3_600_000, cacheScope: 'public' as const };

export function createServer(): McpServer {
  const server = new McpServer(
    {
      name: 'timepicker-ui',
      title: 'timepicker-ui',
      version: packageJson.version,
      description: 'Reference data, snippets and migration help for the timepicker-ui time picker.',
      websiteUrl: SITE_URL,
    },
    {
      instructions: INSTRUCTIONS,
      cacheHints: {
        'tools/list': CACHE_HINT,
        'prompts/list': CACHE_HINT,
        'resources/list': CACHE_HINT,
        'resources/read': CACHE_HINT,
        'server/discover': CACHE_HINT,
      },
    },
  );

  server.registerTool(
    'list_themes',
    {
      title: 'List timepicker-ui themes',
      description:
        'Lists the 12 built-in themes with their CSS import paths. Select one with ui.theme. For a custom look use ui.cssClass (see generate_custom_theme).',
      annotations: READ_ONLY,
    },
    async () =>
      text({
        themes: THEMES,
        usage: "Import 'timepicker-ui/main.css', then the theme file, and set ui: { theme: '<name>' }.",
        custom:
          "ui.theme accepts only the built-in names. For your own colors, pass a class in ui.cssClass and set --tp- variables under .tp-ui-wrapper.<class> (generate_custom_theme writes the CSS).",
        docs: DOCS.themes,
      }),
  );

  server.registerTool(
    'list_modes',
    {
      title: 'List timepicker-ui UI modes',
      description: 'Lists the UI modes (clock, wheel, compact-wheel) and which plugin each needs.',
      annotations: READ_ONLY,
    },
    async () => text({ modes: MODES, option: 'ui.mode' }),
  );

  server.registerTool(
    'list_plugins',
    {
      title: 'List timepicker-ui plugins',
      description: 'Lists the optional plugins (range, timezone, wheel) with import paths and the option that turns each on.',
      annotations: READ_ONLY,
    },
    async () =>
      text({
        plugins: PLUGINS,
        register:
          "Import the plugin and call PluginRegistry.register(Plugin) once, before creating pickers: import { TimepickerUI, PluginRegistry } from 'timepicker-ui'.",
        docs: DOCS.plugins,
      }),
  );

  server.registerTool(
    'list_events',
    {
      title: 'List timepicker-ui events',
      description:
        'Lists the events picker.on(event, handler) can subscribe to, with the payload type and its fields, extracted from source. Internal and deprecated events are left out unless asked for.',
      inputSchema: z.object({
        includeInternal: z
          .boolean()
          .default(false)
          .describe('Also list internal events (open:request, range:minute:commit, animation:*). 5.0 removes them from the event map.'),
        includeDeprecated: z.boolean().default(false).describe('Also list deprecated events such as hide, select:am and select:pm.'),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      const shown = EVENTS.filter(
        (event) => (args.includeInternal || !event.internal) && (args.includeDeprecated || !event.deprecated),
      );
      const omitted = EVENTS.filter((event) => !shown.includes(event)).map((event) => event.name);
      return text({ events: shown, omitted, docs: DOCS.events });
    },
  );

  server.registerTool(
    'list_api',
    {
      title: 'List the public API',
      description:
        'Lists the TimepickerUI instance and static methods with signatures, deprecations, and the getValue/setValue contract.',
      annotations: READ_ONLY,
    },
    async () => text({ methods: API_METHODS, io: IO_CONTRACT, docs: DOCS.methods }),
  );

  server.registerTool(
    'list_css_classes',
    {
      title: 'List tp-ui- CSS classes',
      description:
        'Lists the tp-ui- class names and state modifiers, with an example selector for each styled class. Prefer --tp- variables; class names change in 5.0.',
      annotations: READ_ONLY,
    },
    async () => text({ ...CSS_CLASSES, docs: DOCS.cssClasses }),
  );

  server.registerTool(
    'list_css_variables',
    {
      title: 'List --tp- CSS variables',
      description:
        'Lists the --tp- CSS custom properties with group, default value and whether built-in themes override them. Variables no rule reads are left out unless asked for.',
      inputSchema: z.object({
        group: z
          .enum(CSS_VAR_GROUPS as [string, ...string[]])
          .optional()
          .describe('Limit to one group, e.g. Color, Typography, Focus, Wheel.'),
        includeUnread: z
          .boolean()
          .default(false)
          .describe('Also list variables that no rule reads. Setting them changes nothing and 5.0 removes them.'),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      const inGroup = CSS_VARS.filter((v) => !args.group || v.group === args.group);
      const variables = inGroup.filter((v) => args.includeUnread || v.read);
      return text({
        variables,
        omittedUnread: inGroup.filter((v) => !variables.includes(v)).map((v) => v.name),
        groups: CSS_VAR_GROUPS,
        docs: DOCS.cssVariables,
      });
    },
  );

  server.registerTool(
    'get_options',
    {
      title: 'Get grouped options',
      description:
        'Returns the grouped options reference (clock, ui, labels, behavior, callbacks, timezone, range, wheel, clearBehavior) with type, default, description and nested fields, extracted from options.d.ts. Deprecated options are left out unless asked for. Pass a group to narrow it.',
      inputSchema: z.object({
        group: groupEnum.optional().describe('Limit to a single option group.'),
        includeDeprecated: z
          .boolean()
          .default(false)
          .describe('Also return deprecated options (old names that still work in 4.x and are removed in 5.0).'),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      const names = args.group ? [args.group] : OPTION_GROUP_NAMES;
      const groups = Object.fromEntries(
        names.map((name) => {
          const group = OPTION_GROUPS[name];
          const options = args.includeDeprecated ? group.options : withoutDeprecated(group.options);
          return [name, { ...group, options, docs: optionGroupDocs(name) }];
        }),
      );
      const omitted = args.includeDeprecated ? [] : names.flatMap((name) => deprecatedNames(OPTION_GROUPS[name].options, name));
      return text({ groups, omittedDeprecated: omitted });
    },
  );

  server.registerTool(
    'explain_option',
    {
      title: 'Explain a single option',
      description:
        'Returns the full detail (type, default, description, example, deprecation, nested fields) for one option. Use a dotted name for nested fields, e.g. "disabledTime.ranges".',
      inputSchema: z.object({
        group: groupEnum.describe('Option group.'),
        name: z.string().min(1).describe('Option name within the group, e.g. "showSeconds" or "disabledTime.ranges".'),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      const path = args.name.startsWith(`${args.group}.`) ? args.name.slice(args.group.length + 1) : args.name;
      const option = findOption(args.group, path);
      if (option) return text({ group: args.group, ...option, docs: optionGroupDocs(args.group) });

      const elsewhere = OPTION_GROUP_NAMES.filter((group) => group !== args.group && findOption(group, path)).map(
        (group) => `${group}.${path}`,
      );
      return fail(`Unknown option "${path}" in "${args.group}".`, {
        ...(elsewhere.length ? { didYouMean: elsewhere } : {}),
        available: OPTION_GROUPS[args.group].options.map((o) => o.name),
        hint: 'Call search_reference with a keyword when you do not know the exact name.',
      });
    },
  );

  server.registerTool(
    'get_theme',
    {
      title: 'Get a built-in theme variable set',
      description:
        'Returns the --tp- CSS variables a built-in theme sets, with their values, to start a custom theme from.',
      inputSchema: z.object({
        name: z.enum(Object.keys(THEME_VARS) as [string, ...string[]]).describe('Built-in theme name.'),
      }),
      annotations: READ_ONLY,
    },
    async (args) =>
      text({
        theme: args.name,
        cssImport: THEMES.find((t) => t.name === args.name)?.cssImport,
        variables: THEME_VARS[args.name] ?? [],
        docs: DOCS.themes,
      }),
  );

  server.registerTool(
    'framework_recipe',
    {
      title: 'Framework integration recipe',
      description:
        'Returns an integration recipe (lifecycle, SSR notes and code) for vanilla, react, react-wrapper (timepicker-ui-react), next, vue, angular or svelte.',
      inputSchema: z.object({
        framework: z.enum(FRAMEWORK_NAMES).describe('Target framework.'),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      const recipe = FRAMEWORK_RECIPES[args.framework];
      return text({ ...recipe, docs: docsUrl(recipe.docs) });
    },
  );

  server.registerTool(
    'migration_guide',
    {
      title: 'Migration guide',
      description:
        'Returns migration guidance. "v3->v4": flat to grouped option mapping. "v4.3->v4.4" and "v4.4->v4.5": non-breaking changes, with every renamed option. "v4.5->v5": draft list of what 5.0 removes and changes, and the steps that work on 4.5.0 today.',
      inputSchema: z.object({
        path: z
          .enum(['v3->v4', 'v4.3->v4.4', 'v4.4->v4.5', 'v4.5->v5'])
          .default('v3->v4')
          .describe('Which migration to return.'),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      if (args.path === 'v4.3->v4.4') return text({ path: args.path, changes: MIGRATION_V43_TO_V44 });
      if (args.path === 'v4.4->v4.5') {
        return text({ path: args.path, changes: MIGRATION_V44_TO_V45, renamed: MIGRATION_V5.renamed, docs: DOCS.renamed });
      }
      if (args.path === 'v4.5->v5') {
        return text({
          path: args.path,
          ...MIGRATION_V45_TO_V5,
          renamed: MIGRATION_V5.renamed,
          removed: MIGRATION_V5.removed,
          docs: DOCS.migrationV5,
        });
      }
      return text({ path: args.path, ...MIGRATION_V3_TO_V4, docs: DOCS.migrationV4 });
    },
  );

  server.registerTool(
    'generate_snippet',
    {
      title: 'Generate a timepicker-ui setup snippet',
      description:
        'Generates a ready-to-paste vanilla JS or React snippet wiring up TimepickerUI with the chosen theme, mode, clock type, seconds and plugins (CSS imports and plugin registration included). For full framework lifecycle and SSR notes, use framework_recipe.',
      inputSchema: z.object({
        selector: z.string().default('#time').describe('CSS selector of the target input (vanilla only).'),
        theme: z.enum(THEME_NAMES as [string, ...string[]]).default('basic').describe('Theme name.'),
        mode: z.enum(MODE_NAMES as [string, ...string[]]).default('clock').describe('UI mode.'),
        clockType: z
          .enum(['12h', '24h', 'auto'])
          .default('24h')
          .describe("12-hour, 24-hour, or 'auto' (from the browser locale)."),
        showSeconds: z.boolean().default(false).describe('Add a seconds field (clock.showSeconds).'),
        plugins: z
          .array(z.enum(PLUGIN_NAMES as [string, ...string[]]))
          .default([])
          .describe('Plugins to import and register. wheel is added for the wheel modes.'),
        framework: z.enum(['vanilla', 'react']).default('vanilla').describe('Output flavor.'),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      const plugins = new Set<string>(args.plugins);
      if (modeRequiresWheel(args.mode)) plugins.add('wheel');

      return text(
        buildSnippet({
          selector: args.selector,
          theme: args.theme,
          mode: args.mode,
          clockType: args.clockType,
          showSeconds: args.showSeconds,
          plugins: [...plugins],
          framework: args.framework,
        }),
      );
    },
  );

  server.registerTool(
    'generate_custom_theme',
    {
      title: 'Generate a custom theme stylesheet',
      description:
        'Writes the CSS for a custom theme applied with ui.cssClass: a .tp-ui-wrapper.<name> block of --tp- variables. Pass `overrides` to emit only those, or leave it empty for an editable scaffold of the variables built-in themes change. Unknown variables and variables no rule reads are reported.',
      inputSchema: z.object({
        name: z.string().min(1).describe("Class name for ui.cssClass, e.g. 'ocean'. Letters, digits, - and _."),
        overrides: z
          .record(z.string(), z.string())
          .default({})
          .describe("Map of CSS variables to values, e.g. { 'tp-primary': '#0ea5e9' }."),
        onlyCommon: z
          .boolean()
          .default(true)
          .describe('For the scaffold, include only the variables built-in themes override.'),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      if (!CLASS_NAME.test(args.name)) {
        return fail(`"${args.name}" is not a valid CSS class name.`, {
          hint: 'Use letters, digits, "-" and "_", starting with a letter or "_", e.g. "ocean" or "brand-dark".',
        });
      }
      const theme = buildCustomTheme({ name: args.name, overrides: args.overrides, onlyCommon: args.onlyCommon });
      const content = [{ type: 'text' as const, text: theme.css }];
      if (theme.warnings.length) {
        content.push({ type: 'text' as const, text: `Notes:\n${theme.warnings.map((w) => `- ${w}`).join('\n')}` });
      }
      return { content };
    },
  );

  server.registerTool(
    'validate_time',
    {
      title: 'Validate a time string',
      description:
        'Validates a time string against a 12h or 24h clock and returns the parsed parts. Accepts "HH:MM", "HH:MM:SS", "h:MM AM/PM" and "h:MM:SS AM/PM".',
      inputSchema: z.object({
        time: z.string().describe('The time string, e.g. "14:30", "14:30:15" or "2:30:15 PM".'),
        clockType: z.enum(['12h', '24h']).default('24h'),
      }),
      annotations: READ_ONLY,
    },
    async (args) => text(parseTime(args.time, args.clockType)),
  );

  server.registerTool(
    'validate_disabled_time',
    {
      title: 'Validate a disabledTime config',
      description:
        'Validates a clock.disabledTime config: hours, minutes and seconds lists, and range strings in ranges ("10:00 AM - 12:00 PM", "10:00:30 - 10:05"). Returns per-issue feedback.',
      inputSchema: z.object({
        hours: z.array(z.union([z.string(), z.number()])).optional().describe('Disabled hours.'),
        minutes: z.array(z.union([z.string(), z.number()])).optional().describe('Disabled minutes.'),
        seconds: z
          .array(z.union([z.string(), z.number()]))
          .optional()
          .describe('Disabled seconds (used with clock.showSeconds).'),
        ranges: z
          .union([z.string(), z.array(z.string())])
          .optional()
          .describe('Range string or array, e.g. "10:00 AM - 12:00 PM".'),
        interval: z
          .union([z.string(), z.array(z.string())])
          .optional()
          .describe('Deprecated old name of ranges; ranges wins when both are set.'),
        clockType: z.enum(['12h', '24h']).default('24h'),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      const result = validateDisabledTime(
        { hours: args.hours, minutes: args.minutes, seconds: args.seconds, ranges: args.ranges, interval: args.interval },
        args.clockType,
      );
      const notes = args.interval !== undefined ? ['interval is deprecated and removed in 5.0. Use ranges.'] : [];
      return text({ ...result, ...(notes.length ? { notes } : {}) });
    },
  );

  server.registerTool(
    'search_reference',
    {
      title: 'Search the timepicker-ui reference',
      description:
        'Keyword search across options (including nested fields), events, CSS variables, CSS classes, methods, themes and troubleshooting entries. Use it when you do not know the exact name. Pass a few keywords, not a sentence, e.g. "disable time range", "focus ring color" or "seconds increment". Deprecated items rank lower and are flagged.',
      inputSchema: z.object({
        query: z.string().min(2).describe('Keywords, e.g. "seconds increment" or "backdrop".'),
        limit: z.number().int().min(1).max(50).default(10).describe('Maximum number of results.'),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      const results = searchReference(args.query, args.limit);
      return text({
        query: args.query,
        results,
        ...(results.length ? {} : { hint: 'No match. Try a shorter or different keyword, or call get_options.' }),
      });
    },
  );

  server.registerResource(
    'timepicker-ui-reference',
    'timepicker-ui://reference',
    {
      title: 'timepicker-ui options reference',
      description: 'Summary of the grouped options, themes, modes, plugins and events.',
      mimeType: 'text/markdown',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/markdown',
          text: [
            `# timepicker-ui ${LIBRARY_VERSION} - options reference`,
            '',
            'Options are grouped (v4+). Use the `get_options` / `explain_option` tools for full detail. Deprecated names are left out here.',
            '',
            ...OPTION_GROUP_NAMES.map((g) => {
              const options = withoutDeprecated(OPTION_GROUPS[g].options);
              return `- \`${g}\` (${options.length} options): ${options.map((o) => o.name).join(', ')}`;
            }),
            '',
            `Themes: ${THEME_NAMES.join(', ')}`,
            `Modes: ${MODE_NAMES.join(', ')} (wheel modes need the wheel plugin)`,
            `Plugins: ${PLUGINS.map((p) => p.name).join(', ')} (registered via PluginRegistry.register)`,
            `Events: ${EVENTS.filter((e) => !e.internal && !e.deprecated).length} (see list_events for payload fields)`,
            '',
            'CSS: always import `timepicker-ui/main.css`, then a `timepicker-ui/theme-<name>.css` for non-basic themes.',
            '',
            `Docs: ${SITE_URL}/docs`,
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
      description: 'Every --tp- CSS custom property with group and default value; flags the ones themes override and the ones no rule reads.',
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
            `${CSS_VARS.length} variables. **themed**: built-in themes override it. **no effect**: no rule reads it, so setting it changes nothing (removed in 5.0).`,
            '',
            '| Variable | Group | Default | Notes |',
            '| --- | --- | --- | --- |',
            ...CSS_VARS.map((v) => {
              const notes = [v.commonlyThemed ? 'themed' : '', v.read ? '' : 'no effect'].filter(Boolean).join(', ');
              return `| \`${v.name}\` | ${v.group} | \`${v.default ?? 'unset'}\` | ${notes} |`;
            }),
            '',
            `Docs: ${DOCS.cssVariables}`,
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
      description: 'Step-by-step guide for styling timepicker-ui with your own class and --tp- variables.',
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
            '`ui.theme` selects one of the 12 built-in themes only: the picker writes it to the `data-theme` attribute of the modal, and the TypeScript type is a union of the built-in names.',
            'For your own colors, pass a class in `ui.cssClass` and set `--tp-` variables under it. The picker adds the class to `.tp-ui-wrapper` when it opens.',
            '',
            '## Steps',
            '',
            '1. Pick a class name (e.g. `ocean`). Call `generate_custom_theme` to write the CSS, or `get_theme` to copy a built-in theme as a starting point.',
            '2. Override the variables you need. `list_css_variables` lists them; skip the ones marked as having no effect.',
            "3. Import your stylesheet after `timepicker-ui/main.css` (and after a built-in theme file if you combine them).",
            "4. Pass the class: `ui: { cssClass: 'ocean' }`. It can sit on top of a built-in theme: `ui: { theme: 'dark', cssClass: 'ocean' }`.",
            '',
            '## Example',
            '',
            '```css',
            '.tp-ui-wrapper.ocean {',
            '  --tp-bg: #06283d;',
            '  --tp-surface: #0a3a52;',
            '  --tp-text: #eaf6ff;',
            '  --tp-primary: #2ec4f1;',
            '  --tp-on-primary: #00131f;',
            '}',
            '```',
            '',
            'To change a value for every picker, set it on `.tp-ui-wrapper` instead.',
            '',
            '## Material Design 3 note',
            '',
            'Convey selected and active state with fill (state layers, tonal containers) and disabled with reduced opacity, not bold weight or strikethrough. Keep a visible focus ring (`--tp-focus-ring`) with at least 3:1 contrast.',
            '',
            `Docs: ${DOCS.styling}`,
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
      description: 'Common problems, the fix and the cause, from the docs troubleshooting page.',
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
              '',
              ...t.fix.flatMap((step) => [
                step.text,
                '',
                ...(step.code ? ['```' + step.code.language, step.code.source, '```', ''] : []),
              ]),
              ...(t.why ? [`Why: ${t.why}`, ''] : []),
              `Docs: ${t.docs}`,
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
      argsSchema: z.object({
        framework: completable(z.string().describe(FRAMEWORK_NAMES.join(' | ')), (value) =>
          FRAMEWORK_NAMES.filter((name) => name.startsWith(value ?? '')),
        ),
      }),
    },
    (args) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              `Integrate timepicker-ui into a ${args.framework} app.`,
              'Call the `framework_recipe` tool with this framework for the lifecycle and SSR handling,',
              'use `get_options` or `search_reference` for any options I mention, and `list_events` if I need to react to selections.',
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
      argsSchema: z.object({
        description: z.string().describe('Describe the look or palette, e.g. "dark ocean blue, teal accent".'),
      }),
    },
    (args) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              `Create a custom timepicker-ui theme: ${args.description}.`,
              'Call `list_css_variables` (group Color first) and optionally `get_theme` for a similar built-in,',
              'then call `generate_custom_theme` with concrete --tp- overrides and show how to pass the class in ui.cssClass.',
              'Follow Material Design 3 (state via fill and opacity, visible focus ring with at least 3:1 contrast).',
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
      argsSchema: z.object({
        code: z.string().describe('Paste the v3 timepicker-ui setup code to migrate.'),
      }),
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

  server.registerPrompt(
    'prepare-for-v5',
    {
      title: 'Prepare 4.x code for 5.0',
      description: 'Replace deprecated timepicker-ui 4.x options, events and methods with the names that stay in 5.0.',
      argsSchema: z.object({
        code: z.string().describe('Paste the timepicker-ui 4.x code to update.'),
      }),
    },
    (args) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'Update this timepicker-ui 4.x code so it uses no deprecated API and is ready for 5.0.',
              'Call the `migration_guide` tool with path "v4.5->v5" for the renamed and removed items,',
              'and `explain_option` when an option is unclear. Keep the behavior the same and list each change you made:',
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

  return server;
}

try {
  serveStdio(() => createServer());
  process.stderr.write('timepicker-ui MCP server running on stdio\n');
} catch (error) {
  process.stderr.write(`Fatal error: ${String(error)}\n`);
  process.exit(1);
}
