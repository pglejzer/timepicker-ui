import { CSS_VARS } from './generated.js';

export interface CustomThemeArgs {
  name: string;
  overrides: Record<string, string>;
  onlyCommon: boolean;
}

function normalizeVarName(key: string): string {
  const trimmed = key.trim();
  if (trimmed.startsWith('--')) return trimmed;
  if (trimmed.startsWith('tp-')) return `--${trimmed}`;
  return `--tp-${trimmed}`;
}

export function buildCustomTheme(args: CustomThemeArgs): string {
  const known = new Map(CSS_VARS.map((v) => [v.name, v]));
  const base = args.onlyCommon ? CSS_VARS.filter((v) => v.commonlyThemed) : CSS_VARS;

  const overridePairs = Object.entries(args.overrides).map(([k, v]) => [normalizeVarName(k), v] as const);
  const overrideMap = new Map(overridePairs);

  const lines: string[] = [`[data-theme='${args.name}'] {`];

  if (overrideMap.size > 0) {
    for (const [name, value] of overrideMap) {
      const fallback = known.get(name);
      const suffix = fallback ? '' : '  /* not a known --tp- variable, verify the name */';
      lines.push(`  ${name}: ${value};${suffix}`);
    }
  } else {
    for (const v of base) {
      lines.push(`  ${v.name}: ${v.value};`);
    }
  }

  lines.push('}');

  const header = [
    `/* Custom timepicker-ui theme: "${args.name}"`,
    ' *',
    ' * 1. Save this CSS and import it in your app (after timepicker-ui/main.css).',
    " * 2. Pass ui.theme = '" + args.name + "' (cast as any in TS — custom names are not in the union).",
    ' *',
    " * The picker sets data-theme on its modal, so [data-theme='" + args.name + "'] scopes your overrides.",
    ' */',
    '',
  ].join('\n');

  return `${header}${lines.join('\n')}\n`;
}
