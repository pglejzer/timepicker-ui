import type { ThemeName } from "@pglejzer/datepicker-ui";

export const DATEPICKER_VERSION = "1.0.0";
export const DATEPICKER_PACKAGE = "@pglejzer/datepicker-ui";
export const DATEPICKER_NPM_URL = "https://www.npmjs.com/package/@pglejzer/datepicker-ui";
export const DATEPICKER_REPO_URL = "https://github.com/pglejzer/datepicker-ui";

export const DATEPICKER_THEMES = [
  "basic",
  "m3-green",
  "crane",
  "crane-straight",
  "m2",
  "glassmorphic",
  "pastel",
  "ai",
  "cyberpunk",
  "blueprint",
] as const satisfies readonly ThemeName[];

export type DatepickerThemeName = (typeof DATEPICKER_THEMES)[number];

export function isDatepickerTheme(value: string): value is DatepickerThemeName {
  return (DATEPICKER_THEMES as readonly string[]).includes(value);
}
