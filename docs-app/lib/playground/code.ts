import {
  DEFAULT_STATE,
  PLUGIN_EXPORT,
  appearanceEntries,
  hasAppearance,
  isPopover,
  pluginsFor,
  rangeEnabled,
  type PlaygroundPlugin,
  type PlaygroundState,
} from "./state";

type Options = Record<string, Record<string, unknown>>;

const CUSTOM_CLASS = "my-picker";
const INPUT_HTML = '<input id="timepicker" type="text" />';
const CONTAINER_HTML = '<div id="timepicker-container"></div>';
const CONTAINER = "#timepicker-container";

export function quote(value: string): string {
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n");
  return `'${escaped}'`;
}

function formatValue(value: unknown, indent: number): string {
  if (typeof value === "string") return quote(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const pad = "  ".repeat(indent + 1);
    const inner = entries.map(([key, item]) => `${pad}${key}: ${formatValue(item, indent + 1)},`).join("\n");
    return `{\n${inner}\n${"  ".repeat(indent)}}`;
  }
  return "undefined";
}

function put(options: Options, group: string, key: string, value: unknown): void {
  options[group] = { ...(options[group] ?? {}), [key]: value };
}

export function toOptions(state: PlaygroundState): Options {
  const options: Options = {};
  if (state.clockType !== DEFAULT_STATE.clockType) put(options, "clock", "type", state.clockType);
  if (state.incrementHours !== DEFAULT_STATE.incrementHours) {
    put(options, "clock", "incrementHours", state.incrementHours);
  }
  if (state.incrementMinutes !== DEFAULT_STATE.incrementMinutes) {
    put(options, "clock", "incrementMinutes", state.incrementMinutes);
  }
  if (state.showSeconds) {
    put(options, "clock", "showSeconds", true);
    if (state.incrementSeconds !== DEFAULT_STATE.incrementSeconds) {
      put(options, "clock", "incrementSeconds", state.incrementSeconds);
    }
  }
  if (state.mode !== DEFAULT_STATE.mode) put(options, "ui", "mode", state.mode);
  if (state.theme !== DEFAULT_STATE.theme) put(options, "ui", "theme", state.theme);
  if (!state.animation) put(options, "ui", "animation", false);
  if (state.display === "modal" && !isPopover(state) && !state.backdrop) put(options, "ui", "backdrop", false);
  if (state.editable) put(options, "ui", "editable", true);
  if (state.clearButton) put(options, "ui", "clearButton", true);
  const ok = state.okLabel.trim();
  const cancel = state.cancelLabel.trim();
  if (ok && ok !== DEFAULT_STATE.okLabel) put(options, "labels", "ok", ok);
  if (cancel && cancel !== DEFAULT_STATE.cancelLabel) put(options, "labels", "cancel", cancel);
  if (isPopover(state)) put(options, "wheel", "placement", state.wheelPlacement);
  if (state.mode === "compact-wheel" && state.wheelHideFooter) put(options, "wheel", "hideFooter", true);
  if (state.mode !== "clock" && state.wheelCommitOnScroll) put(options, "wheel", "commitOnScroll", true);
  if (rangeEnabled(state)) {
    put(options, "range", "enabled", true);
    if (state.rangeMinDuration !== null) put(options, "range", "minDuration", state.rangeMinDuration);
    if (state.rangeMaxDuration !== null) put(options, "range", "maxDuration", state.rangeMaxDuration);
  }
  if (state.timezone) {
    put(options, "timezone", "enabled", true);
    if (state.timezoneDefault) put(options, "timezone", "default", state.timezoneDefault);
  }
  return options;
}

function cssImports(state: PlaygroundState): string[] {
  const lines = ["import 'timepicker-ui/main.css';"];
  if (state.theme !== DEFAULT_STATE.theme) lines.push(`import 'timepicker-ui/theme-${state.theme}.css';`);
  return lines;
}

function pluginImports(plugins: PlaygroundPlugin[]): string[] {
  return plugins.map((plugin) => `import { ${PLUGIN_EXPORT[plugin]} } from 'timepicker-ui/plugins/${plugin}';`);
}

function registrations(plugins: PlaygroundPlugin[]): string[] {
  if (plugins.length === 0) return [];
  return [...plugins.map((plugin) => `PluginRegistry.register(${PLUGIN_EXPORT[plugin]});`), ""];
}

function codeOptions(state: PlaygroundState): Options {
  const options = toOptions(state);
  if (hasAppearance(state)) put(options, "ui", "cssClass", CUSTOM_CLASS);
  return options;
}

export function toJs(state: PlaygroundState): string {
  const plugins = pluginsFor(state);
  const options = codeOptions(state);
  const inline = state.display === "inline";
  if (inline) put(options, "ui", "inline", { enabled: true, container: CONTAINER, showButtons: true });
  const html = inline ? `${INPUT_HTML} ${CONTAINER_HTML}` : INPUT_HTML;
  const named = plugins.length ? "TimepickerUI, PluginRegistry" : "TimepickerUI";
  const create = Object.keys(options).length
    ? `const picker = new TimepickerUI(input, ${formatValue(options, 0)});`
    : "const picker = new TimepickerUI(input);";
  return [
    `// HTML: ${html}`,
    `import { ${named} } from 'timepicker-ui';`,
    ...pluginImports(plugins),
    ...cssImports(state),
    "",
    ...registrations(plugins),
    "const input = document.querySelector('#timepicker');",
    create,
    "picker.create();",
  ].join("\n");
}

export function toReact(state: PlaygroundState): string {
  const plugins = pluginsFor(state);
  const options = codeOptions(state);
  const named = plugins.length ? "Timepicker, PluginRegistry" : "Timepicker";
  const element = Object.keys(options).length
    ? [
        "  return (",
        "    <Timepicker",
        '      placeholder="Select time"',
        `      options={${formatValue(options, 3)}}`,
        "    />",
        "  );",
      ]
    : ['  return <Timepicker placeholder="Select time" />;'];
  return [
    `import { ${named} } from 'timepicker-ui-react';`,
    ...pluginImports(plugins),
    ...cssImports(state),
    "",
    ...registrations(plugins),
    "export function TimeField() {",
    ...element,
    "}",
  ].join("\n");
}

export function appearanceCss(state: PlaygroundState, className: string): string {
  const entries = appearanceEntries(state);
  if (entries.length === 0) return "";
  const body = entries.map(([name, value]) => `  ${name}: ${value};`).join("\n");
  return `.tp-ui-wrapper.${className} {\n${body}\n}`;
}

export function toCss(state: PlaygroundState): string {
  return appearanceCss(state, CUSTOM_CLASS);
}
