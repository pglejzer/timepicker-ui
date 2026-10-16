import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

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
