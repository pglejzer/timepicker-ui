"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import styles from "@/components/companion-demos.module.css";

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

      <Section title="Three Visible Rows">
        <p>
          <code>--tp-wheel-visible-items</code> sets how many rows each column
          shows. Use an odd number: 3, 5 (the default) or 7. New in 4.7.0.
        </p>
        <div className={styles.threeRows}>
          <TimepickerExample
            code={`.tp-ui-wrapper.my-picker {
  --tp-wheel-visible-items: 3;
}

const picker = new TimepickerUI(input, {
  ui: { mode: 'wheel', cssClass: 'my-picker' }
});
picker.create();`}
            options={{
              ui: { mode: "wheel", cssClass: "docs-three-rows" },
            }}
            plugins={["wheel"]}
          />
        </div>
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

      <Section title="Range in Wheel Modes">
        <p>
          The range plugin works in <code>wheel</code> and{" "}
          <code>compact-wheel</code> too. See the{" "}
          <Link href="/examples/plugins/range">range examples</Link>.
        </p>
      </Section>
    </div>
  );
}
