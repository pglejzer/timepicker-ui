import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { LinkCard } from "@/components/link-card";
import { Eye, Keyboard, Users, ArrowRight, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Accessibility - Timepicker-UI",
  description:
    "ARIA compliance, keyboard navigation, and screen reader support",
};

export default function AccessibilityPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Accessibility
        </h1>
        <p className="text-lg text-muted-foreground">
          Built with WCAG 2.1 compliance and full keyboard support
        </p>
      </div>

      <Section icon={Eye} title="ARIA Support">
        <p className="text-muted-foreground mb-4">
          Timepicker-UI includes comprehensive ARIA attributes for screen reader
          compatibility:
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  role="dialog"
                </code>{" "}
                with{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-modal="true"
                </code>{" "}
                for modal timepicker
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-labelledby
                </code>{" "}
                connecting dialog to title
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-label
                </code>{" "}
                on all interactive elements (inputs, buttons)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  role="spinbutton"
                </code>{" "}
                with{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-valuenow
                </code>{" "}
                for hour/minute inputs (dynamically updated)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  role="listbox"
                </code>{" "}
                for clock face wrappers
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  role="option"
                </code>{" "}
                with{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-selected
                </code>{" "}
                for active time values on clock
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-disabled
                </code>{" "}
                for disabled times (respects disabledTime configuration)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-pressed
                </code>{" "}
                for AM/PM toggle buttons (dynamically updated)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  role="status"
                </code>{" "}
                +{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-live="polite"
                </code>{" "}
                +{" "}
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-atomic="true"
                </code>{" "}
                for time change announcements
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>
                <code className="text-primary bg-primary/10 px-1 rounded text-sm">
                  aria-hidden="true"
                </code>{" "}
                for decorative elements (dots, clock hand)
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
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  Enter
                </kbd>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Close / Cancel
                </span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  Esc
                </kbd>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Navigate between elements
                </span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  Tab
                </kbd>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Adjust time on clock face (±1 min/hour)
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    <ArrowLeft className="rotate-90 inline w-4 h-4 align-middle text-gray-500" />{" "}
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    <ArrowLeft className="-rotate-90 inline w-4 h-4 align-middle text-gray-500" />{" "}
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    <ArrowLeft className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Adjust time on hour/minute inputs (±1)
                </span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    <ArrowLeft className="rotate-90 inline w-4 h-4 align-middle text-gray-500" />{" "}
                  </kbd>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    <ArrowLeft className="-rotate-90 inline w-4 h-4 align-middle text-gray-500" />{" "}
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Switch view (hour ↔ minute) from input
                </span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  Enter
                </kbd>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  Quick toggle to AM
                </span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  A
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Quick toggle to PM
                </span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                  P
                </kbd>
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Clock face
                numbers are Tab-focusable. Use arrow keys while focused to
                adjust time by 1 minute/hour. The clock hand and input values
                update in real-time, but focus stays on the current element for
                easier fine-tuning.
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
                  Tab through: Hour input{" "}
                  <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  Minute input{" "}
                  <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  Clock face numbers{" "}
                  <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  AM/PM{" "}
                  <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  Cancel{" "}
                  <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
                  OK
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-sm font-medium min-w-[20px]">
                  2.
                </span>
                <span className="text-sm text-muted-foreground">
                  When focused on hour/minute input, press Enter to switch clock
                  face view
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary text-sm font-medium min-w-[20px]">
                  3.
                </span>
                <span className="text-sm text-muted-foreground">
                  When focused on clock face numbers, use arrow keys to adjust
                  time without moving focus
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

// Arrow keys work on both inputs and clock face
// - On hour/minute inputs: Up/Down adjusts by ±1
// - On clock face numbers: Up/Down/Left/Right adjusts by ±1
// - Disabled times are automatically skipped

// A/P shortcuts work from anywhere except inputs
document.addEventListener('keydown', (e) => {
  if (e.key === 'a' || e.key === 'A') {
    // Switches to AM (when not typing in input)
  }
  if (e.key === 'p' || e.key === 'P') {
    // Switches to PM (when not typing in input)
  }
});`}
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
  // Labels are announced by screen readers
  okLabel: 'Confirm time selection',
  cancelLabel: 'Cancel time selection',
  
  // Add custom aria-label to input
  ariaLabel: 'Select appointment time'
});

// Or add to HTML
<input 
  type="time" 
  id="timepicker"
  aria-label="Select appointment time"
  aria-describedby="time-help"
/>
<span id="time-help" class="sr-only">
  Use arrow keys to select time. Press Enter to confirm.
</span>`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">Live Regions</h3>
            <CodeBlock
              code={`<!-- Live region for screen reader announcements -->
<div 
  class="timepicker-announcer" 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  style="position: absolute; width: 1px; height: 1px; 
         overflow: hidden; clip: rect(0,0,0,0);"
>
  <!-- Dynamically updated by the timepicker -->
  <!-- Announces: "Hour changed to 14", "Minute changed to 30", etc. -->
</div>

<script>
// Timepicker automatically announces changes via live region
// No manual setup required - works out of the box

// Example announcements:
// - "Hour changed to 14"
// - "Minute changed to 30" 
// - "AM selected"
// - "PM selected"

// Live region updates happen on:
// - Clock hand drag
// - Clock number click
// - Arrow key navigation
// - AM/PM toggle
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
  type="time" 
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
  // Modal automatically manages focus
  focusTrap: true  // Default behavior
});

picker.create();

// When modal opens:
// 1. Focus moves to the wrapper element
// 2. Tab cycles through all focusable elements in order:
//    - Hour input
//    - Minute input  
//    - Clock face numbers (all visible hour/minute values)
//    - AM/PM buttons (in 12h mode)
//    - Cancel button
//    - OK button
// 3. Shift+Tab cycles backwards
// 4. When last element is focused and Tab is pressed, focus returns to first element
// 5. Cannot tab to elements behind modal

// When modal closes:
// - Focus returns to the input field that triggered the modal

// Note: Clock face numbers are included in Tab order, allowing keyboard-only
// users to reach them. Once focused, arrow keys can adjust time precisely.`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Visible Focus Indicators
            </h3>
            <CodeBlock
              code={`/* Default focus styles for all interactive elements */
.timepicker-ui-hour-time-12:focus-visible,
.timepicker-ui-minutes-time:focus-visible,
.timepicker-ui-hour-time-24:focus-visible,
.timepicker-ui-am:focus-visible,
.timepicker-ui-pm:focus-visible,
.timepicker-ui-cancel-btn:focus-visible,
.timepicker-ui-ok-btn:focus-visible,
.timepicker-ui-keyboard-icon-wrapper:focus-visible {
  outline: 3px solid var(--timepicker-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(98, 0, 238, 0.2);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .timepicker-ui-hour-time-12:focus-visible,
  .timepicker-ui-minutes-time:focus-visible,
  .timepicker-ui-hour-time-24:focus-visible,
  .timepicker-ui-am:focus-visible,
  .timepicker-ui-pm:focus-visible,
  .timepicker-ui-cancel-btn:focus-visible,
  .timepicker-ui-ok-btn:focus-visible {
    outline-width: 4px;
    font-weight: 700;
  }
}

/* Focus styles use :focus-visible to only show for keyboard navigation */
/* Mouse clicks won't show focus ring, but Tab navigation will */`}
              language="css"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Disabled Time Handling
            </h3>
            <CodeBlock
              code={`// Disabled times are properly marked and skipped

const picker = new TimepickerUI(input, {
  disabledTime: {
    interval: true,
    intervals: [
      ['9:00 AM', '12:00 PM'],  // Disabled range
      ['6:00 PM', '11:59 PM']   // Another disabled range
    ]
  }
});

// Disabled times have:
// - tabIndex = -1 (not focusable via Tab)
// - aria-disabled="true" (announced by screen readers)
// - Visual styling (grayed out)
// - Skipped during arrow key navigation

// Arrow key navigation automatically skips disabled values
// If all minutes in an hour are disabled, that hour is also skipped`}
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
              code={`/* High contrast accessible theme */
[data-theme="high-contrast"] {
  --timepicker-bg-color: #000000;
  --timepicker-text-color: #ffffff;
  --timepicker-primary-color: #ffff00;
  --timepicker-border-color: #ffffff;
  
  /* Ensure all text meets 7:1 contrast ratio */
}

/* Respect user's contrast preference */
@media (prefers-contrast: high) {
  .timepicker-ui-wrapper {
    border: 2px solid currentColor;
  }
  
  .timepicker-ui-clock-face__clock-number {
    font-weight: 700;
  }
}

@media (prefers-contrast: more) {
  /* Enhanced contrast for users who need it */
  .timepicker-ui-wrapper {
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
  .timepicker-ui-wrapper {
    animation: none !important;
    transition: none !important;
  }
  
  .timepicker-ui-clock-face__clock-hand {
    transition: none !important;
  }
  
  .timepicker-ui-backdrop {
    animation: none !important;
  }
}

// JavaScript: Detect user preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const picker = new TimepickerUI(input, {
  animation: !prefersReducedMotion
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
                href="https://www.w3.org/WAI/WCAG21/quickref/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-medium text-primary hover:underline"
              >
                WCAG 2.1 Quick Reference
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
