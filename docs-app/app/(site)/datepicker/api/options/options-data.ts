import type { LabelRow, OptionRow } from "../api-helpers";

export const CALENDAR_OPTIONS: OptionRow[] = [
  {
    name: "mode",
    type: '"single" | "range" | "multiple"',
    default: '"single"',
    description: "What the user selects.",
  },
  {
    name: "defaultValue",
    type: "PickerValueInput",
    default: "undefined",
    description:
      "Starting value for an empty input, in the shape of `setValue()`: a date, `{ start, end }` or an array of dates, matching `calendar.mode`. Any date can be `\"today\"`. Text already in the input wins when it is a date (with `ui.endInput`, the two fields). The value is written to the input and the form field, and a form reset restores it. Read when `create()` runs.",
  },
  {
    name: "range.minLength",
    type: "number",
    default: "undefined",
    description: "Shortest range in days, a positive integer.",
  },
  {
    name: "range.maxLength",
    type: "number",
    default: "undefined",
    description: "Longest range in days. Ignored, with an error, when below `minLength`.",
  },
  {
    name: "range.presets",
    type: "RangePreset[]",
    default: "[]",
    description: "Range shortcuts. See the `RangePreset` shape below.",
  },
  {
    name: "multiple.max",
    type: "number",
    default: "undefined",
    description: "Most dates in a multiple selection, a positive integer.",
  },
  {
    name: "months",
    type: "number",
    default: "1",
    description:
      "Months side by side, a positive integer. Applies to the docked look (`ui.layout`) at day precision. The modal and full-screen looks show one month.",
  },
  {
    name: "pageBy",
    type: '"month" | "view"',
    default: '"view"',
    description: "Whether the arrows move one month or as many as are shown.",
  },
  {
    name: "precision",
    type: '"day" | "month" | "year"',
    default: '"day"',
    description: "What one pick selects. Single mode only.",
  },
  {
    name: "locale",
    type: "string",
    default: "page locale",
    description:
      "BCP 47 tag. Falls back to `<html lang>`, then `navigator.language`, then `en-US`. An invalid tag emits `invalid-option`.",
  },
  {
    name: "weekStart",
    type: '"auto" | "sunday" | "monday" | "saturday"',
    default: '"auto"',
    description: "First day of the week. `\"auto\"` follows the locale.",
  },
  {
    name: "minDate",
    type: 'Date | string | "today"',
    default: "undefined",
    description: "Earliest selectable day. Strings are ISO `YYYY-MM-DD`.",
  },
  {
    name: "maxDate",
    type: 'Date | string | "today"',
    default: "undefined",
    description: "Latest selectable day.",
  },
  {
    name: "disabledDates",
    type: "(Date | string)[]",
    default: "[]",
    description: "Days that cannot be selected.",
  },
  {
    name: "enabledDates",
    type: "(Date | string)[]",
    default: "undefined",
    description: "When set, only these days can be selected.",
  },
  {
    name: "disabledWeekdays",
    type: "number[]",
    default: "[]",
    description: "Weekdays that cannot be selected. `0` is Sunday and `6` is Saturday.",
  },
  {
    name: "isDateDisabled",
    type: "(date: Date) => boolean",
    default: "undefined",
    description: "Return `true` for a day that cannot be selected.",
  },
  {
    name: "decorateDate",
    type: "(date: Date) => DateDecoration | undefined",
    default: "undefined",
    description: "Return extra presentation for a day.",
  },
  {
    name: "renderDate",
    type: "(date: Date) => string | Node | null",
    default: "undefined",
    description:
      "Return content shown under the day number. A string is always text, never HTML, and it is added to the accessible name of the day.",
  },
  {
    name: "validate",
    type: "(value: PickerValue | null) => string | null",
    default: "undefined",
    description:
      "Return a message to mark the field invalid, or `null` or `undefined` when it is fine. It never blocks a pick or a commit.",
  },
];

export const UI_OPTIONS: OptionRow[] = [
  {
    name: "displayMode",
    type: '"auto" | "docked" | "modal"',
    default: '"auto"',
    description:
      "Which surface opens. `\"auto\"` uses the modal below 600 px wide or 480 px tall and the docked popover otherwise. With `\"auto\"`, a docked picker that fits neither below nor above the field, at its current position on the page, opens as the modal.",
  },
  {
    name: "layout",
    type: '"auto" | "docked" | "modal" | "fullscreen"',
    default: '"auto"',
    description:
      "Look of the calendar on any surface. `\"auto\"` gives each surface its own look: docked for the popover and inline, modal for the dialog (full screen for a range below `ui.fullscreen`). `\"docked\"` uses the docked header with month and year menus everywhere. `\"modal\"` uses the headline, a month row with arrows on every page, and month and year grids everywhere. `\"fullscreen\"` gives a range picker the full-screen layout: in a dialog at every window width, inline sized to the container. Other modes, and the popover, treat it as `\"modal\"`. An inline calendar with the modal look fits its rows to the month unless `ui.fixedWeeks` is set.",
  },
  {
    name: "inline.enabled",
    type: "boolean",
    default: "false",
    description: "Render the calendar permanently instead of opening it.",
  },
  {
    name: "inline.container",
    type: "string | HTMLElement",
    default: "undefined",
    description: "Selector or element for the inline picker.",
  },
  {
    name: "inline.headline",
    type: "boolean",
    default: "true",
    description:
      "`false` leaves out the headline (the modal title, selected value and view switch, or the range header), for a host that shows its own. The full-screen top bar keeps its close and save buttons.",
  },
  {
    name: "inline.navigation",
    type: '"menus" | "caption"',
    default: '"menus"',
    description:
      "`\"caption\"` shows the month and year as text next to the arrows, with no month or year menus. Day precision only.",
  },
  {
    name: "inline.announceSelection",
    type: "boolean",
    default: "true",
    description:
      "`false` stops the inline calendar from announcing selection changes, for a host that announces them itself. Month changes and errors are still announced.",
  },
  {
    name: "format",
    type: "string",
    default: '"auto"',
    description:
      "Date text format: `\"auto\"` or a pattern of `d`, `dd`, `M`, `MM`, `yy`, `yyyy` with one separator of `/`, `.`, `-` or a space.",
  },
  {
    name: "theme",
    type: "ThemeName",
    default: '"basic"',
    description: "Theme name.",
  },
  {
    name: "colorScheme",
    type: '"auto" | "light" | "dark"',
    default: '"auto"',
    description: "Light or dark. `\"auto\"` detects it when the picker opens.",
  },
  {
    name: "fullscreen",
    type: "boolean | number",
    default: "true",
    description:
      "Width below which a modal range picker goes full screen. `true` means 600 px, a number is a width in pixels, `false` means never. Used with `ui.layout` `\"auto\"` and `\"modal\"`. `\"fullscreen\"` opens full screen at every width and `\"docked\"` never does.",
  },
  {
    name: "toggleButton",
    type: "string | HTMLElement",
    default: "undefined",
    description: "Extra element that opens the picker, such as a calendar icon button.",
  },
  {
    name: "weekNumbers",
    type: "boolean",
    default: "false",
    description: "Show ISO week numbers before each row.",
  },
  {
    name: "outsideDays",
    type: "boolean | { selectable?: boolean }",
    default: "false",
    description:
      "Show days of neighbouring months. `true` keeps them selectable, `{ selectable: false }` makes them inert.",
  },
  {
    name: "fixedWeeks",
    type: "boolean",
    default: "false",
    description: "Always show six rows.",
  },
  {
    name: "startView",
    type: '"day" | "month" | "year"',
    default: '"day"',
    description:
      "Panel shown first: the day grid, the month list (docked look) or grid (modal look), or the year list or grid. `initialView: \"input\"` wins. Ignored in range mode, with `ui.inline.navigation: \"caption\"` and for month or year precision.",
  },
  {
    name: "endInput",
    type: "string | HTMLElement",
    default: "undefined",
    description:
      "Second page input for a range. Read on `create()` and used in range mode only. A value that is not an `<input>` emits `invalid-option`.",
  },
  {
    name: "yearRange.before",
    type: "number",
    default: "100",
    description: "Years offered before the current year.",
  },
  {
    name: "yearRange.after",
    type: "number",
    default: "20",
    description: "Years offered after the current year.",
  },
  {
    name: "todayButton",
    type: "boolean",
    default: "false",
    description: "Show the Today button in the footer.",
  },
  {
    name: "clearButton",
    type: "boolean | { clearInput?: boolean }",
    default: "false",
    description: "Show the Clear button. `true` also clears and commits the input.",
  },
  {
    name: "clearButton.clearInput",
    type: "boolean",
    default: "true",
    description:
      "With `false`, Clear only empties the selection in the picker. Nothing is committed and the picker stays open.",
  },
  {
    name: "footer",
    type: "boolean",
    default: "undefined",
    description: "Show the footer. Unset means shown, except inline. `true` or `false` forces it.",
  },
  {
    name: "animation",
    type: "boolean",
    default: "true",
    description: "Play motion. With `prefers-reduced-motion: reduce` only short fades remain.",
  },
  {
    name: "allowPageScroll",
    type: "boolean",
    default: "false",
    description: "Keep the page scrollable while the modal is open.",
  },
  {
    name: "cssClass",
    type: "string",
    default: '""',
    description: "Extra class names for the picker surface, separated by spaces.",
  },
  {
    name: "appendTo",
    type: "string | HTMLElement",
    default: "undefined",
    description: "Where the modal dialog is appended. Defaults to the host.",
  },
  {
    name: "swipe",
    type: "boolean",
    default: "true",
    description: "Drag, wheel and swipe between months.",
  },
  {
    name: "viewSwitch",
    type: "boolean",
    default: "true",
    description: "Show the button that switches between the calendar and the input view.",
  },
  {
    name: "initialView",
    type: '"calendar" | "input"',
    default: '"calendar"',
    description:
      "View shown on open, where the input view exists: every range picker, and a single picker with the modal or full-screen look (`ui.layout`), at day precision.",
  },
  {
    name: "mask",
    type: "boolean",
    default: "false",
    description:
      "Format typed digits to the date format while typing. Single mode and the two range fields, day precision only. The text fields of the input view are always masked.",
  },
];

export const LABEL_OPTIONS: LabelRow[] = [
  { name: "title", default: '"Select date"', usedFor: "Modal header supporting text" },
  { name: "monthTitle", default: '"Select month"', usedFor: 'Header supporting text with `calendar.precision: "month"`' },
  { name: "yearTitle", default: '"Select year"', usedFor: 'Header supporting text with `calendar.precision: "year"`' },
  { name: "noDate", default: '"No date selected"', usedFor: "Modal headline while nothing is selected" },
  { name: "confirm", default: '"OK"', usedFor: "Confirm button" },
  { name: "cancel", default: '"Cancel"', usedFor: "Cancel button" },
  { name: "today", default: '"Today"', usedFor: "Today button" },
  { name: "clear", default: '"Clear"', usedFor: "Clear button" },
  { name: "openCalendar", default: '"Choose date"', usedFor: "Accessible name of the toggle button" },
  { name: "previousMonth", default: '"Previous month"', usedFor: "Previous month button" },
  { name: "nextMonth", default: '"Next month"', usedFor: "Next month button" },
  { name: "previousYear", default: '"Previous year"', usedFor: "Previous year button" },
  { name: "nextYear", default: '"Next year"', usedFor: "Next year button" },
  { name: "chooseMonth", default: '"Choose month"', usedFor: "Month menu button and list" },
  { name: "chooseYear", default: '"Choose year"', usedFor: "Year menu button and list" },
  { name: "weekNumber", default: '"Week"', usedFor: "Week number column header" },
  { name: "invalidDate", default: '"Enter a valid date"', usedFor: "Message for typed text that is not a date" },
  { name: "unavailableDate", default: '"This date is not available"', usedFor: "Message for a typed date that is disabled" },
  { name: "rangeTitle", default: '"Select dates"', usedFor: "Header supporting text in range mode" },
  {
    name: "rangeStart",
    default: '"Start"',
    usedFor: "Headline placeholder for a missing range start, and part of the accessible name of the start day",
  },
  {
    name: "rangeEnd",
    default: '"End"',
    usedFor: "Headline placeholder for a missing range end, and part of the accessible name of the end day",
  },
  {
    name: "inRange",
    default: '"In range"',
    usedFor: "Added to the accessible name of the days between the start and the end of a range",
  },
  { name: "multipleSelected", default: '"{count} selected"', usedFor: "Headline in multiple mode. A `PluralLabel`." },
  { name: "save", default: '"Save"', usedFor: "Save button of the full-screen range picker" },
  { name: "close", default: '"Close"', usedFor: "Close button of the full-screen range picker" },
  { name: "switchToInput", default: '"Switch to text input"', usedFor: "Name of the button that shows the input view" },
  { name: "switchToCalendar", default: '"Switch to calendar"', usedFor: "Name of the button that shows the calendar view" },
  { name: "dateField", default: '"Date"', usedFor: "Text field label in single mode" },
  { name: "startDateField", default: '"Start date"', usedFor: "Start text field label in range mode" },
  { name: "endDateField", default: '"End date"', usedFor: "End text field label in range mode" },
  {
    name: "invalidRange",
    default: '"End date must be on or after the start date"',
    usedFor: "Message for a range that is reversed or too long or short",
  },
  { name: "presets", default: '"Presets"', usedFor: "Accessible name of the range presets group" },
  {
    name: "beforeMinDate",
    default: '"Enter a date on or after {date}"',
    usedFor: "Message for a typed date before `minDate`. `{date}` is the limit in the display format.",
  },
  {
    name: "afterMaxDate",
    default: '"Enter a date on or before {date}"',
    usedFor: "Message for a typed date after `maxDate`. `{date}` is the limit in the display format.",
  },
  { name: "hintDay", default: '"dd"', usedFor: "Day letters in the format hint of a text field, such as `dd/mm/yyyy`" },
  { name: "hintMonth", default: '"mm"', usedFor: "Month letters in the format hint" },
  {
    name: "hintYear",
    default: '"yyyy"',
    usedFor: "Year letters in the format hint. A two-digit year format uses the first two characters.",
  },
];

export const BEHAVIOR_OPTIONS: OptionRow[] = [
  {
    name: "closeOnSelect",
    type: "boolean",
    default: "false",
    description: "Commit and close as soon as a day is picked. Not used in multiple mode.",
  },
  {
    name: "closeOnCancel",
    type: "boolean",
    default: "true",
    description: "Close the picker when the Cancel button is pressed.",
  },
  {
    name: "commitOnChange",
    type: "boolean",
    default: "false",
    description: "Commit every change to the input without the confirm button.",
  },
  {
    name: "ignoreOutsideClick",
    type: "boolean",
    default: "false",
    description: "Keep the picker open when the user clicks outside of it.",
  },
  {
    name: "returnFocus",
    type: "boolean",
    default: "true",
    description: "Move focus back to the input when the picker closes.",
  },
  {
    name: "id",
    type: "string",
    default: "undefined",
    description: "Instance id for `DatepickerUI.getById()`.",
  },
];

export const CALLBACK_OPTIONS: OptionRow[] = [
  { name: "onOpen", type: "(data: OpenEventData) => void", default: "undefined", description: "Called on the `open` event." },
  { name: "onClose", type: "(data: CloseEventData) => void", default: "undefined", description: "Called on the `close` event." },
  { name: "onCancel", type: "(data: CancelEventData) => void", default: "undefined", description: "Called on the `cancel` event." },
  { name: "onConfirm", type: "(data: ConfirmEventData) => void", default: "undefined", description: "Called on the `confirm` event." },
  { name: "onUpdate", type: "(data: UpdateEventData) => void", default: "undefined", description: "Called on the `update` event." },
  { name: "onError", type: "(data: ErrorEventData) => void", default: "undefined", description: "Called on the `error` event." },
  { name: "onSelectDay", type: "(data: SelectDayEventData) => void", default: "undefined", description: "Called on the `select:day` event." },
  { name: "onSelectMonth", type: "(data: SelectMonthEventData) => void", default: "undefined", description: "Called on the `select:month` event." },
  { name: "onSelectYear", type: "(data: SelectYearEventData) => void", default: "undefined", description: "Called on the `select:year` event." },
  { name: "onNavigate", type: "(data: NavigateEventData) => void", default: "undefined", description: "Called on the `navigate` event." },
  { name: "onRangeStart", type: "(data: RangeStartEventData) => void", default: "undefined", description: "Called on the `range:start` event." },
  { name: "onRangeEnd", type: "(data: RangeEndEventData) => void", default: "undefined", description: "Called on the `range:end` event." },
  { name: "onSwitchView", type: "(data: SwitchViewEventData) => void", default: "undefined", description: "Called on the `switch:view` event." },
  { name: "onClear", type: "(data: ClearEventData) => void", default: "undefined", description: "Called on the `clear` event." },
];

export const SHAPE_ROWS: OptionRow[] = [
  {
    name: "DateDecoration.className",
    type: "string",
    default: "undefined",
    description: "Class name added to the day cell.",
  },
  {
    name: "DateDecoration.badge",
    type: "boolean",
    default: "undefined",
    description: "Show a small dot on the day.",
  },
  {
    name: "DateDecoration.label",
    type: "string",
    default: "undefined",
    description: "Text appended to the accessible name of the day.",
  },
  {
    name: "RangePreset.label",
    type: "string",
    default: "required",
    description: "Text of the preset button.",
  },
  {
    name: "RangePreset.value",
    type: "RangePresetValue | (() => RangePresetValue)",
    default: "required",
    description:
      "The range, or a function that returns it. The function runs each time the picker refreshes, so relative presets stay current.",
  },
  {
    name: "RangePresetValue.start",
    type: "Date | string",
    default: "required",
    description: "First day of the range.",
  },
  {
    name: "RangePresetValue.end",
    type: "Date | string",
    default: "required",
    description: "Last day of the range, on or after `start`.",
  },
];
