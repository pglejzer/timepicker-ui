"use client";

import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function WheelPluginPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3 text-foreground">
          Wheel Plugin
        </h1>
        <p className="text-muted-foreground">
          Scroll-spinner interface replacing the analog clock face. Supports
          wheel (with header) and compact-wheel (headerless popover) modes.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Basic Wheel (12h)
          </h2>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'wheel' }
});
picker.create();`}
            options={{
              ui: { mode: "wheel" },
            }}
            plugins={["wheel"]}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            24h Wheel
          </h2>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  ui: { mode: 'wheel' }
});
picker.create();`}
            options={{
              clock: { type: "24h" },
              ui: { mode: "wheel" },
            }}
            plugins={["wheel"]}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Compact-Wheel Popover (auto)
          </h2>
          <p className="text-muted-foreground mb-4">
            Headerless variant that opens as a popover anchored to the input.
            Automatically flips between top and bottom based on viewport space.
          </p>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' },
  wheel: { placement: 'auto' }
});
picker.create();`}
            options={{
              ui: { mode: "compact-wheel" },
              wheel: { placement: "auto" },
            }}
            plugins={["wheel"]}
            inputPlaceholder="Click to open popover"
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Compact-Wheel Popover (bottom)
          </h2>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' },
  wheel: { placement: 'bottom' }
});
picker.create();`}
            options={{
              ui: { mode: "compact-wheel" },
              wheel: { placement: "bottom" },
            }}
            plugins={["wheel"]}
            inputPlaceholder="Always opens below"
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Compact-Wheel Popover (top)
          </h2>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' },
  wheel: { placement: 'top' }
});
picker.create();`}
            options={{
              ui: { mode: "compact-wheel" },
              wheel: { placement: "top" },
            }}
            plugins={["wheel"]}
            inputPlaceholder="Always opens above"
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Wheel + Dark Theme
          </h2>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'wheel', theme: 'dark' }
});
picker.create();`}
            options={{
              ui: { mode: "wheel", theme: "dark" },
            }}
            plugins={["wheel"]}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Wheel + 5 Minute Steps
          </h2>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  clock: { incrementMinutes: 5 },
  ui: { mode: 'wheel' }
});
picker.create();`}
            options={{
              clock: { incrementMinutes: 5 },
              ui: { mode: "wheel" },
            }}
            plugins={["wheel"]}
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Auto-Commit on Scroll
          </h2>
          <p className="text-muted-foreground mb-4">
            Automatically confirms and closes when scrolling stops — no OK
            button needed.
          </p>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' },
  wheel: {
    placement: 'auto',
    commitOnScroll: true
  }
});
picker.create();`}
            options={{
              ui: { mode: "compact-wheel" },
              wheel: { placement: "auto", commitOnScroll: true },
            }}
            plugins={["wheel"]}
            inputPlaceholder="Scroll to auto-commit"
          />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Ignore Outside Click
          </h2>
          <p className="text-muted-foreground mb-4">
            Prevents the popover from closing on outside click — user must press
            OK or Cancel.
          </p>
          <TimepickerExample
            code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' },
  wheel: {
    placement: 'bottom',
    ignoreOutsideClick: true
  }
});
picker.create();`}
            options={{
              ui: { mode: "compact-wheel" },
              wheel: { placement: "bottom", ignoreOutsideClick: true },
            }}
            plugins={["wheel"]}
            inputPlaceholder="Click outside won't close"
          />
        </section>
      </div>
    </div>
  );
}
