import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { ApiTable } from "@/components/api-table";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Plugins",
  description:
    "Tree-shakeable plugins for timepicker-ui - range (time range picker), timezone selector and scroll wheel mode. Zero-dependency, framework-agnostic and SSR-safe.",
  path: "/docs/features/plugins",
});

const wheelRangeEvents = [
  {
    id: "open",
    action: "Open the picker, or create() for an inline picker",
    events: (
      <>
        <code>open</code>. Then <code>range:switch</code> with{" "}
        <code>active: &apos;to&apos;</code>, only if To was set with{" "}
        <code>setActivePart()</code> while the picker was closed. The seed is
        quiet.
      </>
    ),
  },
  {
    id: "tab-to",
    action: "Click the To tab",
    events: (
      <>
        <code>range:switch</code> with <code>active: &apos;to&apos;</code> and{" "}
        <code>disabledTime</code>. The wheel shows To without{" "}
        <code>update</code>, and focus stays on the tab. An empty To takes
        From&apos;s time after <code>range:switch</code>, without{" "}
        <code>range:change</code>.
      </>
    ),
  },
  {
    id: "tab-to-refused",
    action: (
      <>
        Click the To tab with <code>linked: true</code> and From empty
      </>
    ),
    events: (
      <>
        Nothing. The tab is <code>aria-disabled</code>. With seeding this
        happens only after Clear.
      </>
    ),
  },
  {
    id: "tab-active",
    action: "Click the active tab",
    events: "Nothing.",
  },
  {
    id: "set-active-part",
    action: <code>setActivePart(&apos;to&apos;)</code>,
    events: (
      <>
        Like a tab click, without moving focus. A time typed into the current
        end is committed first and emits <code>range:change</code>. It returns{" "}
        <code>true</code>.
        When To is already active it emits nothing and returns{" "}
        <code>true</code>. When it is refused it emits nothing and returns{" "}
        <code>false</code>.
      </>
    ),
  },
  {
    id: "set-active-part-closed",
    action: (
      <>
        <code>setActivePart(&apos;to&apos;)</code> while closed
      </>
    ),
    events: (
      <>
        Nothing now. At the next open: <code>open</code>, then{" "}
        <code>range:switch</code> with <code>active: &apos;to&apos;</code>.
      </>
    ),
  },
  {
    id: "scroll",
    action: "Drag, flick or mouse wheel on the hours column",
    events: (
      <>
        <code>wheel:scroll:start</code>, <code>wheel:scroll:end</code>,{" "}
        <code>select:hour</code>, then <code>range:change</code> once the end
        is complete and <code>range:validation</code> when both ends have a
        value, then <code>update</code>. The range plugin handles{" "}
        <code>update</code> before your listeners, so <code>getRange()</code>{" "}
        inside an <code>update</code> listener is already current. No{" "}
        <code>range:switch</code>.
      </>
    ),
  },
  {
    id: "keys",
    action: "Arrow, Page, Home or End on a column",
    events: (
      <>
        The same, without <code>wheel:scroll:start</code>.
      </>
    ),
  },
  {
    id: "period",
    action: "AM / PM column snap (compact-wheel, 12h)",
    events: (
      <>
        <code>wheel:scroll:end</code>, <code>select:am</code> or{" "}
        <code>select:pm</code> (deprecated), <code>select:period</code>, then{" "}
        <code>range:change</code> once the end is complete and{" "}
        <code>range:validation</code> when both ends are set, then{" "}
        <code>update</code>. The picker stays on the active end.
      </>
    ),
  },
  {
    id: "change-order",
    action: "Any user change of a range end",
    events: (
      <>
        <code>range:change</code> comes first of the range events: it is
        emitted right after the end is written, before{" "}
        <code>range:switch</code>, <code>range:validation</code> and{" "}
        <code>range:confirm</code>. <code>getRange()</code> inside the handler
        is final.
      </>
    ),
  },
  {
    id: "set-range",
    action: (
      <>
        <code>setRange(&#123; from, to &#125;)</code>, From active
      </>
    ),
    events: (
      <>
        <code>range:validation</code>. The wheel shows From without{" "}
        <code>update</code>. No <code>range:change</code>, as for{" "}
        <code>setValue()</code> and <code>clear()</code>.
      </>
    ),
  },
  {
    id: "set-range-to",
    action: (
      <>
        <code>setRange(&#123; from, to &#125;)</code>, To active,{" "}
        <code>linked: true</code>
      </>
    ),
    events: (
      <>
        <code>range:switch</code> with <code>active: &apos;to&apos;</code> and{" "}
        <code>disabledTime</code> for the new limit, then{" "}
        <code>range:validation</code>.
      </>
    ),
  },
  {
    id: "ok",
    action: "OK",
    events: (
      <>
        <code>confirm</code>, <code>range:confirm</code> with{" "}
        <code>&#123; from, to, duration &#125;</code>, then the picker closes
        unless it is inline.
      </>
    ),
  },
  {
    id: "clear",
    action: "Clear",
    events: (
      <>
        <code>clear</code>, <code>range:change</code> with{" "}
        <code>part: &apos;from&apos;</code> and both ends <code>null</code>,
        then <code>range:switch</code> with <code>active: &apos;from&apos;</code>{" "}
        and <code>disabledTime: null</code>. The public <code>clear()</code>{" "}
        on an open picker emits only <code>range:switch</code>, no{" "}
        <code>range:change</code>.
      </>
    ),
  },
  {
    id: "set-options",
    action: (
      <>
        <code>setOptions()</code> while open
      </>
    ),
    events: (
      <>
        A time typed into the active end is committed first and emits{" "}
        <code>range:change</code>. Then, with From active: no range event. To
        kept: <code>range:switch</code> with{" "}
        <code>active: &apos;to&apos;</code> and <code>disabledTime</code>. With{" "}
        <code>linked: true</code> and From empty, To cannot be kept and the
        picker falls back to From: <code>range:switch</code> with{" "}
        <code>active: &apos;from&apos;</code> and{" "}
        <code>disabledTime: null</code>.
      </>
    ),
  },
  {
    id: "commit-on-scroll",
    action: (
      <>
        <code>wheel.commitOnScroll</code> timer, range valid
      </>
    ),
    events: (
      <>
        <code>confirm</code> with <code>autoCommit: true</code>, then{" "}
        <code>range:confirm</code> with <code>autoCommit: true</code>. The
        picker stays open.
      </>
    ),
  },
];

export default function PluginsPage() {
  return (
    <div>
      <PageHeader
        title="Plugins"
        description="Optional features as separate imports for smaller bundle sizes"
      />

      <Section title="Overview">
        <p>
          Plugins are optional features that can be imported and registered
          separately. Register plugins once at app startup via PluginRegistry,
          then use features via options. If you don&apos;t need a feature,
          don&apos;t import it - your bundle stays small.
        </p>
        <ul>
          <li>Tree-shaking friendly - unused plugins are excluded</li>
          <li>Manual registration - import, register, use</li>
          <li>Full TypeScript support with type definitions</li>
          <li>3 plugins available: Range, Timezone, and Wheel</li>
        </ul>
      </Section>

      <Section title="Range Plugin">
        <p>
          Enables time range selection with &quot;from&quot; and &quot;to&quot;
          segments. Includes automatic validation and disabled time blocking.
          It works in every <code>ui.mode</code>: <code>clock</code>,{" "}
          <code>wheel</code> and <code>compact-wheel</code>. The wheel modes
          need <code>WheelPlugin</code> registered too.
        </p>
        <CodeBlock
          language="javascript"
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';
import 'timepicker-ui/main.css';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  range: {
    enabled: true,
    minDuration: 30,  // minimum 30 minutes
    maxDuration: 480  // maximum 8 hours
  },
  labels: {
    rangeFrom: 'Start',
    rangeTo: 'End'
  },
  callbacks: {
    onRangeConfirm: (data) => {
      console.log('From:', data.from);
      console.log('To:', data.to);
      console.log('Duration:', data.duration, 'minutes');
    }
  }
});
picker.create();`}
        />

        <h3>Range API</h3>
        <p>
          With the range plugin registered and <code>range.enabled</code> on,
          the instance can read and change the range from code. Without the
          plugin, or with <code>range.enabled</code> off, these methods emit an{" "}
          <code>error</code> event and do nothing.
        </p>
        <ul>
          <li>
            <code>setRange(&#123; from, to &#125;, updateInput = true)</code>{" "}
            sets one or both ends. Each time uses the <code>setValue()</code>{" "}
            format, <code>&apos;14:30&apos;</code> or{" "}
            <code>&apos;2:30 PM&apos;</code>. An end you leave out keeps its
            value, and <code>null</code> clears it. It works while the picker
            is open or closed and emits <code>range:validation</code>, but not{" "}
            <code>range:change</code>. When the end shown does not change, the
            dial and the typed fields stay as they are.
          </li>
          <li>
            <code>getRange()</code> returns <code>&#123; from, to &#125;</code>,
            or <code>null</code>. Each end is{" "}
            <code>&#123; hour, minutes, seconds?, type? &#125;</code> or{" "}
            <code>null</code> until it is complete. A 12h end without AM or PM
            is <code>null</code>.
          </li>
          <li>
            <code>getActivePart()</code> returns the end being edited,{" "}
            <code>&apos;from&apos;</code> or <code>&apos;to&apos;</code>.
          </li>
          <li>
            <code>setRangeCaptions(&#123; from, to &#125;)</code> shows a
            second line under a tab label.
          </li>
          <li>
            <code>clear()</code> empties both ends, open or closed.
          </li>
          <li>
            <code>setActivePart(&apos;from&apos; | &apos;to&apos;)</code>{" "}
            switches the clock to that end without moving focus and emits{" "}
            <code>range:switch</code>. It returns a boolean. With the default{" "}
            <code>range.linked</code>, <code>&apos;to&apos;</code> is refused
            until From is complete.
          </li>
        </ul>
        <CodeBlock
          language="typescript"
          code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  range: { enabled: true }
});
picker.create();

picker.setRange({ from: '09:00', to: '17:00' });

const range = picker.getRange();
console.log(range?.from?.hour, range?.to?.hour);

picker.open();
const switched = picker.setActivePart('to');`}
        />

        <h3>Set one end</h3>
        <p>
          Pass only the end you want to change. An end you leave out keeps its
          value, and <code>null</code> or an empty string clears it. With the
          default <code>range.linked</code>, clearing From while To is active
          switches back to From. The input shows <code>--:--</code> for an
          empty end, and nothing when both ends are empty.{" "}
          <code>setValue()</code> in range mode sets the end being edited.
        </p>
        <CodeBlock
          language="typescript"
          code={`picker.setRange({ from: '09:00' });

picker.setRange({ to: '17:00' });

picker.setRange({ to: null });`}
        />

        <h3>Captions on the tabs</h3>
        <p>
          <code>setRangeCaptions()</code> shows a second line under the From or
          To label, for example the date of that end. The text is plain text,
          not HTML, and becomes part of the accessible name of the tab. It
          works open or closed, survives <code>setOptions()</code> and Clear,
          and emits no event. <code>null</code> or an empty string removes a
          caption. The caption gets the class{" "}
          <code>tp-ui-range-tab-caption</code>.
        </p>
        <CodeBlock
          language="typescript"
          code={`picker.setRangeCaptions({ from: 'Wed Oct 21', to: 'Thu Oct 22' });

picker.setRangeCaptions({ to: null });`}
        />

        <h3>Range in 12h and the keyboard view</h3>
        <ul>
          <li>
            In a 12h clock, clicking AM or PM while From is complete changes
            the period of From and the picker stays on From. It does not move
            on to To.
          </li>
          <li>
            In the keyboard view you type the hour, minutes and seconds into
            fields. A typed time is applied on blur and on Enter, and
            counts for <code>getRange()</code> and <code>range:change</code>{" "}
            from then on. If you switch ends before leaving the field, the
            typed time is applied first. A field you did not touch does not
            commit.
          </li>
          <li>
            The From and To tabs are a tab list, and the time fields and the
            dial sit in the tab panel (<code>tp-ui-range-panel</code>).
            Activating the To tab with a click, Enter or Space keeps focus on
            the tab. Tab then moves into the panel.
          </li>
        </ul>

        <h3>Independent ends with range.linked</h3>
        <p>
          <code>range.linked</code> defaults to <code>true</code>. Set it to{" "}
          <code>false</code> to make From and To independent. Times before From
          are not disabled in To, the To tab is enabled from the start, and{" "}
          <code>minDuration</code> and <code>maxDuration</code> are not
          checked, so a range can cross midnight. <code>range:validation</code>{" "}
          still fires and reports <code>valid: true</code> once both ends are
          complete. Use it when your code validates the range with dates.
        </p>
        <CodeBlock
          language="typescript"
          code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  range: { enabled: true, linked: false }
});
picker.create();

picker.setRange({ from: '22:00', to: '01:00' });`}
        />

        <h3>Range in wheel and compact-wheel</h3>
        <p>
          Register <code>WheelPlugin</code> next to <code>RangePlugin</code>{" "}
          and set <code>ui.mode</code> to <code>&apos;wheel&apos;</code> or{" "}
          <code>&apos;compact-wheel&apos;</code>. The From and To tabs show in
          both modes. New in 4.7.0.
        </p>
        <CodeBlock
          language="javascript"
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';
import 'timepicker-ui/main.css';

PluginRegistry.register(RangePlugin);
PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'wheel' },
  range: { enabled: true, linked: true }
});
picker.create();`}
        />
        <ul>
          <li>
            A wheel snap fills the active end at once. The picker does not
            move on to To by itself: press the To tab.
          </li>
          <li>
            When an empty end becomes active, on open or on a tab switch, it
            takes the other end&apos;s time. Without one it takes the time from{" "}
            <code>clock.defaultTime</code>, and without that 12:00 (12:00 PM
            on a 12h clock). This is quiet: no <code>range:change</code>, no{" "}
            <code>range:validation</code> and no <code>update</code>, and{" "}
            <code>getRange()</code> returns the seeded value.
          </li>
          <li>
            With <code>linked: true</code> a seeded To equals From, so OK
            stays disabled until To moves. With <code>linked: false</code> OK
            accepts a range of zero length.
          </li>
          <li>
            Clear empties both ends and does not seed them. The tabs show{" "}
            <code>--:--</code>, and <code>getRange()</code> returns{" "}
            <code>null</code> for both ends until the next wheel snap, tab
            switch or <code>setRange()</code>. Focus goes to the From tab.
          </li>
          <li>
            <code>setActivePart()</code> and <code>setRange()</code> on an
            open wheel picker are quiet: the wheel moves without{" "}
            <code>update</code> or <code>select:*</code>. In clock mode they
            still emit <code>select:hour</code> and <code>update</code>.
          </li>
          <li>
            With <code>wheel.commitOnScroll</code>, the range is written to
            the input as <code>from - to</code> once scrolling stops and the
            range is valid. <code>range:confirm</code> then carries{" "}
            <code>autoCommit: true</code> and the picker stays open, also
            with <code>wheel.hideFooter</code>.
          </li>
        </ul>
        <p>
          Event order on an open wheel or compact-wheel picker. Clock mode
          keeps its earlier sequences.
        </p>
        <ApiTable
          columns={[
            { key: "action", label: "Action" },
            { key: "events", label: "Events, in order" },
          ]}
          rows={wheelRangeEvents}
          rowKey="id"
        />

        <h3>Active end after a re-render</h3>
        <p>
          In every mode, <code>setOptions()</code> on an open picker keeps the
          active end. When it keeps To, it emits <code>range:switch</code>{" "}
          with <code>active: &apos;to&apos;</code> and{" "}
          <code>disabledTime</code>, because the new clock or wheel starts
          without the limit before From. With <code>linked: true</code> and
          From empty it falls back to From and emits{" "}
          <code>range:switch</code> with <code>active: &apos;from&apos;</code>{" "}
          and <code>disabledTime: null</code>. As with any re-render, a
          selection that was not confirmed is reset to the input value, and
          Cancel on an inline picker goes back to From.
        </p>
        <p>
          <code>setOptions()</code> keeps the times already set in the range,
          the captions and the view (clock or keyboard). A time you typed in a
          field while the picker re-renders counts as your change and emits{" "}
          <code>range:change</code>.
        </p>
        <p>
          See the{" "}
          <Link href="/examples/plugins/range">live range example</Link>.
        </p>
      </Section>

      <Section title="Timezone Plugin">
        <p>
          Adds a timezone selector dropdown to the timepicker. Display-only -
          does not convert times automatically.
        </p>
        <CodeBlock
          language="javascript"
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { TimezonePlugin } from 'timepicker-ui/plugins/timezone';
import 'timepicker-ui/main.css';

PluginRegistry.register(TimezonePlugin);

const picker = new TimepickerUI(input, {
  timezone: {
    enabled: true,
    default: 'America/New_York',
    list: [
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo'
    ]
  },
  labels: {
    timezone: 'Timezone'
  },
  callbacks: {
    onTimezoneChange: (data) => {
      console.log('Selected timezone:', data.timezone);
    }
  }
});
picker.create();`}
        />

        <h3>Timezone list helpers</h3>
        <p>
          <code>timepicker-ui/plugins/timezone</code> also exports{" "}
          <code>DEFAULT_TIMEZONES</code>, <code>getTimezoneList()</code> and
          the <code>TimezoneInfo</code> type. <code>DEFAULT_TIMEZONES</code>{" "}
          is the read-only list of IDs the selector shows when you set no{" "}
          <code>timezone.list</code>. <code>getTimezoneList(list?)</code>{" "}
          returns <code>&#123; id, label, offset &#125;</code> for each ID the
          browser knows, and for <code>DEFAULT_TIMEZONES</code> when you pass
          no list. Use them to add a zone to the built-in list. New in 4.7.0.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import {
  TimezonePlugin,
  getTimezoneList,
  DEFAULT_TIMEZONES,
  type TimezoneInfo
} from 'timepicker-ui/plugins/timezone';

PluginRegistry.register(TimezonePlugin);

const list = [...DEFAULT_TIMEZONES, 'Europe/Warsaw'];

const zones: TimezoneInfo[] = getTimezoneList(list);
// [{ id: 'Pacific/Pago_Pago', label: 'Pago Pago (-11:00)', offset: '-11:00' }, ...]

const picker = new TimepickerUI(input, {
  timezone: {
    enabled: true,
    default: 'Europe/Warsaw',
    list
  }
});
picker.create();`}
        />

        <h3>A default that is not in the list</h3>
        <p>
          When <code>timezone.default</code> is not in the list, the picker
          shows the browser timezone if it is listed, and otherwise the first
          entry. It also emits <code>error</code>, so{" "}
          <code>callbacks.onError</code> runs. The error is emitted once per
          picker, not on every open, and again only after{" "}
          <code>setOptions()</code> changes <code>timezone.default</code> or{" "}
          <code>timezone.list</code>. New in 4.7.0.
        </p>
        <CodeBlock
          language="typescript"
          code={`const picker = new TimepickerUI(input, {
  timezone: { enabled: true, default: 'Europe/Warsaw' }
});
picker.create();

picker.on('error', (data) => {
  console.warn(data.error);
  // timezone.default "Europe/Warsaw" is not in the timezone list, using "Europe/Paris"
});`}
        />

        <h3>Escape key</h3>
        <p>
          With the timezone menu open, Escape closes only the menu. With the
          menu closed, Escape reaches the picker and closes it, or a popover
          around it. New in 4.7.0.
        </p>

        <h3>Select-only combobox</h3>
        <p>
          The selected timezone is a select-only combobox. Tab focuses it, and
          typing letters jumps to the next timezone that starts with them
          (type-ahead). New in 4.7.0.
        </p>
      </Section>

      <Section title="Wheel Plugin">
        <p>
          Replaces the analog clock face with a touch-friendly scroll-spinner.
          Two modes available: <code>wheel</code> (with
          header) and <code>compact-wheel</code>{" "}
          (headerless: a popover when <code>wheel.placement</code> is set,
          otherwise a modal). Supports all themes, 12h/24h, disabled time,
          keyboard navigation and the range plugin.
        </p>
        <CodeBlock
          language="javascript"
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';
import 'timepicker-ui/main.css';

PluginRegistry.register(WheelPlugin);

// Full wheel mode (with header)
const picker = new TimepickerUI(input, {
  ui: { mode: 'wheel' }
});
picker.create();

// Compact-wheel popover (headerless, anchored to input)
const popoverPicker = new TimepickerUI(input2, {
  ui: { mode: 'compact-wheel' },
  wheel: {
    placement: 'auto',      // 'auto', 'top', or 'bottom'
    commitOnScroll: true,    // auto-confirm on scroll stop
    ignoreOutsideClick: false
  }
});
popoverPicker.create();`}
        />
      </Section>

      <Section title="Registering plugins">
        <p>
          Registration is global. Call <code>PluginRegistry.register()</code>{" "}
          once, before you create pickers. Every picker created afterwards gets
          a small manager for each registered plugin.
        </p>
        <ul>
          <li>
            A plugin does nothing unless the picker turns it on:{" "}
            <code>range.enabled</code>, <code>timezone.enabled</code>, or{" "}
            <code>ui.mode</code> set to <code>&apos;wheel&apos;</code> or{" "}
            <code>&apos;compact-wheel&apos;</code>.
          </li>
          <li>
            A plugin registered after a picker was created is not available to
            that picker. Create the picker again.
          </li>
          <li>
            Turning a feature on without its plugin registered emits{" "}
            <code>error</code>.
          </li>
        </ul>
      </Section>

      <Section title="Script tag (UMD)">
        <p>
          The UMD core exposes <code>TimepickerUI.PluginRegistry</code>. Load
          the core script first, then each plugin script, and register the
          plugins before you create a picker. The globals are{" "}
          <code>TimepickerUIRange.RangePlugin</code>,{" "}
          <code>TimepickerUITimezone.TimezonePlugin</code> and{" "}
          <code>TimepickerUIWheel.WheelPlugin</code>. Available from 4.7.0. See{" "}
          <Link href="/docs/installation">Installation</Link> for the full
          CDN setup.
        </p>
        <CodeBlock
          language="html"
          code={`<script src="https://cdn.jsdelivr.net/npm/timepicker-ui@4.7.0/dist/index.umd.js"></script>
<script src="https://cdn.jsdelivr.net/npm/timepicker-ui@4.7.0/dist/plugins/range.umd.js"></script>
<script>
  TimepickerUI.PluginRegistry.register(TimepickerUIRange.RangePlugin);
  const picker = new TimepickerUI('#timepicker', { range: { enabled: true } });
  picker.create();
</script>`}
        />
      </Section>

      <Section title="Using Multiple Plugins">
        <p>
          Register all plugins you need at app startup before creating
          TimepickerUI instances.
        </p>
        <CodeBlock
          language="javascript"
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';
import { TimezonePlugin } from 'timepicker-ui/plugins/timezone';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';
import 'timepicker-ui/main.css';

// Register plugins once at startup
PluginRegistry.register(RangePlugin);
PluginRegistry.register(TimezonePlugin);
PluginRegistry.register(WheelPlugin);

// Range + Timezone picker
const rangePicker = new TimepickerUI(input1, {
  range: { enabled: true },
  timezone: { enabled: true }
});
rangePicker.create();

// Wheel picker
const wheelPicker = new TimepickerUI(input2, {
  ui: { mode: 'wheel' }
});
wheelPicker.create();`}
        />
      </Section>
    </div>
  );
}
