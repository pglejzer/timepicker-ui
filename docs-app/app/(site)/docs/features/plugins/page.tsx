import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Plugins",
  description:
    "Tree-shakeable plugins for timepicker-ui - range (time range picker), timezone selector and scroll wheel mode. Zero-dependency, framework-agnostic and SSR-safe.",
  path: "/docs/features/plugins",
});

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
            sets both ends. Each time uses the <code>setValue()</code> format,{" "}
            <code>&apos;14:30&apos;</code> or <code>&apos;2:30 PM&apos;</code>.
            It works while the picker is open or closed and emits{" "}
            <code>range:validation</code>.
          </li>
          <li>
            <code>getRange()</code> returns <code>&#123; from, to &#125;</code>,
            or <code>null</code>. Each end is{" "}
            <code>&#123; hour, minutes, seconds?, type? &#125;</code> or{" "}
            <code>null</code> until it is complete.
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
      </Section>

      <Section title="Wheel Plugin">
        <p>
          Replaces the analog clock face with a touch-friendly scroll-spinner.
          Two modes available: <code>wheel</code> (with
          header) and <code>compact-wheel</code>{" "}
          (headerless: a popover when <code>wheel.placement</code> is set,
          otherwise a modal). Supports all themes, 12h/24h, disabled time, and
          keyboard navigation.
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
