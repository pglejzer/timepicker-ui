export const LIBRARY_VERSION = "4.6.0";
export const REPO = "pglejzer/timepicker-ui";
export const REPO_URL = `https://github.com/${REPO}`;
export const ISSUES_URL = `${REPO_URL}/issues`;
export const NPM_URL = "https://www.npmjs.com/package/timepicker-ui";
export const REACT_REPO_URL = "https://github.com/pglejzer/timepicker-ui-react";
export const REACT_NPM_URL = "https://www.npmjs.com/package/timepicker-ui-react";

export const THEMES = [
  "basic",
  "crane",
  "crane-straight",
  "m2",
  "m3-green",
  "dark",
  "glassmorphic",
  "pastel",
  "ai",
  "cyberpunk",
  "blueprint",
  "blueprint-dark",
] as const;

export type ThemeName = (typeof THEMES)[number];
