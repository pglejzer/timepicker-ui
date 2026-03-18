import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { Package, Zap, Clock, Globe, Disc3 } from "lucide-react";

export const metadata = {
  title: "Plugins - Timepicker-UI",
  description: "Optional plugins for Range mode and Timezone selector",
};

export default function PluginsPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Plugins
        </h1>
        <p className="text-lg text-muted-foreground">
          Optional features as separate imports for smaller bundle sizes
        </p>
      </div>

      <Section icon={Package} title="Overview">
        <p className="text-muted-foreground mb-4">
          Plugins are optional features that can be imported and registered
          separately. Register plugins once at app startup via PluginRegistry,
          then use features via options. If you don&apos;t need a feature,
          don&apos;t import it - your bundle stays small.
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Tree-shaking friendly - unused plugins are excluded</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Manual registration - import, register, use</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Full TypeScript support with type definitions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>3 plugins available: Range, Timezone, and Wheel</span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Clock} title="Range Plugin">
        <p className="text-muted-foreground mb-4">
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
    fromLabel: 'Start',
    toLabel: 'End',
    minDuration: 30,  // minimum 30 minutes
    maxDuration: 480  // maximum 8 hours
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

      <Section icon={Globe} title="Timezone Plugin">
        <p className="text-muted-foreground mb-4">
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
    whitelist: [
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo'
    ],
    label: 'Timezone'
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

      <Section icon={Disc3} title="Wheel Plugin">
        <p className="text-muted-foreground mb-4">
          Replaces the analog clock face with a touch-friendly scroll-spinner.
          Two modes available: <code className="text-primary">wheel</code> (with
          header) and <code className="text-primary">compact-wheel</code>{" "}
          (headerless popover). Supports all themes, 12h/24h, disabled time, and
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

      <Section icon={Zap} title="Using Multiple Plugins">
        <p className="text-muted-foreground mb-4">
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
