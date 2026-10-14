import type { ReactNode } from "react";
import Link from "next/link";

export interface RemovedItem {
  id: string;
  name: ReactNode;
  action: ReactNode;
}

const linkClassName = "text-primary hover:underline font-medium";

export const removedItems: RemovedItem[] = [
  {
    id: "renamed-options",
    name: (
      <>
        Old names of the options renamed in 4.5.0, for example{" "}
        <code>ui.mobile</code> and <code>labels.hourLabel</code>
      </>
    ),
    action: (
      <>
        Use the new names. The{" "}
        <Link href="/docs/api/options#renamed" className={linkClassName}>
          Renamed in 4.5.0
        </Link>{" "}
        table lists every pair.
      </>
    ),
  },
  {
    id: "period-events",
    name: (
      <>
        <code>select:am</code> and <code>select:pm</code> events,{" "}
        <code>callbacks.onSelectAM</code> and <code>callbacks.onSelectPM</code>
      </>
    ),
    action: (
      <>
        Use <code>select:period</code> or{" "}
        <code>callbacks.onSelectPeriod</code>. The payload is{" "}
        <code>{"{ type: 'AM' | 'PM' }"}</code>.
      </>
    ),
  },
  {
    id: "update-method",
    name: (
      <>
        <code>{"update({ options, create }, callback)"}</code>
      </>
    ),
    action: (
      <>
        Use <code>setOptions(options)</code>. If you passed{" "}
        <code>create: true</code>, call <code>picker.create()</code> after it.
        Code from the callback can run on the next line.
      </>
    ),
  },
  {
    id: "option-types",
    name: (
      <>
        <code>OptionTypes</code> type
      </>
    ),
    action: (
      <>
        Use <code>TimepickerOptions</code>.
      </>
    ),
  },
  {
    id: "locales",
    name: <code>clock.currentTime.locales</code>,
    action:
      "Remove it. It has no effect since 4.5.0, because the library formats the value itself.",
  },
  {
    id: "degrees",
    name: (
      <>
        <code>getValue().degreesHours</code>,{" "}
        <code>getValue().degreesMinutes</code>
      </>
    ),
    action: "Stop reading them. They are internal clock angles.",
  },
  {
    id: "toggle-label",
    name: <code>labels.toggleLabel</code>,
    action: "Remove it.",
  },
  {
    id: "format24-label",
    name: <code>labels.format24Label</code>,
    action: "Remove it. It has no effect.",
  },
  {
    id: "timezone-selector-label",
    name: <code>labels.timezoneSelectorLabel</code>,
    action: (
      <>
        It has no effect. Use <code>labels.timezone</code>.
      </>
    ),
  },
  {
    id: "focus-input-after-close-modal",
    name: (
      <>
        <code>focusInputAfterCloseModal</code> (legacy option)
      </>
    ),
    action: (
      <>
        Use <code>behavior.returnFocus</code>. It defaults to{" "}
        <code>false</code>; 5.0 makes <code>true</code> the default.
      </>
    ),
  },
  {
    id: "hide-event",
    name: (
      <>
        <code>hide</code> event and <code>HideEventData</code>
      </>
    ),
    action: (
      <>
        Remove listeners for it. The picker never emits <code>hide</code>.
      </>
    ),
  },
  {
    id: "range-internal-events",
    name: (
      <>
        <code>range:get-disabled-time</code> and{" "}
        <code>range:update-disabled</code> events
      </>
    ),
    action: "Remove listeners for them. The picker never emits them.",
  },
  {
    id: "rejected-hour-minute",
    name: (
      <>
        <code>ErrorEventData.rejectedHour</code>,{" "}
        <code>ErrorEventData.rejectedMinute</code>
      </>
    ),
    action: (
      <>
        Stop reading them. They are always <code>undefined</code>.
      </>
    ),
  },
];
