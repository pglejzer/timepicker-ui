import { CSS_VARS } from './generated.js';

export interface CustomThemeArgs {
  name: string;
  overrides: Record<string, string>;
  onlyCommon: boolean;
}

export interface CustomThemeResult {
  css: string;
  warnings: string[];
}

export const CLASS_NAME = /^[a-z_][a-z0-9_-]*$/i;

function normalizeVarName(key: string): string {
  const trimmed = key.trim();
  if (trimmed.startsWith('--')) return trimmed;
  if (trimmed.startsWith('tp-')) return `--${trimmed}`;
  return `--tp-${trimmed}`;
}

export function buildCustomTheme(args: CustomThemeArgs): CustomThemeResult {
  const known = new Map(CSS_VARS.map((v) => [v.name, v]));
  const scaffold = CSS_VARS.filter((v) => v.read && !v.readOutsideWrapper && (!args.onlyCommon || v.commonlyThemed));
  const overrides = new Map(Object.entries(args.overrides).map(([k, v]) => [normalizeVarName(k), v] as const));

  const wrapper = `.tp-ui-wrapper.${args.name}`;
  const root = `.tp-ui.${args.name}`;
  const modal = '.tp-ui-modal[data-theme]';
  const blocks = new Map<string, string[]>([[wrapper, []]]);
  const add = (selector: string, line: string) => blocks.set(selector, [...(blocks.get(selector) ?? []), line]);
  const warnings: string[] = [];

  if (overrides.size > 0) {
    for (const [name, value] of overrides) {
      const info = known.get(name);
      if (!info) {
        warnings.push(`${name} is not a --tp- variable timepicker-ui defines. Check the name with list_css_variables.`);
        add(wrapper, `  ${name}: ${value};`);
      } else if (!info.read) {
        warnings.push(`${name} has no effect: no rule reads it, and 5.0 removes it. It was left out.`);
      } else if (info.readOutsideWrapper?.includes('tp-ui-modal')) {
        add(modal, `  ${name}: ${value};`);
        warnings.push(`${name} is read on .tp-ui-modal, outside .tp-ui-wrapper, so it is set there and applies to every picker.`);
      } else if (info.readOutsideWrapper) {
        add(root, `  ${name}: ${value};`);
      } else {
        add(wrapper, `  ${name}: ${value};`);
      }
    }
  } else {
    for (const v of scaffold) add(wrapper, `  ${v.name}: ${v.default ?? 'initial'};`);
  }

  const header = [
    `/* Custom timepicker-ui theme: "${args.name}"`,
    ' *',
    " * 1. Import this CSS after 'timepicker-ui/main.css' (and after a built-in theme file if you combine them).",
    ` * 2. Pass the class: new TimepickerUI(input, { ui: { cssClass: '${args.name}' } }).`,
    " *    It can be combined with a built-in theme as the base: ui: { theme: 'dark', cssClass: '" + args.name + "' }.",
    ' *',
    ` * The picker adds the class to .tp-ui-wrapper when it opens, so .tp-ui-wrapper.${args.name} scopes these values.`,
    ' */',
    '',
  ].join('\n');

  const css = [...blocks]
    .filter(([, lines]) => lines.length > 0)
    .map(([selector, lines]) => `${selector} {\n${lines.join('\n')}\n}`)
    .join('\n\n');

  return { css: `${header}${css}\n`, warnings };
}
