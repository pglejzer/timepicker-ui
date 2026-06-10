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
}

export interface OptionGroup {
  interface: string;
  description?: string;
  options: OptionEntry[];
}

export type OptionGroups = Record<string, OptionGroup>;

export interface EventField {
  name: string;
  optional: boolean;
  type: string;
  description?: string;
}

export interface EventEntry {
  name: string;
  data: string;
  fields: EventField[];
}

export interface CssVar {
  name: string;
  value: string;
  commonlyThemed: boolean;
}

export type ThemeVarMap = Record<string, { name: string; value: string }[]>;

export const OPTION_GROUPS = load<OptionGroups>('options.json', {});
export const EVENTS = load<EventEntry[]>('events.json', []);
export const CSS_VARS = load<CssVar[]>('css-variables.json', []);
export const THEME_VARS = load<ThemeVarMap>('themes.json', {});
export const CSS_CLASSES = load<string[]>('css-classes.json', []);

export const OPTION_GROUP_NAMES = Object.keys(OPTION_GROUPS);
