export type VariableRow = { name: string; value: string };

export type VariableGroup = { title: string; intro?: string; rows: VariableRow[] };

type Scale = { name: string; size: string; lineHeight: string; weight: string; tracking: string };

const SCALES: Scale[] = [
  { name: "body-large", size: "16px", lineHeight: "24px", weight: "400", tracking: "0.5px" },
  { name: "body-small", size: "12px", lineHeight: "16px", weight: "400", tracking: "0.4px" },
  { name: "label-large", size: "14px", lineHeight: "20px", weight: "500", tracking: "0.1px" },
  { name: "label-small", size: "11px", lineHeight: "16px", weight: "500", tracking: "0.5px" },
  { name: "title-large", size: "22px", lineHeight: "28px", weight: "400", tracking: "0" },
  { name: "headline-large", size: "32px", lineHeight: "40px", weight: "400", tracking: "0" },
];

function scaleRows(scale: Scale): VariableRow[] {
  const prefix = `--dp-ui-sys-typescale-${scale.name}`;
  return [
    { name: `${prefix}-font`, value: "var(--dp-ui-sys-typescale-font)" },
    { name: `${prefix}-size`, value: scale.size },
    { name: `${prefix}-line-height`, value: scale.lineHeight },
    { name: `${prefix}-weight`, value: scale.weight },
    { name: `${prefix}-tracking`, value: scale.tracking },
  ];
}

const color = (name: string) => `var(--dp-ui-sys-color-${name})`;

export const VARIABLE_GROUPS: VariableGroup[] = [
  {
    title: "Color roles",
    intro:
      "System tokens follow the Material Design 3 roles and are set with `light-dark()`, so the first value is the light scheme and the second the dark one.",
    rows: [
      { name: "--dp-ui-sys-color-surface-container-high", value: "light-dark(#ece6f0, #2b2930)" },
      { name: "--dp-ui-sys-color-surface-variant", value: "light-dark(#e7e0ec, #49454f)" },
      { name: "--dp-ui-sys-color-on-surface", value: "light-dark(#1d1b20, #e6e0e9)" },
      { name: "--dp-ui-sys-color-on-surface-variant", value: "light-dark(#49454f, #cac4d0)" },
      { name: "--dp-ui-sys-color-primary", value: "light-dark(#6750a4, #d0bcff)" },
      { name: "--dp-ui-sys-color-on-primary", value: "light-dark(#ffffff, #381e72)" },
      { name: "--dp-ui-sys-color-secondary-container", value: "light-dark(#e8def8, #4a4458)" },
      { name: "--dp-ui-sys-color-on-secondary-container", value: "light-dark(#4a4458, #e8def8)" },
      { name: "--dp-ui-sys-color-on-primary-container", value: "light-dark(#4f378b, #eaddff)" },
      { name: "--dp-ui-sys-color-outline", value: "light-dark(#79747e, #938f99)" },
      { name: "--dp-ui-sys-color-outline-variant", value: "light-dark(#cac4d0, #49454f)" },
      { name: "--dp-ui-sys-color-error", value: "light-dark(#b3261e, #f2b8b5)" },
      { name: "--dp-ui-sys-color-scrim", value: "#000000" },
    ],
  },
  {
    title: "Shape",
    rows: [
      { name: "--dp-ui-sys-shape-corner-none", value: "0" },
      { name: "--dp-ui-sys-shape-corner-extra-small", value: "4px" },
      { name: "--dp-ui-sys-shape-corner-small", value: "8px" },
      { name: "--dp-ui-sys-shape-corner-medium", value: "12px" },
      { name: "--dp-ui-sys-shape-corner-large", value: "16px" },
      { name: "--dp-ui-sys-shape-corner-extra-large", value: "28px" },
      { name: "--dp-ui-sys-shape-corner-full", value: "9999px" },
    ],
  },
  {
    title: "Typography",
    intro:
      "`--dp-ui-sys-typescale-font` sets the family. Each scale below has a font, size, line height, weight and tracking variable.",
    rows: [
      { name: "--dp-ui-sys-typescale-font", value: "Roboto, system-ui, sans-serif" },
      ...SCALES.flatMap(scaleRows),
    ],
  },
  {
    title: "State layers",
    rows: [
      { name: "--dp-ui-sys-state-layer-hover-opacity", value: "0.08" },
      { name: "--dp-ui-sys-state-layer-focus-opacity", value: "0.1" },
      { name: "--dp-ui-sys-state-layer-pressed-opacity", value: "0.1" },
      { name: "--dp-ui-sys-state-disabled-opacity", value: "0.38" },
    ],
  },
  {
    title: "Elevation",
    rows: [
      {
        name: "--dp-ui-sys-elevation-level3",
        value: "0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15)",
      },
    ],
  },
  {
    title: "Container",
    rows: [
      { name: "--dp-ui-container-color", value: color("surface-container-high") },
      { name: "--dp-ui-container-text-color", value: color("on-surface") },
      { name: "--dp-ui-container-width", value: "360px" },
      { name: "--dp-ui-container-shape-docked", value: "var(--dp-ui-sys-shape-corner-large)" },
      { name: "--dp-ui-container-shape-modal", value: "var(--dp-ui-sys-shape-corner-extra-large)" },
      { name: "--dp-ui-container-elevation", value: "var(--dp-ui-sys-elevation-level3)" },
      { name: "--dp-ui-container-backdrop-filter", value: "none" },
      { name: "--dp-ui-container-side-padding", value: "12px" },
    ],
  },
  {
    title: "Scrim and divider",
    rows: [
      { name: "--dp-ui-scrim-color", value: color("scrim") },
      { name: "--dp-ui-scrim-opacity", value: "0.32" },
      { name: "--dp-ui-divider-color", value: color("outline-variant") },
    ],
  },
  {
    title: "Header",
    rows: [
      { name: "--dp-ui-header-height-docked", value: "64px" },
      { name: "--dp-ui-header-height-modal", value: "120px" },
      { name: "--dp-ui-header-supporting-text-color", value: color("on-surface-variant") },
      { name: "--dp-ui-header-headline-color", value: color("on-surface-variant") },
    ],
  },
  {
    title: "Buttons",
    rows: [
      { name: "--dp-ui-menu-button-height", value: "40px" },
      { name: "--dp-ui-menu-button-label-text-color", value: color("on-surface-variant") },
      { name: "--dp-ui-menu-button-icon-size", value: "18px" },
      { name: "--dp-ui-icon-button-size", value: "40px" },
      { name: "--dp-ui-icon-button-icon-size", value: "24px" },
      { name: "--dp-ui-icon-button-icon-color", value: color("on-surface-variant") },
      { name: "--dp-ui-text-button-height", value: "36px" },
      { name: "--dp-ui-text-button-label-text-color", value: color("primary") },
    ],
  },
  {
    title: "Weekdays",
    rows: [
      { name: "--dp-ui-weekday-label-text-color", value: color("on-surface") },
      { name: "--dp-ui-week-number-label-text-color", value: color("on-surface-variant") },
      { name: "--dp-ui-week-number-width", value: "48px" },
    ],
  },
  {
    title: "Day cell",
    rows: [
      { name: "--dp-ui-date-container-size", value: "48px" },
      { name: "--dp-ui-date-state-layer-size", value: "40px" },
      { name: "--dp-ui-date-label-text-color", value: color("on-surface") },
      { name: "--dp-ui-date-state-layer-color", value: color("on-surface") },
      { name: "--dp-ui-date-outside-month-opacity", value: "0.38" },
      { name: "--dp-ui-date-disabled-opacity", value: "var(--dp-ui-sys-state-disabled-opacity)" },
      { name: "--dp-ui-date-today-outline-width", value: "1px" },
      { name: "--dp-ui-date-today-outline-color", value: color("primary") },
      { name: "--dp-ui-date-today-label-text-color", value: color("primary") },
      { name: "--dp-ui-date-selected-container-color", value: color("primary") },
      { name: "--dp-ui-date-selected-label-text-color", value: color("on-primary") },
      { name: "--dp-ui-date-content-color", value: color("on-surface-variant") },
      { name: "--dp-ui-date-content-row-height", value: "64px" },
    ],
  },
  {
    title: "Range, badge and presets",
    rows: [
      { name: "--dp-ui-date-in-range-container-color", value: color("secondary-container") },
      { name: "--dp-ui-date-in-range-label-text-color", value: color("on-secondary-container") },
      { name: "--dp-ui-date-in-range-state-layer-color", value: color("on-primary-container") },
      { name: "--dp-ui-date-badge-color", value: color("primary") },
      { name: "--dp-ui-date-badge-selected-color", value: color("on-primary") },
      { name: "--dp-ui-date-badge-size", value: "4px" },
      { name: "--dp-ui-range-height", value: "568px" },
      { name: "--dp-ui-input-container-width", value: "328px" },
      { name: "--dp-ui-month-width", value: "calc(7 * var(--dp-ui-date-container-size))" },
      { name: "--dp-ui-month-gap", value: "24px" },
      { name: "--dp-ui-presets-width", value: "168px" },
      { name: "--dp-ui-preset-height", value: "32px" },
      { name: "--dp-ui-preset-shape", value: "8px" },
      { name: "--dp-ui-preset-outline-color", value: color("outline") },
      { name: "--dp-ui-preset-label-text-color", value: color("on-surface-variant") },
      { name: "--dp-ui-preset-pressed-container-color", value: color("secondary-container") },
      { name: "--dp-ui-preset-pressed-label-text-color", value: color("on-secondary-container") },
      { name: "--dp-ui-preset-row-height", value: "48px" },
    ],
  },
  {
    title: "Text field",
    rows: [
      { name: "--dp-ui-text-field-height", value: "56px" },
      { name: "--dp-ui-text-field-shape", value: "var(--dp-ui-sys-shape-corner-extra-small)" },
      { name: "--dp-ui-text-field-outline-width", value: "1px" },
      { name: "--dp-ui-text-field-outline-color", value: color("outline") },
      { name: "--dp-ui-text-field-focus-outline-width", value: "2px" },
      { name: "--dp-ui-text-field-focus-outline-color", value: color("primary") },
      { name: "--dp-ui-text-field-label-container-color", value: "var(--dp-ui-container-color)" },
      { name: "--dp-ui-text-field-label-text-color", value: color("on-surface-variant") },
      { name: "--dp-ui-text-field-focus-label-text-color", value: color("primary") },
      { name: "--dp-ui-text-field-input-text-color", value: color("on-surface") },
      { name: "--dp-ui-text-field-supporting-text-color", value: color("on-surface-variant") },
      { name: "--dp-ui-text-field-error-color", value: color("error") },
    ],
  },
  {
    title: "Menus",
    rows: [
      { name: "--dp-ui-menu-item-height", value: "48px" },
      { name: "--dp-ui-menu-item-label-text-color", value: color("on-surface") },
      { name: "--dp-ui-menu-item-icon-color", value: color("on-surface-variant") },
      { name: "--dp-ui-menu-item-selected-container-color", value: color("surface-variant") },
      { name: "--dp-ui-menu-max-height", value: "336px" },
      { name: "--dp-ui-scrollbar-thumb-color", value: color("on-surface-variant") },
    ],
  },
  {
    title: "Year grid",
    rows: [
      { name: "--dp-ui-year-item-width", value: "72px" },
      { name: "--dp-ui-year-item-height", value: "36px" },
      { name: "--dp-ui-year-item-label-text-color", value: color("on-surface-variant") },
      { name: "--dp-ui-year-item-selected-container-color", value: color("primary") },
      { name: "--dp-ui-year-item-selected-label-text-color", value: color("on-primary") },
      { name: "--dp-ui-year-selection-height", value: "288px" },
    ],
  },
  {
    title: "Focus ring",
    rows: [
      { name: "--dp-ui-focus-ring-color", value: color("primary") },
      { name: "--dp-ui-focus-ring-width", value: "2px" },
      { name: "--dp-ui-focus-ring-offset", value: "2px" },
    ],
  },
  {
    title: "Popover",
    rows: [
      { name: "--dp-ui-popover-gap", value: "4px" },
      { name: "--dp-ui-popover-edge-margin", value: "4px" },
      { name: "--dp-ui-popover-min-height", value: "160px" },
      { name: "--dp-ui-popover-z-index", value: "5001" },
    ],
  },
];

export const BRAND_CSS = `.brand {
  --dp-ui-sys-color-primary: #006a6a;
  --dp-ui-sys-color-on-primary: #ffffff;
  --dp-ui-sys-color-secondary-container: #cce8e7;
  --dp-ui-container-shape-docked: 8px;
}`;

export const BRAND_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", { ui: { cssClass: "brand" } }).create();`;
