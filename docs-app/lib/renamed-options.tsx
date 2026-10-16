import type { ReactNode } from "react";
import Link from "next/link";

export type RenamedRow = {
  from: string;
  to: string;
  note?: ReactNode;
};

export const renamedOptions: RenamedRow[] = [
  {
    from: "clock.currentTime: true",
    to: "clock.defaultTime: 'now'",
    note: "Shows the current time and writes it to the input.",
  },
  {
    from: "clock.currentTime: { time, updateInput }",
    to: "clock.defaultTime: { time, updateInput }",
    note: (
      <>
        <code>time</code> is a <code>Date</code> or{" "}
        <code>&apos;now&apos;</code>. <code>locales</code> has no effect and
        has no new name.
      </>
    ),
  },
  {
    from: "clock.currentTime.preventClockType: true",
    to: "clock.type: 'auto'",
    note: (
      <>
        12h or 24h from the browser locale, with or without{" "}
        <code>defaultTime</code>.
      </>
    ),
  },
  { from: "clock.disabledTime.interval", to: "clock.disabledTime.ranges" },
  {
    from: "clock.smoothHourSnap: false",
    to: "clock.discreteHourJump: true",
    note: "Inverted. Smooth movement stays the default.",
  },
  { from: "ui.mobile: true", to: "ui.initialView: 'keyboard'" },
  { from: "ui.enableSwitchIcon", to: "ui.viewSwitch" },
  { from: "ui.enableScrollbar", to: "ui.allowPageScroll" },
  {
    from: "ui.appendModalSelector",
    to: "ui.appendTo",
    note: "Also accepts an element.",
  },
  { from: "ui.iconTemplate", to: "ui.keyboardIcon" },
  { from: "ui.iconTemplateMobile", to: "ui.clockIcon" },
  {
    from: "ui.inline.containerId: 'x'",
    to: "ui.inline.container: '#x'",
    note: "A selector or an element.",
  },
  {
    from: "clearBehavior.clearInput",
    to: "ui.clearButton: { clearInput }",
    note: "The object form also shows the Clear button.",
  },
  {
    from: "behavior.focusInputAfterClose",
    to: "behavior.returnFocus",
    note: (
      <>
        5.0 makes <code>true</code> the default.
      </>
    ),
  },
  { from: "timezone.whitelist", to: "timezone.list" },
  { from: "timezone.label", to: "labels.timezone" },
  { from: "range.fromLabel", to: "labels.rangeFrom" },
  { from: "range.toLabel", to: "labels.rangeTo" },
  { from: "labels.time", to: "labels.clockTitle" },
  { from: "labels.mobileTime", to: "labels.keyboardTitle" },
  {
    from: "labels.mobileHour, labels.hourLabel, labels.announceHour",
    to: "labels.hour",
    note: "One key for the caption, the accessible name and the announcement. An old key set next to it still wins for its own use.",
  },
  {
    from: "labels.mobileMinute, labels.minuteLabel, labels.announceMinute",
    to: "labels.minute",
    note: (
      <>
        Same as <code>labels.hour</code>.
      </>
    ),
  },
  { from: "labels.clockLabel", to: "labels.clock" },
  { from: "labels.periodLabel", to: "labels.period" },
  { from: "labels.timeLabel", to: "labels.timeFields" },
  { from: "labels.rangeSelectionLabel", to: "labels.range" },
  { from: "labels.switchToKeyboardLabel", to: "labels.switchToKeyboard" },
  { from: "labels.switchToClockLabel", to: "labels.switchToClock" },
  {
    from: "callbacks.onSelectAM, callbacks.onSelectPM",
    to: "callbacks.onSelectPeriod",
    note: (
      <>
        Receives <code>{"{ type: 'AM' | 'PM' }"}</code>. The{" "}
        <code>select:am</code> and <code>select:pm</code> events become{" "}
        <code>select:period</code>.
      </>
    ),
  },
  {
    from: "picker.update({ options })",
    to: "picker.setOptions(options)",
    note: (
      <>
        Method. See{" "}
        <Link href="/docs/api/methods">
          Methods
        </Link>
        .
      </>
    ),
  },
];
