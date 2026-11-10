"use client";

import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Figure } from "@/components/figure";
import { CodeBlock } from "@/components/code-block";
import { RangeApiDemo } from "@/components/range-api-demo";
import { RangeStartOnlyDemo } from "@/components/view-and-range-demos";

export default function RangePluginPage() {
  return (
    <div>
      <PageHeader
        title="Range Plugin"
        description={
          <>
            Select time ranges with &quot;from&quot; and &quot;to&quot; segments.
            Automatic validation blocks invalid time selections. It works in
            the clock, wheel and compact-wheel modes.
          </>
        }
      />

      <Section title="Basic Range">
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  range: {
    enabled: true
  }
});
picker.create();`}
          options={{
            range: {
              enabled: true,
            },
          }}
          plugins={["range"]}
          inputPlaceholder="Select time range"
        />
      </Section>

      <Section title="Custom Labels">
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  range: {
    enabled: true
  },
  labels: {
    rangeFrom: 'Start',
    rangeTo: 'End'
  }
});
picker.create();`}
          options={{
            range: {
              enabled: true,
            },
            labels: {
              rangeFrom: "Start",
              rangeTo: "End",
            },
          }}
          plugins={["range"]}
          inputPlaceholder="Select start and end time"
        />
      </Section>

      <Section title="With Duration Constraints">
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  range: {
    enabled: true,
    minDuration: 30,  // min 30 minutes
    maxDuration: 240  // max 4 hours
  }
});
picker.create();`}
          options={{
            range: {
              enabled: true,
              minDuration: 30,
              maxDuration: 240,
            },
          }}
          plugins={["range"]}
          inputPlaceholder="30min - 4h range"
        />
      </Section>

      <Section title="24h Format Range">
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  clock: {
    type: '24h'
  },
  range: {
    enabled: true
  }
});
picker.create();`}
          options={{
            clock: {
              type: "24h",
            },
            range: {
              enabled: true,
            },
          }}
          plugins={["range"]}
          inputPlaceholder="24h range selection"
        />
      </Section>

      <Section title="Range in Wheel Mode">
        <p>
          With <code>ui.mode: &apos;wheel&apos;</code> the From and To tabs
          show with the wheel. A wheel snap fills the active end, and the
          picker does not move on to To by itself: press the To tab. With{" "}
          <code>linked: true</code>, times before From are disabled on the To
          wheel. Register <code>WheelPlugin</code> next to{" "}
          <code>RangePlugin</code>. New in 4.7.0.
        </p>
        <TimepickerExample
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(RangePlugin);
PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'wheel' },
  range: {
    enabled: true,
    linked: true
  }
});
picker.create();`}
          options={{
            ui: { mode: "wheel" },
            range: {
              enabled: true,
              linked: true,
            },
          }}
          plugins={["range", "wheel"]}
          inputPlaceholder="Select time range"
        />
      </Section>

      <Section title="Range in Compact-Wheel Mode">
        <p>
          <code>ui.mode: &apos;compact-wheel&apos;</code> keeps the From and To
          tabs. This one opens as a popover because{" "}
          <code>wheel.placement</code> is set. Without it, compact-wheel opens
          as a modal. New in 4.7.0.
        </p>
        <TimepickerExample
          display="field"
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(RangePlugin);
PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' },
  wheel: { placement: 'auto' },
  range: {
    enabled: true,
    linked: true
  }
});
picker.create();`}
          options={{
            ui: { mode: "compact-wheel" },
            wheel: { placement: "auto" },
            range: {
              enabled: true,
              linked: true,
            },
          }}
          plugins={["range", "wheel"]}
          inputPlaceholder="Click to open the range popover"
        />
      </Section>

      <Section title="Range with Auto-Commit on Scroll">
        <p>
          With <code>wheel.commitOnScroll</code> the range is written to the
          input as <code>from - to</code> once scrolling stops and the range is
          valid. <code>range:confirm</code> fires with{" "}
          <code>autoCommit: true</code>, and the picker stays open, also with{" "}
          <code>wheel.hideFooter</code>.
        </p>
        <CodeBlock
          language="typescript"
          code={`const picker = new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' },
  wheel: {
    placement: 'auto',
    hideFooter: true,
    commitOnScroll: true
  },
  range: { enabled: true }
});
picker.create();

picker.on('range:confirm', (data) => {
  console.log(data.from, data.to, data.autoCommit);
});`}
        />
      </Section>

      <Section title="Range API and Independent Ends">
        <p>
          <code>setRange()</code>, <code>getRange()</code> and{" "}
          <code>setActivePart()</code> control the range from code. With{" "}
          <code>range.linked: false</code> From and To are independent, so a
          range can cross midnight: 22:00 to 01:00 is accepted, and{" "}
          <code>minDuration</code> and <code>maxDuration</code> are not
          checked.
        </p>
        <Figure
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  range: { enabled: true }
});
picker.create();

picker.setRange({ from: '09:00', to: '17:00' });
console.log(picker.getRange());

picker.open();
picker.setActivePart('to');

const overnight = new TimepickerUI(otherInput, {
  clock: { type: '24h' },
  range: { enabled: true, linked: false, minDuration: 30 }
});
overnight.create();
overnight.setRange({ from: '22:00', to: '01:00' });`}
        >
          <RangeApiDemo />
        </Figure>
      </Section>

      <Section title="Set Start Only and Captions">
        <p>
          <code>setRange()</code> takes one end: the other keeps its value.{" "}
          <code>setRangeCaptions()</code> adds a second line under the tab
          labels, for example a date. Edit a time in the picker to see{" "}
          <code>range:change</code> in the log. API calls do not emit it. New
          in 4.7.0.
        </p>
        <Figure
          code={`picker.setRange({ from: '09:00' });

picker.setRangeCaptions({ from: 'Wed Oct 21', to: 'Thu Oct 22' });

picker.on('range:change', ({ part, from, to }) => {
  console.log(part, from, to);
});`}
        >
          <RangeStartOnlyDemo />
        </Figure>
      </Section>
    </div>
  );
}
