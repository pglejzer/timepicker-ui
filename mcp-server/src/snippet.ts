import { MODES, PLUGINS, THEMES } from './data.js';

export interface SnippetArgs {
  selector: string;
  theme: string;
  mode: string;
  clockType: '12h' | '24h';
  plugins: string[];
  framework: 'vanilla' | 'react';
}

function pluginImportsFor(plugins: string[]): { imports: string[]; registers: string[] } {
  const imports: string[] = [];
  const registers: string[] = [];
  for (const name of plugins) {
    const plugin = PLUGINS.find((p) => p.name === name);
    if (!plugin) continue;
    imports.push(`import { ${plugin.export} } from '${plugin.importPath}';`);
    registers.push(`PluginRegistry.register(${plugin.export});`);
  }
  return { imports, registers };
}

function optionsFor(args: SnippetArgs): string {
  const ui: string[] = [];
  if (args.theme && args.theme !== 'basic') ui.push(`theme: '${args.theme}'`);
  if (args.mode && args.mode !== 'clock') ui.push(`mode: '${args.mode}'`);

  const clock: string[] = [`type: '${args.clockType}'`];

  const groups: string[] = [];
  if (ui.length) groups.push(`  ui: { ${ui.join(', ')} },`);
  groups.push(`  clock: { ${clock.join(', ')} },`);

  for (const name of args.plugins) {
    const plugin = PLUGINS.find((p) => p.name === name);
    if (!plugin || plugin.name === 'wheel') continue;
    groups.push(`  ${plugin.enableOption},`);
  }

  return `{\n${groups.join('\n')}\n}`;
}

export function buildSnippet(args: SnippetArgs): string {
  const theme = THEMES.find((t) => t.name === args.theme) ?? THEMES[0];
  const cssImports = ["import 'timepicker-ui/main.css';"];
  if (theme.name !== 'basic') cssImports.push(`import '${theme.cssImport}';`);

  const { imports: pluginImports, registers } = pluginImportsFor(args.plugins);
  const options = optionsFor(args);

  if (args.framework === 'react') {
    return [
      "import { useEffect, useRef } from 'react';",
      "import { TimepickerUI, PluginRegistry } from 'timepicker-ui';",
      ...pluginImports,
      ...cssImports,
      '',
      ...(registers.length ? [...registers, ''] : []),
      'export function TimePicker() {',
      '  const ref = useRef<HTMLInputElement>(null);',
      '  useEffect(() => {',
      '    if (!ref.current) return;',
      `    const picker = new TimepickerUI(ref.current, ${options.replace(/\n/g, '\n    ')});`,
      '    picker.create();',
      '    return () => picker.destroy();',
      '  }, []);',
      '  return <input ref={ref} />;',
      '}',
    ].join('\n');
  }

  return [
    "import { TimepickerUI, PluginRegistry } from 'timepicker-ui';",
    ...pluginImports,
    ...cssImports,
    '',
    ...(registers.length ? [...registers, ''] : []),
    `const input = document.querySelector('${args.selector}');`,
    `const picker = new TimepickerUI(input, ${options});`,
    'picker.create();',
  ].join('\n');
}

export function modeRequiresWheel(mode: string): boolean {
  const info = MODES.find((m) => m.name === mode);
  return info?.requiresPlugin === 'wheel';
}
