import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

export type Scope = { tokens: Map<string, string>; parent?: Scope };

export const STYLES_DIR = resolve(__dirname, '../../../src/styles');
export const VARIABLES_PATH = join(STYLES_DIR, 'variables.scss');

const THEMES_DIR = join(STYLES_DIR, 'themes');

const ROOT_BLOCK = /:root\s*\{([^}]*)\}/g;
const THEME_BLOCK = /\[data-theme=['"]([\w-]+)['"]\]\s*\{([^}]*)\}/g;
const DECLARATION = /(--tp-[\w-]+)\s*:\s*([^;]+);/g;
const VAR_REF = /^var\(\s*(--tp-[\w-]+)\s*(?:,\s*(.+))?\)$/;

export const stripComments = (source: string): string =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');

export const readScss = (path: string): string => (existsSync(path) ? stripComments(readFileSync(path, 'utf8')) : '');

export const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const declarations = (block: string): Map<string, string> =>
  new Map([...block.matchAll(DECLARATION)].map((m): [string, string] => [m[1], m[2].trim()]));

export const rootTokens = (): Map<string, string> =>
  new Map([...readScss(VARIABLES_PATH).matchAll(ROOT_BLOCK)].flatMap(([, body]) => [...declarations(body)]));

export const themeFiles = readdirSync(THEMES_DIR).filter((file) => file.endsWith('.scss'));

export const themeBlocks = (file: string): RegExpMatchArray[] => [
  ...readScss(join(THEMES_DIR, file)).matchAll(THEME_BLOCK),
];

export const loadThemes = (): Map<string, Scope> => {
  const defaults: Scope = { tokens: rootTokens() };
  const themes = new Map<string, Scope>([['basic', { tokens: new Map(), parent: defaults }]]);
  themeFiles.flatMap(themeBlocks).forEach(([, name, block]) => {
    const tokens = new Map([...(themes.get(name)?.tokens ?? []), ...declarations(block)]);
    themes.set(name, { tokens, parent: defaults });
  });
  return themes;
};

const lookup = (scope: Scope, token: string): { value: string; scope: Scope } | undefined => {
  const value = scope.tokens.get(token);
  if (value !== undefined) return { value, scope };
  return scope.parent ? lookup(scope.parent, token) : undefined;
};

export const resolveValue = (scope: Scope, value: string): string => {
  const ref = value.trim().match(VAR_REF);
  if (!ref) return value.trim();
  const [, token, fallback] = ref;
  const found = lookup(scope, token);
  if (found) return resolveValue(found.scope, found.value);
  if (fallback !== undefined) return resolveValue(scope, fallback);
  throw new Error(`${token} is not defined in the theme or in variables.scss`);
};
