import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { JsonLdBreadcrumb } from "@/components/json-ld";
import { ChangelogSwitcher, ReleaseList, type ReleaseNotes } from "@/components/changelog";
import { DATEPICKER_PACKAGE } from "@/lib/datepicker";

export const metadata = buildMetadata({
  title: "Date Picker Changelog",
  description:
    "Release notes for @pglejzer/datepicker-ui, the date picker that is the companion of timepicker-ui, listed by version with the changes in 1.1.0 and 1.0.0.",
  path: "/docs/changelog/datepicker",
});

const RELEASES: ReleaseNotes[] = [
  {
    title: "Version 1.1.0 - 2026-11-11",
    changes: {
      Added: [
        "`ui.layout` gives any surface the docked, modal or full-screen look, so a dialog can use the docked month and year menus",
        "`ui.inline.headline: false` hides an inline calendar's own headline",
        "`calendar.defaultValue` sets the starting value of an empty input, in the same shape as `setValue()`",
        "`setValue()`, `isSelectable()`, `goTo()` and range presets accept `\"today\"` for any date",
        "`ui.inline.navigation: \"caption\"` shows the month and year as text next to the arrows, without the month and year menus",
        "`ui.inline.announceSelection: false` leaves selection announcements to the host and keeps month announcements",
        "`setView()`, `getView()` and the `switch:view` event switch between the calendar and the text fields, also for an inline single picker with the modal layout",
        "`getVisibleRange()` returns the first and last day shown, and `navigate` carries them as `from` and `to`",
        "`goTo(date)` shows the month of a date without selecting it",
        "`isSelectable(value)` checks a day, a range or a set of days against every selection rule",
        "`clear()` empties the value and fires `input`, `change` and the new `clear` event, which the Clear button also fires. `setValue(null)` clears without any of them",
        "`labels.inRange` names the days inside a range for screen readers, and a start picked without an end is named as the start",
        "The `cancel` event reports `reason: \"toggle\"` when the toggle button closes the picker",
        "The kit exports `applyTheme`, `createTextButton`, `Pager`, `RANGE_SEPARATOR`, `splitRangeText`, `leadingDateLength`, `normalizeDigits` and the calendar's week and name helpers",
        "Kit hosts accept `labelledBy` to take their accessible name from a visible title",
        "Kit hosts have `setLabel(label, labelledBy?)`, which renames a shown surface by the same rule as the constructor",
        "The kit exports `fitsViewport(root, anchor)`, which tells whether a docked surface fits the window entirely below or entirely above its anchor",
        "`formatFullDate()` in `./kit` takes `{ year: false }` to leave the year out",
        "`isDateTextComplete()` in `./kit` tells whether a typed date has every group in full",
        "`dp-ui__presets--column` gives a presets group outside the picker the same column look",
      ],
      Changed: [
        "`navigate` now also fires when opening, `setValue()`, `setOptions()`, `goTo()` or a resize changes the shown days. Check `source` to tell them apart",
        "The input view's text fields always format typed digits to `ui.format`, adding its separators. `ui.mask` still controls only the page inputs",
        "A date typed in the text fields emits `select:day`, `range:start` or `range:end` like a picked day, and `behavior.commitOnChange` commits it",
      ],
      Fixed: [
        "The picker no longer sets `color-scheme` on the element around the input, so page inputs, `ui.endInput` included, keep the page's color scheme",
        "Months that cannot be picked in the docked month menu now look disabled, as in the month and year grids",
        "Resizing the window or rotating a phone with the picker open now updates how many months show side by side and whether `calendar.range.presets` are a column or a chip row",
        "On touch screens a tapped day, menu item, preset or button no longer keeps a hover highlight. Hover styles now apply only where the device supports hover",
        "Clicking `ui.toggleButton` while a docked picker is open now closes it instead of reopening it with an empty draft",
        "A picker no longer overflows the window or a parent with a set width. Day cells shrink from 48 px to 36 px. Narrower inline calendars scroll sideways",
        "A calendar placed inside another picker's dialog or popover no longer takes that surface's pager height, grid height and button size",
        "Typing a separator after an unfinished year no longer pads it with zeros, so `21.10.26.` no longer becomes `21.10.0026`",
        "Changing options on a shown calendar, or resizing it to another number of months, no longer replays the month fade-in",
        "With `ui.displayMode: \"auto\"`, a docked picker that fits neither below nor above the field, at its current position on the page, opens as a dialog",
        "`setOptions()` with a new `labels.title` now also renames the open popover, dialog or inline group, which kept the old accessible name",
        "An inline calendar is laid out as soon as it is mounted instead of one frame later, and a calendar mounted in a hidden container lays itself out before it is first shown",
        "Enter saves the value only where an OK button is shown. Elsewhere it picks the day or the typed date like a click",
        "A docked popover wider than the room right of its field now shifts left into the window, so several months no longer overlap or squeeze",
        "Clicking the input of a picker that opens on the month or year grid now moves focus into the grid, so Escape closes the popover again",
        "A docked picker with `calendar.renderDate` content no longer grows after opening, so `ui.displayMode: \"auto\"` opens a dialog when it does not fit",
        "A docked popover wider than the window now keeps its edge margin on both sides instead of sticking out on one side",
      ],
    },
  },
  {
    title: "Version 1.0.0 - 2026-10-19",
    changes: {
      Added: [
        "Three surfaces: a docked popover, a modal dialog and an inline calendar (`ui.inline`). `ui.displayMode: \"auto\"` picks docked or modal from the viewport size",
        "A range picker in a modal opens full screen on small windows. `ui.fullscreen` sets the width limit, or `false` turns it off",
        "Selection modes through `calendar.mode`: `single`, `range` and `multiple`. `calendar.multiple.max` caps the number of days",
        "Range length limits with `calendar.range.minLength` and `calendar.range.maxLength`, and ready-made ranges with `calendar.range.presets`",
        "Month and year pickers with `calendar.precision`, where the value is `YYYY-MM` or `YYYY`",
        "Several months side by side with `calendar.months`. `calendar.pageBy` sets whether the arrows move one month or a whole view",
        "Typed input with a switch between the calendar and the text field, controlled by `ui.viewSwitch` and `ui.initialView`. `ui.mask` formats typed digits to `ui.format`",
        "`ui.endInput` turns a range into two page inputs, Start and End",
        "Disabled days through `calendar.minDate`, `calendar.maxDate`, `calendar.disabledDates`, `calendar.enabledDates`, `calendar.disabledWeekdays` and `calendar.isDateDisabled`",
        "`calendar.decorateDate` adds a class, a badge or an accessible label to a day, and `calendar.renderDate` puts content such as a price inside the day cell",
        "`calendar.validate` marks the field invalid with your own message and never blocks a pick or a commit",
        "The `error` event carries a `code`, and for unavailable dates a `reason` such as `min`, `max`, `disabled` or `weekday`",
        "`ui.startView` opens the picker on the day, month or year panel. Grid options: `ui.fixedWeeks`, `ui.outsideDays`, `ui.weekNumbers`, `ui.todayButton`, `ui.clearButton` and `ui.footer`",
        "Themes `basic`, `m3-green`, `crane`, `crane-straight`, `m2`, `glassmorphic`, `pastel`, `ai`, `cyberpunk` and `blueprint`, set with `ui.theme`",
        "`ui.colorScheme` accepts `light`, `dark` and `auto`. `auto` checks the background behind the input, then the page `color-scheme`, then the OS",
        "`calendar.locale` drives `Intl` month and weekday names, the headline and the input format, and `calendar.weekStart` sets the first day. Numbers show in the locale's digits, and right-to-left layouts are supported",
        "The day grid follows the WAI-ARIA date picker pattern with full keyboard support, and a live region announces month and selection changes",
        "With `prefers-reduced-motion: reduce`, slides and resizes give way to short fades",
        "An input with a `name` submits ISO values through a hidden input. The visible input gets `input` and `change` events on commit, and a form reset restores the initial value",
        "Methods `create`, `open`, `close`, `destroy`, `getValue`, `setValue`, `setOptions` and `setActiveEnd`, plus `on`, `once` and `off`, where `on` and `once` return an unsubscribe function",
        "Static methods `DatepickerUI.getById`, `DatepickerUI.getAllInstances` and `DatepickerUI.destroyAll`",
        "Events `open`, `close`, `cancel`, `confirm`, `update`, `error`, `select:day`, `select:month`, `select:year`, `navigate`, `range:start` and `range:end`, each with a matching `callbacks.on*` option",
        "A second entry, `@pglejzer/datepicker-ui/kit`, exports the surface hosts, surface-mode rules, color-scheme detection and date text helpers for companion packages",
        "No runtime dependencies, and the package imports safely during server rendering",
        "ESM, CommonJS, TypeScript declarations and a UMD build for CDNs",
      ],
      Changed: [
        "**Check before upgrading:** 1.0.0 is a full rewrite, so nothing from 0.0.1 carries over. The README describes the current API.",
        "Options are grouped into `calendar`, `ui`, `labels`, `behavior` and `callbacks`, and `setOptions()` updates them at runtime",
        "The picker markup uses `dp-ui__*` class names, and custom CSS needs to target them",
        "Styling tokens are `--dp-ui-*` custom properties",
        "The CSS ships as `index.css` (core and every theme), `main.css` (core only) and one file per theme, such as `theme-m3-green.css`",
      ],
    },
  },
];

export default function DatepickerChangelogPage() {
  return (
    <div data-toc-depth="2">
      <JsonLdBreadcrumb pathname="/docs/changelog/datepicker" />
      <PageHeader
        title="Date Picker Changelog"
        description={
          <>
            Notable changes to <code>{DATEPICKER_PACKAGE}</code>, newest first. It is the companion of
            timepicker-ui, and the <Link href="/datepicker">date picker docs</Link> describe the
            current API. The package follows{" "}
            <a href="https://semver.org/spec/v2.0.0.html">Semantic Versioning</a>.
          </>
        }
      />

      <ChangelogSwitcher current="datepicker" />

      <ReleaseList releases={RELEASES} />
    </div>
  );
}
