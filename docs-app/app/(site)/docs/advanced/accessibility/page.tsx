import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import {
  Eye,
  Keyboard,
  Users,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "Accessibility",
  description:
    "Accessibility in timepicker-ui - full keyboard navigation, ARIA roles, focus trap and screen-reader support. Zero-dependency, framework-agnostic and SSR-safe.",
  path: "/docs/advanced/accessibility",
});

export default function AccessibilityPage() {
  return (
    <div>
      <PageHeader
        title="Accessibility"
        description="Built with WCAG 2.2 AA compliance and full keyboard support"
        eyebrow="Guide"
      />

      <Section icon={Eye} title="ARIA Support">
        <p className="text-muted-foreground mb-4">
          Timepicker-UI includes ARIA roles, live-region announcements and focus
          management for screen reader compatibility:
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  role=&quot;dialog&quot;
                </code>{" "}
                with{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-modal=&quot;true&quot;
                </code>{" "}
                for modal timepicker
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-labelledby
                </code>{" "}
                connecting dialog to title
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-label
                </code>{" "}
                on all interactive elements (inputs, buttons)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  role=&quot;spinbutton&quot;
                </code>{" "}
                with{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-valuenow
                </code>{" "}
                for the hour and minute inputs, and the seconds input when{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  clock.showSeconds
                </code>{" "}
                is on (dynamically updated)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  role=&quot;group&quot;
                </code>{" "}
                around the analog clock, named by{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  labels.clock
                </code>{" "}
                (default &quot;Clock&quot;)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  role=&quot;slider&quot;
                </code>{" "}
                with{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  tabindex=&quot;0&quot;
                </code>{" "}
                on the clock face. Its{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-label
                </code>
                ,{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-valuemin
                </code>
                ,{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-valuemax
                </code>
                ,{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-valuenow
                </code>{" "}
                and{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-valuetext
                </code>{" "}
                follow the active hour, minute or second field
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  role=&quot;listbox&quot;
                </code>{" "}
                for the wheel columns (wheel and compact-wheel modes) and the
                timezone dropdown
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  role=&quot;option&quot;
                </code>{" "}
                with{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-selected
                </code>{" "}
                for the values in those lists, with{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-activedescendant
                </code>{" "}
                pointing to the current one
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-disabled
                </code>{" "}
                on disabled wheel items, on the OK button while the time
                can&apos;t be confirmed (a disabled time, a time that was just
                cleared, or a range that isn&apos;t valid yet), on the Clear
                button when there is nothing to clear, and on the range To tab
                until a From time is set. Disabled numbers on the clock face
                are dimmed, can&apos;t be clicked and are skipped by the
                keyboard. They have no{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-disabled
                </code>{" "}
                because the numbers are{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-hidden
                </code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-pressed
                </code>{" "}
                for AM/PM toggle buttons (dynamically updated)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  role=&quot;status&quot;
                </code>{" "}
                +{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-live=&quot;polite&quot;
                </code>{" "}
                +{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-atomic=&quot;true&quot;
                </code>{" "}
                for time change announcements
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-hidden=&quot;true&quot;
                </code>{" "}
                for decorative elements (clock numbers, dots, clock hand). The
                clock numbers are not focusable
              </span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Keyboard} title="Keyboard Navigation">
        <p className="text-muted-foreground mb-4">
          Complete keyboard support for users who cannot or prefer not to use a
          mouse:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Open timepicker
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    Enter
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    Space
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Close / Cancel (not in inline mode)
                </span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  Esc
                </kbd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Move between controls: hour, minute, second (when shown), AM,
                  PM, clock face, then the footer buttons
                </span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  Tab
                </kbd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Clock face: one step up (1 hour, or the minute / second
                  increment)
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    <span className="sr-only">Up arrow</span>
                    <ArrowLeft className="rotate-90 inline w-4 h-4 align-middle text-gray-500" />{" "}
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    <span className="sr-only">Right arrow</span>
                    <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Clock face: one step down
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    <span className="sr-only">Down arrow</span>
                    <ArrowLeft className="-rotate-90 inline w-4 h-4 align-middle text-gray-500" />{" "}
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    <span className="sr-only">Left arrow</span>
                    <ArrowLeft className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Clock face: ±3 hours, or ±5 steps on minutes and seconds
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    PgUp
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    PgDn
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Clock face: first / last value
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    Home
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    End
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Clock face: go to the next face (hour, then minute, then
                  second). Off when{" "}
                  <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                    clock.autoSwitchToMinutes
                  </code>{" "}
                  /{" "}
                  <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                    autoSwitchToSeconds
                  </code>{" "}
                  is{" "}
                  <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                    false
                  </code>
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    Enter
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    Space
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Hour, minute or second field: one step up / down
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    <span className="sr-only">Up arrow</span>
                    <ArrowLeft className="rotate-90 inline w-4 h-4 align-middle text-gray-500" />{" "}
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    <span className="sr-only">Down arrow</span>
                    <ArrowLeft className="-rotate-90 inline w-4 h-4 align-middle text-gray-500" />{" "}
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Hour, minute or second field: first / last value
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    Home
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    End
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Hour, minute or second field: ±3 hours, or ±5 steps on
                  minutes and seconds
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    PgUp
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    PgDn
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Select AM or PM (Tab to the button first)
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    Enter
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    Space
                  </kbd>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Note:</strong> The clock
                face is a single Tab stop and works like a slider. The arrow
                keys change the value of the active face (hour, minute or
                second). The clock hand and the matching field update as you
                press, and focus stays on the face. Disabled values are skipped
                on the clock face and in the time fields.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Navigation Flow
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-primary text-sm font-medium min-w-[20px]">
                  1.
                </span>
                <span className="text-sm text-muted-foreground">
                  Tab through: Hour input
                  <span className="sr-only">, then</span>{" "}
                  <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  Minute input
                  <span className="sr-only">, then</span>{" "}
                  <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  Second input (when shown)
                  <span className="sr-only">, then</span>{" "}
                  <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  AM
                  <span className="sr-only">, then</span>{" "}
                  <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  PM
                  <span className="sr-only">, then</span>{" "}
                  <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  Clock face
                  <span className="sr-only">, then</span>{" "}
                  <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  Cancel
                  <span className="sr-only">, then</span>{" "}
                  <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  OK
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-sm font-medium min-w-[20px]">
                  2.
                </span>
                <span className="text-sm text-muted-foreground">
                  On the clock face, press Enter or Space to go to the next face
                  (hour, then minute, then second). Clicking a time field also
                  switches the face
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-sm font-medium min-w-[20px]">
                  3.
                </span>
                <span className="text-sm text-muted-foreground">
                  When the clock face has focus, the arrow keys change the
                  active value and focus stays on the face
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-sm font-medium min-w-[20px]">
                  4.
                </span>
                <span className="text-sm text-muted-foreground">
                  Disabled times (if configured) are skipped during arrow key
                  navigation
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-sm font-medium min-w-[20px]">
                  5.
                </span>
                <span className="text-sm text-muted-foreground">
                  Focus trap prevents tabbing outside the modal while open
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Enabling Keyboard Navigation
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  // Keyboard navigation is enabled by default
  // All interactive elements are focusable
});

picker.create();

// Arrow keys work on the time fields and on the clock face
// - Hour/minute/second fields: Up/Down step by 1 hour, or by
//   clock.incrementMinutes / clock.incrementSeconds
// - Clock face: Up/Right and Down/Left step the active face the same way
// - Disabled times are automatically skipped

// AM and PM are buttons: Tab to one and press Enter or Space`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <Section icon={Users} title="Screen Reader Support">
        <p className="text-muted-foreground mb-4">
          Optimized for screen readers like NVDA, JAWS, and VoiceOver:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">ARIA Labels</h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  labels: {
    // Visible button text (also announced by screen readers)
    ok: 'Confirm',
    cancel: 'Cancel',

    // Accessible names for the picker controls
    clock: 'Clock',
    period: 'Period',
    timeFields: 'Select appointment time',

    // Field caption, accessible name and announcement prefix in one key
    hour: 'Hour',
    minute: 'Minute'
  }
});

// Add a custom aria-label / hint directly on the input element
<input
  type="text"
  id="timepicker"
  aria-label="Select appointment time"
  aria-describedby="time-help"
/>
<span id="time-help" class="sr-only">
  Press Enter or Space to open the time picker.
</span>`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">Live Regions</h3>
            <CodeBlock
              code={`<!-- Live region for screen reader announcements -->
<!-- Rendered as the last child of .tp-ui-modal; sr-only hides it visually -->
<div
  class="timepicker-announcer sr-only"
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  <!-- Dynamically updated by the timepicker -->
  <!-- Announces: "Hour: 14", "Minutes: 30", etc. -->
</div>

<script>
// Timepicker automatically announces changes via live region
// No manual setup required - works out of the box

// Example announcements with the default labels:
// - "Hour: 14"
// - "Minutes: 30"
// - "Second: 15"
// - "AM selected"
// - "PM selected"
// - "Time cleared"

// Live region updates happen on:
// - Clock hand drag
// - Clock number click
// - Arrow keys, Home/End and PageUp/PageDown on the time fields
// - Enter/Space on the clock face (announces the new face and its value)
// - Wheel column scroll (wheel and compact-wheel modes)
// - AM/PM toggle
// - Clear

// Arrow steps on the focused clock face are not announced here: the
// clock face is a slider, so the screen reader reads its new value itself
</script>`}
              language="html"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Descriptive Labels
            </h3>
            <CodeBlock
              code={`<label for="meeting-time" class="form-label">
  Meeting Time
  <span class="text-muted">(Required)</span>
</label>
<input
  type="text"
  id="meeting-time"
  required
  aria-required="true"
  aria-describedby="meeting-time-hint"
/>
<div id="meeting-time-hint" class="form-hint">
  Select a time between 9:00 AM and 5:00 PM
</div>`}
              language="html"
            />
          </div>
        </div>
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Focus Management
        </h2>
        <p className="text-muted-foreground mb-4">
          Proper focus handling for keyboard and screen reader users:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Focus Trapping
            </h3>
            <CodeBlock
              code={`// Focus is automatically trapped within the modal
// Users cannot tab outside the timepicker when open

const picker = new TimepickerUI(input, {
  behavior: {
    // Modal automatically manages focus
    focusTrap: true, // Default behavior
    returnFocus: true // Recommended, default: false (true in 5.0)
  }
});

picker.create();

// When modal opens:
// 1. Focus moves to the wrapper element
// 2. Tab cycles through all focusable elements in order:
//    - Hour input
//    - Minute input
//    - Second input (when clock.showSeconds is true)
//    - AM/PM buttons (in 12h mode)
//    - Clock face (one Tab stop for the whole dial)
//    - Cancel button
//    - OK button
// 3. Shift+Tab cycles backwards
// 4. When last element is focused and Tab is pressed, focus returns to first element
// 5. Cannot tab to elements behind modal

// When modal closes:
// - Focus returns to the input field that triggered the modal
//   when behavior.returnFocus is true (default: false)

// Note: The numbers on the clock face are not in the Tab order. The clock
// face itself works like a slider: the arrow keys change the active value.`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Visible Focus Indicators
            </h3>
            <CodeBlock
              code={`/* Built-in focus ring (simplified) */
.tp-ui-ok-btn:focus-visible,
.tp-ui-cancel-btn:focus-visible,
.tp-ui-clear-btn:focus-visible,
.tp-ui-keyboard-icon:focus-visible {
  outline: 3px solid var(--tp-focus-ring, var(--tp-primary));
  outline-offset: 2px;
  box-shadow: var(--tp-shadow-focus-ring, none);
}

/* AM/PM, the time fields and the clock face draw the ring inside their edge */
.tp-ui-hour:focus-visible,
.tp-ui-minutes:focus-visible,
.tp-ui-seconds:focus-visible,
.tp-ui-am:focus-visible,
.tp-ui-pm:focus-visible,
.tp-ui-clock-face:focus-visible {
  outline-offset: -3px;
}

/* Thicker ring when the user asks for more contrast */
@media (prefers-contrast: more) {
  .tp-ui-ok-btn:focus-visible,
  .tp-ui-cancel-btn:focus-visible {
    outline-width: 4px;
  }
}

/* The ring shows only for keyboard focus, not after a mouse click or tap */
/* Set --tp-focus-ring to change its color */`}
              language="css"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Disabled Time Handling
            </h3>
            <CodeBlock
              code={`// Disabled times are properly marked and skipped

// Lists: disable specific hours / minutes
const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: {
      hours: [0, 1, 2],
      minutes: [15, 45]
    }
  }
});

// Ranges: disable one or more time ranges (string or array of strings).
// When ranges is set, the hours, minutes and seconds lists are ignored
const rangesPicker = new TimepickerUI(input, {
  clock: {
    disabledTime: {
      ranges: ['9:00 AM - 12:00 PM', '6:00 PM - 11:59 PM']
    }
  }
});

// On the clock face, disabled numbers:
// - are dimmed and can't be picked by click or drag
// - are skipped by the arrow keys, Home/End and PageUp/PageDown
// - have no aria-disabled, because the numbers are aria-hidden and not
//   focusable (the clock face itself is the focusable slider)

// In wheel and compact-wheel modes, disabled items get aria-disabled="true",
// or are left out with wheel.hideDisabled: true

// OK gets aria-disabled="true" while the shown time is disabled

// The keyboard skips disabled values in the time fields too
// If the ranges cover every minute of an hour, that hour is also skipped`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Color Contrast
        </h2>
        <p className="text-muted-foreground mb-4">
          Ensure WCAG AA compliance with proper color contrast:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Contrast Requirements
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-primary text-sm font-medium">
                  WCAG AA:
                </span>
                <span className="text-sm text-muted-foreground">
                  Text contrast ratio of at least 4.5:1
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-sm font-medium">
                  WCAG AAA:
                </span>
                <span className="text-sm text-muted-foreground">
                  Text contrast ratio of at least 7:1
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-sm font-medium">
                  Large Text:
                </span>
                <span className="text-sm text-muted-foreground">
                  18px or 14px bold requires 3:1 contrast
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              High Contrast Theme
            </h3>
            <CodeBlock
              code={`/* High contrast accessible override (CSS variables use the --tp- prefix) */
.tp-ui-modal[data-theme="dark"] {
  --tp-bg: #000000;
  --tp-text: #ffffff;
  --tp-primary: #ffff00;
  --tp-border: #ffffff;

  /* Ensure all text meets 7:1 contrast ratio */
}

/* Respect user's contrast preference */
@media (prefers-contrast: more) {
  .tp-ui-wrapper {
    border: 2px solid currentColor;
  }

  .tp-ui-clock-face {
    border: 2px solid currentColor;
  }
}

@media (prefers-contrast: more) {
  /* Enhanced contrast for users who need it */
  .tp-ui-wrapper {
    background: #000000;
    color: #ffffff;
  }
}`}
              language="css"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Reduced Motion
        </h2>
        <p className="text-muted-foreground mb-4">
          Respect user preferences for reduced motion:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Disable Animations
            </h3>
            <CodeBlock
              code={`/* CSS: Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .tp-ui-wrapper {
    animation: none !important;
    transition: none !important;
  }

  .tp-ui-clock-hand {
    transition: none !important;
  }

  .tp-ui-modal {
    animation: none !important;
  }
}

// JavaScript: Detect user preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const picker = new TimepickerUI(input, {
  ui: {
    animation: !prefersReducedMotion
  }
});

picker.create();`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Testing Accessibility
        </h2>
        <p className="text-muted-foreground mb-4">
          Tools and techniques for testing accessibility:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Automated Testing
            </h3>
            <CodeBlock
              code={`// Using axe-core for accessibility testing
import { axe } from 'jest-axe';

test('timepicker should have no accessibility violations', async () => {
  const { container } = render(
    <TimepickerComponent />
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Using @testing-library for keyboard testing
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('can navigate with keyboard', async () => {
  const user = userEvent.setup();
  render(<TimepickerComponent />);
  
  const input = screen.getByRole('textbox');
  await user.click(input);
  await user.keyboard('{Enter}');
  
  // Verify modal opened
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  
  // Test arrow key navigation
  await user.keyboard('{ArrowUp}');
  await user.keyboard('{Enter}');
});`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Manual Testing Checklist
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" />
                <label className="text-muted-foreground">
                  Can navigate entire timepicker using only keyboard
                </label>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" />
                <label className="text-muted-foreground">
                  Focus is visible at all times
                </label>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" />
                <label className="text-muted-foreground">
                  Screen reader announces all actions and changes
                </label>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" />
                <label className="text-muted-foreground">
                  Color contrast meets WCAG AA standards
                </label>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" />
                <label className="text-muted-foreground">
                  Works with browser zoom at 200%
                </label>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" />
                <label className="text-muted-foreground">
                  Respects prefers-reduced-motion
                </label>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" />
                <label className="text-muted-foreground">
                  Error messages are announced
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12 rounded-xl border border-primary/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5 p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium mb-2 text-foreground">
              Accessibility Resources
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Learn more about web accessibility standards and best practices:
            </p>
            <div className="space-y-2">
              <a
                href="https://www.w3.org/WAI/WCAG22/quickref/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-medium text-primary hover:underline"
              >
                WCAG 2.2 Quick Reference
              </a>
              <a
                href="https://webaim.org/resources/contrastchecker/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-medium text-primary hover:underline"
              >
                WebAIM Contrast Checker
              </a>
              <a
                href="https://www.w3.org/WAI/ARIA/apg/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-medium text-primary hover:underline"
              >
                ARIA Authoring Practices Guide
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
