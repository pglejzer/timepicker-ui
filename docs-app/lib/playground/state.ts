export type PickerMode = "clock" | "wheel" | "compact-wheel";
export type Display = "inline" | "modal";
export type Step = 1 | 5 | 10 | 15 | 20 | 30;
export type HourStep = 1 | 2 | 3 | 4 | 6;
export type WheelPlacement = "" | "auto" | "top" | "bottom";
export type PlaygroundPlugin = "range" | "timezone" | "wheel";

export type PlaygroundState = {
  mode: PickerMode;
  theme: string;
  clockType: "12h" | "24h";
  display: Display;
  backdrop: boolean;
  animation: boolean;
  editable: boolean;
  clearButton: boolean;
  showSeconds: boolean;
  incrementHours: HourStep;
  incrementMinutes: Step;
  incrementSeconds: Step;
  okLabel: string;
  cancelLabel: string;
  wheelPlacement: WheelPlacement;
  wheelHideFooter: boolean;
  wheelCommitOnScroll: boolean;
  range: boolean;
  rangeMinDuration: number | null;
  rangeMaxDuration: number | null;
  timezone: boolean;
  timezoneDefault: string;
  appearance: Record<string, string>;
};

export const DEFAULT_STATE: PlaygroundState = {
  mode: "clock",
  theme: "basic",
  clockType: "12h",
  display: "inline",
  backdrop: true,
  animation: true,
  editable: false,
  clearButton: false,
  showSeconds: false,
  incrementHours: 1,
  incrementMinutes: 1,
  incrementSeconds: 1,
  okLabel: "OK",
  cancelLabel: "Cancel",
  wheelPlacement: "",
  wheelHideFooter: false,
  wheelCommitOnScroll: false,
  range: false,
  rangeMinDuration: null,
  rangeMaxDuration: null,
  timezone: false,
  timezoneDefault: "",
  appearance: {},
};

export type Preset = { id: string; label: string; patch: Partial<PlaygroundState> };

export const PRESETS: readonly Preset[] = [
  { id: "default", label: "Default", patch: {} },
  { id: "24h", label: "24-hour", patch: { clockType: "24h" } },
  { id: "wheel", label: "Wheel", patch: { mode: "wheel" } },
  {
    id: "compact-popover",
    label: "Compact popover",
    patch: { mode: "compact-wheel", display: "modal", wheelPlacement: "auto" },
  },
  { id: "range", label: "Range", patch: { range: true } },
  { id: "timezone", label: "Timezone", patch: { timezone: true, timezoneDefault: "UTC" } },
];

export function presetState(preset: Preset): PlaygroundState {
  return { ...DEFAULT_STATE, ...preset.patch, appearance: {} };
}

export const APPEARANCE_VARS = [
  { name: "--tp-primary", kind: "color", label: "Primary" },
  { name: "--tp-on-primary", kind: "color", label: "Text on primary" },
  { name: "--tp-bg", kind: "color", label: "Panel" },
  { name: "--tp-surface", kind: "color", label: "Dial" },
  { name: "--tp-input-bg", kind: "color", label: "Time fields" },
  { name: "--tp-text", kind: "color", label: "Text" },
  { name: "--tp-text-secondary", kind: "color", label: "Secondary text" },
  { name: "--tp-am-pm-active", kind: "color", label: "Active AM/PM" },
  { name: "--tp-border-radius", kind: "length", label: "Panel corners" },
  { name: "--tp-radius-md", kind: "length", label: "Field corners" },
] as const;

export const TIMEZONES = [
  "UTC",
  "America/Los_Angeles",
  "America/New_York",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
] as const;

export const PLUGIN_EXPORT: Record<PlaygroundPlugin, string> = {
  range: "RangePlugin",
  timezone: "TimezonePlugin",
  wheel: "WheelPlugin",
};

export function rangeEnabled(state: PlaygroundState): boolean {
  return state.range && state.mode === "clock";
}

export function isPopover(state: PlaygroundState): boolean {
  return state.display === "modal" && state.mode === "compact-wheel" && state.wheelPlacement !== "";
}

export function pluginsFor(state: PlaygroundState): PlaygroundPlugin[] {
  const plugins: PlaygroundPlugin[] = [];
  if (state.mode !== "clock") plugins.push("wheel");
  if (rangeEnabled(state)) plugins.push("range");
  if (state.timezone) plugins.push("timezone");
  return plugins;
}

function cleanCssValue(value: string): string {
  return value.replace(/[{};<>\r\n]/g, "").trim();
}

export function appearanceEntries(state: PlaygroundState): Array<[string, string]> {
  return APPEARANCE_VARS.map((variable): [string, string] => [
    variable.name,
    cleanCssValue(state.appearance[variable.name] ?? ""),
  ]).filter(([, value]) => value !== "");
}

export function hasAppearance(state: PlaygroundState): boolean {
  return appearanceEntries(state).length > 0;
}
