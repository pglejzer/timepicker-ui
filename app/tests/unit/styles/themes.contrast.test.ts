import { loadThemes, resolveValue, themeBlocks, themeFiles } from './style-test-helpers';
import type { Scope } from './style-test-helpers';

type Rgba = [number, number, number, number];
type Pair = { name: string; fg: string; bg: string; under?: string; min: number };

const EXCLUDED_THEMES = new Set(['glassmorphic']);

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGB = /^rgba?\(\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?\)$/i;
const KEYWORDS = new Map<string, Rgba>([
  ['white', [255, 255, 255, 1]],
  ['black', [0, 0, 0, 1]],
]);

const PAIRS: Pair[] = [
  { name: 'text on bg', fg: 'var(--tp-text)', bg: 'var(--tp-bg)', min: 4.5 },
  { name: 'text-secondary on bg', fg: 'var(--tp-text-secondary)', bg: 'var(--tp-bg)', min: 4.5 },
  {
    name: 'am-pm-text-unselected on bg',
    fg: 'var(--tp-am-pm-text-unselected)',
    bg: 'var(--tp-bg)',
    min: 4.5,
  },
  { name: 'wheel-text-color on bg', fg: 'var(--tp-wheel-text-color)', bg: 'var(--tp-bg)', min: 4.5 },
  {
    name: 'wheel-selected-color on wheel-highlight-bg',
    fg: 'var(--tp-wheel-selected-color)',
    bg: 'var(--tp-wheel-highlight-bg)',
    min: 4.5,
  },
  {
    name: 'on-primary-container on primary-container',
    fg: 'var(--tp-on-primary-container)',
    bg: 'var(--tp-primary-container)',
    min: 4.5,
  },
  {
    name: 'am-pm-text-selected on am-pm-active',
    fg: 'var(--tp-am-pm-text-selected)',
    bg: 'var(--tp-am-pm-active)',
    min: 4.5,
  },
  {
    name: 'footer button text on bg',
    fg: 'var(--tp-btn-text, var(--tp-primary))',
    bg: 'var(--tp-bg)',
    min: 4.5,
  },
  {
    name: 'focus ring on bg (the shared ring, wheel columns included)',
    fg: 'var(--tp-focus-ring, var(--tp-primary))',
    bg: 'var(--tp-bg)',
    min: 3,
  },
  {
    name: 'focus ring on input-bg (focused hour/minute input)',
    fg: 'var(--tp-focus-ring, var(--tp-primary))',
    bg: 'var(--tp-input-bg)',
    min: 3,
  },
  {
    name: 'focus ring on primary-container (focused active hour/minute input)',
    fg: 'var(--tp-on-primary-container)',
    bg: 'var(--tp-primary-container)',
    min: 3,
  },
  {
    name: 'focus ring on a selected AM/PM segment',
    fg: 'var(--tp-am-pm-text-selected)',
    bg: 'var(--tp-am-pm-active)',
    min: 3,
  },
  { name: 'on-primary on primary', fg: 'var(--tp-on-primary)', bg: 'var(--tp-primary)', min: 4.5 },
  {
    name: 'timezone option text on the dropdown menu',
    fg: 'var(--tp-dropdown-option-text)',
    bg: 'var(--tp-dropdown-option-bg)',
    min: 4.5,
  },
  {
    name: 'timezone option text on its hover/focus background',
    fg: 'var(--tp-dropdown-option-hover-text, var(--tp-dropdown-option-text))',
    bg: 'var(--tp-surface-hover)',
    under: 'var(--tp-dropdown-option-bg)',
    min: 4.5,
  },
];

const parseColor = (value: string, where: string): Rgba => {
  const keyword = KEYWORDS.get(value.toLowerCase());
  if (keyword) return keyword;
  const hex = value.match(HEX)?.[1];
  if (hex) {
    const digits = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex;
    return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16)).concat(1) as Rgba;
  }
  const rgb = value.match(RGB);
  if (rgb) return [1, 2, 3, 4].map((i) => Number(rgb[i] ?? 1)) as Rgba;
  throw new Error(`${where}: unsupported color value "${value}"`);
};

const color = (theme: string, scope: Scope, value: string): Rgba =>
  parseColor(resolveValue(scope, value), `${theme} ${value}`);

const over = ([r, g, b, a]: Rgba, [br, bg, bb]: Rgba): Rgba => [
  r * a + br * (1 - a),
  g * a + bg * (1 - a),
  b * a + bb * (1 - a),
  1,
];

const luminance = ([r, g, b]: Rgba): number => {
  const c = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

const contrast = (a: Rgba, b: Rgba): number => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

const themes = loadThemes();

const measure = (theme: string, { fg, bg, under = 'var(--tp-bg)' }: Omit<Pair, 'name' | 'min'>): number => {
  const scope = themes.get(theme) as Scope;
  const page = color(theme, scope, 'var(--tp-bg)');
  if (page[3] < 1) {
    throw new Error(`${theme}: --tp-bg is translucent, so its contrast depends on the page behind it`);
  }
  const base = over(color(theme, scope, under), page);
  const surface = over(color(theme, scope, bg), base);
  return contrast(over(color(theme, scope, fg), surface), surface);
};

const cases = [...themes.keys()]
  .filter((theme) => !EXCLUDED_THEMES.has(theme))
  .sort()
  .flatMap((theme) => PAIRS.map((pair) => ({ theme, ...pair })));

describe('theme text contrast (WCAG AA, glassmorphic excluded: translucent background)', () => {
  it.each(themeFiles)('%s declares its tokens in a data-theme block', (file) => {
    expect(themeBlocks(file).length).toBeGreaterThan(0);
  });

  it.each(cases)('$theme: $name is at least $min:1', ({ theme, ...pair }) => {
    expect(measure(theme, pair)).toBeGreaterThanOrEqual(pair.min);
  });
});
