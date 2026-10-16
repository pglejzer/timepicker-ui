import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import styles from "./page.module.css";

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
      />

      <Section title="ARIA Support">
        <p>
          Timepicker-UI includes ARIA roles, live-region announcements and focus
          management for screen reader compatibility:
        </p>
        <ul>
          <li>
            <code>role=&quot;dialog&quot;</code>{" "}
            with{" "}
            <code>aria-modal=&quot;true&quot;</code>{" "}
            for modal timepicker
          </li>
          <li>
            <code>aria-labelledby</code>{" "}
            connecting dialog to title
          </li>
          <li>
            <code>aria-label</code>{" "}
            on all interactive elements (inputs, buttons)
          </li>
          <li>
            <code>role=&quot;spinbutton&quot;</code>{" "}
            with{" "}
            <code>aria-valuenow</code>{" "}
            for the hour and minute inputs, and the seconds input when{" "}
            <code>clock.showSeconds</code>{" "}
            is on (dynamically updated)
          </li>
          <li>
            <code>role=&quot;group&quot;</code>{" "}
            around the analog clock, named by{" "}
            <code>labels.clock</code>{" "}
            (default &quot;Clock&quot;)
          </li>
          <li>
            <code>role=&quot;slider&quot;</code>{" "}
            with{" "}
            <code>tabindex=&quot;0&quot;</code>{" "}
            on the clock face. Its{" "}
            <code>aria-label</code>
            ,{" "}
            <code>aria-valuemin</code>
            ,{" "}
            <code>aria-valuemax</code>
            ,{" "}
            <code>aria-valuenow</code>{" "}
            and{" "}
            <code>aria-valuetext</code>{" "}
            follow the active hour, minute or second field
          </li>
          <li>
            <code>role=&quot;listbox&quot;</code>{" "}
            for the wheel columns (wheel and compact-wheel modes) and the
            timezone dropdown
          </li>
          <li>
            <code>role=&quot;option&quot;</code>{" "}
            with{" "}
            <code>aria-selected</code>{" "}
            for the values in those lists, with{" "}
            <code>aria-activedescendant</code>{" "}
            pointing to the current one
          </li>
          <li>
            <code>aria-disabled</code>{" "}
            on disabled wheel items, on the OK button while the time
            can&apos;t be confirmed (a disabled time, a time that was just
            cleared, or a range that isn&apos;t valid yet), on the Clear
            button when there is nothing to clear, and on the range To tab
            until a From time is set. Disabled numbers on the clock face
            are dimmed, can&apos;t be clicked and are skipped by the
            keyboard. They have no{" "}
            <code>aria-disabled</code>{" "}
            because the numbers are{" "}
            <code>aria-hidden</code>
          </li>
          <li>
            <code>aria-pressed</code>{" "}
            for AM/PM toggle buttons (dynamically updated)
          </li>
          <li>
            <code>role=&quot;status&quot;</code>{" "}
            +{" "}
            <code>aria-live=&quot;polite&quot;</code>{" "}
            +{" "}
            <code>aria-atomic=&quot;true&quot;</code>{" "}
            for time change announcements
          </li>
          <li>
            <code>aria-hidden=&quot;true&quot;</code>{" "}
            for decorative elements (clock numbers, dots, clock hand). The
            clock numbers are not focusable
          </li>
        </ul>
      </Section>

      <Section title="Keyboard Navigation">
        <p>
          Complete keyboard support for users who cannot or prefer not to use a
          mouse:
        </p>
        <h3>Keyboard Shortcuts</h3>
        <dl className={styles.keys}>
          <div>
            <dt>
              <kbd>Enter</kbd> <kbd>Space</kbd>
            </dt>
            <dd>Open timepicker</dd>
          </div>
          <div>
            <dt>
              <kbd>Esc</kbd>
            </dt>
            <dd>Close / Cancel (not in inline mode)</dd>
          </div>
          <div>
            <dt>
              <kbd>Tab</kbd>
            </dt>
            <dd>
              Move between controls: hour, minute, second (when shown), AM,
              PM, clock face, then the footer buttons
            </dd>
          </div>
          <div>
            <dt>
              <kbd>Up arrow</kbd> <kbd>Right arrow</kbd>
            </dt>
            <dd>
              Clock face: one step up (1 hour, or the minute / second
              increment)
            </dd>
          </div>
          <div>
            <dt>
              <kbd>Down arrow</kbd> <kbd>Left arrow</kbd>
            </dt>
            <dd>Clock face: one step down</dd>
          </div>
          <div>
            <dt>
              <kbd>PgUp</kbd> <kbd>PgDn</kbd>
            </dt>
            <dd>Clock face: ±3 hours, or ±5 steps on minutes and seconds</dd>
          </div>
          <div>
            <dt>
              <kbd>Home</kbd> <kbd>End</kbd>
            </dt>
            <dd>Clock face: first / last value</dd>
          </div>
          <div>
            <dt>
              <kbd>Enter</kbd> <kbd>Space</kbd>
            </dt>
            <dd>
              Clock face: go to the next face (hour, then minute, then
              second). Off when{" "}
              <code>clock.autoSwitchToMinutes</code>{" "}
              /{" "}
              <code>autoSwitchToSeconds</code>{" "}
              is{" "}
              <code>false</code>
            </dd>
          </div>
          <div>
            <dt>
              <kbd>Up arrow</kbd> <kbd>Down arrow</kbd>
            </dt>
            <dd>Hour, minute or second field: one step up / down</dd>
          </div>
          <div>
            <dt>
              <kbd>Home</kbd> <kbd>End</kbd>
            </dt>
            <dd>Hour, minute or second field: first / last value</dd>
          </div>
          <div>
            <dt>
              <kbd>PgUp</kbd> <kbd>PgDn</kbd>
            </dt>
            <dd>
              Hour, minute or second field: ±3 hours, or ±5 steps on
              minutes and seconds
            </dd>
          </div>
          <div>
            <dt>
              <kbd>Enter</kbd> <kbd>Space</kbd>
            </dt>
            <dd>Select AM or PM (Tab to the button first)</dd>
          </div>
        </dl>
        <p>
          <strong>Note:</strong> The clock
          face is a single Tab stop and works like a slider. The arrow
          keys change the value of the active face (hour, minute or
          second). The clock hand and the matching field update as you
          press, and focus stays on the face. Disabled values are skipped
          on the clock face and in the time fields.
        </p>

        <h3>Navigation Flow</h3>
        <ol>
          <li>
            Tab through: Hour input, then Minute input, then Second input
            (when shown), then AM, then PM, then Clock face, then Cancel,
            then OK
          </li>
          <li>
            On the clock face, press Enter or Space to go to the next face
            (hour, then minute, then second). Clicking a time field also
            switches the face
          </li>
          <li>
            When the clock face has focus, the arrow keys change the
            active value and focus stays on the face
          </li>
          <li>
            Disabled times (if configured) are skipped during arrow key
            navigation
          </li>
          <li>
            Focus trap prevents tabbing outside the modal while open
          </li>
        </ol>

        <h3>Enabling Keyboard Navigation</h3>
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
      </Section>

      <Section title="Screen Reader Support">
        <p>
          Optimized for screen readers like NVDA, JAWS, and VoiceOver:
        </p>
        <h3>ARIA Labels</h3>
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

        <h3>Live Regions</h3>
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
// No manual setup required

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

        <h3>Descriptive Labels</h3>
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
      </Section>

      <Section title="Focus Management">
        <p>
          Proper focus handling for keyboard and screen reader users:
        </p>
        <h3>Focus Trapping</h3>
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

        <h3>Visible Focus Indicators</h3>
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

        <h3>Disabled Time Handling</h3>
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
      </Section>

      <Section title="Color Contrast">
        <p>
          Ensure WCAG AA compliance with proper color contrast:
        </p>
        <h3>Contrast Requirements</h3>
        <dl>
          <div>
            <dt>WCAG AA:</dt>
            <dd>Text contrast ratio of at least 4.5:1</dd>
          </div>
          <div>
            <dt>WCAG AAA:</dt>
            <dd>Text contrast ratio of at least 7:1</dd>
          </div>
          <div>
            <dt>Large Text:</dt>
            <dd>18px or 14px bold requires 3:1 contrast</dd>
          </div>
        </dl>

        <h3>High Contrast Theme</h3>
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
  /* Higher contrast for users who ask for it */
  .tp-ui-wrapper {
    background: #000000;
    color: #ffffff;
  }
}`}
          language="css"
        />
      </Section>

      <Section title="Reduced Motion">
        <p>
          Respect user preferences for reduced motion:
        </p>
        <h3>Disable Animations</h3>
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
      </Section>

      <Section title="Testing Accessibility">
        <p>
          Tools and techniques for testing accessibility:
        </p>
        <h3>Automated Testing</h3>
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

        <h3>Manual Testing Checklist</h3>
        <div className={styles.checklist}>
          <label>
            <input type="checkbox" />
            Can navigate entire timepicker using only keyboard
          </label>
          <label>
            <input type="checkbox" />
            Focus is visible at all times
          </label>
          <label>
            <input type="checkbox" />
            Screen reader announces all actions and changes
          </label>
          <label>
            <input type="checkbox" />
            Color contrast meets WCAG AA standards
          </label>
          <label>
            <input type="checkbox" />
            Works with browser zoom at 200%
          </label>
          <label>
            <input type="checkbox" />
            Respects prefers-reduced-motion
          </label>
          <label>
            <input type="checkbox" />
            Error messages are announced
          </label>
        </div>
      </Section>

      <dl>
        <div>
          <dt>Accessibility Resources</dt>
          <dd>
            Learn more about web accessibility standards and best practices:
          </dd>
          <dd>
            <ul>
              <li>
                <a
                  href="https://www.w3.org/WAI/WCAG22/quickref/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WCAG 2.2 Quick Reference
                </a>
              </li>
              <li>
                <a
                  href="https://webaim.org/resources/contrastchecker/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WebAIM Contrast Checker
                </a>
              </li>
              <li>
                <a
                  href="https://www.w3.org/WAI/ARIA/apg/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ARIA Authoring Practices Guide
                </a>
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  );
}
