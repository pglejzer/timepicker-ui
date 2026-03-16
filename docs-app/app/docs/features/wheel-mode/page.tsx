import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import {
  Disc3,
  Settings,
  Palette,
  Keyboard,
  Zap,
  Minimize2,
  EyeOff,
  RotateCcw,
} from "lucide-react";

export const metadata = {
  title: "Wheel Mode - Timepicker-UI",
  description:
    "Scroll-spinner interface that replaces the analog clock face with touch-friendly wheels",
};

export default function WheelModePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Wheel Mode
        </h1>
        <p className="text-lg text-muted-foreground">
          Replace the analog clock face with a touch-friendly scroll-spinner
          interface
        </p>
      </div>

      <InfoBox
        title="Available since v4.2.0"
        variant="emerald"
        className="mb-8"
      >
        Two wheel variants are available:{" "}
        <code>ui.mode: &apos;wheel&apos;</code> (with header) and{" "}
        <code>ui.mode: &apos;compact-wheel&apos;</code> (headerless). The header
        (hour/minute inputs, AM/PM toggle) and footer (OK/Cancel/Clear buttons)
        remain unchanged in wheel mode.
      </InfoBox>

      <Section icon={Disc3} title="Basic Usage">
        <p className="text-muted-foreground mb-4">
          Enable wheel mode with a single option:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: { mode: 'wheel' }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section icon={Settings} title="12h and 24h Support">
        <p className="text-muted-foreground mb-4">
          Wheel mode respects the{" "}
          <code className="text-primary">clock.type</code> setting. In 12h mode
          an AM/PM column appears automatically.
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              12h Wheel (default)
            </h3>
            <CodeBlock
              code={`new TimepickerUI(input, {
  ui: { mode: 'wheel' }
}).create();`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">24h Wheel</h3>
            <CodeBlock
              code={`new TimepickerUI(input, {
  clock: { type: '24h' },
  ui: { mode: 'wheel' }
}).create();`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <Section icon={Palette} title="Theme Compatibility">
        <p className="text-muted-foreground mb-4">
          Wheel mode inherits the active theme via CSS variables. All 10
          built-in themes work out of the box.
        </p>
        <CodeBlock
          code={`// Dark theme wheel
new TimepickerUI(input, {
  ui: { mode: 'wheel', theme: 'dark' }
}).create();

// M3 green theme wheel
new TimepickerUI(input, {
  ui: { mode: 'wheel', theme: 'm3-green' }
}).create();

// Cyberpunk theme wheel
new TimepickerUI(input, {
  ui: { mode: 'wheel', theme: 'cyberpunk' }
}).create();`}
          language="typescript"
        />
      </Section>

      <Section icon={Settings} title="Minute Steps">
        <p className="text-muted-foreground mb-4">
          Use <code className="text-primary">clock.incrementMinutes</code> to
          control the step between minute wheel items.
        </p>
        <CodeBlock
          code={`new TimepickerUI(input, {
  clock: { incrementMinutes: 5 },
  ui: { mode: 'wheel' }
}).create();`}
          language="typescript"
        />
      </Section>

      <Section icon={Zap} title="Events">
        <p className="text-muted-foreground mb-4">
          Wheel mode emits all standard events plus two wheel-specific events
          for tracking scroll interactions:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: { mode: 'wheel' }
});
picker.create();

// Wheel-specific events
picker.on('wheel:scroll:start', (data) => {
  console.log('Scroll started on:', data.column);
  // data.column: 'hours' | 'minutes' | 'ampm'
});

picker.on('wheel:scroll:end', (data) => {
  console.log('Column:', data.column, 'snapped to:', data.value);
  console.log('Previous value:', data.previousValue);
});

// All standard events also work
picker.on('select:hour', (data) => {
  console.log('Hour scrolled to:', data.hour);
});

picker.on('select:minute', (data) => {
  console.log('Minute scrolled to:', data.minutes);
});

picker.on('update', (data) => {
  console.log('Time changed:', data.hour, data.minutes);
});

picker.on('confirm', (data) => {
  console.log('Confirmed:', data.hour, data.minutes, data.type);
});

picker.on('clear', (data) => {
  console.log('Cleared, previous:', data.previousValue);
});`}
          language="typescript"
        />
        <div className="mt-4 rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Wheel-specific events:</strong>{" "}
            <code>wheel:scroll:start</code>, <code>wheel:scroll:end</code>
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Standard events:</strong> <code>confirm</code>,{" "}
            <code>cancel</code>, <code>open</code>, <code>update</code>,{" "}
            <code>select:hour</code>, <code>select:minute</code>,{" "}
            <code>select:am</code>, <code>select:pm</code>, <code>error</code>,{" "}
            <code>clear</code>
          </p>
        </div>
      </Section>

      <Section icon={Keyboard} title="Keyboard Navigation">
        <p className="text-muted-foreground mb-4">
          Wheel mode supports full keyboard navigation:
        </p>
        <ul className="space-y-2 text-muted-foreground ml-4 list-disc list-inside">
          <li>
            <strong>Arrow Up / Down</strong> — scroll one item
          </li>
          <li>
            <strong>Tab</strong> — move between columns (hours → minutes →
            AM/PM)
          </li>
        </ul>
      </Section>

      <Section icon={Settings} title="Limitations">
        <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-6">
          <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-300 list-disc list-inside">
            <li>
              Range plugin (<code>range.enabled</code>) is not supported in
              wheel or compact-wheel mode
            </li>
            <li>
              <code>ui.mobile</code> is ignored — wheel layout is always the
              same regardless of viewport
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={Minimize2} title="Compact-Wheel Mode">
        <p className="text-muted-foreground mb-4">
          Compact-wheel mode is a headerless variant — it shows only the scroll
          wheels without the hour/minute input header. Ideal for minimal UIs or
          popover-style pickers.
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' }
});
picker.create();`}
          language="typescript"
        />
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-3 text-foreground">
            Popover Placement
          </h3>
          <p className="text-muted-foreground mb-3">
            Combine with <code className="text-primary">wheel.placement</code>{" "}
            to open as a popover anchored to the input instead of a centered
            modal:
          </p>
          <CodeBlock
            code={`new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' },
  wheel: {
    placement: 'auto'  // 'auto', 'top', or 'bottom'
  }
}).create();`}
            language="typescript"
          />
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Behavior
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-primary text-xs">
                      &apos;auto&apos;
                    </code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Opens below if space allows, otherwise above
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-primary text-xs">
                      &apos;top&apos;
                    </code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Always opens above the input
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-primary text-xs">
                      &apos;bottom&apos;
                    </code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Always opens below the input
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <code className="text-primary text-xs">undefined</code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Centered modal with backdrop (default)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section icon={EyeOff} title="Hide Disabled Options">
        <p className="text-muted-foreground mb-4">
          Set <code className="text-primary">wheel.hideDisabled: true</code> to
          completely remove disabled hours/minutes from the wheel instead of
          showing them as dimmed. Useful when many values are disabled (e.g.,
          business hours only).
        </p>
        <CodeBlock
          code={`new TimepickerUI(input, {
  clock: {
    disabledTime: { hours: [0, 1, 2, 3, 4, 5, 18, 19, 20, 21, 22, 23] }
  },
  ui: { mode: 'wheel' },
  wheel: { hideDisabled: true }
}).create();`}
          language="typescript"
        />
      </Section>

      <Section icon={RotateCcw} title="Auto-Commit on Scroll">
        <p className="text-muted-foreground mb-4">
          Set <code className="text-primary">wheel.commitOnScroll: true</code>{" "}
          to automatically confirm the selected time when scrolling stops,
          without requiring the user to press OK. Works in both wheel and
          compact-wheel modes.
        </p>
        <CodeBlock
          code={`new TimepickerUI(input, {
  ui: { mode: 'wheel' },
  wheel: { commitOnScroll: true }
}).create();

// The confirm event includes autoCommit: true
picker.on('confirm', (data) => {
  if (data.autoCommit) {
    console.log('Auto-committed:', data.hour, data.minutes);
  }
});`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
