import { THEMES } from "@/lib/site";
import {
  DEFAULT_STATE,
  TIMEZONES,
  appearanceEntries,
  isPopover,
  rangeEnabled,
  type PlaygroundState,
} from "./state";

type Key = Exclude<keyof PlaygroundState, "appearance">;
type Value = PlaygroundState[Key];
type Choice = { value: string; label: string };
type When = (state: PlaygroundState) => boolean;

type Common = {
  key: Key;
  label: string;
  option: string;
  help?: string;
  libraryDefault?: string;
  showIf?: When;
};

export type Control =
  | (Common & { kind: "radio"; choices: Choice[] })
  | (Common & { kind: "select"; choices: Choice[] })
  | (Common & { kind: "swatches"; choices: Choice[] })
  | (Common & { kind: "toggle" })
  | (Common & { kind: "number"; min: number; max: number; step: number })
  | (Common & { kind: "text" });

export type GroupId = "look" | "format" | "behavior" | "labels" | "plugins" | "appearance";

export type ControlGroup = { id: GroupId; legend: string; open: boolean; controls: Control[] };

const steps = (values: number[]): Choice[] =>
  values.map((value) => ({ value: String(value), label: String(value) }));

const STEPS = steps([1, 5, 10, 15, 20, 30]);

export const CONTROL_GROUPS: ControlGroup[] = [
  {
    id: "look",
    legend: "Look",
    open: true,
    controls: [
      {
        kind: "swatches",
        key: "theme",
        label: "Theme",
        option: "ui.theme",
        choices: THEMES.map((theme) => ({ value: theme, label: theme })),
      },
      {
        kind: "radio",
        key: "mode",
        label: "Mode",
        option: "ui.mode",
        choices: [
          { value: "clock", label: "Clock" },
          { value: "wheel", label: "Wheel" },
          { value: "compact-wheel", label: "Compact wheel" },
        ],
      },
      {
        kind: "radio",
        key: "display",
        label: "Display",
        option: "ui.inline.enabled",
        libraryDefault: "false",
        choices: [
          { value: "inline", label: "Inline" },
          { value: "modal", label: "Modal" },
        ],
      },
    ],
  },
  {
    id: "format",
    legend: "Format",
    open: true,
    controls: [
      {
        kind: "radio",
        key: "clockType",
        label: "Hour format",
        option: "clock.type",
        choices: [
          { value: "12h", label: "12-hour" },
          { value: "24h", label: "24-hour" },
        ],
      },
      {
        kind: "select",
        key: "incrementHours",
        label: "Hour step",
        option: "clock.incrementHours",
        choices: steps([1, 2, 3, 4, 6]),
      },
      {
        kind: "select",
        key: "incrementMinutes",
        label: "Minute step",
        option: "clock.incrementMinutes",
        choices: STEPS,
      },
      { kind: "toggle", key: "showSeconds", label: "Show seconds", option: "clock.showSeconds" },
      {
        kind: "select",
        key: "incrementSeconds",
        label: "Second step",
        option: "clock.incrementSeconds",
        choices: STEPS,
        showIf: (s) => s.showSeconds,
      },
    ],
  },
  {
    id: "behavior",
    legend: "Behavior",
    open: false,
    controls: [
      { kind: "toggle", key: "animation", label: "Animation", option: "ui.animation" },
      {
        kind: "toggle",
        key: "backdrop",
        label: "Backdrop",
        option: "ui.backdrop",
        help: "Shades the page behind the modal.",
        showIf: (s) => s.display === "modal" && !isPopover(s),
      },
      {
        kind: "toggle",
        key: "editable",
        label: "Editable fields",
        option: "ui.editable",
        help: "Lets users type the time into the hour and minute fields.",
      },
      { kind: "toggle", key: "clearButton", label: "Clear button", option: "ui.clearButton" },
      {
        kind: "radio",
        key: "wheelPlacement",
        label: "Popover placement",
        option: "wheel.placement",
        help: "Any choice except None opens a popover at the input instead of a modal.",
        choices: [
          { value: "", label: "None (modal)" },
          { value: "auto", label: "Auto" },
          { value: "top", label: "Top" },
          { value: "bottom", label: "Bottom" },
        ],
        showIf: (s) => s.mode === "compact-wheel" && s.display === "modal",
      },
      {
        kind: "toggle",
        key: "wheelHideFooter",
        label: "Hide wheel footer",
        option: "wheel.hideFooter",
        help: "Leaves out the footer with the OK and Cancel buttons.",
        showIf: (s) => s.mode === "compact-wheel",
      },
      {
        kind: "toggle",
        key: "wheelCommitOnScroll",
        label: "Commit on scroll",
        option: "wheel.commitOnScroll",
        help: "Writes the time to the input when scrolling stops, so OK is not needed.",
        showIf: (s) => s.mode !== "clock",
      },
    ],
  },
  {
    id: "labels",
    legend: "Labels",
    open: false,
    controls: [
      { kind: "text", key: "okLabel", label: "OK label", option: "labels.ok" },
      { kind: "text", key: "cancelLabel", label: "Cancel label", option: "labels.cancel" },
    ],
  },
  {
    id: "plugins",
    legend: "Plugins",
    open: false,
    controls: [
      {
        kind: "toggle",
        key: "range",
        label: "Range (from and to)",
        option: "range.enabled",
        showIf: (s) => s.mode === "clock",
      },
      {
        kind: "number",
        key: "rangeMinDuration",
        label: "Minimum duration (minutes)",
        option: "range.minDuration",
        help: "OK stays disabled until the range is at least this long.",
        min: 0,
        max: 1440,
        step: 5,
        showIf: rangeEnabled,
      },
      {
        kind: "number",
        key: "rangeMaxDuration",
        label: "Maximum duration (minutes)",
        option: "range.maxDuration",
        help: "OK stays disabled while the range is longer than this.",
        min: 0,
        max: 1440,
        step: 5,
        showIf: rangeEnabled,
      },
      { kind: "toggle", key: "timezone", label: "Timezone", option: "timezone.enabled" },
      {
        kind: "select",
        key: "timezoneDefault",
        label: "Default timezone",
        option: "timezone.default",
        help: "Preselects this zone in the timezone list.",
        choices: [{ value: "", label: "None" }, ...TIMEZONES.map((zone) => ({ value: zone, label: zone }))],
        showIf: (s) => s.timezone,
      },
    ],
  },
  { id: "appearance", legend: "Colors and shape", open: false, controls: [] },
];

export function isVisible(control: Control, state: PlaygroundState): boolean {
  return !control.showIf || control.showIf(state);
}

export function isChanged(control: Control, state: PlaygroundState): boolean {
  return state[control.key] !== DEFAULT_STATE[control.key];
}

export function changedCount(group: ControlGroup, state: PlaygroundState): number {
  if (group.id === "appearance") return appearanceEntries(state).length;
  return group.controls.filter((control) => isVisible(control, state) && isChanged(control, state)).length;
}

export function groupDefaults(group: ControlGroup): Partial<PlaygroundState> {
  if (group.id === "appearance") return { appearance: {} };
  const patch: Partial<Record<Key, Value>> = {};
  for (const control of group.controls) patch[control.key] = DEFAULT_STATE[control.key];
  return patch as Partial<PlaygroundState>;
}

function formatDefault(value: Value): string {
  if (value === null || value === "") return "undefined";
  if (typeof value === "string") return `'${value}'`;
  return String(value);
}

export function defaultText(control: Control): string {
  return control.libraryDefault ?? formatDefault(DEFAULT_STATE[control.key]);
}
