"use client";

import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function WheelPluginPage() {
  return (
    <div>
      <PageHeader
        title="Wheel Plugin"
        description={
          <>
            Scroll-spinner interface replacing the analog clock face. Supports
            wheel (with header) and compact-wheel (headerless) modes.
            Compact-wheel opens as a popover when <code>wheel.placement</code>{" "}
            is set, otherwise as a modal.
          </>
        }
      />

      <Section title="Basic Wheel (12h)">
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
      </Section>

      <Section title="24h Wheel">
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
      </Section>

      <Section title="Compact-Wheel Popover (auto)">
        <p>
          Headerless variant that opens as a popover anchored to the input.
          Automatically flips between top and bottom based on viewport space.
        </p>
        <TimepickerExample
          display="field"
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
      </Section>

      <Section title="Compact-Wheel Popover (bottom)">
        <TimepickerExample
          display="field"
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
          inputPlaceholder="Opens below"
        />
      </Section>

      <Section title="Compact-Wheel Popover (top)">
        <TimepickerExample
          display="field"
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
          inputPlaceholder="Opens above"
        />
      </Section>

      <Section title="Wheel + Dark Theme">
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
      </Section>

      <Section title="Wheel + 5 Minute Steps">
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
      </Section>

      <Section title="Auto-Commit on Scroll">
        <p>
          Writes the time to the input and emits confirm when scrolling
          stops - no OK button needed. The popover stays open.
        </p>
        <TimepickerExample
          display="field"
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
      </Section>

      <Section title="Ignore Outside Click">
        <p>
          Prevents the popover from closing on outside click - user must press
          OK or Cancel.
        </p>
        <TimepickerExample
          display="field"
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
      </Section>
    </div>
  );
}
