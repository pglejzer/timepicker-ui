import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));

function load<T>(name: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(resolve(dir, 'generated', name), 'utf8')) as T;
  } catch {
    return fallback;
  }
}

export interface OptionEntry {
  name: string;
  optional: boolean;
  type: string;
  description?: string;
  default?: string;
  example?: string;
  deprecated?: string;
  fields?: OptionEntry[];
}

export interface OptionGroup {
  interface: string;
  description?: string;
  options: OptionEntry[];
}

export type OptionGroups = Record<string, OptionGroup>;

export interface EventEntry {
  name: string;
  data: string;
  fields: OptionEntry[];
  description?: string;
  deprecated?: string;
  internal?: boolean;
}

export interface CssVar {
  name: string;
  group: string;
  default: string | null;
  read: boolean;
  commonlyThemed: boolean;
  readOutsideWrapper?: string[];
}

export interface CssClassReference {
  classes: { name: string; example?: string }[];
  modifiers: { name: string; example?: string }[];
}

export type ThemeVarMap = Record<string, { name: string; value: string }[]>;

export interface TroubleshootingEntry {
  group: string;
  symptom: string;
  fix: { text: string; code?: { language: string; source: string } }[];
  why?: string;
  docs: string;
}

export interface MigrationV5Data {
  renamed: { from: string; to: string; note?: string }[];
  removed: { name: string; action: string }[];
}

export interface Meta {
  library: string;
  cssReference: string | null;
  siteUrl: string;
}

export const META = load<Meta>('meta.json', {
  library: '4.5.0',
  cssReference: null,
  siteUrl: 'https://timepicker-ui.vercel.app',
});
export const OPTION_GROUPS = load<OptionGroups>('options.json', {});
export const EVENTS = load<EventEntry[]>('events.json', []);
export const CSS_VARS = load<CssVar[]>('css-variables.json', []);
export const THEME_VARS = load<ThemeVarMap>('themes.json', {});
export const CSS_CLASSES = load<CssClassReference>('css-classes.json', { classes: [], modifiers: [] });
export const TROUBLESHOOTING = load<TroubleshootingEntry[]>('troubleshooting.json', []);
export const MIGRATION_V5 = load<MigrationV5Data>('migration-v5.json', { renamed: [], removed: [] });

export const OPTION_GROUP_NAMES = Object.keys(OPTION_GROUPS);
export const CSS_VAR_GROUPS = [...new Set(CSS_VARS.map((v) => v.group))];
