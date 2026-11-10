/**
 * @jest-environment node
 */
import { loadThemes, resolveValue } from './style-test-helpers';
import type { Scope } from './style-test-helpers';

const DARK_TOKENS: ReadonlyArray<readonly [string, string]> = [
  ['--tp-bg', '#2b2930'],
  ['--tp-surface', '#36343b'],
  ['--tp-input-bg', '#36343b'],
  ['--tp-surface-hover', '#444249'],
  ['--tp-hover-bg', '#444249'],
  ['--tp-surface-container', '#211f26'],
  ['--tp-text', '#e6e0e9'],
  ['--tp-on-surface', '#e6e0e9'],
  ['--tp-on-surface-rgb', '230, 224, 233'],
  ['--tp-text-secondary', '#cac4d0'],
  ['--tp-text-type-time', '#cac4d0'],
  ['--tp-text-icon', '#cac4d0'],
  ['--tp-am-pm-text-unselected', '#cac4d0'],
  ['--tp-on-surface-variant', '#cac4d0'],
  ['--tp-text-disabled', 'rgba(230, 224, 233, 0.38)'],
  ['--tp-primary', '#d0bcff'],
  ['--tp-outline', '#d0bcff'],
  ['--tp-primary-rgb', '208, 188, 255'],
  ['--tp-on-primary', '#381e72'],
  ['--tp-primary-container', '#4f378b'],
  ['--tp-on-primary-container', '#eaddff'],
  ['--tp-tertiary-container', '#633b48'],
  ['--tp-am-pm-active', '#633b48'],
  ['--tp-on-tertiary-container', '#ffd8e4'],
  ['--tp-am-pm-text-selected', '#ffd8e4'],
  ['--tp-outline-variant', '#49454f'],
  ['--tp-border', '#49454f'],
  ['--tp-dropdown-option-bg', '#2b2930'],
  ['--tp-dropdown-option-text', '#e6e0e9'],
  ['--tp-error', '#f2b8b5'],
  ['--tp-wheel-highlight-bg', '#4f378b'],
  ['--tp-wheel-highlight-border', '#49454f'],
  ['--tp-wheel-text-color', '#e6e0e9'],
  ['--tp-wheel-selected-color', '#eaddff'],
  ['--tp-shadow', '0px 8px 16px rgba(0, 0, 0, 0.6)'],
];

const BASIC_COLOR_TOKENS: ReadonlyArray<string> = [
  '--tp-bg',
  '--tp-surface',
  '--tp-surface-hover',
  '--tp-input-bg',
  '--tp-text',
  '--tp-text-secondary',
  '--tp-text-disabled',
  '--tp-text-type-time',
  '--tp-text-icon',
  '--tp-am-pm-active',
  '--tp-am-pm-text-selected',
  '--tp-am-pm-text-unselected',
  '--tp-primary',
  '--tp-on-primary',
  '--tp-primary-container',
  '--tp-on-primary-container',
  '--tp-primary-rgb',
  '--tp-on-surface',
  '--tp-on-surface-variant',
  '--tp-on-surface-rgb',
  '--tp-surface-container',
  '--tp-outline-variant',
  '--tp-tertiary-container',
  '--tp-on-tertiary-container',
  '--tp-border',
  '--tp-outline',
  '--tp-hover-bg',
  '--tp-dropdown-option-bg',
  '--tp-dropdown-option-text',
  '--tp-error',
  '--tp-shadow',
];

describe('dark theme (M3 baseline dark)', () => {
  const dark = loadThemes().get('dark') as Scope;

  it.each(DARK_TOKENS)('%s is %s', (token, expected) => {
    expect(resolveValue(dark, `var(${token})`)).toBe(expected);
  });

  it.each(BASIC_COLOR_TOKENS)('sets %s itself instead of falling back to the light :root value', (token) => {
    expect(dark.tokens.has(token)).toBe(true);
  });
});
