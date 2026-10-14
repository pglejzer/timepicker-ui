import { Section } from "@/components/section";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { InfoBox } from "@/components/info-box";
import {
  History,
  Sparkles,
  Wrench,
  Bug,
  Zap,
  Code,
  Package,
  AlertTriangle,
  Shield,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

export const metadata = buildMetadata({
  title: "Changelog",
  description:
    "Changelog for timepicker-ui - every notable release, feature and fix for the zero-dependency, framework-agnostic, SSR-safe time picker, listed by version.",
  path: "/docs/changelog",
});

interface ChangeItemProps {
  title: string;
  description?: string;
}

function ChangeItem({ title, description }: ChangeItemProps) {
  return (
    <li className="text-sm">
      <strong className="text-foreground">{title}</strong>
      {description && (
        <span className="text-muted-foreground"> - {description}</span>
      )}
    </li>
  );
}

function ChangeSection({
  icon: Icon,
  label,
  color,
  items,
}: {
  icon: LucideIcon;
  label: string;
  color: string;
  items: ChangeItemProps[];
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-foreground">
        <Icon className={`h-5 w-5 text-${color}`} />
        {label}
      </h3>

      <ul className="space-y-1 ml-7">
        {items.map((item) => (
          <ChangeItem key={item.title} {...item} />
        ))}
      </ul>
    </div>
  );
}

const CHANGELOG_450 = {
  security: [
    {
      title: "Labels are HTML-escaped",
      description:
        "Label text in labels.*, range.fromLabel / range.toLabel and timezone.label is now HTML-escaped, so it cannot inject markup. The icon options ui.keyboardIcon and ui.clockIcon (ui.iconTemplate / ui.iconTemplateMobile) still accept HTML",
    },
  ],
  added: [
    {
      title: "Optional seconds",
      description:
        "Set clock.showSeconds: true to add a seconds field, face and wheel column. Values become HH:MM:SS (HH:MM:SS AM in 12h). Off by default, with no change when off",
    },
    {
      title: "clock.incrementSeconds and autoSwitchToSeconds",
      description:
        "clock.incrementSeconds (1, 5, 10, 15, 20 or 30, default 1) sets the seconds step, and clock.autoSwitchToSeconds (default true) moves to the seconds face after a minute is picked",
    },
    {
      title: "Disabled seconds",
      description:
        "clock.disabledTime.seconds disables the listed seconds in every minute, and clock.disabledTime.interval edges can include seconds. Edges without seconds cover the whole minute, so existing intervals still work",
    },
    {
      title: "labels.second",
      description:
        "Default 'Second'. Names the seconds field, its caption in the keyboard view, its wheel column and its announcement",
    },
    {
      title: "select:second and onSelectSecond",
      description:
        "New event and callback, with the SelectSecondEventData type",
    },
    {
      title: "Seconds in values and payloads",
      description:
        "With seconds on, getValue() and the open, confirm and update payloads include seconds, the error payload includes inputSecond, and setValue() accepts '14:30:15'. Values without seconds read as :00",
    },
    {
      title: "Range with seconds",
      description:
        "range:confirm and range:validation include durationSeconds. duration stays in whole minutes, and range.minDuration / range.maxDuration are compared with the exact length",
    },
    {
      title: "Seconds layout class and tokens",
      description:
        "The modal gets the tp-ui-has-seconds class when seconds are shown, and new CSS tokens such as --tp-wheel-column-width-seconds size the seconds layout",
    },
    {
      title: "Clearer option names",
      description:
        "Such as ui.initialView: 'keyboard' for ui.mobile: true and ui.viewSwitch for ui.enableSwitchIcon. The old names work until 5.0, and the options page lists every pair",
    },
    {
      title: "setOptions(), select:period, switch:face and clock.type: 'auto'",
      description:
        "setOptions(), the select:period and switch:face events with callbacks.onSelectPeriod and callbacks.onSwitchFace, and clock.type: 'auto', which picks 12h or 24h from the browser locale",
    },
    {
      title: "ui.appendTo and ui.inline.container",
      description:
        "ui.appendTo (where the modal goes) and ui.inline.container (where the inline picker renders) accept an element as well as a CSS selector",
    },
    {
      title: "Keyboard control of the clock face",
      description:
        "Arrow keys, PageUp / PageDown and Home / End change the value, and Enter or Space moves to the next face. See the accessibility page",
    },
    {
      title: "Mobile landscape size tokens",
      description:
        "--tp-mobile-landscape-width, --tp-mobile-landscape-height, --tp-mobile-landscape-height-range and --tp-mobile-landscape-height-timezone set the mobile keyboard view size in landscape",
    },
    {
      title: "--tp-focus-ring",
      description: "Sets the focus ring color, falling back to --tp-primary",
    },
    {
      title: "labels.announceCleared",
      description:
        "Sets the text announced after Clear (default 'Time cleared')",
    },
    {
      title: "ui.inline.autoUpdate works",
      description: "An inline picker updates its input as you pick",
    },
    {
      title: "Callbacks for every event",
      description:
        "callbacks.onShow, callbacks.onSwitchView, callbacks.onWheelScrollStart and callbacks.onWheelScrollEnd, so every public event now has a matching callback",
    },
    {
      title: "Material Design 3 press feedback",
      description:
        "A ripple plus hover, focus and pressed state layers, tuned with --tp-state-hover-opacity, --tp-state-focus-opacity, --tp-state-pressed-opacity and --tp-ripple-opacity. With prefers-reduced-motion, a press shows the pressed layer without the ripple",
    },
    {
      title: "--tp-dropdown-option-hover-text",
      description:
        "Sets the text color of a hovered or focused timezone option",
    },
    {
      title: "--tp-scrollbar-gap",
      description:
        "Set on <html> to the removed scrollbar width while a picker locks the page. Use it to pad fixed or sticky elements",
    },
    {
      title: "--tp-popover-edge-margin",
      description:
        "Default 4px. Sets the smallest gap between the compact-wheel popover and the viewport's side edges",
    },
  ],
  changed: [
    {
      title: "AM/PM value is always AM or PM",
      description:
        "labels.am / labels.pm only change the shown and announced text, not the input value or getValue().type",
    },
    {
      title: "update() applies every option group",
      description:
        "update({ options }) now applies every option group, including range, timezone, wheel and clearBehavior, and inline pickers re-render with new labels",
    },
    {
      title: "Inline OK and Cancel",
      description:
        "With ui.inline.showButtons: true, both keep the picker visible. OK writes the value to the input and emits confirm. Cancel restores the input's value and emits cancel. close() still removes it",
    },
    {
      title: "Stricter interval validation",
      description:
        "clock.disabledTime.interval rejects out-of-range edges such as 13:00 PM and reports them through error / callbacks.onError. On create() the picker does not open, and update() keeps the old options. Lowercase am / pm are accepted",
    },
    {
      title: "setValue() converts the other clock format",
      description:
        "'14:30' becomes 02:30 PM in a 12h picker. A string that is not a time emits error / callbacks.onError. An empty string is still ignored",
    },
    {
      title: "Clock and wheel agree on disabled times",
      description: "Both modes now give the same result at interval edges",
    },
    {
      title: "Range 'to' face disabled times",
      description:
        "Times before 'from' and inside disabled intervals are both disabled, and in 12h mode clock.disabledTime.hours / minutes apply too",
    },
    {
      title: "Theme color contrast",
      description:
        "Text and focus contrast meet WCAG AA in pastel, ai, m2, m3-green, crane and crane-straight, and dark accents follow --tp-primary",
    },
    {
      title: "One focus ring",
      description:
        "Every control shows one 3px focus ring. The gap ring and halo are removed: --tp-focus-ring-halo is no longer read and --tp-shadow-focus-ring defaults to none",
    },
    {
      title: "box-sizing set by the picker",
      description:
        "The picker sets box-sizing: border-box on its own elements, so it no longer depends on a page-wide reset",
    },
    {
      title: "AM/PM and view-switch hover",
      description:
        "Hover on unselected AM/PM buttons and the view-switch icon now shows only the state layer",
    },
    {
      title: "Validation message glyph removed",
      description:
        "The warning-sign glyph before the validation message is removed. Screen readers read it aloud and it could not be turned off",
    },
    {
      title: "Radius tokens no longer on :root",
      description:
        "--tp-wheel-highlight-radius, --tp-popover-radius and --tp-btn-radius are no longer defined on :root, so theme values reach them. Setting them still works, but reading them with var() outside the picker gets no value",
    },
    {
      title: "Old ripple removed",
      description:
        ".tp-ui-ripple, .tp-ui-ripple-effect and the ripple keyframes are removed. Move custom CSS to the new state and ripple tokens",
    },
    {
      title: "Compact-wheel popover",
      description:
        "With wheel.placement, the popover uses the Popover API and CSS anchor positioning, so a parent's overflow: hidden or z-index no longer clips or covers it. Browsers without anchor positioning use a script fallback",
    },
    {
      title: "Popover tokens and styling hooks",
      description:
        "--tp-popover-gap, --tp-popover-min-width and --tp-popover-max-width now take effect. New popover styling hooks: the tp-ui-popover-anchored and tp-ui-popover-constrained classes and the data-popover-request attribute",
    },
    {
      title: "Scroll lock on <html>",
      description:
        "With ui.enableScrollbar: false (the default), the lock sets overflow-y: hidden on <html>, and on <body> only when it scrolls. Only the element that lost its scrollbar gets padding-right",
    },
    {
      title: "Legacy 'Spacebar' key value",
      description:
        "No longer counts as Space. Only very old browsers, such as old Edge and Internet Explorer, send it",
    },
    {
      title: "Open and close without a pause",
      description:
        "The picker fades in over 200 ms and out over 150 ms, both starting on the click",
    },
    {
      title: "Reduced motion and ui.animation: false",
      description:
        "With prefers-reduced-motion or ui.animation: false, the picker opens and closes at once, with no wait",
    },
    {
      title: "behavior.delayHandler default",
      description:
        "Now defaults to 0 instead of 300. Set it to 300 to keep the old pause before closing",
    },
    {
      title: "Landscape view switch",
      description:
        "In mobile landscape, switching between the keyboard and clock views no longer jumps: the picker resizes smoothly while its content cross-fades",
    },
    {
      title: "Hand animation respects ui.animation",
      description:
        "ui.animation: false and prefers-reduced-motion now also stop the clock hand from animating when the face switches",
    },
  ],
  deprecated: [
    {
      title: "Old names of renamed options, select:am / select:pm, update()",
      description:
        "For options such as ui.mobile or labels.hourLabel, use the new names listed on the options page. For select:am / select:pm use select:period, and for update() use setOptions()",
    },
    {
      title: "OptionTypes",
      description: "Use TimepickerOptions",
    },
    {
      title: "clock.currentTime.locales",
      description: "Has no effect. The library formats the value",
    },
    {
      title: "getValue().degreesHours / degreesMinutes",
      description: "Internal clock-hand angles. Use hour / minutes",
    },
    {
      title: "labels.toggleLabel",
      description:
        "Has no effect now that the view switch is one button. Use labels.switchToKeyboard / labels.switchToClock",
    },
    {
      title: "labels.format24Label, labels.timezoneSelectorLabel",
      description:
        "Never had an effect. The timezone selector label comes from labels.timezone",
    },
    {
      title: "focusInputAfterCloseModal",
      description: "Legacy option type. Use behavior.returnFocus",
    },
    {
      title: "hide event, HideEventData",
      description: "Never emitted",
    },
    {
      title: "range:get-disabled-time, range:update-disabled events",
      description: "Never emitted",
    },
    {
      title: "ErrorEventData.rejectedHour / rejectedMinute",
      description: "Always undefined",
    },
  ],
  fixed: [
    {
      title: "Disabled hour click",
      description:
        "Clicking a disabled hour no longer switches the clock to the minutes view",
    },
    {
      title: "Stacked event handlers",
      description:
        "Reopening a picker, range pickers included, no longer stacks event handlers",
    },
    {
      title: "onClear fired twice",
      description: "callbacks.onClear fires once per clear",
    },
    {
      title: "close(true)",
      description:
        "Commits the current selection to the input, like the OK button",
    },
    {
      title: "Double confirm or cancel",
      description:
        "Once OK, Cancel or Escape starts a close, further input is ignored: a double-click or second Escape no longer fires confirm / cancel twice",
    },
    {
      title: "getValue() and destroy() while closing",
      description:
        "While the picker is closing, getValue() returns the input value and destroy() cancels the pending close",
    },
    {
      title: "Opening while the picker fades out",
      description:
        "Enter or a click on the input while the picker fades out is ignored, instead of firing show / callbacks.onShow without opening the picker",
    },
    {
      title: "Inline wheel Cancel with commitOnScroll",
      description:
        "Inline wheel pickers with wheel.commitOnScroll: Cancel right after a scroll no longer fires confirm / callbacks.onConfirm after cancel",
    },
    {
      title: "Callbacks set through update()",
      description:
        "Callbacks passed later through update({ options: { callbacks } }) take effect, replaced callbacks stop firing, and inline pickers no longer fire onOpen again after update()",
    },
    {
      title: "update() rewrites the input format",
      description:
        "Changing clock.type or clock.showSeconds through update() rewrites the input in the new format, range values (from - to) included, so getValue() reads it correctly",
    },
    {
      title: "update() on an open picker",
      description:
        "update() on an open modal or popover re-renders it with the new options right away. An unconfirmed selection resets to the input value",
    },
    {
      title: "show before open",
      description:
        "When the user opens the picker, show / callbacks.onShow now fire before open / callbacks.onOpen. picker.open() still emits only open",
    },
    {
      title: "Invalid value on open",
      description:
        "Opening the picker on an invalid value shows and announces the error (labels.invalidTimeFormat) inside the dialog, and the input gets aria-invalid and aria-describedby",
    },
    {
      title: "Invalid disabledTime reported",
      description:
        "An invalid clock.disabledTime, including an interval without '-', is reported through error / callbacks.onError instead of silently breaking the picker",
    },
    {
      title: "Clear button on first open",
      description:
        "The Clear button is enabled on the first open after page load",
    },
    {
      title: "data-open with quotes",
      description:
        "Opener elements with a quote or backslash in their data-open value no longer break the picker",
    },
    {
      title: "data-open inside a wrapper element",
      description:
        "Passing a wrapper element instead of the input to new TimepickerUI() makes the wrapper the picker root, so data-open buttons inside it open the picker",
    },
    {
      title: "setValue() with 12h values and an open clock",
      description:
        "setValue() accepts zero-padded 12h hours such as '03:45 PM' and 12h values longer than 8 characters. While the clock is open, it updates the whole face, not only the hand",
    },
    {
      title: "Degrees while open",
      description:
        "getValue().degreesHours / degreesMinutes and the open payload degrees now follow clicks and drags on the clock",
    },
    {
      title: "currentTime in 12h locales",
      description: "clock.currentTime: true keeps the AM/PM part",
    },
    {
      title: "clock.smoothHourSnap",
      description:
        "On release, the hand animates to the hour instead of jumping. With reduced motion it moves without animation",
    },
    {
      title: "update after closing mid-drag",
      description:
        "Closing the picker during a clock drag, for example with Escape while the mouse button is held, no longer emits update events afterwards",
    },
    {
      title: "Arrow keys on the time fields",
      description:
        "Arrow keys on the minute field step by clock.incrementMinutes. Arrow keys and typed values on the time fields skip disabled times, and OK stays disabled while the shown time is disabled",
    },
    {
      title: "clock.incrementHours",
      description:
        "Now works with the default clock.smoothHourSnap: true, in wheel and compact-wheel modes, and with the hour field's arrow keys, PageUp / PageDown and Home / End",
    },
    {
      title: "Clock hand froze on held arrow keys",
      description: "Holding an arrow key no longer freezes the clock hand",
    },
    {
      title: "Slow key presses with several pickers",
      description:
        "Key presses no longer slow down pages with several open or inline pickers",
    },
    {
      title: "View-switch button",
      description:
        "The view-switch control is one button with one Tab stop, a label that says what it does and stays localized, a focus ring and a 40px target",
    },
    {
      title: "ui.iconTemplateMobile placement",
      description:
        "Goes inside the view-switch button, like ui.iconTemplate, instead of replacing it on the first mobile render",
    },
    {
      title: "Clock drag announcements",
      description:
        "Drag announcements use labels.announceHour / labels.announceMinute",
    },
    {
      title: "ARIA state in sync",
      description:
        "The hour and minute fields' aria-valuenow / aria-valuetext and the AM/PM aria-pressed now stay in sync with the shown time",
    },
    {
      title: "Range tab placeholder",
      description:
        "Empty range tabs no longer read the --:-- placeholder aloud, also after Clear",
    },
    {
      title: "Clock face and numbers for screen readers",
      description:
        "After switching views, the decorative clock numbers stay hidden from screen readers, and on mobile the clock face is no longer hidden",
    },
    {
      title: "Time field names after switching views",
      description:
        "The hour and minute fields' accessible names follow the view: labels.mobileHour / mobileMinute in the keyboard view, labels.hourLabel / minuteLabel in the clock view",
    },
    {
      title: "Focus rings",
      description:
        "Focus rings show only during keyboard use, and now appear on the hour and minute fields in every theme, the mobile Cancel and Clear buttons and the timezone dropdown",
    },
    {
      title: "prefers-contrast: more",
      description:
        "High-contrast styles now apply with prefers-contrast: more. They used prefers-contrast: high, which browsers never match",
    },
    {
      title: "Forced colors",
      description:
        "In Windows High Contrast, the selection stays visible in system colors, and disabled clock numbers use GrayText",
    },
    {
      title: "--tp-font-family",
      description:
        "Now sets the picker font as documented, and the time fields and buttons inherit it",
    },
    {
      title: "Wheel separator",
      description: "The ':' separator is visible in the basic and m2 themes",
    },
    {
      title: "Wheel disabled items",
      description:
        "Keyboard navigation skips disabled items, disabled options have aria-disabled set to true, and zero-padded clock.disabledTime.minutes strings such as '05' work",
    },
    {
      title: "Wheel header fields",
      description:
        "The header hour and minute fields move the columns and stay in sync when disabled times move a column",
    },
    {
      title: "Wheel times between steps",
      description:
        "A time between a column's steps, such as '10:07' with clock.incrementMinutes: 5, now lands on the nearest item instead of a wrong one",
    },
    {
      title: "Theme radius values",
      description:
        "In crane-straight the wheel selection highlight and the popover are square again, and the m2 popover uses its 4px radius",
    },
    {
      title: "Compact-wheel AM/PM column",
      description:
        "Shows labels.am / labels.pm and opens on the input's period, and interval-disabled minutes follow the selected hour and period",
    },
    {
      title: "Compact-wheel getValue()",
      description:
        "getValue() while the picker is open returns the wheel selection",
    },
    {
      title: "Compact-wheel Clear",
      description:
        "Clear no longer flips AM/PM, or jumps back to the input value with clearBehavior.clearInput: false",
    },
    {
      title: "Compact-wheel popover size",
      description:
        "The popover is as wide as its columns, so 12h with seconds fits, and it scrolls inside a short viewport",
    },
    {
      title: "Compact-wheel popover near a viewport edge",
      description:
        "With wheel.placement: 'top' or 'bottom', the popover switches sides when fewer than three wheel rows fit, instead of covering the input",
    },
    {
      title: "Compact-wheel popover in right-to-left containers",
      description:
        "With dir='rtl' set only on a container, the popover lines up with the input's right edge, with or without CSS anchor positioning",
    },
    {
      title: "Compact-wheel popover tokens in rem, em or calc()",
      description:
        "Without CSS anchor positioning, the --tp-popover-* gap, margin and width tokens now work in rem, em or calc(), not only px",
    },
    {
      title: "wheel.placement default",
      description:
        "Types and docs: wheel.placement has no default (the JSDoc said 'auto'). Without it, compact-wheel opens as a modal, as before",
    },
    {
      title: "Range by keyboard",
      description:
        "A range can be completed with the keyboard alone, and focus moves to the hour field after the From time is committed",
    },
    {
      title: "Range duration limits",
      description:
        "OK stays disabled while the range is outside range.minDuration / range.maxDuration, also when picked with the pointer",
    },
    {
      title: "Timezone default fallback",
      description:
        "A timezone.default missing from the list falls back to the browser's zone if listed, otherwise the first option, instead of an empty label",
    },
    {
      title: "Timezone Clear",
      description:
        "Clear resets the selected zone, and the trigger then shows timezone.label instead of the English 'Timezone...' or 'undefined...'",
    },
    {
      title: "Timezone check mark",
      description:
        "Screen readers no longer read 'check mark' as part of the selected zone name",
    },
    {
      title: "Timezone field in right-to-left pages",
      description:
        "The closed field is mirrored in right-to-left pages, with the arrow on the left",
    },
    {
      title: "Crane and pastel contrast",
      description:
        "Hovered and focused timezone options in crane / crane-straight and the pastel footer buttons are now readable",
    },
    {
      title: "Page shift on open",
      description:
        "Opening a modal picker no longer shifts the page sideways or overwrites its padding-right, and pages that scroll on <html> are locked too",
    },
    {
      title: "12h header overflow",
      description:
        "The 12h header no longer overflows by 2px and fits phones 330px wide or narrower",
    },
    {
      title: "Inline picker layout",
      description:
        "Inline pickers follow the theme's corner radius and no longer leave empty space: 500px in compact-wheel and mobile, or a 48px footer band with ui.inline.showButtons: false",
    },
    {
      title: "Mobile landscape size",
      description:
        "The keyboard view size follows the orientation after rotating, and uses the taller timezone height when range and timezone are both on",
    },
    {
      title: "Editable after leaving mobile",
      description:
        "After update() sets ui.mobile: false, the desktop time fields are no longer left editable",
    },
    {
      title: "Drag out to the backdrop",
      description:
        "A press that starts inside the picker and ends over the backdrop, such as dragging the clock hand, no longer closes it",
    },
    {
      title: "Landscape on large phones",
      description:
        "The landscape layout now applies to any landscape viewport up to 480px tall. Current large phones, such as the iPhone 16 Pro Max, got the portrait card cut off",
    },
    {
      title: "Highlight follows the hand",
      description:
        "When the clock switches faces, the highlighted number follows the hand instead of turning white before the hand arrives",
    },
  ],
};

const CHANGELOG_440 = {
  added: [
    {
      title: "Blueprint and Blueprint Dark themes",
      description:
        "Two new built-in themes - 'blueprint' (light precision-instrument look: cobalt-blue accent, white surfaces, hairline borders) and 'blueprint-dark' (cobalt accent on near-black neutrals). Enable via ui.theme: 'blueprint' / 'blueprint-dark' and import the matching timepicker-ui/theme-blueprint.css / theme-blueprint-dark.css stylesheet. Brings the bundled theme count from 10 to 12, each still tree-shakeable as a separate CSS file",
    },
    {
      title: "16 localizable accessibility labels",
      description:
        "New optional labels.* options for fully localizable screen-reader and ARIA text: hourLabel, minuteLabel, clockLabel, periodLabel, timeLabel, format24Label, rangeSelectionLabel, switchToKeyboardLabel, switchToClockLabel, toggleLabel, timezoneSelectorLabel, announceHour, announceMinute, announceAmSelected, announcePmSelected, and invalidTimeFormat. All ship with English defaults - previously these strings were hardcoded",
    },
    {
      title: "Home / End / Page keyboard navigation",
      description:
        "Home / End / PageUp / PageDown key support on the hour and minute spinbuttons (clock mode) and on the wheel columns, in addition to the existing Arrow keys, for faster keyboard time selection",
    },
  ],
  changed: [
    {
      title: "Localizable assistive-technology text",
      description:
        "Screen-reader announcements and ARIA labels across the clock, wheel, range, timezone, and modal now read from the labels group instead of hardcoded English, so all assistive-technology text can be localized",
    },
    {
      title: "Spinbutton aria-valuetext",
      description:
        "Spinbutton inputs now expose aria-valuetext and keep it in sync on every change for more accurate screen-reader output",
    },
    {
      title: "Smarter focus trap",
      description:
        "Focus trap now skips elements marked aria-disabled / aria-hidden, so keyboard tabbing only lands on genuinely actionable controls",
    },
  ],
  fixed: [
    {
      title: "Focus-ring visibility",
      description:
        "Improved focus-ring visibility with a new high-contrast focus halo, so the focused control is clearly distinguishable on every theme",
    },
    {
      title: "Firefox number-input spinner buttons",
      description:
        "Native browser spinner buttons no longer appear on the clock-mode time inputs in Firefox - number inputs now render cleanly and consistently across browsers (-moz-appearance: textfield + -webkit-appearance reset). Thanks to @in-omnibus (https://github.com/in-omnibus) for reporting and proposing the fix (https://github.com/pglejzer/timepicker-ui/issues/166)",
    },
    {
      title: "Scroll lock release",
      description:
        "Fix the page scroll lock not releasing after rapid open/close cycles (or with multiple pickers on a page), which could leave the whole page unscrollable; body scroll locking is now reference-counted across instances",
    },
    {
      title: "theme-crane-straight.css export",
      description:
        "Added the missing theme-crane-straight.css entry to the package exports map, so the documented import 'timepicker-ui/theme-crane-straight.css' subpath now resolves instead of throwing ERR_PACKAGE_PATH_NOT_EXPORTED",
    },
  ],
};

const CHANGELOG_430 = {
  added: [
    {
      title: "Plugin templateProvider hook",
      description:
        "Plugins can register their own modal templates without core static imports, enabling true tree-shaking",
    },
    {
      title: "Plugin clearHandler hook",
      description:
        "Plugins can register custom clear logic executed when the clear button is pressed",
    },
    {
      title: "New exported types",
      description:
        "TemplateProvider and ClearHandler types available from the public API",
    },
  ],
  changed: [
    {
      title: "Tree-shakeable plugin system",
      description:
        "Unused plugins (wheel, range, timezone) are completely excluded from the final bundle when not imported. Core no longer statically imports any plugin implementation modules",
    },
    {
      title: "Wheel template registration",
      description:
        "Wheel template is no longer statically bundled with core - it is registered by the WheelPlugin at import time",
    },
    {
      title: "Plugin clear logic decoupled",
      description:
        "Range and timezone clear logic moved from core ClearButtonManager to plugin-provided clear handlers",
    },
  ],
};

const CHANGELOG_422 = {
  fixed: [
    {
      title: "WheelOptions not exported",
      description:
        "WheelOptions interface was defined but missing from the public API export. TypeScript consumers can now import it directly to type wheel/compact-wheel configuration objects",
    },
  ],
};

const CHANGELOG_421 = {
  fixed: [
    {
      title: "Plugin type declarations",
      description:
        "Plugin .d.ts files (range, timezone, wheel) used 'never' for factory parameters, causing PluginRegistry.register() to reject plugins in strict TypeScript projects",
    },
  ],
};

const CHANGELOG_420 = {
  added: [
    {
      title: "Wheel mode",
      description:
        "Scroll-spinner interface replacing the analog clock face. Enable via ui.mode: 'wheel'. Supports 12h/24h, all themes, disabled time, and keyboard navigation",
    },
    {
      title: "Compact-wheel mode",
      description:
        "Headerless wheel picker without the hour/minute inputs header. Enable via ui.mode: 'compact-wheel'. Combine with wheel.placement for popover positioning",
    },
    {
      title: "wheel.placement option",
      description:
        "Popover placement ('auto', 'top', 'bottom') for compact-wheel mode. Opens as a popover anchored to the input instead of a centered modal",
    },
    {
      title: "wheel.hideDisabled option",
      description:
        "Completely remove disabled hours/minutes from the wheel list instead of dimming them. Only applies to wheel and compact-wheel modes",
    },
    {
      title: "wheel.commitOnScroll option",
      description:
        "Auto-commit time at the end of wheel scrolling without pressing OK. Only applies to wheel and compact-wheel modes",
    },
    {
      title: "Clear button",
      description:
        "Reset time selection with a dedicated clear button. Enabled by default via ui.clearButton option",
    },
    {
      title: "clearBehavior.clearInput option",
      description:
        "Control whether clearing also empties the input field value (default: true)",
    },
    {
      title: "labels.clear option",
      description: 'Customize the clear button text (default: "Clear")',
    },
    {
      title: "onClear callback and clear event",
      description:
        "New callback and EventEmitter event with previousValue payload",
    },
    {
      title: "New exported types",
      description:
        "ClearEventData, ClearBehaviorOptions, WheelScrollStartEventData, WheelScrollEndEventData",
    },
    {
      title: "wheel.ignoreOutsideClick option",
      description:
        "Prevent the picker from closing when clicking outside its area. Only applies to wheel and compact-wheel modes",
    },
  ],
  fixed: [
    {
      title: "Rapid-click race condition",
      description:
        "Rapidly clicking the input before the modal fully opened could cause the picker to remain invisible in the DOM or permanently block the input element",
    },
    {
      title: "Range plugin landscape layout",
      description:
        "From/To header tabs were mispositioned in landscape orientation. Fixed with proper absolute positioning within the grid layout",
    },
    {
      title: "Timezone plugin landscape layout",
      description:
        "Timezone picker was broken in landscape orientation. Implemented CSS Grid layout that properly positions header, timezone selector, and clock face side by side",
    },
    {
      title: "AM/PM border color in landscape",
      description:
        "Hardcoded black border replaced with theme-aware var(--tp-border) variable",
    },
    {
      title: "Compact-wheel popover viewport detection",
      description:
        "Popover did not flip from bottom to top early enough near the viewport edge. Added safety threshold, switched to accurate visible viewport measurement, and improved fallback to prefer the side with more space",
    },
    {
      title: "PluginFactory type safety",
      description:
        "PluginFactory type now correctly accepts CoreState and EventEmitter parameters instead of using any/never workarounds. Removed unsafe type assertions from the plugin registry",
    },
  ],
};

const CHANGELOG_417 = {
  fixed: [
    {
      title: "Range plugin 12h AM/PM sync",
      description:
        "AM/PM state desynchronization when switching between From/To tabs. Clock now correctly syncs internal AM/PM state with saved range values",
    },
  ],
};

const CHANGELOG_416 = {
  fixed: [
    {
      title: "Range plugin minute disabling",
      description:
        "Minutes were incorrectly disabled for all hours in TO picker instead of only for the FROM hour. Now minutes are blocked only when TO hour equals FROM hour (both 12h and 24h modes)",
    },
    {
      title: "setValue() method",
      description:
        "Fixed setValue() not working correctly when called programmatically after initialization",
    },
  ],
};

const CHANGELOG_415 = {
  fixed: [
    {
      title: "DisabledTime update() method",
      description:
        "update() now properly calls getDisableTime() to refresh disabled time state after options change",
    },
  ],
};

const CHANGELOG_414 = {
  fixed: [
    {
      title: "iOS Mobile hover state fix",
      description:
        "v4.1.3 didn't fix the hover bug on all mobile devices, especially iOS Safari. Enhanced CSS with additional touch-action properties and improved media query specificity to completely prevent hover state persistence on all mobile browsers",
    },
    {
      title: "Range mode validation",
      description:
        "OK button now correctly disabled when end time ≤ start time. AM/PM changes automatically trigger validation to prevent invalid range selection",
    },
  ],
};

const CHANGELOG_413 = {
  fixed: [
    {
      title: "Mobile hover state persistence",
      description:
        "Fixed hover state remaining on hour/minute inputs and AM/PM buttons after touch events on mobile devices",
    },
    {
      title: "Range mode AM/PM state",
      description:
        "Fixed AM/PM remaining selected when switching from filled 'from' to empty 'to' in range mode",
    },
    {
      title: "Range mode input updates",
      description:
        "Input value now updates only on confirm instead of during selection in range mode",
    },
    {
      title: "Mobile view class assignment",
      description:
        "Added missing mobile class to wrapper-type-time, AM/PM buttons and input-ripple-wrapper when toggling mobile view",
    },
    {
      title: "Input readonly removal on view switch",
      description:
        "Fixed readonly attribute not being removed when switching from desktop to mobile view with enableSwitchIcon",
    },
    {
      title: "Dynamic input validation on view switch",
      description:
        "Mobile input validation now works when switching views - blur handlers check readonly attribute dynamically instead of static options",
    },
  ],
  added: [
    {
      title: "Range plugin TypeScript types",
      description:
        "Exported RangeOptions, RangeConfirmEventData, RangeSwitchEventData, RangeValidationEventData for better type safety",
    },
  ],
};

const CHANGELOG_412 = {
  fixed: [
    {
      title: "Range button text visibility",
      description:
        "Fixed text visibility in range buttons for crane, crane-straight, dark and cyberpunk themes",
    },
    {
      title: "Documentation examples",
      description:
        "Corrected timezone option property name from defaultTimezone to default in all examples",
    },
  ],
  added: [
    {
      title: "Auto-switch to minutes",
      description:
        "Hour and minute input elements automatically update active state when hour is selected on desktop",
    },
  ],
};

const CHANGELOG_411 = {
  fixed: [
    {
      title: "Mobile input validation",
      description:
        "Fixed issue where invalid time values (e.g., 169:70) could be entered via keyboard in mobile mode. Inputs now auto-clamp to valid ranges",
    },
  ],
  internal: [
    {
      title: "Test coverage",
      description: "Expanded test suite to 1100+ tests with 90%+ code coverage",
    },
  ],
};

const CHANGELOG_410 = {
  added: [
    {
      title: "Plugin architecture",
      description:
        "Range and Timezone as optional plugins - import only what you need for smaller bundles",
    },
    {
      title: "Smooth hour snapping",
      description:
        "New smoothHourSnap option (default: true) enables fluid hour dragging with animation",
    },
    {
      title: "Range mode time blocking",
      description:
        "When from time is selected, to picker automatically disables earlier times with visual feedback",
    },
    {
      title: "Timezone dropdown theming",
      description:
        "CSS variables --tp-dropdown-option-bg and --tp-dropdown-option-text for consistent styling",
    },
  ],
  changed: [
    {
      title: "Modular bundle structure",
      description:
        "Core bundle no longer includes Range and Timezone code. Reduces default bundle size",
    },
    {
      title: "Smooth hour dragging is now default",
      description:
        "smoothHourSnap defaults to true. Set to false for legacy discrete jump behavior",
    },
  ],
};

const CHANGELOG_403 = {
  fixed: [
    {
      title: "Desktop/mobile view switching",
      description:
        "Fixed enableSwitchIcon toggle not updating label text (Select time <-> Enter time), icon (keyboard <-> schedule), and Hour/Minute label visibility",
    },
  ],
};

const CHANGELOG_320 = {
  added: [
    {
      title: "Material Design 3 Ripple Effect",
      description: "Interactive ripple animations on buttons and inputs",
    },
    {
      title: "M3 Color System",
      description: "Complete color token implementation with CSS variables",
    },
    {
      title: "M2 Legacy Theme",
      description: "Material Design 2 theme (theme: 'm2')",
    },
    {
      title: "Mobile Clock Face Toggle",
      description: "Expand/collapse clock face with smooth animations",
    },
    {
      title: "Desktop to Mobile Switching",
      description: "Dynamic view switching via enableSwitchIcon",
    },
    {
      title: "Local SVG Icon Assets",
      description: "Built-in keyboard.svg and schedule.svg icons",
    },
    {
      title: "New ClockSystem Architecture",
      description:
        "Three-layer Engine -> Controller -> Renderer with RAF batching",
    },
  ],

  changed: [
    {
      title: "Theme Naming (Breaking)",
      description: "Renamed 'm3' -> 'm3-green'",
    },
    {
      title: "Option Naming (Breaking)",
      description:
        "Renamed 'switchToMinutesAfterSelectHour' -> 'autoSwitchToMinutes'",
    },
    {
      title: "ConfigManager Refactoring",
      description: "Split into 4 modules (87% code reduction)",
    },
    {
      title: "Code Quality",
      description:
        "KISS/DRY optimization - longest method 225->18 lines (-92%)",
    },
  ],

  fixed: [
    {
      title: "Clock face state bugs",
      description: "Fixed mobile <-> desktop switching issues",
    },
    {
      title: "Animation performance",
      description: "Removed will-change causing resize lag",
    },
    {
      title: "Angle Jump Bug",
      description: "Fixed Math.atan2() parameter order",
    },
    {
      title: "Disabled minutes styling",
      description: "Visual state now reflects configuration",
    },
    {
      title: "24h positioning",
      description: "Fixed inner/outer circle dimensions",
    },
    {
      title: "24h click overlap",
      description: "Reduced threshold and element size",
    },
    {
      title: "ClockFace disappears early",
      description: "Destroy after modal animation completes",
    },
    {
      title: "Landscape layout",
      description: "Fixed expansion direction and class system",
    },
    {
      title: "Desktop init bug",
      description: "Removed incorrect .mobile class",
    },
    {
      title: "autoSwitchToMinutes regression",
      description: "Fixed feature after ClockSystem refactor",
    },
  ],

  performance: [
    { title: "60fps transitions", description: "Multi-phase RAF scheduling" },
    {
      title: "ClockSystem gains",
      description: "Rendering 15ms->3ms, Drag 8ms->2ms, -25% code size",
    },
  ],
};

export default function ChangelogPage() {
  return (
    <div>
      <PageHeader
        title="Changelog"
        description="All notable changes to this project are documented here"
        eyebrow="Guide"
      />

      <InfoBox title="Current Version" variant="purple" className="mb-6">
        <strong>v4.5.0</strong> - Released October 14, 2026
      </InfoBox>

      <Section icon={Sparkles} title="Version 4.5.0 - October 14, 2026">
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-lg p-4 border border-red-500/20">
            <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Check before upgrading
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              These changes can affect an existing setup. Each one is described
              under Changed.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                The <code>.tp-ui-ripple</code> /{" "}
                <code>.tp-ui-ripple-effect</code> classes and the{" "}
                <code>ripple</code> keyframes are removed
              </li>
              <li>
                <code>--tp-wheel-highlight-radius</code>,{" "}
                <code>--tp-popover-radius</code> and{" "}
                <code>--tp-btn-radius</code> are no longer defined on{" "}
                <code>:root</code>
              </li>
              <li>
                <code>--tp-focus-ring-halo</code> is no longer read, and{" "}
                <code>--tp-shadow-focus-ring</code> defaults to{" "}
                <code>none</code>
              </li>
              <li>
                The AM/PM value is always <code>AM</code> / <code>PM</code>,
                whatever <code>labels.am</code> / <code>labels.pm</code> are set
                to
              </li>
              <li>
                Out-of-range <code>clock.disabledTime.interval</code> edges such
                as <code>25:00</code> are now rejected and reported through{" "}
                <code>error</code> / <code>callbacks.onError</code>
              </li>
              <li>
                <code>setValue()</code> with a string that is not a time now
                emits <code>error</code> / <code>callbacks.onError</code>{" "}
                instead of being ignored
              </li>
              <li>
                The scroll lock now styles <code>&lt;html&gt;</code>, and{" "}
                <code>&lt;body&gt;</code> only when it scrolls. CSS that relied
                on the <code>padding-right</code> added to <code>body</code>{" "}
                should use <code>--tp-scrollbar-gap</code>
              </li>
              <li>
                With CSS anchor positioning, the compact-wheel popover gets{" "}
                <code>tp-ui-popover-anchored</code> and no inline{" "}
                <code>top</code>, <code>left</code> or <code>width</code>.
                Review CSS that positions <code>.tp-ui-popover</code> by hand
              </li>
              <li>
                With <code>ui.inline.showButtons: true</code>, inline OK and
                Cancel no longer remove the picker from its container
              </li>
              <li>
                <code>behavior.delayHandler</code> defaults to <code>0</code>{" "}
                instead of <code>300</code>, so the picker closes without a
                pause
              </li>
            </ul>
          </div>

          <ChangeSection
            icon={Shield}
            label="Security"
            color="red-500"
            items={CHANGELOG_450.security}
          />

          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={CHANGELOG_450.added}
          />

          <ChangeSection
            icon={Zap}
            label="Changed"
            color="blue-500"
            items={CHANGELOG_450.changed}
          />

          <div>
            <ChangeSection
              icon={AlertTriangle}
              label="Deprecated"
              color="amber-500"
              items={CHANGELOG_450.deprecated}
            />
            <p className="mt-2 ml-7 text-sm text-muted-foreground">
              Each item still works unless its entry says otherwise. All of them
              are removed in 5.0.
            </p>
          </div>

          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_450.fixed}
          />

          <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-lg p-4 border border-blue-500/20">
            <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
              <Rocket className="h-4 w-4 text-blue-500" />
              Upcoming in 5.0
            </h4>
            <p className="text-sm text-muted-foreground">
              5.0 will change how plugins are built and registered, and will
              rename the part of each CSS class after the <code>tp-ui-</code>{" "}
              prefix to follow Material Design component naming. It also removes
              the items deprecated above and other unused API, and ships with a
              migration guide. See the{" "}
              <Link
                href="/docs/roadmap"
                className="text-primary hover:underline font-medium"
              >
                roadmap
              </Link>{" "}
              for details.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              In 5.0, <code>behavior.returnFocus</code> defaults to{" "}
              <code>true</code>: on close, focus goes back to the input, or to
              the <code>data-open</code> element that opened the picker. Set{" "}
              <code>behavior.returnFocus: true</code> now to return focus to
              the input.
            </p>
          </div>
        </div>
      </Section>

      <Section icon={Sparkles} title="Version 4.4.0 - June 10, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={CHANGELOG_440.added}
          />

          <ChangeSection
            icon={Zap}
            label="Changed"
            color="blue-500"
            items={CHANGELOG_440.changed}
          />

          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_440.fixed}
          />
        </div>
      </Section>

      <Section icon={Sparkles} title="Version 4.3.0 - March 26, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={CHANGELOG_430.added}
          />

          <ChangeSection
            icon={Zap}
            label="Changed"
            color="blue-500"
            items={CHANGELOG_430.changed}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.2.2 - March 24, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_422.fixed}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.2.1 - March 18, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_421.fixed}
          />
        </div>
      </Section>

      <Section icon={History} title="Version 4.2.0 - March 18, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={CHANGELOG_420.added}
          />

          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_420.fixed}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.1.7 - March 8, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_417.fixed}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.1.6 - February 14, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_416.fixed}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.1.5 - February 10, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_415.fixed}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.1.4 - February 9, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_414.fixed}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.1.3 - February 9, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_413.fixed}
          />

          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={CHANGELOG_413.added}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.1.2 - February 8, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_412.fixed}
          />

          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={CHANGELOG_412.added}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.1.1 - February 1, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_411.fixed}
          />

          <ChangeSection
            icon={Code}
            label="Internal"
            color="slate-500"
            items={CHANGELOG_411.internal}
          />
        </div>
      </Section>

      <Section icon={History} title="Version 4.1.0 - January 31, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={CHANGELOG_410.added}
          />

          <ChangeSection
            icon={Code}
            label="Changed"
            color="blue-500"
            items={CHANGELOG_410.changed}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.0.3 - January 23, 2026">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={CHANGELOG_403.fixed}
          />
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.0.2 - November 23, 2025">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={[
              {
                title: "Firefox Compatibility",
                description:
                  "Fixed 'TouchEvent is not defined' error in DragHandlers - changed from instanceof TouchEvent to 'touches' in event check",
              },
            ]}
          />

          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={[
              {
                title: "Exported Grouped Option Types",
                description:
                  "Added exports for TimepickerOptions, ClockOptions, UIOptions, LabelsOptions, BehaviorOptions, CallbacksOptions to support type-safe option composition",
              },
              {
                title: "onUpdate Event Emissions",
                description:
                  "Added missing onUpdate event emissions in EventManager and ClockManager for real-time value synchronization",
              },
            ]}
          />

          <div className="rounded-lg border border-border bg-card p-6 mt-6">
            <h4 className="font-semibold mb-3 text-foreground">
              Firefox Fix Details
            </h4>
            <CodeBlock
              code={`// Before (causing error on Firefox)
if (event instanceof TouchEvent) { // ERROR: TouchEvent not defined
  const touch = event.touches[0];
}

// After (cross-browser compatible)
if ('touches' in event) { // OK: Works everywhere
  const touch = event.touches[0];
}`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <Section icon={Bug} title="Version 4.0.1 - November 21, 2025">
        <div className="space-y-4">
          <ChangeSection
            icon={Wrench}
            label="Fixed"
            color="orange-500"
            items={[
              {
                title: "TypeScript Callback Types",
                description:
                  "All callback functions now have proper generic types instead of unknown",
              },
              {
                title: "Type-safe Event Payloads",
                description:
                  "onConfirm, onOpen, onUpdate, and other callbacks now correctly infer event data types",
              },
              {
                title: "Improved IntelliSense",
                description:
                  "Full autocomplete for event data properties without requiring manual type annotations",
              },
            ]}
          />

          <div className="rounded-lg border border-border bg-card p-6 mt-6">
            <h4 className="font-semibold mb-3 text-foreground">
              Before (4.0.0)
            </h4>
            <CodeBlock
              code={`// Callbacks had unknown types
callbacks: {
  onConfirm: (data) => {
    // data: unknown - no autocomplete
    console.log(data.hour); // TypeScript error
  }
}`}
              language="typescript"
            />

            <h4 className="font-semibold mb-3 mt-6 text-foreground">
              After (4.0.1)
            </h4>
            <CodeBlock
              code={`// Callbacks are now properly typed
callbacks: {
  onConfirm: (data) => {
    // data: ConfirmEventData - full autocomplete
    console.log(data.hour); // string | undefined
    console.log(data.minutes); // string | undefined
    console.log(data.type); // string | undefined
  }
}`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <Section icon={Package} title="Version 4.0.0 - November 21, 2025">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-lg p-4 border border-red-500/20 mb-6">
            <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              BREAKING CHANGES - Migration Required
            </h4>

            <p className="text-sm text-muted-foreground mb-3">
              <strong className="text-red-600 dark:text-red-400">
                All CSS class names and CSS variable names have been renamed:
              </strong>
            </p>

            <CodeBlock
              code={`// CSS Class Names (ALL classes changed)
- .timepicker-ui-*
+ .tp-ui-*

Examples:
- .timepicker-ui-wrapper       -> .tp-ui-wrapper
- .timepicker-ui-modal         -> .tp-ui-modal
- .timepicker-ui-clock-face    -> .tp-ui-clock-face
- .timepicker-ui-hour          -> .tp-ui-hour
- .timepicker-ui-minutes       -> .tp-ui-minutes
- .timepicker-ui-am            -> .tp-ui-am
- .timepicker-ui-pm            -> .tp-ui-pm
- .timepicker-ui-ok-btn        -> .tp-ui-ok-btn
- .timepicker-ui-cancel-btn    -> .tp-ui-cancel-btn

// CSS Variables (ALL variables changed)
- --timepicker-*
+ --tp-*

Examples:
- --timepicker-bg              -> --tp-bg
- --timepicker-primary         -> --tp-primary
- --timepicker-text            -> --tp-text
- --timepicker-surface         -> --tp-surface
- --timepicker-border          -> --tp-border
- --timepicker-shadow          -> --tp-shadow
- --timepicker-border-radius   -> --tp-border-radius
- --timepicker-font-family     -> --tp-font-family

// Options Structure (GROUPED)
// v3.x (flat - DEPRECATED):
-{
-  clockType: '24h',
-  theme: 'dark',
-  animation: true,
-  amLabel: 'AM',
-  onConfirm: (data) => {}
-}

// v4.0.0 (grouped - NEW):
+{
+  clock: {
+    type: '24h'
+  },
+  ui: {
+    theme: 'dark',
+    animation: true
+  },
+  labels: {
+    am: 'AM'
+  },
+  callbacks: {
+    onConfirm: (data) => {}
+  }
+}

// Migration Steps:
1. Find & replace all CSS class names in your stylesheets
2. Find & replace all CSS variable names in your custom themes
3. Reorganize options into groups: clock, ui, labels, behavior, callbacks
4. Update clockType -> clock.type, theme -> ui.theme, onConfirm -> callbacks.onConfirm
5. Test all customizations and themes thoroughly`}
              language="diff"
            />

            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>Important:</strong> The NPM package name remains{" "}
                <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">
                  timepicker-ui
                </code>
                . Only CSS classes and variables changed.
              </p>
            </div>
          </div>

          <ChangeSection
            icon={Wrench}
            label="Changed (Breaking)"
            color="red-500"
            items={[
              {
                title: "CSS Class Renaming",
                description: "All .timepicker-ui-* classes renamed to .tp-ui-*",
              },
              {
                title: "CSS Variable Renaming",
                description: "All --timepicker-* variables renamed to --tp-*",
              },
              {
                title: "Options Structure Reorganization",
                description:
                  "Options now grouped into: clock, ui, labels, behavior, callbacks",
              },
              {
                title: "Legacy DOM Events Removed",
                description:
                  "timepicker:* custom events completely removed - use EventEmitter API or callbacks",
              },
              {
                title: "setTheme() Method Removed",
                description:
                  "Programmatic theming removed - use CSS classes with CSS variables instead",
              },
            ]}
          />

          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={[
              {
                title: "EventEmitter API with Callback Bridge",
                description:
                  "All 9 callback options automatically bridge to EventEmitter with on(), off(), once() methods",
              },
              {
                title: "SSR-Safe Architecture",
                description:
                  "All modules can be imported in Node.js (Next.js, Nuxt, Remix, Astro compatible)",
              },
              {
                title: "Composition-Based Architecture",
                description:
                  "Pure composition with CoreState, Managers, Lifecycle - no inheritance, fully testable",
              },
              {
                title: "Auto-Focus Improvements",
                description:
                  "Modal auto-focuses on open, minutes auto-focus with autoSwitchToMinutes",
              },
              {
                title: "TypeScript Enhancements",
                description:
                  "No any types, fully typed event payloads, grouped options types, stricter type safety",
              },
            ]}
          />

          <ChangeSection
            icon={Wrench}
            label="Changed"
            color="blue-500"
            items={[
              {
                title: "Architecture Refactored",
                description:
                  "Composition-only pattern - removed all extends, pure dependency injection",
              },
              {
                title: "Bundle Size Reduced",
                description: "80 KB -> 63.3 KB ESM (-20.9%)",
              },
              {
                title: "Theme Count",
                description:
                  "11 -> 10 themes (removed theme-custom from production)",
              },
              {
                title: "Event System Unified",
                description:
                  "Single source of truth - callbacks bridge to EventEmitter automatically",
              },
              {
                title: "Options API Restructured",
                description: "40+ flat options -> 5 logical groups",
              },
            ]}
          />

          <ChangeSection
            icon={Package}
            label="Removed"
            color="orange-500"
            items={[
              {
                title: "Legacy DOM Events",
                description:
                  "timepicker:open, timepicker:confirm, timepicker:cancel, etc. - use picker.on() instead",
              },
              {
                title: "setTheme() Method",
                description:
                  "Programmatic theme setting removed - use CSS classes instead",
              },
              {
                title: "theme-custom",
                description:
                  "Removed from production bundle - users create custom themes via CSS variables",
              },
            ]}
          />

          <ChangeSection
            icon={Bug}
            label="Fixed"
            color="red-500"
            items={[
              {
                title: "Focus Trap Auto-Focus",
                description:
                  "Modal wrapper auto-focuses on open (no Tab press needed)",
              },
              {
                title: "Auto-Switch Focus",
                description:
                  "Minute input receives focus when autoSwitchToMinutes enabled",
              },
              {
                title: "SSR Compatibility",
                description:
                  "No DOM globals during initialization - safe for server rendering",
              },
              {
                title: "currentTime Parsing",
                description: "Simplified time parsing for better reliability",
              },
              {
                title: "Dynamic Updates",
                description:
                  "Fixed React useEffect patterns to prevent infinite loops",
              },
            ]}
          />

          <ChangeSection
            icon={Zap}
            label="Benefits"
            color="green-500"
            items={[
              {
                title: "Shorter class names",
                description: "Reduced HTML size and improved readability",
              },
              {
                title: "Smaller bundle",
                description: "-20.9% bundle size reduction (80 KB -> 63.3 KB)",
              },
              {
                title: "Better DX",
                description:
                  "Cleaner API with grouped options and EventEmitter",
              },
              {
                title: "SSR Compatible",
                description: "Works with Next.js, Nuxt, Remix, Astro.",
              },
              {
                title: "Type Safety",
                description: "No any types, fully typed events and options",
              },
            ]}
          />
        </div>
      </Section>

      <Section icon={Package} title="Version 3.2.0 - November 14, 2025">
        <div className="space-y-6">
          <ChangeSection
            icon={Sparkles}
            label="Added"
            color="green-500"
            items={CHANGELOG_320.added}
          />

          <ChangeSection
            icon={Wrench}
            label="Changed"
            color="blue-500"
            items={CHANGELOG_320.changed}
          />

          <ChangeSection
            icon={Bug}
            label="Fixed"
            color="red-500"
            items={CHANGELOG_320.fixed}
          />

          <ChangeSection
            icon={Zap}
            label="Performance"
            color="yellow-500"
            items={CHANGELOG_320.performance}
          />

          <div className="bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-lg p-4 border border-orange-500/20">
            <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
              <Code className="h-4 w-4 text-orange-500" />
              Migration Guide
            </h4>

            <p className="text-sm text-muted-foreground mb-3">
              <strong className="text-orange-600 dark:text-orange-400">
                Breaking Changes:
              </strong>
            </p>

            <CodeBlock
              code={`// Theme rename
- theme: 'm3'
+ theme: 'm3-green'

// Option rename
- switchToMinutesAfterSelectHour: true
+ autoSwitchToMinutes: true`}
              language="diff"
            />
          </div>
        </div>
      </Section>

      <Section icon={History} title="Previous Versions">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-foreground">
                Version 3.1.2
              </h3>
              <span className="text-xs text-muted-foreground">Nov 7, 2025</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Fixed CSS variable issues with var(--timepicker-text)</li>
              <li>Resolved input color styling problems</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-foreground">
                Version 3.1.1
              </h3>
              <span className="text-xs text-muted-foreground">Nov 7, 2025</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Virtual DOM caching - 25% performance improvement</li>
              <li>RAF batching for smoother animations</li>
              <li>Input sanitization for XSS protection</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-foreground">
                Version 3.1.0
              </h3>
              <span className="text-xs text-muted-foreground">Nov 7, 2025</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">EventEmitter API</strong> -
                on(), once(), off()
              </li>
              <li>Deprecated DOM events - migrate to EventEmitter</li>
            </ul>
          </div>
        </div>
      </Section>

      <InfoBox title="Full Changelog" variant="blue">
        View the complete changelog with all versions on{" "}
        <a
          href="https://github.com/pglejzer/timepicker-ui/blob/main/CHANGELOG.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          GitHub
        </a>
      </InfoBox>
    </div>
  );
}
