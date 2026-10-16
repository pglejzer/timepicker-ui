import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";
import { PageHeader } from "@/components/page-header";
import { ApiTable } from "@/components/api-table";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "What's New",
  description:
    "What's new in timepicker-ui - the latest features, improvements and fixes for the zero-dependency, framework-agnostic, SSR-safe time picker library.",
  path: "/docs/whats-new",
});

const optionMapping = [
  { v3: "clockType", v4: "clock.type" },
  { v3: "theme", v4: "ui.theme" },
  { v3: "mobile", v4: "ui.mobile" },
  { v3: "animation", v4: "ui.animation" },
  { v3: "okLabel", v4: "labels.ok" },
  { v3: "cancelLabel", v4: "labels.cancel" },
  { v3: "incrementMinutes", v4: "clock.incrementMinutes" },
  { v3: "focusTrap", v4: "behavior.focusTrap" },
];

export default function WhatsNewPage() {
  return (
    <div>
      <PageHeader
        badge="Latest Release"
        title="What's New"
        description="Stay up to date with the latest features and improvements"
      />

      <Callout title="Version 4.5.0 - October 14, 2026" tone="tip">
        <p>
          Optional seconds, clearer option names, keyboard control of the clock
          face, a callback for every event, Material Design 3 press feedback,
          and keyboard, screen-reader and theme fixes
        </p>
        <p>What&apos;s new:</p>
        <ul>
          <li>
            <strong>Optional seconds</strong> - Set{" "}
            <code>clock.showSeconds: true</code> for <code>HH:MM:SS</code> in
            every mode, with its own step, disabled seconds and{" "}
            <code>select:second</code> event
          </li>
          <li>
            <strong>Renamed options</strong> - Clearer names such as{" "}
            <code>ui.initialView</code> for <code>ui.mobile</code> and{" "}
            <code>labels.hour</code> for <code>hourLabel</code>,{" "}
            <code>mobileHour</code> and <code>announceHour</code>, plus{" "}
            <code>setOptions()</code> in place of <code>update()</code>. The
            old names keep working until 5.0, and the{" "}
            <Link href="/docs/api/options">options page</Link>{" "}
            lists every pair
          </li>
          <li>
            <strong>Keyboard control of the clock face</strong> - Arrow keys,
            PageUp / PageDown and Home / End change the value, and Enter or
            Space moves to the next face
          </li>
          <li>
            <strong>A callback for every event</strong> -{" "}
            <code>callbacks.onShow</code>, <code>onSwitchView</code>,{" "}
            <code>onWheelScrollStart</code> and <code>onWheelScrollEnd</code>.
            Callbacks passed later through <code>update()</code> now take effect
          </li>
          <li>
            <strong>Material Design 3 press feedback</strong> - A ripple plus
            hover, focus and pressed state layers, and one 3px focus ring on
            every control
          </li>
          <li>
            <strong>Keyboard and screen readers</strong> - Arrow keys skip
            disabled times, a range can be completed with the keyboard alone,
            and errors are announced inside the dialog
          </li>
          <li>
            <strong>Compact-wheel popover</strong> - A parent&apos;s{" "}
            <code>overflow: hidden</code> or <code>z-index</code> no longer
            clips the popover, and it fits its columns and the viewport
          </li>
          <li>
            <strong>setValue() converts formats</strong> -{" "}
            <code>&apos;14:30&apos;</code> in a 12h picker sets{" "}
            <code>02:30 PM</code>. A string that is not a time now emits{" "}
            <code>error</code>
          </li>
          <li>
            <strong>Faster open and close</strong> - The fade starts on the
            click, with no wait before it. <code>behavior.delayHandler</code>{" "}
            now defaults to <code>0</code>
          </li>
          <li>
            <strong>No page shift on open</strong> - Opening a modal picker no
            longer moves the page sideways, and <code>--tp-scrollbar-gap</code>{" "}
            helps keep fixed headers in place
          </li>
          <li>
            <strong>Safer labels</strong> - Label text is HTML-escaped, so it
            cannot inject markup
          </li>
          <li>
            <strong>Check before upgrading</strong> - Some defaults, classes and
            tokens changed: for example, the old <code>.tp-ui-ripple</code>{" "}
            classes are removed. The changelog lists them all, and the items
            deprecated for removal in 5.0. Set{" "}
            <code>behavior.returnFocus: true</code> to return focus to the
            input on close. 5.0 does this by default
          </li>
        </ul>
        <div className={styles.links}>
          <Link href="/docs/features/seconds">Seconds guide</Link>
          <Link href="/docs/changelog">Full 4.5.0 changelog</Link>
        </div>
      </Callout>

      <Callout title="Version 4.4.0">
        <p>
          <strong>June 10, 2026</strong> - Two new Blueprint themes, localizable
          accessibility labels, and extended keyboard navigation
        </p>
        <p>What&apos;s new:</p>
        <ul>
          <li>
            <strong>
              New <code>blueprint</code> theme
            </strong>{" "}
            - A light precision-instrument look with a vivid cobalt-blue accent,
            white surfaces, hairline borders and subtle shadows. Enable via{" "}
            <code>ui.theme: &apos;blueprint&apos;</code>
          </li>
          <li>
            <strong>
              New <code>blueprint-dark</code> theme
            </strong>{" "}
            - The dark sibling with a brighter cobalt accent on near-black
            neutral surfaces and hairline borders, distinct from the existing
            purple Material <code>dark</code> theme
          </li>
          <li>
            <strong>12 built-in themes</strong> - Blueprint brings the bundled
            theme count from 10 to 12, all still tree-shakeable via separate{" "}
            <code>theme-*.css</code> files
          </li>
          <li>
            <strong>16 localizable accessibility labels</strong> - New optional{" "}
            <code>labels.*</code> options (e.g. <code>hourLabel</code>,{" "}
            <code>minuteLabel</code>, <code>announceHour</code>,{" "}
            <code>invalidTimeFormat</code>) let you translate all screen-reader
            and ARIA text that was previously hardcoded in English
          </li>
          <li>
            <strong>Home / End / Page keyboard navigation</strong> - Home, End,
            PageUp and PageDown now work on the hour and minute spinbuttons
            (clock mode) and on the wheel columns, alongside the existing Arrow
            keys
          </li>
        </ul>
        <p>
          <Link href="/docs/features/themes">Browse all themes</Link>
        </p>
      </Callout>

      <Callout title="Version 4.3.0">
        <p>
          <strong>March 26, 2026</strong> - Tree-shakeable plugin system,
          smaller core bundle
        </p>
        <p>What&apos;s new:</p>
        <ul>
          <li>
            <strong>Tree-shakeable plugins</strong> - Unused plugins (wheel,
            range, timezone) are completely excluded from the final bundle when
            not imported
          </li>
          <li>
            <strong>Plugin templateProvider hook</strong> - Plugins register
            their own templates, eliminating static imports from core
          </li>
          <li>
            <strong>Plugin clearHandler hook</strong> - Plugins provide custom
            clear logic, decoupling core from plugin implementations
          </li>
          <li>
            <strong>New exported types</strong> - <code>TemplateProvider</code>{" "}
            and <code>ClearHandler</code> for plugin authors
          </li>
        </ul>
      </Callout>

      <Callout title="Version 4.2.0">
        <p>
          <strong>March 18, 2026</strong> - Wheel mode, clear button, and more
        </p>
        <p>What&apos;s new:</p>
        <ul>
          <li>
            <strong>Wheel mode</strong> - Scroll-spinner interface replacing the
            analog clock face. Enable via{" "}
            <code>ui.mode: &apos;wheel&apos;</code>
          </li>
          <li>
            <strong>Compact-wheel mode</strong> - Headerless wheel picker with
            optional popover placement (<code>&apos;auto&apos;</code>,{" "}
            <code>&apos;top&apos;</code>, <code>&apos;bottom&apos;</code>)
          </li>
          <li>
            <strong>Hide disabled options</strong> - Set{" "}
            <code>wheel.hideDisabled: true</code> to completely remove disabled
            values instead of dimming them
          </li>
          <li>
            <strong>Auto-commit on scroll</strong> - Set{" "}
            <code>wheel.commitOnScroll: true</code> to auto-confirm time at
            scroll end without pressing OK
          </li>
          <li>
            <strong>Clear button</strong> - Reset time selection with a
            dedicated button, enabled by default via <code>ui.clearButton</code>
          </li>
          <li>
            <strong>clearBehavior options</strong> - Control whether clearing
            empties the input value with <code>clearBehavior.clearInput</code>
          </li>
          <li>
            <strong>onClear callback &amp; event</strong> - New callback and
            EventEmitter event with <code>previousValue</code> payload
          </li>
          <li>
            <strong>New exported types</strong> - <code>ClearEventData</code>,{" "}
            <code>ClearBehaviorOptions</code>,{" "}
            <code>WheelScrollStartEventData</code>,{" "}
            <code>WheelScrollEndEventData</code>
          </li>
          <li>
            <strong>Persist on outside click</strong> - Set{" "}
            <code>wheel.ignoreOutsideClick: true</code> to keep the picker open
            when clicking outside its area (wheel and compact-wheel modes)
          </li>
          <li>
            <strong>Race condition fix</strong> - Rapidly clicking the input
            before the modal fully opened no longer causes the picker to get
            stuck invisible in the DOM or permanently blocks the input
          </li>
          <li>
            <strong>Range landscape fix</strong> - From/To tabs now properly
            positioned in landscape orientation
          </li>
          <li>
            <strong>Timezone landscape fix</strong> - Timezone picker layout
            corrected in landscape orientation with CSS Grid
          </li>
          <li>
            <strong>AM/PM border theming</strong> - Landscape border color now
            uses theme variable instead of hardcoded black
          </li>
        </ul>
        <p>
          <Link href="/docs/changelog">View full changelog</Link>
        </p>
      </Callout>

      <Callout title="Version 4.1.0">
        <p>
          <strong>January 31, 2026</strong> - New features and UX improvements
        </p>
        <p>What&apos;s new:</p>
        <ul>
          <li>
            <strong>Range Plugin</strong> - New! Select time ranges with
            start/end pickers, duration calculation, and validation
          </li>
          <li>
            <strong>Timezone Plugin</strong> - New! Timezone selector with
            searchable dropdown and UTC offset display
          </li>
          <li>
            <strong>Plugin architecture</strong> - Tree-shakeable plugins for
            smaller core bundle size
          </li>
          <li>
            <strong>Smooth hour snapping</strong> - Fluid hour dragging with
            animation (new default)
          </li>
        </ul>
        <p>
          <Link href="/docs/changelog">View full changelog</Link>
        </p>
      </Callout>

      <Section title="What's New in v4.0.0">
        <p>
          Version 4.0.0 brought major improvements in architecture, TypeScript
          support, and developer experience.
        </p>
      </Section>

      <Section title="Grouped Options Architecture">
        <p>
          Options are now organized into logical groups for better clarity and
          maintainability.
        </p>
        <h3>Old API (v3.x)</h3>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clockType: '12h',
  theme: 'dark',
  mobile: true,
  animation: true,
  incrementMinutes: 5,
  okLabel: 'Confirm',
  cancelLabel: 'Close'
});`}
          language="typescript"
        />

        <h3>New API (v4.0.0)</h3>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    incrementMinutes: 5
  },
  ui: {
    theme: 'dark',
    mobile: true,
    animation: true
  },
  labels: {
    ok: 'Confirm',
    cancel: 'Close'
  }
});`}
          language="typescript"
        />

        <h4>Five Main Groups</h4>
        <ul>
          <li>
            <strong>clock:</strong> Time format, increments, disabled times,
            auto-switch behavior
          </li>
          <li>
            <strong>ui:</strong> Theme, animations, mobile mode, backdrop,
            icons
          </li>
          <li>
            <strong>labels:</strong> All text labels (OK, Cancel, AM/PM,
            etc.)
          </li>
          <li>
            <strong>behavior:</strong> Focus trap, delays, input focus after
            close
          </li>
          <li>
            <strong>callbacks:</strong> All event handlers in one place
          </li>
        </ul>
      </Section>

      <Section title="Typed Options and Event Payloads">
        <p>
          Complete type safety with strict interfaces and better IntelliSense.
        </p>
        <ul>
          <li>Fully typed options with detailed documentation</li>
          <li>Typed event payloads for all callbacks</li>
          <li>Better autocomplete in modern IDEs</li>
          <li>Strict mode compatible (no any, no unknown)</li>
        </ul>
      </Section>

      <Section title="New Features">
        <h3>Keyboard Navigation</h3>
        <p>
          Use Arrow Up/Down keys to increment/decrement hour and minute
          values with live clockface updates.
        </p>
        <ul>
          <li>Works in both 12h and 24h modes</li>
          <li>Proper wrap-around (59 to 00, 12 to 01)</li>
          <li>Smooth clock hand animations</li>
        </ul>

        <h3>Improved Accessibility</h3>
        <p>
          Dynamic tabindex management ensures hidden elements are not
          focusable.
        </p>

        <h3>Glassmorphic Theme</h3>
        <p>
          New theme with backdrop-filter blur effect for modern glass UI.
        </p>
      </Section>

      <Section title="Architecture Improvements">
        <ul>
          <li>
            <strong>Composition over Inheritance:</strong> No class
            hierarchies, only explicit composition
          </li>
          <li>
            <strong>Manager Pattern:</strong> Independent, testable managers
            for each concern
          </li>
          <li>
            <strong>SSR Safety:</strong> Full compatibility with Next.js,
            Nuxt, Remix, and other SSR frameworks
          </li>
          <li>
            <strong>Pure State Container:</strong> Centralized state with no
            side effects
          </li>
          <li>
            <strong>Event-Driven:</strong> Clean event system for all
            interactions
          </li>
        </ul>
      </Section>

      <Callout title="Breaking Changes" tone="tip">
        <p>
          v4.0.0 introduces breaking changes in the options structure. See
          the migration guide below.
        </p>
        <p>
          <strong>Old:</strong> <code>clockType: &apos;12h&apos;</code>
        </p>
        <p>
          <strong>New:</strong>{" "}
          <code>clock: &#123; type: &apos;12h&apos; &#125;</code>
        </p>
      </Callout>

      <Section title="Migration Guide">
        <h3>Option Mapping</h3>
        <ApiTable
          columns={[
            { key: "v3", label: "v3.x" },
            { key: "v4", label: "v4.0.0", mono: true },
          ]}
          rows={optionMapping.map((row) => ({
            id: row.v3,
            v3: <code>{row.v3}</code>,
            v4: <code>{row.v4}</code>,
          }))}
          rowKey="id"
        />

        <h3>Complete Migration Example</h3>
        <CodeBlock
          code={`// v3.x
const picker = new TimepickerUI(input, {
  clockType: '24h',
  theme: 'dark',
  mobile: true,
  animation: true,
  incrementMinutes: 15,
  okLabel: 'Confirm',
  cancelLabel: 'Close',
  focusTrap: true
});

// v4.0.0
const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    incrementMinutes: 15
  },
  ui: {
    theme: 'dark',
    mobile: true,
    animation: true
  },
  labels: {
    ok: 'Confirm',
    cancel: 'Close'
  },
  behavior: {
    focusTrap: true
  }
});`}
          language="typescript"
        />
      </Section>

      <Callout title="Ready to upgrade?">
        <p>
          Check out the full documentation to explore all new features and
          options.
        </p>
        <div className={styles.links}>
          <Link href="/docs/installation">Installation Guide</Link>
          <Link href="/docs/api/options">API Reference</Link>
          <Link href="/docs/changelog">Full Changelog</Link>
        </div>
      </Callout>
    </div>
  );
}
